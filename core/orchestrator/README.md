# Orchestration Layer

The orchestrator is a planning and policy-decision foundation. It does not replace an AI coding harness and does not yet execute work through agent processes.

## Current capabilities

- Task planning and dependency ordering.
- Task metadata validation.
- Approved-only Knowledge Engine retrieval during plan creation.
- Opt-in technology architecture assessment using caller-supplied candidates and evidence.
- Versioned action Policy Engine.
- Deny-by-default handling for unknown actions.
- Approval requests bound to action, target, policy version, plan ID, and plan digest.
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
- A trusted `verifyApproval` callback must return `true`.
- A boolean such as `humanApproved: true` is not an approval record.
- A plan change changes its digest. An approval for the old plan must not be reused.

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
