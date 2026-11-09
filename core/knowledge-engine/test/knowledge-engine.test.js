import test from "node:test";
import assert from "node:assert/strict";
import { selectKnowledge } from "../src/index.js";
import registry from "../../../knowledge/registry.json" with { type: "json" };

const draftPreview = { statuses: ["draft"] };

test("selects graph and shortest-path material for a weighted path problem", () => {
  const result = selectKnowledge(registry, {
    description: "Find the shortest path in a weighted graph with non-negative edges",
    tags: ["graph", "shortest-path", "weighted-graph"],
    domain: "algorithms"
  }, draftPreview);
  assert.equal(result.matches[0].id, "algo.shortest-path-selection");
  assert.ok(result.matches.some((item) => item.id === "algo.graph-traversal"));
});

test("selects mathematics and its formula for Bayes theorem", () => {
  const result = selectKnowledge(registry, {
    description: "Calculate posterior probability with Bayes theorem",
    tags: ["probability"],
    domain: "statistics"
  }, draftPreview);
  assert.equal(result.matches[0].id, "math.probability-statistics");
  assert.ok(result.matches.some((item) => item.id === "math.formula.bayes-theorem"));
});

test("selects a focused formula for a gradient update task", () => {
  const result = selectKnowledge(registry, {
    description: "Apply the gradient descent update using a learning rate",
    tags: ["gradient-descent", "learning-rate"],
    domain: "machine-learning"
  }, draftPreview);
  assert.equal(result.matches[0].id, "math.formula.gradient-descent");
});

test("does not return unrelated material for a vague task", () => {
  const result = selectKnowledge(registry, {
    description: "Improve the application",
    tags: [],
    domain: "business"
  }, draftPreview);
  assert.deepEqual(result.matches, []);
});

test("does not match a phrase as a substring inside a different word", () => {
  const result = selectKnowledge(registry, {
    description: "Build a graphical user interface",
    tags: [],
    domain: "algorithms"
  }, draftPreview);
  assert.deepEqual(result.matches, []);
});

test("domain alone is not enough to retrieve knowledge", () => {
  const result = selectKnowledge(registry, {
    description: "Implement a feature",
    tags: [],
    domain: "machine-learning"
  }, draftPreview);
  assert.deepEqual(result.matches, []);
});

test("honours exclusion phrases with token boundaries", () => {
  const result = selectKnowledge(registry, {
    description: "Optimise image file size",
    tags: ["optimization"],
    domain: "machine-learning"
  }, draftPreview);
  assert.ok(result.excluded.some((item) => item.id === "math.optimisation"));
  assert.ok(!result.matches.some((item) => item.id === "math.optimisation"));
});

test("excludes draft material by default", () => {
  const result = selectKnowledge(registry, {
    description: "Use breadth first search on a graph",
    tags: ["graph", "bfs"],
    domain: "algorithms"
  });
  assert.deepEqual(result.matches, []);
});

test("draft preview never reports material as ready to apply", () => {
  const result = selectKnowledge(registry, {
    description: "Apply the gradient descent update using a learning rate",
    tags: ["gradient-descent", "learning-rate"],
    domain: "machine-learning"
  }, { ...draftPreview, limit: 10 });
  const formula = result.matches.find((item) => item.id === "math.formula.gradient-descent");
  assert.ok(formula);
  assert.equal(formula.ready_to_apply, false);
  assert.ok(formula.unresolved_prerequisites.includes("math.optimisation"));
});

test("enforces all_tags activation requirements", () => {
  const custom = { items: [{
    id: "required.tags", title: "Required tags", kind: "algorithm", path: "knowledge/example.md",
    version: "1.0.0", status: "draft", domains: ["graphs"], tags: ["graph", "weighted"],
    prerequisites: [], related: [], limitations: [],
    activation: { any_tags: [], all_tags: ["graph", "weighted"], any_phrases: [] }
  }] };
  assert.equal(selectKnowledge(custom, { tags: ["graph"] }, { statuses: ["draft"] }).matches.length, 0);
  assert.equal(selectKnowledge(custom, { tags: ["graph", "weighted"] }, { statuses: ["draft"] }).matches.length, 1);
});

test("required capabilities are enforced as prerequisites", () => {
  const custom = { items: [{
    id: "required.capabilities", title: "Required capabilities", kind: "algorithm",
    path: "knowledge/example.md", version: "1.0.0", status: "draft",
    domains: ["graphs"], tags: ["graph"], prerequisites: [], related: [], limitations: [],
    activation: {
      any_tags: ["graph"], all_tags: [], any_phrases: [],
      required_capabilities: ["pathfinding", "weighted-graphs"]
    }
  }] };
  assert.equal(selectKnowledge(custom, { tags: ["graph"], required_capabilities: ["pathfinding"] }, { statuses: ["draft"] }).matches.length, 0);
  assert.equal(selectKnowledge(custom, {
    tags: ["graph"], required_capabilities: ["pathfinding", "weighted-graphs"]
  }, { statuses: ["draft"] }).matches.length, 1);
});

test("rejects duplicate IDs and unsafe paths", () => {
  const base = {
    title: "Example", kind: "algorithm", version: "1.0.0", status: "draft",
    domains: ["algorithms"], tags: ["test"], prerequisites: [], related: [], limitations: [],
    activation: { any_tags: ["test"], any_phrases: [] }
  };
  assert.throws(() => selectKnowledge({ items: [
    { ...base, id: "same", path: "knowledge/a.md" },
    { ...base, id: "same", path: "knowledge/b.md" }
  ] }, { description: "test", tags: ["test"] }), /Duplicate knowledge item id/);
  assert.throws(() => selectKnowledge({ items: [
    { ...base, id: "unsafe", path: "knowledge/../../secrets.md" }
  ] }, { description: "test", tags: ["test"] }), /Unsafe or invalid knowledge path/);
});

test("rejects missing prerequisite references and prerequisite cycles", () => {
  const base = {
    title: "Example", kind: "algorithm", version: "1.0.0", status: "draft",
    domains: ["algorithms"], tags: ["test"], related: [], limitations: [],
    activation: { any_tags: ["test"], any_phrases: [] }
  };
  assert.throws(() => selectKnowledge({ items: [
    { ...base, id: "a", path: "knowledge/a.md", prerequisites: ["missing"] }
  ] }, { tags: ["test"] }), /Unknown knowledge relationship/);
  assert.throws(() => selectKnowledge({ items: [
    { ...base, id: "a", path: "knowledge/a.md", prerequisites: ["b"] },
    { ...base, id: "b", path: "knowledge/b.md", prerequisites: ["a"] }
  ] }, { tags: ["test"] }), /prerequisite cycle/);
});

test("rejects approved content without an auditable review", () => {
  const item = registry.items[0];
  const approved = { ...item, status: "approved" };
  assert.throws(() => selectKnowledge({ items: [approved] }, { tags: ["complexity"] }), /needs reviewer/);
});

test("validates caller options and task types", () => {
  assert.throws(() => selectKnowledge(registry, { tags: ["graph", 7] }), /non-empty strings/);
  assert.throws(() => selectKnowledge(registry, { tags: ["graph"] }, { limit: 100 }), /limit/);
  assert.throws(() => selectKnowledge(registry, { tags: ["graph"] }, { statuses: ["trusted"] }), /known knowledge statuses/);
});

test("returns reasons and respects the result limit", () => {
  const result = selectKnowledge(registry, {
    description: "Analyse graph shortest path complexity",
    tags: ["graph", "shortest-path", "complexity"],
    domain: "algorithms"
  }, { ...draftPreview, limit: 2 });
  assert.equal(result.matches.length, 2);
  assert.ok(result.matches[0].reasons.length > 0);
  assert.equal(result.retrieval_mode, "deterministic_metadata");
});
