import { createPlanDigest, evaluatePolicy, POLICY_VERSION } from "./policy-engine.js";

export class ExecutionGateError extends Error {
  constructor(code, message, details = {}) {
    super(message);
    this.name = "ExecutionGateError";
    this.code = code;
    this.details = details;
  }
}

function stringArray(value, field) {
  if (!Array.isArray(value) || value.some(item => typeof item !== "string" || !item.trim())) {
    throw new ExecutionGateError("INVALID_ADAPTER_CONTRACT", field + " must be an array of non-empty strings");
  }
  return [...new Set(value.map(item => item.trim()))];
}

function normalisePlannedAction(action, taskId) {
  if (!action || typeof action !== "object" || Array.isArray(action)) {
    throw new ExecutionGateError("INVALID_ACTION", "Every executable action must be an object with an explicit target", { task_id: taskId });
  }
  const type = action.type ?? action.action;
  if (typeof type !== "string" || !type.trim() || typeof action.target !== "string" || !action.target.trim()) {
    throw new ExecutionGateError("INVALID_ACTION", "Every executable action requires a non-empty type and target", { task_id: taskId });
  }
  return { ...action, type: type.trim(), target: action.target.trim() };
}

export class ExecutionGate {
  constructor({ approvalStore = null, audit = null } = {}) {
    if (approvalStore !== null &&
        (typeof approvalStore.getApproval !== "function" || typeof approvalStore.verifyApproval !== "function" ||
         typeof approvalStore.requestApproval !== "function")) {
      throw new Error("approvalStore must implement requestApproval, getApproval, and verifyApproval");
    }
    if (audit !== null && typeof audit !== "function") throw new Error("audit must be a function");
    this.approvalStore = approvalStore;
    this.audit = audit;
    this.adapters = new Map();
  }

  registerAdapter(adapter) {
    if (!adapter || typeof adapter !== "object" || Array.isArray(adapter)) {
      throw new ExecutionGateError("INVALID_ADAPTER_CONTRACT", "Adapter must be an object");
    }
    const { id, version, harnessId = null, execute } = adapter;
    if (typeof id !== "string" || !id.trim() || typeof version !== "string" || !version.trim() ||
        typeof execute !== "function") {
      throw new ExecutionGateError("INVALID_ADAPTER_CONTRACT", "Adapter requires id, version, and execute()");
    }
    if (harnessId !== null && (typeof harnessId !== "string" || !harnessId.trim())) {
      throw new ExecutionGateError("INVALID_ADAPTER_CONTRACT", "harnessId must be a non-empty string when supplied");
    }
    const supportedActions = stringArray(adapter.supportedActions, "supportedActions");
    const capabilities = stringArray(adapter.capabilities ?? [], "capabilities");
    if (supportedActions.length === 0) {
      throw new ExecutionGateError("INVALID_ADAPTER_CONTRACT", "Adapter must declare at least one supported action");
    }
    const normalizedId = id.trim();
    if (this.adapters.has(normalizedId)) throw new ExecutionGateError("DUPLICATE_ADAPTER", "Adapter id is already registered: " + normalizedId);
    const registered = Object.freeze({
      id: normalizedId, version: version.trim(), harnessId: harnessId?.trim() ?? null,
      supportedActions: Object.freeze(supportedActions),
      capabilities: Object.freeze(capabilities),
      execute
    });
    this.adapters.set(registered.id, registered);
    return Object.freeze({
      id: registered.id, version: registered.version, harnessId: registered.harnessId,
      supportedActions: [...registered.supportedActions], capabilities: [...registered.capabilities]
    });
  }

  listAdapters() {
    return [...this.adapters.values()].map(({ id, version, harnessId, supportedActions, capabilities }) => ({
      id, version, harnessId, supportedActions: [...supportedActions], capabilities: [...capabilities]
    }));
  }

  getApprovalRequests(plan) {
    this.#validatePlan(plan);
    const requests = new Map();
    for (const task of plan.tasks) {
      if (!Array.isArray(task.actions)) throw new ExecutionGateError("INVALID_PLAN", "Task actions must be an array", { task_id: task.id });
      for (const rawAction of task.actions) {
        const action = normalisePlannedAction(rawAction, task.id);
        const decision = evaluatePolicy({
          risk: plan.risk, actions: [action], planId: plan.task_id, planDigest: plan.plan_digest
        });
        for (const request of decision.approval_requests ?? []) requests.set(request.request_id, request);
      }
    }
    return [...requests.values()];
  }

  requestApprovals(plan) {
    if (!this.approvalStore) throw new ExecutionGateError("APPROVAL_STORE_REQUIRED", "Approval Store is not configured");
    return this.getApprovalRequests(plan).map(request => this.approvalStore.requestApproval(request));
  }

  async executePlan(plan, { dryRun = false, signal = null } = {}) {
    this.#validatePlan(plan);
    if (typeof dryRun !== "boolean") throw new ExecutionGateError("INVALID_EXECUTION_OPTIONS", "dryRun must be a boolean");
    if (!dryRun && !this.audit) {
      throw new ExecutionGateError("AUDIT_REQUIRED", "A durable audit callback is required before execution");
    }
    const results = [];
    for (const task of plan.tasks) {
      if (!task || typeof task.id !== "string" || !task.id.trim() || !Array.isArray(task.actions)) {
        throw new ExecutionGateError("INVALID_PLAN", "Every task requires an id and an actions array");
      }
      for (const rawAction of task.actions) {
        if (signal?.aborted) {
          throw new ExecutionGateError("EXECUTION_ABORTED", "Execution was aborted", { results });
        }
        const action = normalisePlannedAction(rawAction, task.id);
        const adapter = this.#resolveAdapter(task, action);
        let decision = evaluatePolicy({
          risk: plan.risk, actions: [action], planId: plan.task_id, planDigest: plan.plan_digest
        });
        if (decision.approval_required) {
          const approvals = this.approvalStore
            ? decision.approval_requests.map(request => this.approvalStore.getApproval(request.request_id)).filter(Boolean)
            : [];
          decision = evaluatePolicy({
            risk: plan.risk, actions: [action], planId: plan.task_id, planDigest: plan.plan_digest,
            approvals, verifyApproval: this.approvalStore ? this.approvalStore.verifyApproval.bind(this.approvalStore) : null
          });
        }
        if (!decision.allowed) {
          throw new ExecutionGateError("POLICY_DENIED", "Policy denied action " + action.type, {
            task_id: task.id, action, reasons: decision.reasons, approval_requests: decision.approval_requests
          });
        }
        if (dryRun) {
          results.push({ task_id: task.id, action, adapter_id: adapter.id, status: "dry_run" });
          continue;
        }
        const auditBase = {
          plan_id: plan.task_id, plan_digest: plan.plan_digest, task_id: task.id,
          action: action.type, target: action.target, adapter_id: adapter.id, adapter_version: adapter.version
        };
        try {
          await this.audit({ event: "action_started", ...auditBase });
        } catch (error) {
          throw new ExecutionGateError("AUDIT_FAILED", "Audit sink rejected the execution-start event", {
            ...auditBase, results, cause: error.message
          });
        }
        let output;
        try {
          output = await adapter.execute({
            plan_id: plan.task_id, plan_digest: plan.plan_digest, task, action,
            signal, policy_version: POLICY_VERSION
          });
        } catch (error) {
          try { await this.audit({ event: "action_failed", ...auditBase, error_type: error?.name ?? "Error", error_code: error?.code ?? null }); } catch {}
          throw new ExecutionGateError("ADAPTER_EXECUTION_FAILED", "Adapter failed while executing " + action.type, {
            ...auditBase, results, cause: error?.message ?? String(error)
          });
        }
        const result = { task_id: task.id, action, adapter_id: adapter.id, status: "completed", output };
        results.push(result);
        try {
          await this.audit({ event: "action_completed", ...auditBase });
        } catch (error) {
          throw new ExecutionGateError("AUDIT_FAILED_AFTER_EXECUTION", "Action completed but the audit sink failed to record completion", {
            ...auditBase, results, action_executed: true, cause: error.message
          });
        }
      }
    }
    return { plan_id: plan.task_id, plan_digest: plan.plan_digest, status: dryRun ? "dry_run" : "completed", results };
  }

  #validatePlan(plan) {
    if (!plan || typeof plan !== "object" || Array.isArray(plan) ||
        typeof plan.task_id !== "string" || typeof plan.goal !== "string" ||
        !plan.repository || typeof plan.plan_digest !== "string" ||
        plan.policy_version !== POLICY_VERSION || !Array.isArray(plan.tasks)) {
      throw new ExecutionGateError("INVALID_PLAN", "Plan identity, version, repository, digest, and tasks are required");
    }
    let actual;
    try {
      actual = createPlanDigest({
        taskId: plan.task_id, goal: plan.goal, repository: plan.repository, risk: plan.risk,
        tasks: plan.tasks, technologyDecision: plan.technology_decision ?? null
      });
    } catch (error) {
      throw new ExecutionGateError("INVALID_PLAN", "Plan digest inputs are invalid", { cause: error.message });
    }
    if (actual !== plan.plan_digest) {
      throw new ExecutionGateError("PLAN_DIGEST_MISMATCH", "Plan content changed after approval scope was created", {
        expected: plan.plan_digest, actual
      });
    }
  }

  #resolveAdapter(task, action) {
    const required = stringArray(task.required_capabilities ?? [], "task.required_capabilities");
    const matches = [...this.adapters.values()].filter(adapter =>
      adapter.supportedActions.includes(action.type) &&
      required.every(capability => adapter.capabilities.includes(capability)) &&
      (!task.preferred_harness || adapter.harnessId === task.preferred_harness)
    );
    if (matches.length === 0) {
      throw new ExecutionGateError("NO_COMPATIBLE_ADAPTER", "No registered adapter satisfies action, harness, and capability requirements", {
        task_id: task.id, action: action.type, preferred_harness: task.preferred_harness ?? null, required_capabilities: required
      });
    }
    if (matches.length > 1) {
      throw new ExecutionGateError("AMBIGUOUS_ADAPTER", "More than one adapter matches; specify preferred_harness or reduce adapter overlap", {
        task_id: task.id, action: action.type, adapters: matches.map(adapter => adapter.id)
      });
    }
    return matches[0];
  }
}
