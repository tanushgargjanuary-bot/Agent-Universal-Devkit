import test from "node:test";
import assert from "node:assert/strict";
import { generateKeyPairSync } from "node:crypto";
import { ApprovalStore } from "../src/approval-store.js";
import { createApprovalRequest, evaluatePolicy } from "../src/policy-engine.js";

function keys() { return generateKeyPairSync("ed25519"); }
function scope(overrides = {}) {
  return createApprovalRequest({
    planId: "plan-approval-store", planDigest: "a".repeat(64),
    action: "install_dependency", target: "package:sample@1.0.0", ...overrides
  });
}
function storeOptions(pair, extra = {}) {
  return {
    dbPath: ":memory:", privateKey: pair.privateKey, publicKey: pair.publicKey,
    authenticateApprover: async credential => credential === "valid-token" ? { subject: "github-user:123" } : null,
    ...extra
  };
}

test("creates an idempotent pending request with a bounded expiry", async () => {
  const store = await new ApprovalStore(storeOptions(keys())).open();
  const request = scope(), first = store.requestApproval(request), second = store.requestApproval(request);
  assert.equal(first.status, "pending");
  assert.equal(first.request_id, second.request_id);
  assert.equal(first.expires_at, second.expires_at);
  assert.equal(store.listPending().length, 1);
  store.close();
});

test("authenticates and signs an approval that the policy engine accepts", async () => {
  const store = await new ApprovalStore(storeOptions(keys())).open();
  const request = scope();
  store.requestApproval(request);
  const approved = await store.approve(request.request_id, "valid-token");
  assert.equal(approved.status, "approved");
  assert.equal(approved.approved_by, "github-user:123");
  assert.ok(approved.signature);
  const result = evaluatePolicy({
    risk: "medium", actions: [{ type: request.action, target: request.target }],
    planId: request.plan_id, planDigest: request.plan_digest, approvals: [approved],
    verifyApproval: store.verifyApproval.bind(store)
  });
  assert.equal(result.allowed, true);
  store.close();
});

test("rejects invalid approver credentials and prevents repeated approval", async () => {
  const store = await new ApprovalStore(storeOptions(keys())).open();
  const request = scope(); store.requestApproval(request);
  await assert.rejects(() => store.approve(request.request_id, "bad-token"), /authentication failed/);
  await store.approve(request.request_id, "valid-token");
  await assert.rejects(() => store.approve(request.request_id, "valid-token"), /not pending/);
  store.close();
});

test("rejects tampering and a record signed by another key", async () => {
  const store = await new ApprovalStore(storeOptions(keys())).open();
  const request = scope(); store.requestApproval(request);
  const approved = await store.approve(request.request_id, "valid-token");
  assert.equal(store.verifyApproval({ ...approved, target: "package:other@1.0.0" }, request), false);
  assert.equal(store.verifyApproval({ ...approved, signature: "ZmFrZQ==" }, request), false);
  const wrongVerifier = await new ApprovalStore({ dbPath: ":memory:", publicKey: keys().publicKey }).open();
  assert.equal(wrongVerifier.verifyApproval(approved, request), false);
  wrongVerifier.close(); store.close();
});

test("revocation invalidates a previously issued approval", async () => {
  const store = await new ApprovalStore(storeOptions(keys())).open();
  const request = scope(); store.requestApproval(request);
  const approved = await store.approve(request.request_id, "valid-token");
  assert.equal(store.verifyApproval(approved, request), true);
  const revoked = await store.revoke(request.request_id, "valid-token", "Plan changed.");
  assert.equal(revoked.status, "revoked");
  assert.equal(store.verifyApproval(approved, request), false);
  store.close();
});

test("expired requests cannot be approved and can be renewed", async () => {
  const pair = keys();
  let time = new Date("2026-11-11T00:00:00.000Z");
  const store = await new ApprovalStore(storeOptions(pair, { ttlMs: 60_000, clock: () => time })).open();
  const request = scope(); store.requestApproval(request);
  time = new Date(time.getTime() + 60_001);
  await assert.rejects(() => store.approve(request.request_id, "valid-token"), /expired/);
  assert.equal(store.getApproval(request.request_id).status, "expired");
  const renewed = store.requestApproval(request);
  assert.equal(renewed.status, "pending");
  assert.equal(store.listPending().length, 1);
  store.close();
});

test("rejects malformed request scopes and untrusted store configuration", async () => {
  const pair = keys();
  assert.throws(() => new ApprovalStore({ dbPath: ":memory:", ttlMs: 1 }), /ttlMs/);
  const store = await new ApprovalStore(storeOptions(pair)).open();
  assert.throws(() => store.requestApproval({ ...scope(), target: "other" }), /scope or policy version is invalid/);
  assert.throws(() => store.listPending({ limit: 0 }), /limit/);
  store.close();
});

test("rejected approvals cannot be verified or approved later", async () => {
  const store = await new ApprovalStore(storeOptions(keys())).open();
  const request = scope(); store.requestApproval(request);
  const rejected = await store.reject(request.request_id, "valid-token", "Not authorised.");
  assert.equal(rejected.status, "rejected");
  assert.equal(store.verifyApproval(rejected, request), false);
  await assert.rejects(() => store.approve(request.request_id, "valid-token"), /not pending/);
  store.close();
});
