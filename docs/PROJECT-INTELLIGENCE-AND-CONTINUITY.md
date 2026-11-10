# Project Intelligence, Planning, and Continuity Protocol

## Purpose

Every repository managed by the Devkit must remain understandable and recoverable when its original developer or AI agent is unavailable. A replacement agent must be able to establish what the project is, what is true now, why important choices were made, what work is active, how to verify changes, and what to do next by reading the repository alone.

This protocol is a working standard, not a promise that documentation can replace source inspection, credentials, external services, or human decisions.

## 1. Repository-first recovery

At the start of a new agent session, after a context loss, or when taking over work:

1. Read the root `AGENTS.md` and harness-specific instructions that apply.
2. Read `README.md` and `docs/PROJECT-STATE.md`. If the state file is absent, create it from the Devkit template after inspecting the project.
3. Read the latest relevant entries in `docs/WORKLOG.md`, then follow links to active issues, plans, architecture docs, and decision records.
4. Inspect the current branch, commit, working tree, repository tree, manifests, CI, tests, and deployment configuration.
5. Read the documentation and source for the subsystem being changed. Check whether recorded status matches actual code and tests.
6. Identify unknowns, external dependencies, owner-only actions, and anything that cannot be recovered from repository contents.

Do not treat a handoff note as proof. Verify important claims against source, tests, Git history, and external state where access exists. Do not overwrite user changes.

## 2. Required repository knowledge

Maintain one concise, current `docs/PROJECT-STATE.md` as the handoff entry point. It must link to canonical sources rather than copy large sections of them. Keep these fields current:

- Project identity: name, purpose, users, problem, intended outcome, and explicit non-goals.
- Current truth: implemented, partial, experimental, planned, deprecated, and removed capabilities.
- Architecture map: major components, responsibilities, boundaries, data flows, and entry points.
- Technology and operations: languages, runtimes, package managers, setup, run, test, build, deploy, and recovery commands.
- Decisions: links to important ADRs or issue discussions, with reasons and rejected options.
- Work state: active milestone, in-progress tasks, blocked items, owners where known, and links to issues/PRs.
- Verification: exact commands, last known results, environment/version, and checks not run.
- Risks and limitations: known bugs, security boundaries, technical debt, assumptions, and external dependencies.
- Next actions: ordered, actionable steps with dependencies and acceptance criteria.
- Handoff metadata: last updated date, commit SHA, and agent/session that updated it (use a tool or agent label, not personal data).

Use explicit labels such as **Verified**, **Inferred**, **Assumed**, **Unknown**, and **Owner action**. Include evidence or a link for important verified claims. Never convert an assumption into a fact through repetition.

## 3. Work log and decision history

Maintain `docs/WORKLOG.md` as a concise chronological record of meaningful work. Each entry records:

- Date and commit or PR.
- Goal and scope.
- Important changes.
- Tests/checks run and their actual outcomes.
- Remaining work, blockers, and known risks.
- The next recommended action.

Do not log every trivial edit. Do not rewrite history to hide a failure. Correct mistakes with a later entry. Use ADRs for decisions that materially affect architecture, security, data, compatibility, cost, or are expensive to reverse. A work log records what happened; an ADR records why a decision was made.

## 4. Planning protocol for meaningful work

Scale planning effort to the task's size and risk. A typo does not need a formal design. A multi-component, security-sensitive, data-changing, or hard-to-reverse task does.

For substantial work, create a durable plan in the issue, PR, or `docs/plans/` and include:

1. **Outcome:** user problem, intended result, and measurable success criteria.
2. **Context:** existing behaviour, constraints, architecture, prior decisions, and relevant evidence.
3. **Requirements:** functional and non-functional requirements; separate must-have from optional.
4. **Scope:** in-scope work, explicit exclusions, and compatibility requirements.
5. **Options:** credible alternatives, including doing nothing; compare complexity, security, reliability, cost, maintainability, and reversibility.
6. **Design:** components, interfaces, data flow, state transitions, trust boundaries, and failure behaviour.
7. **Work breakdown:** ordered tasks, dependencies, parallelism, and concrete acceptance criteria.
8. **Validation:** unit, integration, end-to-end, regression, security, performance, and manual checks as relevant.
9. **Risks and recovery:** failure modes, edge cases, migration, rollback, data recovery, and required approvals.
10. **Delivery:** documentation, observability, release notes, owner actions, and handoff updates.

### Devil's advocate review

Before implementation, challenge the plan:

- Does it solve the stated problem, or add complexity around it?
- What assumptions lack evidence?
- What can fail at boundaries, under concurrency, on retries, or with malformed input?
- Can an untrusted user, agent, file, tool result, or dependency bypass a control?
- Is there a simpler design with fewer dependencies or privileges?
- What happens on partial failure, interruption, rollback, or loss of external services?
- Are tests capable of detecting the likely failures?
- Does the plan preserve existing behaviour and user data?
- What is deliberately not being built?

Record material objections and how the plan addresses them. Do not hide unresolved risks.

## 5. Future-scope discipline

Every substantial planning review should identify useful future scope, but must not silently add it to current delivery.

Classify proposals as:

- **Now:** required for the accepted outcome or a release blocker.
- **Next:** high-value follow-up with a clear trigger or dependency.
- **Later:** useful, but not justified by current evidence or capacity.
- **Explore:** speculative idea that needs research or user validation.
- **Reject:** poor fit, duplicate, unsafe, or unjustified.

For each non-trivial proposal, state user value, evidence, dependencies, rough complexity/cost, risks, and what would trigger reconsideration. Prefer improvements that increase user capability, agent reliability, portability, safety, and ease of maintenance. Do not add features only because they are technically possible.

## 6. Execution and verification discipline

- Work from an accepted scope and keep changes reviewable.
- Re-check repository state before editing and before committing.
- Use the existing stack unless evidence supports a change.
- Do not install dependencies, expose secrets, change permissions, deploy, or perform destructive actions without required approval.
- Add tests for changed behaviour and important failure modes.
- Run relevant checks and report exact commands and outcomes. A skipped or unavailable check is not a pass.
- Review the complete diff for regressions, unrelated changes, secrets, generated files, and accidental deletions.
- Update `PROJECT-STATE.md`, `WORKLOG.md`, README, subsystem docs, API/config examples, and roadmap when the change affects them.
- Leave the repository in a clear state. If work is interrupted, write a handoff entry before stopping when possible.

## 7. Documentation freshness rules

Documentation is part of the deliverable whenever a change affects:

| Change | Required update |
|---|---|
| Purpose, scope, user workflow | README and project state |
| Architecture, interfaces, data model, trust boundary | Architecture docs and ADR if consequential |
| Setup, commands, dependencies, configuration | README or operations guide |
| Behaviour, API, schema, CLI | Relevant subsystem/API docs and examples |
| Security, permissions, data handling | Security docs and threat model |
| Tests, CI, supported platforms | Test/CI docs and project state |
| Milestones, blockers, next actions | Project state and roadmap/task tracker |
| Important decision or rejected option | ADR or durable issue record |
| Meaningful completed session | Work log and project state |

Do not create duplicate sources of truth. Keep one canonical explanation and link to it. Mark stale or unverified information clearly. Do not update timestamps without reviewing the content.

## 8. Handoff acceptance test

A repository is handoff-ready when a competent agent with no access to prior chats can, using repository contents alone:

- Explain the purpose, users, scope, and current implementation.
- Locate the main components and understand their responsibilities.
- Set up the project or identify exactly what access is missing.
- Run the documented tests and distinguish passed, failed, and unrun checks.
- Identify active work, blockers, risks, and the next useful action.
- Explain important decisions and find their evidence.
- Continue without guessing, overwriting user work, or repeating completed tasks.

If this test fails, record the gap and fix the highest-impact missing information first.

## 9. Honest limits

Repository documentation cannot preserve secrets, credentials, private external state, uncommitted work that was never saved, or decisions that were never recorded. It cannot prove that external deployments, permissions, backups, or services still work. The agent must state these limits and request the minimum required owner input. Never place secrets or sensitive personal data in continuity files.
