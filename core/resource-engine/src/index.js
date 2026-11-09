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
  const ids = new Set();
  for (const resource of resources) {
    validateResource(resource);
    if (ids.has(resource.id)) throw new Error(`Duplicate resource id: ${resource.id}`);
    ids.add(resource.id);
  }

  const weights = { ...DEFAULT_WEIGHTS, ...(options.weights ?? {}) };
  for (const [key, value] of Object.entries(weights)) {
    if (!DIMENSIONS.includes(key) || !Number.isFinite(value) || value < 0) {
      throw new Error(`Invalid weight: ${key}`);
    }
  }
  if (DIMENSIONS.reduce((sum, key) => sum + weights[key], 0) === 0) {
    throw new Error("At least one scoring weight must be greater than zero");
  }

  const ranked = resources.map((resource) => ({
    id: resource.id,
    name: resource.name,
    url: resource.url,
    score: scoreResource(resource, weights),
    capabilities: resource.capabilities ?? [],
    complements: resource.complements ?? [],
    evaluation: resource.evaluation,
    evidence: resource.evidence
  })).sort((a, b) => b.score - a.score || a.id.localeCompare(b.id));

  const best = ranked[0];
  let hybrid = null;
  if (options.allowHybrid !== false && ranked.length > 1) {
    for (const other of ranked.slice(1)) {
      const declaredComplement =
        best.complements.includes(other.id) || other.complements.includes(best.id);
      const addsCapability = other.capabilities.some(
        (capability) => !best.capabilities.includes(capability)
      );
      const compatible = Math.min(
        best.evaluation.compatibility, other.evaluation.compatibility
      ) >= (options.minimumCompatibility ?? 3);
      const affordableIntegration = Math.max(
        best.evaluation.integration_cost, other.evaluation.integration_cost
      ) <= (options.maximumIntegrationCost ?? 2.5);

      if (declaredComplement && addsCapability && compatible && affordableIntegration) {
        const required = options.requiredCapabilities ?? [];
        const bestCoverage = required.filter((capability) =>
          best.capabilities.includes(capability)
        );
        const hybridCoverage = required.filter((capability) =>
          best.capabilities.includes(capability) || other.capabilities.includes(capability)
        );
        hybrid = {
          resources: [best.id, other.id],
          reason: "The resources declare complementary roles, add distinct capabilities, and meet compatibility and integration-cost limits.",
          added_capabilities: other.capabilities.filter(
            (capability) => !best.capabilities.includes(capability)
          ),
          required_capabilities_covered: hybridCoverage,
          required_capabilities_missing: required.filter(
            (capability) => !hybridCoverage.includes(capability)
          ),
          improves_required_coverage: hybridCoverage.length > bestCoverage.length
        };
        break;
      }
    }
  }

  return {
    recommended: best,
    alternatives: ranked.slice(1),
    hybrid,
    decision_note: hybrid
      ? "A single resource ranks highest. A hybrid is a candidate, not an automatic choice. Use it only when the extra capability is required and its integration cost is justified."
      : "Use the highest-ranked resource unless project-specific constraints justify an alternative.",
    scoring: {
      scale: "0-5 per dimension; weighted total converted to 0-100",
      weights
    }
  };
}

export { DIMENSIONS, DEFAULT_WEIGHTS };
