import test from "node:test";
import assert from "node:assert/strict";
import { createPlan, evaluateExecutionGate, orderTasks } from "../src/index.js";

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
