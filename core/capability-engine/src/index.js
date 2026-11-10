import { validateRecord } from "../../problem-engine/src/index.js";

const DEFAULT_EXECUTION_MODES = ["read_only", "recommend"];
const VALID_EXECUTION_MODES = new Set(["read_only", "recommend", "controlled_write", "external_service"]);
const COST_ORDER = { low: 0, medium: 1, high: 2, variable: 3, unknown: 4 };

function requireStringList(value, label, { allowEmpty = true } = {}) {
  if (!Array.isArray(value) || (!allowEmpty && value.length === 0) ||
      value.some((entry) => typeof entry !== "string" || !entry.trim())) {
    throw new TypeError(label + " must be " + (allowEmpty ? "an array" : "a non-empty array") + " of non-empty strings");
  }
  if (new Set(value).size !== value.length) throw new TypeError(label + " must not contain duplicates");
  return value;
}

function reject(capability, reason, details) {
  return { id: typeof capability?.id === "string" ? capability.id : null, reason, details };
}

/**
 * Rank capability declarations for a problem without invoking them.
 * Permission and execution-mode checks are deny-by-default.
 */
export function rankCapabilities(problem, capabilities, options = {}) {
  const problemResult = validateRecord("problem", problem);
  if (!problemResult.valid) throw new TypeError("Invalid problem record: " + problemResult.errors.join("; "));
  if (!Array.isArray(capabilities)) throw new TypeError("capabilities must be an array");
  if (options === null || typeof options !== "object" || Array.isArray(options)) throw new TypeError("options must be an object");

  const grantedPermissions = requireStringList(options.granted_permissions ?? [], "granted_permissions");
  const allowedModes = requireStringList(options.allowed_execution_modes ?? DEFAULT_EXECUTION_MODES, "allowed_execution_modes", { allowEmpty: false });
  for (const mode of allowedModes) {
    if (!VALID_EXECUTION_MODES.has(mode)) throw new TypeError("Unsupported execution mode: " + mode);
  }
  const preferredIds = requireStringList(options.preferred_capability_ids ?? [], "preferred_capability_ids");
  const availableInputs = requireStringList(options.available_input_types ?? [], "available_input_types");
  const requiredOutputs = requireStringList(options.required_output_types ?? [], "required_output_types");
  const problemType = options.problem_type;
  if (problemType !== undefined && (typeof problemType !== "string" || !problemType.trim())) {
    throw new TypeError("problem_type must be a non-empty string when supplied");
  }
  const includeExperimental = options.include_experimental ?? false;
  if (typeof includeExperimental !== "boolean") throw new TypeError("include_experimental must be a boolean");
  const limit = options.limit ?? 5;
  if (!Number.isInteger(limit) || limit < 1 || limit > 50) throw new RangeError("limit must be an integer from 1 to 50");

  const idCounts = new Map();
  for (const capability of capabilities) {
    if (typeof capability?.id === "string") idCounts.set(capability.id, (idCounts.get(capability.id) ?? 0) + 1);
  }

  const eligible = [];
  const rejected = [];
  for (const capability of capabilities) {
    const validation = validateRecord("capability", capability);
    if (!validation.valid) {
      rejected.push(reject(capability, "invalid_record", validation.errors));
      continue;
    }
    if (idCounts.get(capability.id) > 1) {
      rejected.push(reject(capability, "duplicate_id", ["Capability IDs must be unique within a selection request."]));
      continue;
    }
    if (capability.status !== "enabled" && !(includeExperimental && capability.status === "experimental")) {
      rejected.push(reject(capability, "inactive", ["Only enabled capabilities are eligible by default; experimental requires explicit opt-in."]));
      continue;
    }

    const matchedDomains = capability.domains.filter((domain) => problem.domain_hints.includes(domain));
    if (problem.domain_hints.length > 0 && matchedDomains.length === 0) {
      rejected.push(reject(capability, "domain_mismatch", ["No capability domain matches the problem's domain hints."]));
      continue;
    }
    if (problemType && !capability.problem_types.includes(problemType)) {
      rejected.push(reject(capability, "problem_type_mismatch", ["Capability does not declare support for problem type " + problemType + "."]));
      continue;
    }

    const missingInputs = (capability.required_input_types ?? []).filter((input) => !availableInputs.includes(input));
    if (missingInputs.length > 0) {
      rejected.push(reject(capability, "required_input_unavailable", missingInputs));
      continue;
    }
    const unsupportedOutputs = requiredOutputs.filter((output) => !capability.output_types.includes(output));
    if (unsupportedOutputs.length > 0) {
      rejected.push(reject(capability, "required_output_unsupported", unsupportedOutputs));
      continue;
    }

    const missingPermissions = capability.permissions.filter((permission) => !grantedPermissions.includes(permission));
    if (missingPermissions.length > 0) {
      rejected.push(reject(capability, "permission_not_granted", missingPermissions));
      continue;
    }
    const compatibleModes = capability.execution_modes.filter((mode) => allowedModes.includes(mode));
    if (compatibleModes.length === 0) {
      rejected.push(reject(capability, "execution_mode_not_allowed", capability.execution_modes));
      continue;
    }
    if (capability.verification_methods.length === 0) {
      rejected.push(reject(capability, "verification_not_declared", ["At least one verification method is required."]));
      continue;
    }

    const reasons = [];
    if (matchedDomains.length > 0) reasons.push("Matches problem domains: " + matchedDomains.join(", "));
    if (problemType) reasons.push("Declares support for problem type: " + problemType);
    if ((capability.required_input_types ?? []).length > 0) reasons.push("Required inputs are available.");
    if (requiredOutputs.length > 0) reasons.push("Required outputs are supported.");
    reasons.push("All declared permissions are granted.");
    reasons.push("Allowed execution mode: " + compatibleModes.join(", "));
    reasons.push("Verification methods are declared.");
    eligible.push({
      capability,
      matched_domains: matchedDomains,
      compatible_execution_modes: compatibleModes,
      cost_level: capability.cost_profile?.level ?? "unknown",
      reasons
    });
  }

  const preferredOrder = new Map(preferredIds.map((id, index) => [id, index]));
  eligible.sort((left, right) => {
    const leftPreference = preferredOrder.get(left.capability.id) ?? Number.MAX_SAFE_INTEGER;
    const rightPreference = preferredOrder.get(right.capability.id) ?? Number.MAX_SAFE_INTEGER;
    return leftPreference - rightPreference ||
      right.matched_domains.length - left.matched_domains.length ||
      COST_ORDER[left.cost_level] - COST_ORDER[right.cost_level] ||
      left.capability.id.localeCompare(right.capability.id);
  });

  const candidates = eligible.slice(0, limit);
  return {
    outcome: candidates.length > 0 ? "capabilities_available" : "no_eligible_capability",
    recommended: candidates[0] ?? null,
    candidates,
    total_eligible: eligible.length,
    rejected
  };
}
