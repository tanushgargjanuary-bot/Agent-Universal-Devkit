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

`src/approval-store.js` provides a SQLite-backed approval lifecycle. It stores pending requests, authenticated decisions, signed approvals, expiry, rejection, revocation, and an append-only event history. The integration must provide an `authenticateApprover` callback that validates a real credential and returns a stable subject. The store signs approvals with an Ed25519 private key; keep that key outside the repository. Verification checks the signature, exact scope, expiry, key ID, current stored status, and whether the approval has already been consumed. The Execution Gate atomically consumes each approval immediately before adapter execution; one approval cannot authorise repeated runs. Pass `store.verifyApproval.bind(store)` to the Policy Engine.

The store does not implement a user interface, identity provider, key provisioning/rotation, distributed locking, or executor-side enforcement. Do not pass a caller-created identity object as proof of authentication.

`src/execution-gate.js` is the required orchestration path for adapter calls. It revalidates the plan digest, evaluates policy for each exact action and target, verifies approvals from the current store, resolves one adapter that satisfies the declared harness and capabilities, requires an audit callback, and executes sequentially. It has no built-in adapters. Adapter code must remain private to the host and must not expose an alternate direct execution path. The gate is not an OS sandbox.

Keep execution disabled until a real identity provider, protected key management, durable audit sink, and least-privilege adapters are integrated.

## Critical limitation and security boundary

The Policy Engine remains a deterministic decision core. The Approval Store and Execution Gate add approval lifecycle and a standard adapter invocation path:

- The Approval Store stores scoped requests, signs approvals with Ed25519, enforces expiry, supports rejection/revocation, records events, and consumes approvals exactly once.
- The host must provide a real `authenticateApprover` implementation and secure private-key provisioning, storage, backup, and rotation.
- The Execution Gate revalidates the plan digest and dependency order, evaluates each action, checks the current approval record, consumes the approval, resolves one compatible adapter, requires an audit callback, and executes sequentially.
- No production adapter or agent-process launcher is included.
- The audit callback contract does not itself provide durable or tamper-evident storage.
- The gate is not an OS/container sandbox. A host can bypass it if it exposes raw adapter methods elsewhere.

Keep raw adapters private and do not enable unrestricted execution. Add least-privilege process isolation before write-capable adapters. Do not claim a complete execution security boundary until the host integration has been independently tested.

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

The current implementation includes planning, policy decisions, approval lifecycle storage, and a policy-enforcing adapter gate. Production harness adapters, agent-process orchestration, durable audit storage, retries/recovery, OS-level isolation, and independent runtime verification remain future work.
