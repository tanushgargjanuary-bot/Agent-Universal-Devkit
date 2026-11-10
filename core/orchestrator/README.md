# Orchestration Layer

The orchestration layer coordinates work. It does not replace the AI coding harness.

## What it should do

1. Receive a goal and repository context.
2. Inspect the project and identify its language, framework, tests, and constraints.
3. Derive requirements and acceptance criteria.
4. Break the goal into small tasks.
5. Match each task to a suitable agent capability and approved tool.
6. Retrieve relevant approved knowledge and resources.
7. Check permissions, risk, and required approvals.
8. Run tasks through a supported harness adapter.
9. Verify results with tests and independent checks.
10. Return a clear report and record diagnosed failures.

## Main parts

- **Planner:** turns a goal into ordered tasks.
- **Router:** chooses a compatible agent or harness for each task.
- **Tool selector:** recommends tools from the Devkit catalog.
- **Knowledge selector:** retrieves relevant algorithms, mathematics, and methods.
- **Technology decision engine:** inspects repository signals and compares evidence-backed language and architecture candidates against explicit workload requirements.
- **Architecture approval gate:** blocks stack additions, hybrid adoption, and migrations until a human approves the proposal.
- **Policy Engine:** classifies actions, denies unknown actions, and creates target- and plan-bound approval requests.
- **Approval verifier:** checks an approval through a trusted adapter before the policy gate allows the action.
- **Executor adapters:** connect to supported coding harnesses.
- **Verifier:** checks tests, diffs, and task completion.
- **State store:** tracks task status and evidence.

## Current implementation boundary

The current orchestrator implements task planning, dependency ordering, metadata validation, a versioned action Policy Engine, scoped approval checks, approved-knowledge retrieval, and an opt-in technology architecture assessment. The technology engine can inspect a bounded local repository snapshot or supplied file records, then compare caller-supplied candidates. It does not discover candidates automatically, execute code, or apply migrations. The Policy Engine is a deterministic decision core. It does not authenticate a human approver by itself. A trusted integration must implement `verifyApproval`; without that verifier, an approval-controlled action remains blocked. It does not execute actions or enforce operating-system permissions. It does not yet launch or control OpenCode, Codex, Claude Code, or Antigravity.

The Knowledge Engine is called during plan creation. The technology decision engine is called when the planner receives an explicit workload and at least two candidate architectures. Both are decision aids; agents must inspect evidence, assumptions, and limitations.

Each harness needs a tested executor adapter before the orchestrator can run it.

## Execution model

`understand → retrieve → plan → approve → execute → verify → report`

Never allow an agent to approve its own high-risk action. Never treat an agent's statement that a task is complete as proof. Use test results, diffs, and other evidence.

## Policy Engine

Use `core/orchestrator/src/policy-engine.js` to evaluate planned actions before execution.

- Known read and test actions can pass without approval at low risk.
- Known write, dependency, network, permission, secret, deployment, migration, and deletion actions have explicit risk thresholds.
- Unknown actions are denied.
- Approval requests bind the policy version, plan ID, plan digest, action, and exact target.
- An approval is accepted only when its fields match and a trusted `verifyApproval` callback returns `true`.
- A boolean such as `humanApproved: true` is not an approval record.
- A plan change produces a different digest. Old approvals then fail.
- The policy result is advisory until an executor checks it immediately before the action and applies least-privilege controls.

The core cannot prove that a callback is trustworthy. Each integration must authenticate the approver, protect approval records, prevent replay, and enforce the returned decision at the execution boundary.
