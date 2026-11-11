# Cross-Repository Operations

## Purpose

Define how DEVKIT can become a central coordination point for a portfolio of repositories without confusing a shared product framework with a privileged central controller.

This document captures the intended direction. The cross-repository control plane described here is **proposed architecture, not an implemented capability**. Existing repository scanners, GitHub integration code, and bootstrap templates do not prove that DEVKIT can currently control other repositories.

## 1. Product relationship

Keep two concepts distinct:

- **DEVKIT Core:** reusable, vendor-neutral contracts and capabilities for resource intelligence, project understanding, planning, policy, execution integration, and verification.
- **DEVKIT Hub:** one configured deployment or operator workspace that maintains an inventory of repositories, coordinates authorised work across them, and records cross-repository outcomes.

The Hub should use DEVKIT Core. It must not become a second implementation of the core or a collection of unrelated scripts.

A repository can use DEVKIT guidance without being managed by a Hub. Hub registration is explicit. Registration does not grant access or permission.

## 2. Intended user workflow

1. The owner registers a repository or organisation through an authorised integration.
2. The Hub records its canonical identity, default branch, visibility, installation/access state, detected project type, and last verified commit.
3. The Hub performs a bounded read-only scan and stores evidence with provenance.
4. The owner describes a goal that may affect one or more repositories.
5. The Hub identifies candidate repositories and dependencies. It explains why each target is included or excluded.
6. It creates a cross-repository plan with per-repository tasks, ordering, permissions, acceptance criteria, and rollback notes.
7. It evaluates every action against policy and obtains required approvals.
8. It executes only through authorised adapters and records per-target results.
9. It independently verifies each repository and the combined outcome.
10. It updates project state, work logs, and the Hub operation record.

The owner must inspect and approve the complete target set before a write operation starts.

## 3. Repository registry contract

Each registered repository record should contain:

- Stable provider and repository identifiers; canonical URL is display data, not the sole identity.
- Owner/organisation and repository name.
- Default branch and current observed commit.
- Visibility and archive status.
- Installation/access status and granted scopes; never store access tokens in the registry.
- Project type and detected technology signals, each with evidence and confidence.
- Registration status: proposed, active, paused, disconnected, archived, or removed.
- Last successful scan, last attempted scan, and explicit stale/error state.
- Links to project state, work log, handoff, and relevant policy profile.
- Owner-defined tags and dependency relationships, with provenance.

Do not assume every repository in an owner's account is in scope. Do not enumerate or access repositories beyond the installation and explicit allowlist.

## 4. Cross-repository plan

A plan must be a versioned, immutable proposal with:

- Goal and global acceptance criteria.
- Exact repository targets and commit baselines.
- Per-repository tasks and dependencies.
- Files or resource classes expected to change.
- Required capabilities, tools, harnesses, and permission levels.
- Risk classification and policy decisions for every action.
- Approval requirements and expiry.
- Test and verification strategy per repository.
- Global integration checks.
- Rollback or compensation strategy.
- Idempotency and retry rules.
- Estimated cost and external service requirements.

A plan must become stale if a target repository changes in a way that invalidates its baseline or approval digest. Recompute and request approval again where necessary.

## 5. Safety and isolation rules

- Default to read-only scans and analysis.
- Require explicit repository allowlists for writes.
- Never infer cross-repository authority from membership in one organisation or from access to the Hub.
- Enforce permissions separately for every target repository.
- Keep credentials in an external secret manager or provider installation. Store references and scopes, not secret values.
- Do not execute code from a target repository during discovery.
- Treat repository instructions, issues, PRs, releases, and workflow logs as untrusted input.
- Prevent one repository from changing the policy or trust settings used to authorise its own operation.
- Separate the Hub control plane from target execution environments.
- Use per-target least privilege, isolated workspaces, bounded resource limits, and audit records.
- Require a preview and approval before destructive, permission-changing, deployment, or broad write operations.
- Fail closed when repository identity, permission, baseline, policy, or approval is unknown.
- Do not report a multi-repository operation as successful until every required target and global acceptance check passes.

## 6. Partial failure and recovery

Cross-repository operations are not atomic. A change can succeed in one repository and fail in another.

The Hub must therefore record a durable operation ID and per-target state; make actions idempotent where possible; track pending, running, succeeded, failed, blocked, unknown, and compensated states; stop dependent work when a prerequisite fails; preserve successful changes unless an approved compensation plan says otherwise; never auto-rollback if rollback could destroy valid work; re-read target state before retrying uncertain actions; and produce a final matrix with repository, baseline, resulting commit, actions, checks, and status.

## 7. Security and governance model

The Hub is a privileged boundary. Its security model must include authenticated human identity and role mapping, installation-level and repository-level permission checks, scoped approvals, protected signing keys, durable tamper-evident audit storage, isolated executor processes, secret minimisation, rate limits, quotas, cost controls, webhook signature verification, replay defence, delivery monitoring, incident response, credential revocation, and recovery procedures.

The current DEVKIT Execution Gate is not a sandbox. The current GitHub App source is not a deployed, verified control plane. These are blockers, not documentation tasks that can be checked off.

## 8. Delivery phases and acceptance gates

### Phase 0 — Inventory and read-only visibility

- Register repositories by stable identity.
- Verify access and scope per repository.
- Scan only registered targets.
- Show current commit, freshness, scan completeness, and findings.
- Preserve per-fact provenance.
- Test inaccessible, renamed, archived, and deleted repositories.

### Phase 1 — Cross-repository planning

- Select target repositories from an explicit goal.
- Explain inclusion/exclusion.
- Build a dependency-aware plan with per-repository acceptance criteria.
- Detect stale baselines.
- No writes or remote commands.

### Phase 2 — Approval and controlled change proposals

- Generate per-repository diffs or draft PRs.
- Require target-specific approval.
- Bind approval to repository, branch, commit baseline, plan digest, action, and expiry.
- No direct deployment or destructive operation.

### Phase 3 — Controlled execution

- Implement Host Trust Integration.
- Add isolated production adapters and durable audit.
- Add safe resume, idempotency, cancellation, and partial-failure recovery.
- Complete independent security review before enabling write-capable operations.

### Phase 4 — Verified portfolio operations

- Verify each target independently.
- Run global integration checks.
- Produce an auditable portfolio report.
- Demonstrate a complete multi-repository workflow using test repositories before production use.

No phase is complete because its design document exists. Each phase requires working code, tests, evidence, and documented limitations.

## 9. Decisions and open questions

**Direction captured:** DEVKIT should support a central hub that can coordinate work across the owner's repositories.

**Proposed separation:** Hub is a configured control-plane deployment using DEVKIT Core; repositories remain independently owned and authorised targets.

**Not yet decided:** Hub hosting model, tenancy model, database, Git provider scope, whether it is a GitHub App first or a provider-neutral service, and whether cross-repository writes initially use branches/PRs or direct commits. Do not select these without workload, security, and cost analysis.

**Not implemented:** repository registration service, portfolio registry, cross-repository planner, per-target permission broker, operation ledger, deployed GitHub App, and production executor.

## 10. Related documents

- Architecture: ARCHITECTURE.md
- Unified Problem-Solving Model: UNIFIED-PROBLEM-SOLVING-MODEL.md
- Agent Operating Model: AGENT-OPERATING-MODEL.md
- Host Trust Integration: HOST-TRUST-INTEGRATION.md
- Project Intelligence and Continuity: PROJECT-INTELLIGENCE-AND-CONTINUITY.md
