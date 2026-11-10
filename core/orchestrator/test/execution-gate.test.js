import test from "node:test";
import assert from "node:assert/strict";
import { generateKeyPairSync } from "node:crypto";
import { ApprovalStore } from "../src/approval-store.js";
import { ExecutionGate, ExecutionGateError } from "../src/execution-gate.js";
import { createPlan } from "../src/index.js";
import { createApprovalRequest } from "../src/policy-engine.js";

function plan({ risk = "low", action = { type: "run_tests", target: "suite:unit" }, task = {} } = {}) {
  return createPlan({
    task_id: "gate-plan", goal: "Verify a change",
    repository: { full_name: "owner/repo", default_branch: "main", languages: ["TypeScript"], frameworks: ["Node"] },
    risk,
    tasks: [{ id: "verify", description: "Verify", actions: [action], ...task }]
  });
}
function pair() { return generateKeyPairSync("ed25519"); }
function makeStore() {
  const keys = pair();
  return new ApprovalStore({
    dbPath: ":memory:", privateKey: keys.privateKey, publicKey: keys.publicKey,
    authenticateApprover: async token => token === "ok" ? { subject: "github-user:7" } : null
  });
}
function adapter({ id = "node-harness", harnessId = "node", capabilities = ["test", "build"], supportedActions = ["run_tests", "install_dependency"], execute = async () => ({ exit_code: 0 }) } = {}) {
  return { id, version: "1.0.0", harnessId, capabilities, supportedActions, execute };
}

test("validates adapter contracts and rejects duplicate IDs", () => {
  const gate = new ExecutionGate();
  assert.throws(() => gate.registerAdapter({ id: "bad" }), /requires id, version, and execute/);
  gate.registerAdapter(adapter());
  assert.throws(() => gate.registerAdapter(adapter()), /already registered/);
});

test("executes allowed actions through a matching adapter and audit sink", async () => {
  const events = [], calls = [];
  const gate = new ExecutionGate({ audit: async event => events.push(event) });
  gate.registerAdapter(adapter({ execute: async request => { calls.push(request); return { exit_code: 0 }; } }));
  const result = await gate.executePlan(plan({ task: { required_capabilities: ["test"], preferred_harness: "node" } }));
  assert.equal(result.status, "completed");
  assert.equal(result.results.length, 1);
  assert.equal(calls.length, 1);
  assert.deepEqual(events.map(x => x.event), ["action_started", "action_completed"]);
});

test("refuses execution without a durable audit callback", async () => {
  const gate = new ExecutionGate();
  gate.registerAdapter(adapter());
  await assert.rejects(() => gate.executePlan(plan()), error => error.code === "AUDIT_REQUIRED");
});

test("dry run validates routing but never invokes an adapter", async () => {
  let calls = 0;
  const gate = new ExecutionGate();
  gate.registerAdapter(adapter({ execute: async () => { calls++; } }));
  const result = await gate.executePlan(plan(), { dryRun: true });
  assert.equal(result.status, "dry_run");
  assert.equal(result.results[0].status, "dry_run");
  assert.equal(calls, 0);
});

test("rejects a plan whose routing fields changed after digest creation", async () => {
  const gate = new ExecutionGate({ audit: async () => {} });
  gate.registerAdapter(adapter());
  const value = plan();
  value.tasks[0].preferred_harness = "different";
  await assert.rejects(() => gate.executePlan(value), error => error.code === "PLAN_DIGEST_MISMATCH");
});

test("requires a compatible adapter for every declared capability and harness", async () => {
  const gate = new ExecutionGate({ audit: async () => {} });
  gate.registerAdapter(adapter({ capabilities: ["test"], harnessId: "node" }));
  await assert.rejects(
    () => gate.executePlan(plan({ task: { required_capabilities: ["deploy"], preferred_harness: "node" } })),
    error => error.code === "NO_COMPATIBLE_ADAPTER"
  );
  await assert.rejects(
    () => gate.executePlan(plan({ task: { preferred_harness: "python" } })),
    error => error.code === "NO_COMPATIBLE_ADAPTER"
  );
});

test("fails closed when more than one adapter matches", async () => {
  const gate = new ExecutionGate({ audit: async () => {} });
  gate.registerAdapter(adapter({ id: "node-a" }));
  gate.registerAdapter(adapter({ id: "node-b" }));
  await assert.rejects(() => gate.executePlan(plan()), error => error.code === "AMBIGUOUS_ADAPTER");
});

test("requires a signed approval before executing a privileged action", async () => {
  const store = await makeStore().open();
  const value = plan({ risk: "medium", action: { type: "install_dependency", target: "package:sample@1.0.0" } });
  const gate = new ExecutionGate({ approvalStore: store, audit: async () => {} });
  gate.registerAdapter(adapter());
  const requests = gate.getApprovalRequests(value);
  assert.equal(requests.length, 1);
  store.requestApproval(requests[0]);
  await assert.rejects(() => gate.executePlan(value), error => error.code === "POLICY_DENIED");
  await store.approve(requests[0].request_id, "ok");
  const result = await gate.executePlan(value);
  assert.equal(result.status, "completed");
  store.close();
});

test("revoked approvals cannot pass the execution gate", async () => {
  const store = await makeStore().open();
  const value = plan({ risk: "medium", action: { type: "install_dependency", target: "package:sample@1.0.0" } });
  const gate = new ExecutionGate({ approvalStore: store, audit: async () => {} });
  gate.registerAdapter(adapter());
  const request = gate.requestApprovals(value)[0];
  await store.approve(request.request_id, "ok");
  await store.revoke(request.request_id, "ok", "Cancelled.");
  await assert.rejects(() => gate.executePlan(value), error => error.code === "POLICY_DENIED");
  store.close();
});

test("critical-risk test execution requires an approval", async () => {
  const store = await makeStore().open();
  const value = plan({ risk: "critical" });
  const gate = new ExecutionGate({ approvalStore: store, audit: async () => {} });
  gate.registerAdapter(adapter());
  const request = gate.requestApprovals(value)[0];
  assert.equal(request.action, "run_tests");
  await store.approve(request.request_id, "ok");
  const result = await gate.executePlan(value);
  assert.equal(result.status, "completed");
  store.close();
});

test("unknown actions and missing action targets are rejected before adapter execution", async () => {
  const gate = new ExecutionGate({ audit: async () => {} });
  gate.registerAdapter(adapter());
  await assert.rejects(
    () => gate.executePlan(plan({ action: { type: "unknown_action", target: "x" } })),
    error => error.code === "NO_COMPATIBLE_ADAPTER"
  );
  await assert.rejects(
    () => gate.executePlan(plan({ action: { type: "run_tests" } })),
    error => error.code === "INVALID_ACTION"
  );
});

test("audit failure before execution prevents adapter invocation", async () => {
  let calls = 0;
  const gate = new ExecutionGate({ audit: async () => { throw new Error("audit unavailable"); } });
  gate.registerAdapter(adapter({ execute: async () => { calls++; } }));
  await assert.rejects(() => gate.executePlan(plan()), error => error.code === "AUDIT_FAILED");
  assert.equal(calls, 0);
});

test("adapter failure stops the plan and returns prior completed results", async () => {
  const gate = new ExecutionGate({ audit: async () => {} });
  let calls = 0;
  gate.registerAdapter(adapter({
    execute: async () => {
      calls++;
      if (calls === 2) throw new Error("simulated failure");
      return { ok: true };
    }
  }));
  const value = createPlan({
    task_id: "two-actions", goal: "Run sequential checks",
    repository: { full_name: "owner/repo", default_branch: "main" },
    tasks: [{ id: "verify", actions: [
      { type: "run_tests", target: "suite:unit" },
      { type: "run_tests", target: "suite:integration" }
    ] }]
  });
  await assert.rejects(
    () => gate.executePlan(value),
    error => error.code === "ADAPTER_EXECUTION_FAILED" && error.details.results.length === 1
  );
  assert.equal(calls, 2);
});

test("approval request helper does not mutate the plan", () => {
  const gate = new ExecutionGate();
  const value = plan({ risk: "medium", action: { type: "install_dependency", target: "package:x@1" } });
  const before = value.plan_digest;
  const requests = gate.getApprovalRequests(value);
  assert.equal(requests.length, 1);
  assert.equal(value.plan_digest, before);
});
