import { selectKnowledge } from "../../knowledge-engine/src/index.js";
import defaultKnowledgeRegistry from "../../../knowledge/registry.json" with { type: "json" };
import { evaluateTechnologyArchitecture } from "./technology-decision.js";
import { createPlanDigest, evaluatePolicy, POLICY_VERSION } from "./policy-engine.js";

const RISK_LEVELS = new Set(["low", "medium", "high", "critical"]);

export function orderTasks(tasks) {
  const byId = new Map();

  for (const task of tasks) {
    if (!task.id || byId.has(task.id)) {
      throw new Error(`Task IDs must be present and unique: ${task.id ?? "(missing)"}`);
    }
    byId.set(task.id, task);
  }

  const visiting = new Set();
  const visited = new Set();
  const ordered = [];

  function visit(id) {
    if (visiting.has(id)) throw new Error(`Task dependency cycle detected at: ${id}`);
    if (visited.has(id)) return;

    const task = byId.get(id);
    if (!task) throw new Error(`Unknown task dependency: ${id}`);

    visiting.add(id);
    for (const dependency of task.depends_on ?? []) {
      if (!byId.has(dependency)) {
        throw new Error(`Task ${id} depends on unknown task: ${dependency}`);
      }
      visit(dependency);
    }
    visiting.delete(id);
    visited.add(id);
    ordered.push(task);
  }

  for (const id of byId.keys()) visit(id);
  return ordered;
}

export function createPlan({ task_id, goal, repository, tasks, risk = "low", knowledgeRegistry = defaultKnowledgeRegistry, technologyAssessment = null }) {
  if (!task_id || !goal || !repository?.full_name || !repository?.default_branch) {
    throw new Error("task_id, goal, repository.full_name, and repository.default_branch are required");
  }
  if (!RISK_LEVELS.has(risk)) throw new Error(`Unsupported risk level: ${risk}`);
  if (!Array.isArray(tasks) || tasks.length === 0) {
    throw new Error("At least one task is required");
  }

  const ordered = orderTasks(tasks);
  const approvalRequired = risk !== "low";
  const planDigest = createPlanDigest({ taskId: task_id, goal, repository, risk, tasks: ordered });
  const taskPolicies = new Map(ordered.map((task) => [task.id, evaluatePolicy({
    risk,
    actions: task.actions ?? [],
    planId: task_id,
    planDigest
  })]));
  const technologyDecision = technologyAssessment
    ? evaluateTechnologyArchitecture({ repository, ...technologyAssessment })
    : null;
  const policyApprovalRequired = [...taskPolicies.values()].some((policy) => policy.approval_required);

  return {
    task_id,
    goal,
    repository,
    risk,
    approval_required: approvalRequired || policyApprovalRequired || Boolean(technologyDecision && (technologyDecision.approval.required || technologyDecision.status === "provisional")),
    policy_version: POLICY_VERSION,
    plan_digest: planDigest,
    ...(technologyDecision ? { technology_decision: technologyDecision } : {}),
    tasks: ordered.map((task) => ({
      ...task,
      status: "planned",
      policy: taskPolicies.get(task.id),
      evidence: task.evidence ?? [],
      knowledge_retrieval: selectKnowledge(knowledgeRegistry, {
        description: task.description ?? "",
        goal: task.goal ?? "",
        problem: task.problem ?? "",
        context: task.context ?? "",
        domain: task.domain,
        tags: task.tags ?? [],
        required_capabilities: task.required_capabilities ?? []
      })
    }))
  };
}

export function evaluateExecutionGate({
  risk = "low",
  actions = [],
  planId = null,
  planDigest = null,
  approvals = [],
  verifyApproval = null
} = {}) {
  return evaluatePolicy({ risk, actions, planId, planDigest, approvals, verifyApproval });
}
