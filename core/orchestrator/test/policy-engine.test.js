import test from "node:test";
import assert from "node:assert/strict";
import {
  createApprovalRequest,
  createPlanDigest,
  evaluatePolicy,
  getPolicyActionCatalog,
  POLICY_VERSION
} from "../src/policy-engine.js";
import { createPlan, evaluateExecutionGate } from "../src/index.js";

const plan = {
  taskId: "task-42",
  planDigest: "a".repeat(64),
  action: "install_dependency",
  target: "package:example-lib@1.2.3"
};

function verifiedApproval(overrides = {}) {
  const request = createApprovalRequest({
    planId: plan.taskId,
    planDigest: plan.planDigest,
    action: plan.action,
    target: plan.target
  });
  return {
    ...request,
    status: "approved",
    approval_id: "approval-1",
    approved_by: "human-reviewer",
    approved_at: "2026-11-10T10:00:00.000Z",
    ...overrides
  };
}

test("allows read-only actions without approval", () => {
  const result = evaluatePolicy({
    actions: [{ type: "read_repository", target: "src/" }, { type: "run_tests", target: "unit" }]
  });
  assert.equal(result.allowed, true);
  assert.equal(result.approval_required, false);
});

test("denies unknown actions by default", () => {
  const result = evaluatePolicy({ actions: [{ type: "run_shell_everywhere", target: "*" }] });
  assert.equal(result.allowed, false);
  assert.match(result.reasons[0], /Unknown action/);
});

test("requires an explicit target for approval-controlled actions", () => {
  const result = evaluatePolicy({
    risk: "high",
    actions: [{ type: "change_repository_permissions" }],
    planId: plan.taskId,
    planDigest: plan.planDigest
  });
  assert.equal(result.allowed, false);
  assert.match(result.reasons[0], /explicit target/);
});

test("creates approval requests bound to action, target, policy version, and plan digest", () => {
  const request = createApprovalRequest({
    planId: plan.taskId,
    planDigest: plan.planDigest,
    action: plan.action,
    target: plan.target
  });
  assert.equal(request.policy_version, POLICY_VERSION);
  assert.equal(request.status, "pending");
  assert.equal(request.request_id.length, 64);
  assert.notEqual(request.request_id, createApprovalRequest({
    planId: plan.taskId,
    planDigest: plan.planDigest,
    action: plan.action,
    target: "package:other-lib@1.2.3"
  }).request_id);
});

test("requires a trusted approval verifier, not a caller-supplied boolean", () => {
  const approval = verifiedApproval();
  const withoutVerifier = evaluatePolicy({
    risk: "medium",
    actions: [{ type: plan.action, target: plan.target }],
    planId: plan.taskId,
    planDigest: plan.planDigest,
    approvals: [approval]
  });
  assert.equal(withoutVerifier.allowed, false);

  const verified = evaluatePolicy({
    risk: "medium",
    actions: [{ type: plan.action, target: plan.target }],
    planId: plan.taskId,
    planDigest: plan.planDigest,
    approvals: [approval],
    verifyApproval: (record, request) => record.approval_id === "approval-1" && record.request_id === request.request_id
  });
  assert.equal(verified.allowed, true);
});

test("rejects approvals for another target, action, or plan version", () => {
  const approval = verifiedApproval();
  for (const action of [
    { type: plan.action, target: "package:other-lib@1.2.3" },
    { type: "upgrade_dependency", target: plan.target }
  ]) {
    const result = evaluatePolicy({
      risk: "medium",
      actions: [action],
      planId: plan.taskId,
      planDigest: plan.planDigest,
      approvals: [approval],
      verifyApproval: () => true
    });
    assert.equal(result.allowed, false);
  }
  const stale = evaluatePolicy({
    risk: "medium",
    actions: [{ type: plan.action, target: plan.target }],
    planId: plan.taskId,
    planDigest: "b".repeat(64),
    approvals: [approval],
    verifyApproval: () => true
  });
  assert.equal(stale.allowed, false);
});

test("rejects malformed or expired-format approval records", () => {
  const approval = verifiedApproval({ approved_at: "yesterday" });
  const result = evaluatePolicy({
    risk: "medium",
    actions: [{ type: plan.action, target: plan.target }],
    planId: plan.taskId,
    planDigest: plan.planDigest,
    approvals: [approval],
    verifyApproval: () => true
  });
  assert.equal(result.allowed, false);
});

test("critical risk requires approval for every mutating action", () => {
  const result = evaluatePolicy({
    risk: "critical",
    actions: [{ type: "write_repository_file", target: "src/config.js" }],
    planId: plan.taskId,
    planDigest: plan.planDigest
  });
  assert.equal(result.allowed, false);
  assert.equal(result.approval_required, true);
});

test("execution gate delegates to the policy engine", () => {
  const result = evaluateExecutionGate({
    risk: "high",
    actions: [{ type: "deploy_to_production", target: "service:production" }],
    planId: plan.taskId,
    planDigest: plan.planDigest
  });
  assert.equal(result.allowed, false);
  assert.equal(result.policy_version, POLICY_VERSION);
});

test("plan digest changes when task action scope changes", () => {
  const base = {
    taskId: "plan-1",
    goal: "Update service",
    repository: { full_name: "owner/repo", default_branch: "main" },
    risk: "medium",
    tasks: [{ id: "change", description: "Change config", actions: [{ type: "write_repository_file", target: "config.json" }] }]
  };
  const first = createPlanDigest(base);
  const second = createPlanDigest({
    ...base,
    tasks: [{ id: "change", description: "Change config", actions: [{ type: "write_repository_file", target: "secrets.json" }] }]
  });
  assert.notEqual(first, second);
});

test("plan creation attaches per-task policy decisions and stable digest", () => {
  const result = createPlan({
    task_id: "plan-policy-1",
    goal: "Update a service safely",
    repository: { full_name: "owner/repo", default_branch: "main" },
    risk: "medium",
    tasks: [
      { id: "inspect", description: "Inspect files", actions: [{ type: "read_repository", target: "src/" }] },
      { id: "install", description: "Install a package", depends_on: ["inspect"], actions: [{ type: "install_dependency", target: "package:example@1.0.0" }] }
    ]
  });
  assert.equal(result.policy_version, POLICY_VERSION);
  assert.equal(result.plan_digest.length, 64);
  assert.equal(result.tasks[0].policy.allowed, true);
  assert.equal(result.tasks[1].policy.allowed, false);
  assert.equal(result.approval_required, true);
});

test("catalogue exposes only explicit policy actions", () => {
  const catalog = getPolicyActionCatalog();
  assert.ok(catalog.some((item) => item.action === "delete_repository_data" && item.minimum_risk === "critical"));
  assert.ok(catalog.every((item) => ["allow", "approval", "risk_gated"].includes(item.effect)));
});

test("medium-risk plans do not block read-only task actions", () => {
  const result = createPlan({
    task_id: "plan-read-only",
    goal: "Inspect a repository",
    repository: { full_name: "owner/repo", default_branch: "main" },
    risk: "medium",
    tasks: [{ id: "inspect", description: "Read project files", actions: [{ type: "read_repository", target: "src/" }] }]
  });
  assert.equal(result.approval_required, false);
  assert.equal(result.tasks[0].policy.allowed, true);
});


test("plan digest binds repository and task routing fields", () => {
 const base={
  taskId:"route-plan",goal:"Ship a service",
  repository:{full_name:"owner/repo",default_branch:"main",languages:["TypeScript"],frameworks:["Node"]},
  risk:"medium",
  tasks:[{id:"build",description:"Build service",required_capabilities:["build"],preferred_harness:"harness-a",tools:["git","terminal"],depends_on:[],actions:[{type:"run_tests",target:"unit"}]}]
 };
 const original=createPlanDigest(base);
 const changes=[
  {...base,tasks:[{...base.tasks[0],preferred_harness:"harness-b"}]},
  {...base,tasks:[{...base.tasks[0],tools:["git","docker"]}]},
  {...base,tasks:[{...base.tasks[0],required_capabilities:["deploy"]}]},
  {...base,repository:{...base.repository,languages:["Rust"]}},
  {...base,repository:{...base.repository,frameworks:["Deno"]}},
  {...base,technologyDecision:{decision:"polyglot_hybrid",recommendation:{candidate_id:"rust-node"}}}
 ];
 for(const changed of changes)assert.notEqual(createPlanDigest(changed),original);
});

test("plan digest is stable across object key and set-like array ordering", () => {
 const first=createPlanDigest({
  taskId:"stable",goal:"Build",
  repository:{full_name:"owner/repo",default_branch:"main",languages:["Rust","TypeScript"],frameworks:["Node","React"]},
  tasks:[{id:"one",description:"Build",tags:["backend","api"],required_capabilities:["compile","test"],tools:["git","terminal"],depends_on:["b","a"],actions:[{type:"run_tests",target:"unit"}]}]
 });
 const second=createPlanDigest({
  taskId:"stable",goal:"Build",
  repository:{frameworks:["React","Node"],languages:["TypeScript","Rust"],default_branch:"main",full_name:"owner/repo"},
  tasks:[{actions:[{target:"unit",type:"run_tests"}],depends_on:["a","b"],tools:["terminal","git"],required_capabilities:["test","compile"],tags:["api","backend"],description:"Build",id:"one"}]
 });
 assert.equal(first,second);
});

test("plan digest rejects malformed routing lists and duplicate task IDs", () => {
 const base={taskId:"invalid",goal:"Test",repository:{full_name:"owner/repo",default_branch:"main"},tasks:[{id:"one"}]};
 assert.throws(()=>createPlanDigest({...base,tasks:[{id:"one",tools:"terminal"}]}),/task.tools must be an array/);
 assert.throws(()=>createPlanDigest({...base,tasks:[{id:"one"},{id:"one"}]}),/must be unique/);
});

test("approval records must have approved status and malformed approval collections fail closed", () => {
 const pending=verifiedApproval({status:"pending"});
 const pendingResult=evaluatePolicy({
  risk:"medium",actions:[{type:plan.action,target:plan.target}],planId:plan.taskId,planDigest:plan.planDigest,
  approvals:[pending],verifyApproval:()=>true
 });
 assert.equal(pendingResult.allowed,false);
 const malformed=evaluatePolicy({
  risk:"medium",actions:[{type:plan.action,target:plan.target}],planId:plan.taskId,planDigest:plan.planDigest,
  approvals:{},verifyApproval:()=>true
 });
 assert.equal(malformed.allowed,false);
 assert.match(malformed.reasons[0],/Approvals must be an array/);
});
