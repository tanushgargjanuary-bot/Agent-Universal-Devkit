import { createHash } from "node:crypto";

export const POLICY_VERSION = "1.0.0";

const ACTION_RULES = Object.freeze({
  read_repository: { effect: "allow", minimumRisk: "low" },
  read_tests: { effect: "allow", minimumRisk: "low" },
  inspect_dependencies: { effect: "allow", minimumRisk: "low" },
  run_tests: { effect: "allow", minimumRisk: "low" },
  write_repository_file: { effect: "approval", minimumRisk: "medium" },
  create_branch: { effect: "allow", minimumRisk: "low" },
  install_dependency: { effect: "approval", minimumRisk: "medium" },
  upgrade_dependency: { effect: "approval", minimumRisk: "medium" },
  network_access: { effect: "approval", minimumRisk: "medium" },
  change_repository_permissions: { effect: "approval", minimumRisk: "high" },
  access_secret: { effect: "approval", minimumRisk: "high" },
  export_secret: { effect: "approval", minimumRisk: "critical" },
  deploy_to_staging: { effect: "approval", minimumRisk: "high" },
  deploy_to_production: { effect: "approval", minimumRisk: "critical" },
  destructive_database_migration: { effect: "approval", minimumRisk: "critical" },
  delete_repository_data: { effect: "approval", minimumRisk: "critical" },
  execute_untrusted_code: { effect: "approval", minimumRisk: "critical" }
});

const RISK_ORDER = Object.freeze({ low: 0, medium: 1, high: 2, critical: 3 });
const MUTATING_ACTIONS = new Set([
  "write_repository_file", "install_dependency", "upgrade_dependency",
  "change_repository_permissions", "export_secret", "deploy_to_staging",
  "deploy_to_production", "destructive_database_migration",
  "delete_repository_data", "execute_untrusted_code"
]);

function digest(value) {
  return createHash("sha256").update(JSON.stringify(value)).digest("hex");
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
  if (!planId || !planDigest || !action || !target) {
    throw new Error("planId, planDigest, action, and target are required");
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

    const riskRequiresApproval = RISK_ORDER[risk] >= RISK_ORDER[rule.minimumRisk] && rule.minimumRisk !== "low";
    const requiresApproval = rule.effect === "approval" || (risk === "critical" && MUTATING_ACTIONS.has(action.type));
    if (!requiresApproval || !riskRequiresApproval) {
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
