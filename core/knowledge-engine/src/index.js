import { validateApprovalAttestation } from "./approval.js";
import { createHash } from "node:crypto";

const STATUSES = new Set(["draft", "review", "approved", "deprecated"]);
const ACTIVATION_ARRAYS = [
  "any_tags", "all_tags", "any_phrases", "required_capabilities", "exclude_phrases"
];

function normaliseKey(value) {
  return String(value ?? "").normalize("NFKC").toLowerCase()
    .trim().replace(/[^\p{L}\p{N}]+/gu, "-").replace(/^-|-$/g, "");
}

function tokens(value) {
  return String(value ?? "").normalize("NFKC").toLowerCase()
    .match(/[\p{L}\p{N}]+/gu) ?? [];
}

function containsTokenSequence(sourceTokens, phraseTokens) {
  if (phraseTokens.length === 0 || phraseTokens.length > sourceTokens.length) return false;
  outer: for (let i = 0; i <= sourceTokens.length - phraseTokens.length; i += 1) {
    for (let j = 0; j < phraseTokens.length; j += 1) {
      if (sourceTokens[i + j] !== phraseTokens[j]) continue outer;
    }
    return true;
  }
  return false;
}

function assertStringArray(value, label) {
  if (!Array.isArray(value) || value.some((entry) => typeof entry !== "string" || !entry.trim())) {
    throw new Error(label + " must be an array of non-empty strings");
  }
}

export function validateKnowledgeRegistry(registry) {
  if (!registry || !Array.isArray(registry.items)) {
    throw new Error("Registry must contain an items array");
  }

  const ids = new Map();
  const paths = new Set();

  for (const [index, item] of registry.items.entries()) {
    const label = "items[" + index + "]";
    if (!item || typeof item !== "object") throw new Error(label + " must be an object");
    for (const key of ["id", "title", "kind", "path", "version", "status"]) {
      if (typeof item[key] !== "string" || !item[key].trim()) {
        throw new Error(label + "." + key + " must be a non-empty string");
      }
    }
    if (!/^[a-z0-9][a-z0-9._-]*$/.test(item.id)) throw new Error("Invalid knowledge ID: " + item.id);
    if (ids.has(item.id)) throw new Error("Duplicate knowledge item id: " + item.id);
    if (!STATUSES.has(item.status)) throw new Error("Invalid status for " + item.id + ": " + item.status);
    if (!/^knowledge\/(?!.*(?:^|\/)\.\.(?:\/|$)).+\.md$/.test(item.path)) {
      throw new Error("Unsafe or invalid knowledge path for " + item.id);
    }
    if (paths.has(item.path)) throw new Error("Duplicate knowledge path: " + item.path);
    ids.set(item.id, item);
    paths.add(item.path);

    for (const key of ["domains", "tags", "prerequisites", "related", "limitations"]) {
      if (item[key] !== undefined) assertStringArray(item[key], label + "." + key);
    }
    if (!Array.isArray(item.domains) || item.domains.length === 0) {
      throw new Error(label + ".domains must contain at least one domain");
    }
    if (!Array.isArray(item.tags) || item.tags.length === 0) {
      throw new Error(label + ".tags must contain at least one tag");
    }
    if (!item.activation || typeof item.activation !== "object" || Array.isArray(item.activation)) {
      throw new Error(label + ".activation must be an object");
    }
    for (const key of ACTIVATION_ARRAYS) {
      if (item.activation[key] !== undefined) assertStringArray(item.activation[key], label + ".activation." + key);
    }
    if (!Array.isArray(item.activation.any_tags) || !Array.isArray(item.activation.any_phrases)) {
      throw new Error(label + ".activation must define any_tags and any_phrases arrays");
    }

    if (item.status === "approved") {
      const review = item.review;
      if (!review || !review.approved_by || !review.approved_at ||
          review.reviewed_version !== item.version || !/^[a-f0-9]{64}$/.test(review.content_sha256 ?? "") || !Number.isSafeInteger(review.approval_pr) || review.approval_pr < 1 || !Number.isSafeInteger(review.approval_review_id) || review.approval_review_id < 1 || !/^[a-f0-9]{40}$/i.test(review.approval_commit ?? "") || !Array.isArray(review.sources) ||
          review.sources.length === 0 ||
          review.sources.some((source) => !source.title || !source.url || !source.purpose)) {
        throw new Error("Approved item " + item.id +
          " needs reviewer, approval date, matching reviewed version, a GitHub PR/review/commit attestation, and complete verification sources");
      }
      if (!Number.isFinite(Date.parse(review.approved_at))) {
        throw new Error("Invalid approval date for " + item.id);
      }
    }
  }

  for (const item of registry.items) {
    for (const relation of [...(item.prerequisites ?? []), ...(item.related ?? [])]) {
      if (!ids.has(relation)) {
        throw new Error("Unknown knowledge relationship: " + item.id + " -> " + relation);
      }
    }
  }

  const visiting = new Set();
  const visited = new Set();
  function visit(id) {
    if (visiting.has(id)) throw new Error("Knowledge prerequisite cycle detected at: " + id);
    if (visited.has(id)) return;
    visiting.add(id);
    for (const dependency of ids.get(id).prerequisites ?? []) visit(dependency);
    visiting.delete(id);
    visited.add(id);
  }
  for (const id of ids.keys()) visit(id);

  return { valid: true, item_count: ids.size };
}

function validateTask(task) {
  if (!task || typeof task !== "object" || Array.isArray(task)) {
    throw new Error("A task context object is required");
  }
  for (const key of ["tags", "required_capabilities"]) {
    if (task[key] !== undefined) assertStringArray(task[key], "task." + key);
  }
  for (const key of ["description", "goal", "problem", "context", "domain"]) {
    if (task[key] !== undefined && typeof task[key] !== "string") {
      throw new Error("task." + key + " must be a string");
    }
  }
}

function collectUnapprovedPrerequisites(item, byId) {
  const unresolved = new Set();
  const visited = new Set();
  function visit(current) {
    for (const id of current.prerequisites ?? []) {
      if (visited.has(id)) continue;
      visited.add(id);
      const prerequisite = byId.get(id);
      if (!prerequisite || prerequisite.status !== "approved") unresolved.add(id);
      if (prerequisite) visit(prerequisite);
    }
  }
  visit(item);
  return [...unresolved].sort();
}

export function selectKnowledge(registry, task, options = {}) {
  validateKnowledgeRegistry(registry);
  validateTask(task);

  const allowedStatuses = options.statuses ?? ["approved"];
  if (!Array.isArray(allowedStatuses) || allowedStatuses.some((status) => !STATUSES.has(status))) {
    throw new Error("statuses must contain only known knowledge statuses");
  }
  const minimumScore = options.minimumScore ?? 3;
  const limit = options.limit ?? 5;
  if (!Number.isFinite(minimumScore) || minimumScore < 1) {
    throw new Error("minimumScore must be a finite number of at least 1");
  }
  if (!Number.isInteger(limit) || limit < 1 || limit > 50) {
    throw new Error("limit must be an integer from 1 to 50");
  }

  const description = [
    task.description, task.goal, task.problem, task.context
  ].filter(Boolean).join(" ");
  const descriptionTokens = tokens(description);
  const taskTags = new Set((task.tags ?? []).map(normaliseKey));
  const taskCapabilities = new Set((task.required_capabilities ?? []).map(normaliseKey));
  const domain = normaliseKey(task.domain);
  const allowed = new Set(allowedStatuses);
  const byId = new Map(registry.items.map((item) => [item.id, item]));
  const matches = [];
  const excluded = [];

  for (const item of registry.items) {
    if (!allowed.has(item.status)) continue;
    const activation = item.activation;
    const excludedPhrases = (activation.exclude_phrases ?? [])
      .filter((phrase) => containsTokenSequence(descriptionTokens, tokens(phrase)));
    if (excludedPhrases.length) {
      excluded.push({ id: item.id, reason: "Matched an exclusion phrase", phrases: excludedPhrases });
      continue;
    }

    const anyTags = activation.any_tags.map(normaliseKey);
    const allTags = (activation.all_tags ?? []).map(normaliseKey);
    const requiredCapabilities = (activation.required_capabilities ?? []).map(normaliseKey);
    const tagMatches = [...new Set(anyTags.filter((tag) => taskTags.has(tag)))];
    const allTagsSatisfied = allTags.length > 0 && allTags.every((tag) => taskTags.has(tag));
    const phraseMatches = (activation.any_phrases ?? [])
      .filter((phrase) => containsTokenSequence(descriptionTokens, tokens(phrase)));
    const capabilityMatches = requiredCapabilities.filter((capability) => taskCapabilities.has(capability));
    const capabilitiesSatisfied = requiredCapabilities.every((capability) => taskCapabilities.has(capability));
    const domainMatch = Boolean(domain && (item.domains ?? []).some((entry) => normaliseKey(entry) === domain));

    // Domain alone must never retrieve an item. It is only a ranking signal.
    const hasPositiveSignal = tagMatches.length > 0 || phraseMatches.length > 0 || allTagsSatisfied;
    if (!hasPositiveSignal || !capabilitiesSatisfied || (allTags.length > 0 && !allTagsSatisfied)) continue;

    const score = tagMatches.length * 4 + phraseMatches.length * 2 +
      capabilityMatches.length * 3 + (domainMatch ? 1 : 0) +
      (allTagsSatisfied ? allTags.length * 4 : 0);
    if (score < minimumScore) continue;

    const unresolvedPrerequisites = collectUnapprovedPrerequisites(item, byId);
    const reasons = [];
    if (tagMatches.length) reasons.push("Matched task tags: " + tagMatches.join(", "));
    if (allTagsSatisfied) reasons.push("All required activation tags were present");
    if (phraseMatches.length) reasons.push("Matched task phrases: " + phraseMatches.join(", "));
    if (capabilityMatches.length) reasons.push("Matched required capabilities: " + capabilityMatches.join(", "));
    if (domainMatch) reasons.push("Matched domain: " + domain);
    if (item.status !== "approved") reasons.push("Item is not approved");
    if (unresolvedPrerequisites.length) {
      reasons.push("Prerequisite chain contains items that are not approved");
    }

    matches.push({
      id: item.id,
      title: item.title,
      kind: item.kind,
      path: item.path,
      status: item.status,
      rank_score: score,
      reasons,
      prerequisites: item.prerequisites ?? [],
      unresolved_prerequisites: unresolvedPrerequisites,
      ready_to_apply: item.status === "approved" && unresolvedPrerequisites.length === 0,
      limitations: item.limitations ?? []
    });
  }

  matches.sort((a, b) => b.rank_score - a.rank_score || a.id.localeCompare(b.id));
  return {
    matches: matches.slice(0, limit),
    excluded,
    total_matches: matches.length,
    retrieval_mode: "deterministic_metadata",
    notice: "Rank scores order candidates. They are not probabilities, correctness scores, or proof of suitability. Verify assumptions and prerequisites before use."
  };
}


export function validateKnowledgeContent(registry, readContent) {
  validateKnowledgeRegistry(registry);
  if (typeof readContent !== "function") throw new Error("readContent must be a function");
  const verified = [];
  for (const item of registry.items.filter((entry) => entry.status === "approved")) {
    const content = readContent(item.path);
    if (typeof content !== "string") throw new Error("Content reader must return text for " + item.id);
    const digest = createHash("sha256").update(content, "utf8").digest("hex");
    if (digest !== item.review.content_sha256) throw new Error("Approved content digest mismatch for " + item.id);
    verified.push({ id: item.id, sha256: digest });
  }
  return { valid: true, verified_count: verified.length, verified };
}

export { validateApprovalAttestation } from "./approval.js";
