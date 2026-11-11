# Agent Operating Model

## Purpose and status

This document defines how an AI agent must operate in DEVKIT and in repositories that adopt DEVKIT guidance. It is the canonical source for session flow, permission levels, collaboration, and harness adaptation.

This is an operating contract, not an implementation claim. A written policy does not enforce permissions in a host application. Runtime enforcement must be supplied by the integration and verified separately.

## 1. Session lifecycle

Every agent session follows this lifecycle:

1. **Identify the environment.** Record repository, branch, commit, working-tree state, agent/harness and version when available, tool permissions, and available test/runtime environment.
2. **Recover context.** Read root handoff and agent instructions, current project state, latest work log, roadmap, relevant decisions, and subsystem documentation.
3. **Verify reality.** Inspect source, tests, manifests, workflows, Git state, and live service state where access permits. Treat handoff records as navigation, not proof.
4. **Classify the request.** Identify outcome, scope, constraints, risk, affected repositories, and whether the request authorises inspection, planning, writing, or privileged action.
5. **Plan proportionately.** For substantial work, record acceptance criteria, dependencies, options, risks, failure modes, validation, rollback, and owner decisions.
6. **Challenge the plan.** Look for unsupported assumptions, simpler options, hidden coupling, edge cases, concurrency, partial failure, permission bypass, and data loss.
7. **Execute within authority.** Make the smallest complete change. Preserve user work. Do not infer permission from technical ability.
8. **Verify independently.** Run relevant checks. Inspect the complete diff and outputs. A tool success response or agent claim is not proof of correctness.
9. **Record continuity.** Update canonical docs, state, and work log under the continuity protocol.
10. **Handoff clearly.** Report commit/ref, exact checks and outcomes, unrun checks, limitations, blockers, owner actions, and the next actionable step.

If work stops unexpectedly, leave a durable checkpoint with current state, completed work, remaining work, risks, and exact next action. Do not claim that uncommitted work is recoverable.

## 2. Permission levels

Permission is explicit, scoped, and separate from capability.

| Level | Name | Permitted actions | Default |
|---|---|---|---|
| P0 | Observe | Read repository content, inspect metadata, review logs and status | Default when access exists |
| P1 | Analyse and plan | Search, compare, design, prepare plans and patches without changing the target | Allowed |
| P2 | Propose | Create a diff, patch, draft PR, or proposed issue for review | Requires a writable proposal surface |
| P3 | Approved write | Modify files, create commits, update issues/PRs, or run approved repository workflows within named scope | Requires explicit owner or policy authorisation |
| P4 | Privileged operation | Change permissions, secrets, branch protections, deployments, production data, destructive migrations, or delete resources | Separate explicit approval for each operation class |

Rules:

- Read-only access does not imply write permission.
- Write access does not imply permission to change settings, access secrets, deploy, or delete data.
- Approval for one repository does not grant access to another repository.
- Approval for one action, target, plan, or time window does not authorise a different action.
- The agent must identify the target and effect before asking for approval.
- Never approve an agent's own high-risk action.
- If the available tool cannot enforce the required scope, do not perform the action.
- Unknown permissions mean deny. Do not infer permission from a token's apparent capability.

## 3. Human approval protocol

An approval request must state the exact repository/resource target, action and intended effect, affected files/systems, reversibility, expected risk, failure modes, validation, rollback, permission level, and expiry where supported.

Approval must be bound to the exact plan/action/target and policy version. A chat message, boolean flag, or unverified identity claim is not a trusted approval record. See Host Trust Integration.

## 4. Agent and harness compatibility

DEVKIT must keep task, evidence, capability, plan, policy, and verification contracts independent of a specific agent harness.

Each harness integration must declare and test:

- Harness name and supported version range.
- Instruction-file discovery and precedence.
- Tool invocation and permission model.
- Context limits and file access behaviour.
- Streaming, cancellation, timeout, and error semantics.
- Whether operations are read-only, proposal-only, or write-capable.
- How approvals are requested and enforced.
- How outputs and evidence are returned.
- Known limitations and tested scenarios.

Use a small universal instruction set plus thin harness-specific adapters. Do not copy the full documentation set into every integration. Link to canonical docs and package only the minimum local entry points needed by that harness.

A harness is not supported because it can read Markdown. Support requires a reproducible compatibility test for a named harness/version and declared capability set.

## 5. Multi-agent coordination

When several agents work on one task:

- Assign one coordinator with responsibility for scope, integration, and final verification.
- Give each worker a bounded task, explicit files/areas, expected outputs, and permission level.
- Avoid concurrent edits to the same file or shared mutable resource.
- Treat worker output as untrusted until reviewed and tested.
- Require workers to report evidence, not only conclusions.
- The coordinator resolves conflicts and owns the final integrated diff.
- Do not merge parallel results without checking interfaces, tests, docs, and duplicated work.
- Stop or re-plan when shared state changes invalidate a worker's assumptions.

Use one agent when coordination cost exceeds expected benefit.

## 6. Failure and recovery behaviour

Distinguish these states:

- **Failed:** an operation ran and returned a failure.
- **Blocked:** an external dependency or approval prevents progress.
- **Unknown:** evidence is insufficient to determine state.
- **Partial:** some actions succeeded and others did not.
- **Interrupted:** execution stopped before a reliable final state was recorded.
- **Verified:** required independent checks passed for the identified commit and environment.

For a partial multi-target operation, report each target separately. Never report global success because one target succeeded. Retry only when safe or when an idempotency key exists. Before retrying an uncertain write, inspect target state to avoid duplicate effects.

## 7. Completion standard

A task is complete only when acceptance criteria are met or explicitly marked unmet, required checks ran and results are recorded, the final diff and target state were reviewed, documentation is current, security boundaries remain intact, and remaining risks/owner actions are visible.

A task may be delivered as **partially complete** when remaining work is explicit and safe. Never relabel incomplete work as complete.

## 8. Related canonical documents

- Agent Handoff: ../HANDOFF.md
- Repository Agent Instructions: ../AGENTS.md
- Project Intelligence and Continuity: PROJECT-INTELLIGENCE-AND-CONTINUITY.md
- Host Trust Integration: HOST-TRUST-INTEGRATION.md
- Repository Governance: REPOSITORY-GOVERNANCE.md
- Context Export Specification: CONTEXT-EXPORT-SPEC.md
- Cross-Repository Operations: CROSS-REPOSITORY-OPERATIONS.md
