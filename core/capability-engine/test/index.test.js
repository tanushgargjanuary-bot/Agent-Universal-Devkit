import test from "node:test";
import assert from "node:assert/strict";
import { createRecord } from "../../problem-engine/src/index.js";
import { rankCapabilities } from "../src/index.js";

const timestamp = "2026-11-10T12:00:00Z";
const problem = createRecord("problem", {
  id: "problem-selector-001",
  goal: "Investigate intermittent failures in a web service",
  created_at: timestamp,
  priority: "normal",
  constraints: ["Do not change files"],
  domain_hints: ["software", "reliability"]
});

function capability(overrides = {}) {
  return createRecord("capability", {
    id: "capability.inspect",
    name: "Read-only Inspector",
    version: "1.0.0",
    description: "Inspect evidence without changing the target.",
    domains: ["software"],
    problem_types: ["debugging", "repository_assessment"],
    input_types: ["repository_ref"],
    output_types: ["finding"],
    permissions: ["repository.read"],
    execution_modes: ["read_only"],
    verification_methods: ["fixture_tests"],
    status: "enabled",
    cost_profile: { level: "low" },
    ...overrides
  });
}

test("recommends only enabled capabilities with matching domain, permission, mode, and verification", () => {
  const candidate = capability();
  const result = rankCapabilities(problem, [candidate], {
    problem_type: "debugging",
    granted_permissions: ["repository.read"]
  });
  assert.equal(result.outcome, "capabilities_available");
  assert.equal(result.recommended.capability.id, candidate.id);
  assert.deepEqual(result.recommended.matched_domains, ["software"]);
  assert.equal(result.recommended.compatible_execution_modes[0], "read_only");
  assert.ok(result.recommended.reasons.some((reason) => reason.includes("permissions are granted")));
});

test("denies missing permissions and non-read-only modes by default", () => {
  const needsWrite = capability({
    id: "capability.write",
    permissions: ["repository.write"],
    execution_modes: ["controlled_write"]
  });
  const permissionResult = rankCapabilities(problem, [needsWrite]);
  assert.equal(permissionResult.outcome, "no_eligible_capability");
  assert.equal(permissionResult.rejected[0].reason, "permission_not_granted");

  const writeModeOnly = capability({
    id: "capability.write-mode",
    permissions: [],
    execution_modes: ["controlled_write"]
  });
  const modeResult = rankCapabilities(problem, [writeModeOnly]);
  assert.equal(modeResult.rejected[0].reason, "execution_mode_not_allowed");
});

test("requires an explicit opt-in for experimental capabilities", () => {
  const experimental = capability({ id: "capability.experimental", status: "experimental" });
  assert.equal(rankCapabilities(problem, [experimental], { granted_permissions: ["repository.read"] }).total_eligible, 0);
  assert.equal(rankCapabilities(problem, [experimental], {
    granted_permissions: ["repository.read"],
    include_experimental: true
  }).total_eligible, 1);
});

test("filters mismatched domains and problem types", () => {
  const wrongDomain = capability({ id: "capability.data", domains: ["data"] });
  const result = rankCapabilities(problem, [wrongDomain], {
    problem_type: "debugging",
    granted_permissions: ["repository.read"]
  });
  assert.equal(result.rejected[0].reason, "domain_mismatch");

  const wrongType = capability({ id: "capability.test", problem_types: ["testing"] });
  const typed = rankCapabilities(problem, [wrongType], {
    problem_type: "debugging",
    granted_permissions: ["repository.read"]
  });
  assert.equal(typed.rejected[0].reason, "problem_type_mismatch");
});

test("checks required inputs and requested outputs", () => {
  const needsInput = capability({
    id: "capability.requires-tree",
    required_input_types: ["repository_tree"],
    output_types: ["finding"]
  });
  const missingInput = rankCapabilities(problem, [needsInput], { granted_permissions: ["repository.read"] });
  assert.equal(missingInput.rejected[0].reason, "required_input_unavailable");

  const compatible = rankCapabilities(problem, [needsInput], {
    granted_permissions: ["repository.read"],
    available_input_types: ["repository_tree"],
    required_output_types: ["finding"]
  });
  assert.equal(compatible.total_eligible, 1);

  const missingOutput = rankCapabilities(problem, [needsInput], {
    granted_permissions: ["repository.read"],
    available_input_types: ["repository_tree"],
    required_output_types: ["patch"]
  });
  assert.equal(missingOutput.rejected[0].reason, "required_output_unsupported");
});

test("rejects capabilities without declared verification methods", () => {
  const unverified = capability({ id: "capability.unverified", verification_methods: [] });
  const result = rankCapabilities(problem, [unverified], { granted_permissions: ["repository.read"] });
  assert.equal(result.rejected[0].reason, "verification_not_declared");
});

test("rejects invalid records and duplicate capability IDs", () => {
  const valid = capability();
  const invalid = { ...valid, unexpected: true };
  const invalidResult = rankCapabilities(problem, [invalid]);
  assert.equal(invalidResult.rejected[0].reason, "invalid_record");

  const duplicateResult = rankCapabilities(problem, [valid, structuredClone(valid)], {
    granted_permissions: ["repository.read"]
  });
  assert.equal(duplicateResult.total_eligible, 0);
  assert.ok(duplicateResult.rejected.every((item) => item.reason === "duplicate_id"));
});

test("uses deterministic preference, domain match, cost, and ID ordering", () => {
  const expensive = capability({ id: "capability.z-expensive", domains: ["software"], cost_profile: { level: "high" } });
  const cheap = capability({ id: "capability.a-cheap", domains: ["software", "reliability"], cost_profile: { level: "low" } });
  const preferred = capability({ id: "capability.m-preferred", domains: ["software"], cost_profile: { level: "medium" } });
  const result = rankCapabilities(problem, [expensive, cheap, preferred], {
    granted_permissions: ["repository.read"],
    preferred_capability_ids: ["capability.m-preferred"]
  });
  assert.deepEqual(result.candidates.map((item) => item.capability.id), [
    "capability.m-preferred", "capability.a-cheap", "capability.z-expensive"
  ]);
  assert.equal(result.total_eligible, 3);
});

test("validates arguments and does not mutate inputs", () => {
  const candidate = capability();
  const before = structuredClone(candidate);
  assert.throws(() => rankCapabilities({}, [candidate]), /Invalid problem record/);
  assert.throws(() => rankCapabilities(problem, [candidate], { allowed_execution_modes: [] }), /non-empty array/);
  assert.throws(() => rankCapabilities(problem, [candidate], { limit: 0 }), /limit must be/);
  rankCapabilities(problem, [candidate], { granted_permissions: ["repository.read"] });
  assert.deepEqual(candidate, before);
});
