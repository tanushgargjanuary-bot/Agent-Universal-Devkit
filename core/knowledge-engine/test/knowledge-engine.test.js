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

test("selects mathematics when the task asks for Bayes theorem", () => {
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

test("honours exclusion phrases", () => {
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

test("can restrict results to approved items", () => {
  const result = selectKnowledge(registry, {
    description: "Use breadth first search on a graph",
    tags: ["graph", "bfs"],
    domain: "algorithms"
  }, { statuses: ["approved"] });
  assert.deepEqual(result.matches, []);
});

test("enforces all_tags activation requirements", () => {
  const custom = { items: [{
    id: "required.tags", title: "Required tags", path: "knowledge/example.md",
    status: "approved", domains: [],
    activation: { any_tags: [], all_tags: ["graph", "weighted"], any_phrases: [] }
  }] };
  assert.equal(selectKnowledge(custom, { tags: ["graph"] }).matches.length, 0);
  assert.equal(selectKnowledge(custom, { tags: ["graph", "weighted"] }).matches.length, 1);
});

test("enforces required_capabilities activation requirements", () => {
  const custom = { items: [{
    id: "required.capabilities", title: "Required capabilities", path: "knowledge/example.md",
    status: "approved", domains: [],
    activation: {
      any_tags: ["graph"], all_tags: [], any_phrases: [],
      required_capabilities: ["pathfinding", "weighted-graphs"]
    }
  }] };
  assert.equal(selectKnowledge(custom, { tags: ["graph"], required_capabilities: ["pathfinding"] }).matches.length, 0);
  assert.equal(selectKnowledge(custom, {
    tags: ["graph"], required_capabilities: ["pathfinding", "weighted-graphs"]
  }).matches.length, 1);
});

test("rejects duplicate IDs", () => {
  assert.throws(() => selectKnowledge({ items: [
    { id: "same", title: "A", path: "a.md", activation: {} },
    { id: "same", title: "B", path: "b.md", activation: {} }
  ] }, { description: "test" }), /Duplicate knowledge item id/);
});

test("returns reasons and respects the result limit", () => {
  const result = selectKnowledge(registry, {
    description: "Analyse graph shortest path complexity",
    tags: ["graph", "shortest-path", "complexity"],
    domain: "algorithms"
  }, { ...draftPreview, limit: 2 });
  assert.equal(result.matches.length, 2);
  assert.ok(result.matches[0].reasons.length > 0);
});
