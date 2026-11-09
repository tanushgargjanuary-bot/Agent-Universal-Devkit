const normalise = (value) => String(value ?? "").toLowerCase()
  .replace(/[^a-z0-9+.#\s-]/g, " ").replace(/\s+/g, " ").trim();

function asSet(values = []) {
  return new Set(values.map(normalise).filter(Boolean));
}

function includesPhrase(text, phrase) {
  const source = normalise(text);
  const target = normalise(phrase);
  return target.length > 0 && source.includes(target);
}

function validateRegistry(registry) {
  if (!registry || !Array.isArray(registry.items)) {
    throw new Error("Registry must contain an items array");
  }
  const ids = new Set();
  for (const item of registry.items) {
    if (!item.id || !item.title || !item.path || !item.activation) {
      throw new Error("Each knowledge item needs id, title, path, and activation");
    }
    if (ids.has(item.id)) throw new Error("Duplicate knowledge item id: " + item.id);
    ids.add(item.id);
    for (const key of ["any_tags", "all_tags", "any_phrases", "required_capabilities", "exclude_phrases"]) {
      if (item.activation[key] !== undefined && !Array.isArray(item.activation[key])) {
        throw new Error("Invalid activation field " + key + " for " + item.id);
      }
    }
  }
}

export function selectKnowledge(registry, task, options = {}) {
  validateRegistry(registry);
  if (!task || typeof task !== "object") throw new Error("A task context is required");

  const description = normalise([
    task.description, task.goal, task.problem, task.context
  ].filter(Boolean).join(" "));
  const taskTags = asSet(task.tags);
  const taskCapabilities = asSet(task.required_capabilities);
  const domain = normalise(task.domain);
  // Draft and review material is excluded unless a caller explicitly requests it.
  const allowedStatuses = new Set(options.statuses ?? ["approved"]);
  const minimumScore = options.minimumScore ?? 3;
  const limit = options.limit ?? 5;

  if (!Number.isInteger(limit) || limit < 1) throw new Error("limit must be a positive integer");
  if (!Number.isFinite(minimumScore) || minimumScore < 1) throw new Error("minimumScore must be at least 1");

  const matches = [];
  const excluded = [];

  for (const item of registry.items) {
    if (!allowedStatuses.has(item.status)) continue;
    const activation = item.activation;
    const exclusion = (activation.exclude_phrases ?? [])
      .filter((phrase) => includesPhrase(description, phrase));
    if (exclusion.length) {
      excluded.push({ id: item.id, reason: "Matched an exclusion phrase", phrases: exclusion });
      continue;
    }

    const anyTags = (activation.any_tags ?? []).map(normalise);
    const allTags = (activation.all_tags ?? []).map(normalise);
    const requiredCapabilities = (activation.required_capabilities ?? []).map(normalise);
    const phraseMatches = (activation.any_phrases ?? [])
      .filter((phrase) => includesPhrase(description, phrase));
    const tagMatches = anyTags.filter((tag) => taskTags.has(tag));
    const allTagsSatisfied = allTags.length > 0 && allTags.every((tag) => taskTags.has(tag));
    const capabilityMatches = requiredCapabilities.filter((capability) => taskCapabilities.has(capability));
    const capabilitiesSatisfied = requiredCapabilities.length === 0 ||
      requiredCapabilities.every((capability) => taskCapabilities.has(capability));
    const domainMatch = domain && (item.domains ?? []).map(normalise).includes(domain);

    if (allTags.length && !allTagsSatisfied) continue;
    if (!capabilitiesSatisfied) continue;

    const score = tagMatches.length * 4 + phraseMatches.length * 2 +
      capabilityMatches.length * 3 + (domainMatch ? 1 : 0) +
      (allTagsSatisfied ? allTags.length * 4 : 0);

    if (score < minimumScore) continue;

    const reasons = [];
    if (tagMatches.length) reasons.push("Matched task tags: " + tagMatches.join(", "));
    if (allTagsSatisfied) reasons.push("All required activation tags were present");
    if (phraseMatches.length) reasons.push("Matched task phrases: " + phraseMatches.join(", "));
    if (capabilityMatches.length) reasons.push("Matched capabilities: " + capabilityMatches.join(", "));
    if (domainMatch) reasons.push("Matched domain: " + domain);

    matches.push({
      id: item.id,
      title: item.title,
      kind: item.kind,
      path: item.path,
      status: item.status,
      score,
      reasons,
      prerequisites: item.prerequisites ?? [],
      limitations: item.limitations ?? []
    });
  }

  matches.sort((a, b) => b.score - a.score || a.id.localeCompare(b.id));
  return {
    matches: matches.slice(0, limit),
    excluded,
    total_matches: matches.length,
    notice: "Retrieval suggests relevant material. It does not prove suitability or authorise execution."
  };
}
