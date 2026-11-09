const DIMENSIONS = [
  "project_fit", "quality", "maintenance", "security",
  "documentation", "license", "compatibility", "performance",
  "integration_cost"
];

const DEFAULT_WEIGHTS = {
  project_fit: 5, quality: 4, maintenance: 3, security: 4,
  documentation: 2, license: 3, compatibility: 4,
  performance: 2, integration_cost: 3
};

function validateResource(resource) {
  if (!resource?.id || !resource?.name) {
    throw new Error("Each resource needs an id and name");
  }
  if (!resource.evaluation || !Array.isArray(resource.evidence) || resource.evidence.length === 0) {
    throw new Error(`Resource ${resource.id} needs an evaluation and evidence`);
  }
  for (const dimension of DIMENSIONS) {
    const value = resource.evaluation[dimension];
    if (!Number.isFinite(value) || value < 0 || value > 5) {
      throw new Error(`Resource ${resource.id} needs ${dimension} scored from 0 to 5`);
    }
  }
  if (!resource.evidence.every((item) => item.url && item.claim && item.checked_at)) {
    throw new Error(`Resource ${resource.id} has incomplete evidence`);
  }
}


function evaluateHardConstraints(resource, constraints, requiredCapabilities, allowHybrid) {
  const violations = [];
  const unknowns = [];
  const licenseId = resource.license?.spdx_id;
  if (constraints.allowedLicenseIds) {
    if (!licenseId) unknowns.push("license.spdx_id is missing");
    else if (!constraints.allowedLicenseIds.includes(licenseId)) violations.push("License is not in the allowed list: " + licenseId);
  }
  if (constraints.requireReviewedLicense) {
    if (!resource.license?.review_status) unknowns.push("license.review_status is missing");
    else if (resource.license.review_status !== "approved") violations.push("License review status is not approved");
  }
  if (constraints.minimumSecurity !== undefined && resource.evaluation.security < constraints.minimumSecurity) {
    violations.push("Security score is below the mandatory minimum");
  }
  if (constraints.minimumCompatibility !== undefined && resource.evaluation.compatibility < constraints.minimumCompatibility) {
    violations.push("Compatibility score is below the mandatory minimum");
  }
  if (constraints.maximumIntegrationCost !== undefined && resource.evaluation.integration_cost > constraints.maximumIntegrationCost) {
    violations.push("Integration cost exceeds the mandatory maximum");
  }
  if (constraints.requiredPlatforms?.length) {
    const platforms = resource.compatibility?.platforms;
    if (!Array.isArray(platforms)) unknowns.push("compatibility.platforms is missing");
    else {
      const missing = constraints.requiredPlatforms.filter((platform) => !platforms.includes(platform));
      if (missing.length) violations.push("Unsupported required platforms: " + missing.join(", "));
    }
  }
  if (constraints.maxEvidenceAgeDays !== undefined) {
    const asOf = Date.parse(constraints.asOf ?? new Date().toISOString());
    const oldest = Math.min(...resource.evidence.map((item) => Date.parse(item.checked_at)));
    if (!Number.isFinite(asOf) || !Number.isFinite(oldest)) unknowns.push("Evidence date or asOf date is invalid");
    else if ((asOf - oldest) / 86400000 > constraints.maxEvidenceAgeDays) violations.push("Evidence is older than the allowed maximum age");
  }
  const capabilities = resource.capabilities ?? [];
  const capabilityHits = requiredCapabilities.filter((capability) => capabilities.includes(capability));
  if (requiredCapabilities.length && (allowHybrid ? capabilityHits.length === 0 : capabilityHits.length !== requiredCapabilities.length)) {
    violations.push(allowHybrid
      ? "Resource covers none of the required capabilities"
      : "Resource does not cover every required capability");
  }
  return { eligible: violations.length === 0 && unknowns.length === 0, violations, unknowns };
}

function validateConstraints(constraints) {
  if (!constraints || typeof constraints !== "object" || Array.isArray(constraints)) {
    throw new Error("constraints must be an object");
  }
  for (const key of ["allowedLicenseIds", "requiredPlatforms", "requiredCapabilities"]) {
    if (constraints[key] !== undefined && (!Array.isArray(constraints[key]) || constraints[key].some((v) => typeof v !== "string" || !v.trim()))) {
      throw new Error("constraints." + key + " must be an array of non-empty strings");
    }
  }
  for (const key of ["minimumSecurity", "minimumCompatibility", "maximumIntegrationCost", "maxEvidenceAgeDays"]) {
    if (constraints[key] !== undefined && (!Number.isFinite(constraints[key]) || constraints[key] < 0 || (key !== "maximumIntegrationCost" && key !== "maxEvidenceAgeDays" && constraints[key] > 5))) {
      throw new Error("Invalid hard constraint: " + key);
    }
  }
  if (constraints.requireReviewedLicense !== undefined && typeof constraints.requireReviewedLicense !== "boolean") {
    throw new Error("constraints.requireReviewedLicense must be boolean");
  }
}

function validateHybridOptions(options) {
  for (const key of ["minimumCompatibility", "maximumIntegrationCost"]) {
    if (options[key] !== undefined && (!Number.isFinite(options[key]) || options[key] < 0 || options[key] > 5)) {
      throw new Error("Invalid hybrid option: " + key);
    }
  }
}

function scoreResource(resource, weights) {
  const totalWeight = DIMENSIONS.reduce((sum, key) => sum + weights[key], 0);
  const weighted = DIMENSIONS.reduce(
    (sum, key) => sum + resource.evaluation[key] * weights[key], 0
  );
  return Number((weighted / totalWeight * 20).toFixed(2));
}

export function compareResources(resources, options = {}) {
  if (!Array.isArray(resources) || resources.length === 0) {
    throw new Error("Provide at least one resource to compare");
  }
  if (!options || typeof options !== "object" || Array.isArray(options)) {
    throw new Error("options must be an object");
  }
  const ids = new Set();
  for (const resource of resources) {
    validateResource(resource);
    if (ids.has(resource.id)) throw new Error(`Duplicate resource id: ${resource.id}`);
    ids.add(resource.id);
  }

  const constraints = options.constraints ?? {};
  validateConstraints(constraints);
  validateHybridOptions(options);
  const weights = { ...DEFAULT_WEIGHTS, ...(options.weights ?? {}) };
  for (const [key, value] of Object.entries(weights)) {
    if (!DIMENSIONS.includes(key) || !Number.isFinite(value) || value < 0) throw new Error(`Invalid weight: ${key}`);
  }
  if (DIMENSIONS.reduce((sum, key) => sum + weights[key], 0) === 0) throw new Error("At least one scoring weight must be greater than zero");
  const required = constraints.requiredCapabilities ?? options.requiredCapabilities ?? [];
  if (!Array.isArray(required) || required.some((value) => typeof value !== "string" || !value.trim())) {
    throw new Error("requiredCapabilities must be an array of non-empty strings");
  }
  const allowHybrid = options.allowHybrid !== false;
  const eligible = [], rejected = [];
  for (const resource of resources) {
    const result = evaluateHardConstraints(resource, constraints, required, allowHybrid);
    if (result.eligible) eligible.push(resource);
    else rejected.push({ id: resource.id, reasons: result.violations, unknowns: result.unknowns });
  }
  if (!eligible.length) {
    return {
      recommended: null, alternatives: [], hybrid: null, rejected,
      decision: rejected.some((item) => item.unknowns.length)
        ? "insufficient_evidence" : "none_meet_constraints",
      decision_note: rejected.some((item) => item.unknowns.length)
        ? "No candidate passed the hard constraints. At least one candidate has unknown mandatory evidence."
        : "No candidate meets all mandatory constraints. Do not rank rejected candidates as recommendations.",
      scoring: { scale: "0-5 per dimension; weighted total converted to 0-100", weights: { ...DEFAULT_WEIGHTS, ...(options.weights ?? {}) } }
    };
  }

  const ranked = eligible.map((resource) => ({
    id: resource.id, name: resource.name, url: resource.url,
    score: scoreResource(resource, weights),
    capabilities: resource.capabilities ?? [], complements: resource.complements ?? [],
    evaluation: resource.evaluation, evidence: resource.evidence
  })).sort((a, b) => b.score - a.score || a.id.localeCompare(b.id));

  const best = ranked[0];
  const bestCoverage = required.filter((capability) => best.capabilities.includes(capability));
  const singleMeetsRequirements = bestCoverage.length === required.length;
  let hybrid = null;
  if (allowHybrid && ranked.length > 1) {
    for (const other of ranked.slice(1)) {
      const declaredComplement = best.complements.includes(other.id) || other.complements.includes(best.id);
      const addsCapability = other.capabilities.some((capability) => !best.capabilities.includes(capability));
      const compatible = Math.min(best.evaluation.compatibility, other.evaluation.compatibility) >= (options.minimumCompatibility ?? 3);
      const affordableIntegration = Math.max(best.evaluation.integration_cost, other.evaluation.integration_cost) <= (options.maximumIntegrationCost ?? 2.5);
      const coverage = required.filter((capability) => best.capabilities.includes(capability) || other.capabilities.includes(capability));
      const coversRequirements = coverage.length === required.length;
      if (declaredComplement && addsCapability && compatible && affordableIntegration && coversRequirements) {
        hybrid = {
          resources: [best.id, other.id],
          reason: "The resources declare complementary roles, add distinct capabilities, meet compatibility and integration-cost limits, and cover all mandatory capabilities.",
          added_capabilities: other.capabilities.filter((capability) => !best.capabilities.includes(capability)),
          required_capabilities_covered: coverage,
          required_capabilities_missing: required.filter((capability) => !coverage.includes(capability)),
          improves_required_coverage: coverage.length > bestCoverage.length
        };
        break;
      }
    }
  }

  return {
    recommended: singleMeetsRequirements ? best : null,
    alternatives: ranked.slice(singleMeetsRequirements ? 1 : 0),
    hybrid, rejected,
    decision: singleMeetsRequirements ? "select_single" : hybrid ? "hybrid_candidate" : "none_meet_constraints",
    decision_note: singleMeetsRequirements
      ? "The highest-ranked eligible resource meets all mandatory capability requirements."
      : hybrid
        ? "No single resource meets all mandatory capabilities. A declared complementary hybrid covers them; assess its operational cost before adoption."
        : "No single resource or validated hybrid covers all mandatory capabilities.",
    scoring: { scale: "0-5 per dimension; weighted total converted to 0-100", weights }
  };
}

export { DIMENSIONS, DEFAULT_WEIGHTS };
