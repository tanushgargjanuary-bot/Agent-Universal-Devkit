# Orchestration Layer

The orchestrator is a planning and policy-decision foundation. It does not replace an AI coding harness and does not yet execute work through agent processes.

## Current capabilities

- Task planning and dependency ordering.
- Task metadata validation.
- Approved-only Knowledge Engine retrieval during plan creation.
- Opt-in technology architecture assessment using caller-supplied candidates and evidence.
- Versioned action Policy Engine.
- Deny-by-default handling for unknown actions.
- Approval requests bound to action, exact target, policy version, plan ID, and a routing-complete plan digest.
- Trusted approval-verification callback support.
- Tests for policy and orchestration behaviour.

## Main parts

- **Planner:** turns a goal into ordered tasks.
- **Knowledge selector:** retrieves relevant approved engineering methods.
- **Technology Decision Engine:** assesses candidate language and architecture choices against workload requirements.
- **Policy Engine:** evaluates planned actions and determines whether approval is required.
- **Approval verifier interface:** delegates approval validation to a trusted integration.
- **Future executor adapters:** will connect to supported coding harnesses and tools.
- **Future verifier and state store:** will record execution evidence and task outcomes.

## Policy Engine contract

Use `core/orchestrator/src/policy-engine.js` to evaluate actions before execution.

- Known read and test actions can pass without approval when their risk and context allow it.
- Repository writes use risk-gated approval rules.
- Dependency, network, permission, secret, deployment, migration, deletion, and other privileged actions use explicit approval rules.
- Unknown actions are denied.
- Approval records must match the action, exact target, policy version, plan ID, and plan digest.
- Approval records must have `status: approved`, valid approver identity metadata, and a trusted `verifyApproval` callback must return `true`.
- The canonical runtime action catalogue lives in `policy.rules.json`. `policy.yaml` points to that file and does not maintain a second action list.
- Plan digests bind repository identity, branch, languages, frameworks, technology decision, task dependencies, capabilities, harness, tools, and actions. Set-like arrays and object keys are canonicalised before hashing.
- A boolean such as `humanApproved: true` is not an approval record.
- A plan change changes its digest. An approval for the old plan must not be reused.

## Approval Store

`src/approval-store.js` provides a SQLite-backed approval lifecycle. It stores pending requests, authenticated decisions, signed approvals, expiry, rejection, revocation, and an append-only event history. The integration must provide an `authenticateApprover` callback that validates a real credential and returns a stable subject. The store signs approvals with an Ed25519 private key; keep that key outside the repository. Verification checks the signature, exact scope, expiry, key ID, and current stored status. Pass `store.verifyApproval.bind(store)` to the Policy Engine.

The store does not implement a user interface, identity provider, key provisioning/rotation, distributed locking, or executor-side enforcement. Do not pass a caller-created identity object as proof of authentication. Keep execution disabled until the host integration and adapter enforce this store.

## Critical limitation

The Policy Engine is a deterministic decision core. It does **not**:

- Authenticate the human approver.
- Store or manage approval records.
- Enforce approval expiry or replay protection.
- Execute tools or agent processes.
- Enforce operating-system or container permissions.
- Guarantee that an executor follows the policy result.

The integration must provide trusted identity and approval storage. An executor must re-evaluate policy immediately before each action and enforce the result with least-privilege controls. Until that exists, policy evaluation is not a complete execution security boundary.

## Technology assessment boundary

The technology engine can inspect a bounded repository snapshot or supplied file records. It compares caller-supplied candidates against explicit workload requirements. It does not discover candidates automatically, verify supplied evidence, run code, or apply migrations. Treat its output as a proposal.

## Test

From this directory:

```bash
npm test
```

Run this command in an environment with the package's declared Node.js runtime. Report the actual result. Do not infer test status from source inspection.

## Execution model

The intended lifecycle is:

`understand → retrieve → plan → approve → execute → verify → report`

The current implementation reaches planning and policy evaluation. Harness execution, approval lifecycle management, audit records, retries, and independent runtime verification remain future work.
