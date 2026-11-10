import { createHash } from "node:crypto";
import policyRules from "../policy.rules.json" with { type: "json" };

export const POLICY_VERSION = policyRules.policy_version;
const ACTION_RULES = Object.freeze(policyRules.actions);
const RISK_ORDER = Object.freeze(policyRules.risk_order);
const MUTATING_ACTIONS = new Set(policyRules.mutating_actions);

function stableValue(value) {
  if (Array.isArray(value)) return value.map(stableValue);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.keys(value).sort().filter((key) => value[key] !== undefined)
      .map((key) => [key, stableValue(value[key])]));
  }
  return value;
}

function digest(value) {
  return createHash("sha256").update(JSON.stringify(stableValue(value))).digest("hex");
}

function normaliseAction(action) {
  if (typeof action === "string") return { type: action, target: null };
  if (!action || typeof action !== "object" || Array.isArray(action)) {
    return { type: null, target: null };
  }
  return {
    type: action.type ?? action.action ?? null,
    target: typeof action.target === "string" && action.target.trim()
      ? action.target.trim()
      : null
  };
}

function approvalScope({ planId, planDigest, action, target }) {
  return {
    policy_version: POLICY_VERSION,
    plan_id: planId,
    plan_digest: planDigest,
    action,
    target
  };
}

export function createApprovalRequest({ planId, planDigest, action, target }) {
  if (typeof planId !== "string" || !planId.trim() || typeof planDigest !== "string" || !/^[a-f0-9]{64}$/.test(planDigest) || typeof action !== "string" || !action.trim() || typeof target !== "string" || !target.trim()) {
    throw new Error("planId, a SHA-256 planDigest, action, and target are required");
  }
  const scope = approvalScope({ planId, planDigest, action, target });
  return {
    request_id: digest(scope),
    ...scope,
    status: "pending",
    required_approver: "human"
  };
}

export function evaluatePolicy({
  actions = [],
  risk = "low",
  planId = null,
  planDigest = null,
  approvals = [],
  verifyApproval = null
} = {}) {
  if (!RISK_ORDER.hasOwnProperty(risk)) {
    return {
      policy_version: POLICY_VERSION,
      allowed: false,
      approval_required: true,
      decisions: [],
      reasons: ["Unknown risk level; default deny."]
    };
  }
  if (!Array.isArray(actions)) {
    return {
      policy_version: POLICY_VERSION,
      allowed: false,
      approval_required: true,
      decisions: [],
      reasons: ["Actions must be an array."]
    };
  }

  if (!Array.isArray(approvals)) {
    return { policy_version: POLICY_VERSION, allowed: false, approval_required: true, decisions: [], reasons: ["Approvals must be an array."] };
  }
  if (verifyApproval !== null && typeof verifyApproval !== "function") {
    return { policy_version: POLICY_VERSION, allowed: false, approval_required: true, decisions: [], reasons: ["Approval verifier must be a trusted function."] };
  }

  const decisions = [];
  const reasons = [];
  const approvalRequests = [];

  for (const rawAction of actions) {
    const action = normaliseAction(rawAction);
    const rule = ACTION_RULES[action.type];
    if (!rule) {
      const reason = `Unknown action '${action.type ?? "(missing)"}' is denied.`;
      reasons.push(reason);
      decisions.push({ action: action.type, target: action.target, allowed: false, approval_required: false, reason });
      continue;
    }

    const riskRequiresApproval = rule.effect === "risk_gated" && RISK_ORDER[risk] >= RISK_ORDER[rule.minimumRisk];
    const requiresApproval = rule.effect === "approval" || riskRequiresApproval || (risk === "critical" && MUTATING_ACTIONS.has(action.type));
    if (!requiresApproval) {
      decisions.push({ action: action.type, target: action.target, allowed: true, approval_required: false, reason: "Allowed by policy." });
      continue;
    }

    if (!action.target) {
      const reason = `Action '${action.type}' requires an explicit target before approval can be requested.`;
      reasons.push(reason);
      decisions.push({ action: action.type, target: null, allowed: false, approval_required: true, reason });
      continue;
    }
    if (!planId || !planDigest) {
      const reason = `Action '${action.type}' requires a plan ID and digest to bind approval scope.`;
      reasons.push(reason);
      decisions.push({ action: action.type, target: action.target, allowed: false, approval_required: true, reason });
      approvalRequests.push({ action: action.type, target: action.target, status: "blocked_missing_plan_binding" });
      continue;
    }

    const request = createApprovalRequest({
      planId,
      planDigest,
      action: action.type,
      target: action.target
    });
    approvalRequests.push(request);
    const approval = approvals.find((item) =>
      item?.status === "approved" &&
      item?.request_id === request.request_id &&
      item?.policy_version === POLICY_VERSION &&
      item?.plan_id === planId &&
      item?.plan_digest === planDigest &&
      item?.action === action.type &&
      item?.target === action.target &&
      typeof item?.approved_by === "string" &&
      item.approved_by.trim() &&
      typeof item?.approved_at === "string" &&
      Number.isFinite(Date.parse(item.approved_at))
    );
    let verified = false;
    if (approval && typeof verifyApproval === "function") {
      try {
        verified = verifyApproval(approval, request) === true;
      } catch {
        verified = false;
      }
    }
    const reason = verified
      ? "Approval verified for this exact action, target, and plan version."
      : `Action '${action.type}' requires a verified human approval bound to this exact target and plan version.`;
    if (!verified) reasons.push(reason);
    decisions.push({
      action: action.type,
      target: action.target,
      allowed: verified,
      approval_required: true,
      request_id: request.request_id,
      reason
    });
  }

  return {
    policy_version: POLICY_VERSION,
    allowed: decisions.every((item) => item.allowed),
    approval_required: decisions.some((item) => item.approval_required),
    decisions,
    approval_requests: approvalRequests,
    reasons
  };
}

export function getPolicyActionCatalog() {
  return Object.entries(ACTION_RULES).map(([action, rule]) => ({
    action,
    effect: rule.effect,
    minimum_risk: rule.minimumRisk
  }));
}

export function createPlanDigest({ taskId, goal, repository, risk = "low", tasks = [], technologyDecision = null }) {
  if (typeof taskId !== "string" || !taskId.trim() || typeof goal !== "string" || !goal.trim() ||
      !repository || typeof repository.full_name !== "string" || !repository.full_name.trim() ||
      typeof repository.default_branch !== "string" || !repository.default_branch.trim() ||
      !Array.isArray(tasks) || !Object.hasOwn(RISK_ORDER, risk)) {
    throw new Error("A complete plan identity is required to create its digest");
  }
  const canonical = {
    policy_version: POLICY_VERSION,
    task_id: taskId,
    goal,
    repository: {
      full_name: repository.full_name,
      default_branch: repository.default_branch,
      languages: [...(repository.languages ?? [])].sort(),
      frameworks: [...(repository.frameworks ?? [])].sort()
    },
    risk,
    technology_decision: technologyDecision,
    tasks: tasks.map((task) => {
      if (!task || typeof task !== "object" || Array.isArray(task) || typeof task.id !== "string" || !task.id.trim()) {
        throw new Error("Every plan task must have a non-empty string id");
      }
      return {
        id: task.id,
        description: task.description ?? "",
        goal: task.goal ?? "",
        problem: task.problem ?? "",
        context: task.context ?? "",
        domain: task.domain ?? null,
        tags: [...(task.tags ?? [])].sort(),
        required_capabilities: [...(task.required_capabilities ?? [])].sort(),
        preferred_harness: task.preferred_harness ?? null,
        tools: [...(task.tools ?? [])].sort(),
        depends_on: [...(task.depends_on ?? [])].sort(),
        actions: (task.actions ?? []).map((action) => normaliseAction(action))
      };
    })
  };
  return digest(canonical);
}
