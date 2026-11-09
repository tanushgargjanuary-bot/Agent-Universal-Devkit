import test from "node:test";
import assert from "node:assert/strict";
import { compareResources } from "../src/index.js";

const evidence = [{
  url: "https://example.com/docs",
  claim: "Official documentation",
  checked_at: "2026-11-10T00:00:00Z"
}];
const make = (id, overrides = {}) => {
  const { evaluation = {}, ...rest } = overrides;
  return {
    id, name: id, url: `https://github.com/example/${id}`,
    capabilities: ["scan"],
    complements: [],
    evaluation: {
      project_fit: 5, quality: 4, maintenance: 4, security: 4,
      documentation: 4, license: 5, compatibility: 4,
      performance: 4, integration_cost: 1,
      ...evaluation
    },
    evidence,
    ...rest
  };
};

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

test("hard license constraints filter candidates before ranking", () => {
  const allowed = make("allowed", { license: { spdx_id: "MIT", review_status: "approved" } });
  const rejected = make("rejected", { license: { spdx_id: "AGPL-3.0-only", review_status: "approved" }, evaluation: { quality: 5, project_fit: 5 } });
  const result = compareResources([allowed, rejected], { constraints: { allowedLicenseIds: ["MIT"] } });
  assert.equal(result.recommended.id, "allowed");
  assert.deepEqual(result.rejected.map((item) => item.id), ["rejected"]);
  assert.match(result.rejected[0].reasons[0], /not in the allowed list/);
});

test("unknown mandatory license evidence fails closed and is reported", () => {
  const result = compareResources([make("unknown")], { constraints: { requireReviewedLicense: true } });
  assert.equal(result.recommended, null);
  assert.equal(result.decision, "insufficient_evidence");
  assert.match(result.rejected[0].unknowns[0], /review_status is missing/);
});

test("security, platform, and integration constraints are hard filters", () => {
  const weak = make("weak", {
    compatibility: { platforms: ["linux"] },
    evaluation: { security: 2, integration_cost: 4 }
  });
  const strong = make("strong", {
    compatibility: { platforms: ["linux", "windows"] },
    evaluation: { security: 4, integration_cost: 1 }
  });
  const result = compareResources([weak, strong], {
    constraints: { minimumSecurity: 3, maximumIntegrationCost: 2, requiredPlatforms: ["windows"] }
  });
  assert.equal(result.recommended.id, "strong");
  assert.equal(result.rejected.length, 1);
});

test("no candidate can win through a high weighted score after violating a hard constraint", () => {
  const dangerous = make("dangerous", { evaluation: { security: 0, quality: 5, project_fit: 5 } });
  const safe = make("safe", { evaluation: { security: 4, quality: 3, project_fit: 3 } });
  const result = compareResources([dangerous, safe], { constraints: { minimumSecurity: 3 } });
  assert.equal(result.recommended.id, "safe");
  assert.equal(result.rejected[0].id, "dangerous");
});

test("hybrid candidates must collectively satisfy all required capabilities", () => {
  const a = make("a", { complements: ["b"], capabilities: ["static-analysis"] });
  const b = make("b", { capabilities: ["dynamic-analysis"] });
  const result = compareResources([a, b], { requiredCapabilities: ["static-analysis", "dynamic-analysis"] });
  assert.equal(result.recommended, null);
  assert.deepEqual(result.hybrid.resources, ["a", "b"]);
  assert.equal(result.decision, "hybrid_candidate");
});

test("rejects malformed hard constraints", () => {
  assert.throws(() => compareResources([make("a")], { constraints: { minimumSecurity: 9 } }), /minimumSecurity/);
});

test("stale evidence is rejected as a hard constraint", () => {
  const stale = make("stale", {
    evidence: [{ url: "https://example.com/docs", claim: "Old claim", checked_at: "2024-01-01T00:00:00Z" }]
  });
  const fresh = make("fresh", {
    evidence: [{ url: "https://example.com/docs", claim: "Current claim", checked_at: "2026-11-09T00:00:00Z" }]
  });
  const result = compareResources([stale, fresh], {
    constraints: { maxEvidenceAgeDays: 30, asOf: "2026-11-10T00:00:00Z" }
  });
  assert.equal(result.recommended.id, "fresh");
  assert.match(result.rejected[0].reasons[0], /older than/);
});

test("reports no solution when every fully evidenced candidate violates constraints", () => {
  const result = compareResources([make("weak", { evaluation: { security: 1 } })], {
    constraints: { minimumSecurity: 4 }
  });
  assert.equal(result.recommended, null);
  assert.equal(result.decision, "none_meet_constraints");
});

test("selects a lower-ranked single resource when the top candidate misses a mandatory capability", () => {
  const partial = make("partial", {
    capabilities: ["one"],
    evaluation: { project_fit: 5, quality: 5, security: 5 }
  });
  const complete = make("complete", {
    capabilities: ["one", "two"],
    evaluation: { project_fit: 2, quality: 2, security: 3 }
  });
  const result = compareResources([partial, complete], { requiredCapabilities: ["one", "two"] });
  assert.equal(result.recommended.id, "complete");
  assert.equal(result.decision, "select_single");
});
