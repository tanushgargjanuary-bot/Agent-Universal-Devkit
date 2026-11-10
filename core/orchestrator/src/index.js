import { selectKnowledge } from "../../knowledge-engine/src/index.js";
import defaultKnowledgeRegistry from "../../../knowledge/registry.json" with { type: "json" };
import { evaluateTechnologyArchitecture } from "./technology-decision.js";

const APPROVAL_ACTIONS = new Set([
  "install_or_upgrade_dependencies",
  "change_repository_permissions",
  "access_or_export_secrets",
  "deploy_to_production",
  "destructive_database_migration",
  "delete_repository_data",
  "run_untrusted_code_with_broad_permissions"
]);

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
  const technologyDecision = technologyAssessment
    ? evaluateTechnologyArchitecture({ repository, ...technologyAssessment })
    : null;

  return {
    task_id,
    goal,
    repository,
    risk,
    approval_required: approvalRequired || Boolean(technologyDecision?.approval.required),
    ...(technologyDecision ? { technology_decision: technologyDecision } : {}),
    tasks: ordered.map((task) => ({
      ...task,
      status: "planned",
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
  humanApproved = false
}) {
  if (!RISK_LEVELS.has(risk)) {
    return { allowed: false, approval_required: true, reasons: ["Unknown risk level"] };
  }

  const reasons = [];
  if (risk !== "low") reasons.push(`Risk level '${risk}' requires human approval`);

  for (const action of actions) {
    if (APPROVAL_ACTIONS.has(action)) {
      reasons.push(`Action '${action}' requires human approval`);
    }
  }

  const approvalRequired = reasons.length > 0;
  return {
    allowed: !approvalRequired || humanApproved,
    approval_required: approvalRequired,
    reasons
  };
}
