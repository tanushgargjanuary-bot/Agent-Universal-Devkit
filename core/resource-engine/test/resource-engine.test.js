import test from "node:test";
import assert from "node:assert/strict";
import { compareResources } from "../src/index.js";

const evidence = [{
  url: "https://example.com/docs",
  claim: "Official documentation",
  checked_at: "2026-11-10T00:00:00Z"
}];
const make = (id, overrides = {}) => ({
  id, name: id, url: `https://github.com/example/${id}`,
  capabilities: ["scan"],
  complements: [],
  evaluation: {
    project_fit: 5, quality: 4, maintenance: 4, security: 4,
    documentation: 4, license: 5, compatibility: 4,
    performance: 4, integration_cost: 1,
    ...(overrides.evaluation ?? {})
  },
  evidence,
  ...overrides
});

test("ranks the stronger fit first", () => {
  const result = compareResources([
    make("a", { evaluation: { project_fit: 2 } }),
    make("b")
  ]);
  assert.equal(result.recommended.id, "b");
});

test("suggests a hybrid only for declared complementary capabilities", () => {
  const a = make("a", { complements: ["b"], capabilities: ["static-analysis"] });
  const b = make("b", { capabilities: ["dynamic-analysis"] });
  const result = compareResources([a, b], {
    requiredCapabilities: ["static-analysis", "dynamic-analysis"]
  });
  assert.deepEqual(result.hybrid.resources, ["a", "b"]);
  assert.equal(result.hybrid.improves_required_coverage, true);
});

test("does not suggest a hybrid for duplicate capabilities", () => {
  const a = make("a", { complements: ["b"] });
  const b = make("b");
  assert.equal(compareResources([a, b]).hybrid, null);
});

test("rejects scores without evidence", () => {
  assert.throws(() => compareResources([make("a", { evidence: [] })]), /evidence/);
});

test("rejects out-of-range scores", () => {
  assert.throws(() => compareResources([
    make("a", { evaluation: { security: 8 } })
  ]), /security scored from 0 to 5/);
});
