import test from "node:test";
import assert from "node:assert/strict";
import { createPlan, evaluateExecutionGate, orderTasks } from "../src/index.js";
import { evaluateTechnologyArchitecture, evaluateTechnologyChangeGate, inspectRepository } from "../src/technology-decision.js";

test("orders tasks after their dependencies", () => {
  const ordered = orderTasks([
    { id: "build", depends_on: ["design"] },
    { id: "design", depends_on: [] }
  ]);
  assert.deepEqual(ordered.map((task) => task.id), ["design", "build"]);
});

test("rejects dependency cycles", () => {
  assert.throws(
    () => orderTasks([
      { id: "a", depends_on: ["b"] },
      { id: "b", depends_on: ["a"] }
    ]),
    /cycle/
  );
});

test("creates a plan that requires approval for medium risk", () => {
  const plan = createPlan({
    task_id: "demo-1",
    goal: "Add a health endpoint",
    repository: { full_name: "owner/project", default_branch: "main" },
    risk: "medium",
    tasks: [{ id: "implement", description: "Add endpoint" }]
  });
  assert.equal(plan.approval_required, true);
  assert.equal(plan.tasks[0].status, "planned");
});

test("blocks privileged actions until a human approves", () => {
  const blocked = evaluateExecutionGate({
    actions: ["deploy_to_production"]
  });
  assert.equal(blocked.allowed, false);
  assert.equal(blocked.approval_required, true);

  const approved = evaluateExecutionGate({
    actions: ["deploy_to_production"],
    humanApproved: true
  });
  assert.equal(approved.allowed, true);
});

test("allows low-risk work without approval", () => {
  const gate = evaluateExecutionGate({ risk: "low", actions: [] });
  assert.equal(gate.allowed, true);
  assert.equal(gate.approval_required, false);
});

test("planning retrieves approved knowledge but excludes draft entries", () => {
  const plan = createPlan({
    task_id: "knowledge-1",
    goal: "Traverse a graph",
    repository: { full_name: "owner/project", default_branch: "main" },
    tasks: [{
      id: "traverse",
      description: "Run breadth first search on a graph",
      tags: ["graph", "bfs"],
      domain: "algorithms"
    }]
  });
  assert.deepEqual(plan.tasks[0].knowledge_retrieval.matches, []);
  assert.equal(plan.tasks[0].knowledge_retrieval.retrieval_mode, "deterministic_metadata");
});

test("planning attaches relevant approved knowledge with provenance reasons", () => {
  const approvedRegistry = { items: [{
    id: "algo.test-bfs", title: "BFS", kind: "algorithm", path: "knowledge/algorithms/bfs.md",
    version: "1.0.0", status: "approved", domains: ["algorithms"], tags: ["graph", "bfs"],
    prerequisites: [], related: [], limitations: ["Requires a finite graph representation."],
    activation: { any_tags: ["graph", "bfs"], all_tags: [], any_phrases: ["breadth first search"] },
    review: {
      approved_by: "test-reviewer", approved_at: "2026-11-10T00:00:00Z",
      reviewed_version: "1.0.0", content_sha256: "a".repeat(64),
      approval_pr: 1, approval_review_id: 2, approval_commit: "a".repeat(40),
      sources: [{ title: "Reference", url: "https://example.com/bfs", purpose: "Algorithm verification" }]
    }
  }] };
  const plan = createPlan({
    task_id: "knowledge-2",
    goal: "Traverse a graph",
    repository: { full_name: "owner/project", default_branch: "main" },
    knowledgeRegistry: approvedRegistry,
    tasks: [{
      id: "traverse",
      description: "Run breadth first search on a graph",
      tags: ["graph"],
      domain: "algorithms"
    }]
  });
  const retrieval = plan.tasks[0].knowledge_retrieval;
  assert.equal(retrieval.matches[0].id, "algo.test-bfs");
  assert.equal(retrieval.matches[0].ready_to_apply, true);
  assert.ok(retrieval.matches[0].reasons.length > 0);
});


const technologyCandidates = [
  {
    id: "python-service",
    name: "Python service",
    languages: ["Python"],
    capabilities: ["http-api"],
    platforms: ["linux"],
    security_controls: ["dependency-auditing"],
    integration_complexity: 0,
    operational_complexity: 1,
    migration_cost: 0,
    evidence: ["Existing service and deployment documentation"]
  },
  {
    id: "python-rust-hybrid",
    name: "Python API with Rust compute core",
    languages: ["Python", "Rust"],
    capabilities: ["http-api", "low-latency-compute"],
    platforms: ["linux"],
    security_controls: ["dependency-auditing", "memory-safety"],
    integration_complexity: 2,
    operational_complexity: 1,
    migration_cost: 1,
    evidence: ["Measured compute bottleneck", "Rust component prototype"]
  }
];

test("inspects repository languages and package managers without executing code", () => {
  const result = inspectRepository([
    "src/server.py",
    "src/worker.rs",
    "package.json",
    "pnpm-lock.yaml",
    { path: "pyproject.toml", content: "[project]\\ndependencies = ['fastapi']" }
  ]);
  assert.deepEqual(result.languages.map((item) => item.name), ["Python", "Rust"]);
  assert.deepEqual(result.package_managers, ["pnpm"]);
  assert.deepEqual(result.frameworks, ["FastAPI"]);
  assert.ok(result.limitations.some((item) => item.includes("not executed")));
});

test("recommends an evidence-backed hybrid when one language cannot meet all requirements", () => {
  const decision = evaluateTechnologyArchitecture({
    repository: { full_name: "owner/service" },
    files: ["src/server.py", "pyproject.toml"],
    workload: {
      required_capabilities: ["http-api", "low-latency-compute"],
      required_platforms: ["linux"],
      required_security_controls: ["dependency-auditing"]
    },
    candidates: technologyCandidates
  });
  assert.equal(decision.decision, "polyglot_hybrid");
  assert.equal(decision.recommendation.candidate_id, "python-rust-hybrid");
  assert.equal(decision.approval.required, true);
  assert.equal(decision.status, "proposal_only");
  assert.equal(evaluateTechnologyChangeGate({ decision }).allowed, false);
  assert.equal(evaluateTechnologyChangeGate({ decision, humanApproved: true }).allowed, true);
});

test("abstains when no candidate satisfies hard requirements", () => {
  const decision = evaluateTechnologyArchitecture({
    repository: { full_name: "owner/service" },
    files: [],
    workload: { required_capabilities: ["quantum-computing"] },
    candidates: technologyCandidates
  });
  assert.equal(decision.decision, "insufficient_evidence");
  assert.equal(decision.recommendation, null);
  assert.equal(evaluateTechnologyChangeGate({ decision, humanApproved: true }).allowed, false);
});

test("requires explicit workload requirements and at least two candidates", () => {
  assert.throws(() => evaluateTechnologyArchitecture({
    repository: { full_name: "owner/service" },
    workload: {},
    candidates: technologyCandidates
  }), /required_capabilities/);
  assert.throws(() => evaluateTechnologyArchitecture({
    repository: { full_name: "owner/service" },
    workload: { required_capabilities: ["http-api"] },
    candidates: [technologyCandidates[0]]
  }), /At least two/);
});

test("attaches a technology proposal to orchestration plans and raises approval", () => {
  const plan = createPlan({
    task_id: "architecture-1",
    goal: "Evaluate service architecture",
    repository: { full_name: "owner/service", default_branch: "main" },
    tasks: [{ id: "inspect", description: "Inspect architecture" }],
    technologyAssessment: {
      files: ["src/server.py"],
      workload: {
        required_capabilities: ["http-api", "low-latency-compute"],
        required_platforms: ["linux"]
      },
      candidates: technologyCandidates
    }
  });
  assert.equal(plan.technology_decision.decision, "polyglot_hybrid");
  assert.equal(plan.approval_required, true);
});
