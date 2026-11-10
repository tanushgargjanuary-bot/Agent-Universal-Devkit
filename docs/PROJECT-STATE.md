# DEVKIT Project State and Agent Handoff

> This is the current handoff entry point. Verify every important claim against source and tests before acting.

## 1. Project identity
- **Name:** Agent-Universal-Devkit (DEVKIT)
- **Purpose:** A modular, vendor-neutral engineering ecosystem that helps people and AI agents discover engineering resources, use validated knowledge, plan work, apply policy decisions, and verify results.
- **Primary users:** Developers, project owners, and AI agents working across software and engineering projects.
- **Intended outcome:** Make complex project work safer, easier to plan, easier to verify, and recoverable across tools, models, and agent environments.
- **Non-goals:** No claim of fully autonomous secure execution, universal harness compatibility, or automatic correctness.
- **Project status:** Active development; foundations exist, full end-to-end execution is not implemented.
- **Governance level:** L2 baseline; policy/execution and connected-repository use may require L3 controls.

## 2. Current implementation truth

| Capability | Status | Evidence | Limitations |
|---|---|---|---|
| Resource catalog and comparison | Implemented foundation | `catalog/`, `core/resource-engine/`, subsystem docs | Evidence quality, freshness, and breadth remain incomplete |
| Resource registry | Implemented foundation | `core/resource-registry/` | Metadata sync is not source or dependency auditing |
| Native knowledge library | Implemented foundation | `knowledge/`, `core/knowledge-engine/` | Retrieval is deterministic metadata matching, not semantic understanding |
| Task planning | Implemented foundation | `core/orchestrator/` | Does not launch agent processes |
| Policy Engine | Implemented decision core | `core/orchestrator/src/policy-engine.js`, policy docs | No approval store, identity provider, replay control, or executor enforcement |
| Repository governance and quality rubrics | Implemented guidance and checker | `docs/REPOSITORY-GOVERNANCE.md`, `rubrics/`, `bootstrap/template/` | Governance-level policy enforcement remains incomplete |
| Project intelligence and continuity protocol | Guidance and templates implemented | `docs/PROJECT-INTELLIGENCE-AND-CONTINUITY.md`, `bootstrap/template/docs/` | Automated presence/freshness enforcement is not implemented |
| Pack runtime | Planned | `docs/PACK-MODEL.md`, roadmap | Dependency resolution, activation, and safe removal are not implemented |
| Harness adapters and execution | Mostly planned | `agents/`, `integrations/`, architecture docs | No complete, validated multi-harness execution path |

## 3. Architecture map

| Component/path | Responsibility | Documentation |
|---|---|---|
| `catalog/` | External resource candidates and discovery metadata | `docs/RESOURCE-INTELLIGENCE.md` |
| `knowledge/` | Original engineering knowledge and registry | `docs/KNOWLEDGE-LIBRARY.md` |
| `core/knowledge-engine/` | Deterministic knowledge retrieval and validation | `core/knowledge-engine/README.md` |
| `core/resource-engine/` | Requirement-based resource evaluation | Package and tests |
| `core/resource-registry/` | SQLite resource identity, metadata, and review history | `core/resource-registry/README.md` |
| `core/orchestrator/` | Task planning, technology assessment, and policy evaluation | `core/orchestrator/README.md` |
| `agents/` | Shared agent guidance and harness entry points | `agents/universal/INSTRUCTIONS.md` |
| `integrations/` | External system integrations | Subsystem READMEs |
| `bootstrap/template/` | Small local governance and continuity entry points | `docs/REPOSITORY-GOVERNANCE.md` |
| `schemas/` | Machine-readable contracts | Schema files |
| `scripts/` | Discovery and repository maintenance | Script docs |
| `docs/` | Product, architecture, security, quality, continuity, and roadmap records | This directory |
| `rubrics/` | Universal and specialist project quality criteria | `rubrics/PROJECT-RUBRICS.md` |

## 4. Setup and operation
- **Runtime:** Node.js 22+ is required by several subsystems; resource registry documents Node.js 22.13+.
- **Hygiene check:** `node scripts/repository-hygiene/check.mjs`
- **Subsystem tests:** Run `npm test` from each subsystem package directory where defined.
- **Build/deploy:** No single full-product build or deployment path is established.
- **External state:** GitHub App registration/deployment and repository protection settings require owner-side verification.
- **Configuration:** Never record secret values here. Record variable names and secret-management locations only.

## 5. Decisions and constraints
| Decision/constraint | Reason | Evidence | Revisit when |
|---|---|---|---|
| Keep one small universal core with optional packs | Avoid monolithic scope and unnecessary coupling | `docs/PRODUCT-PRINCIPLES.md`, `docs/PACK-MODEL.md` | Real workloads prove a boundary is needed |
| Resource Intelligence and Agent Orchestration have equal priority | Both are central product pillars | `README.md`, `docs/VISION-AND-SCOPE.md` | Explicit product strategy changes |
| Deny unknown policy actions by default | Prevent implicit permission grants | `core/orchestrator/README.md`, policy source | Only after a reviewed policy redesign |
| Keep current repo on `main`; use branches only when useful | Reduce integration overhead and branch drift | Repository workflow and owner direction | Parallel or isolated work requires it |
| Preserve clear limits between policy decisions and runtime enforcement | Avoid false security claims | `docs/ARCHITECTURE.md`, `docs/SECURITY-AUDIT.md` | Executor enforcement is implemented and tested |

## 6. Active work and next actions
1. **Complete repository-wide DEVKIT audit.** Inventory and read all relevant documentation, agent instructions, subsystem specs, source, tests, CI, branches, PRs, and issues. Compare claims with implementation.
2. **Implement continuity enforcement.** Extend the hygiene checker to detect missing or structurally incomplete project-state/work-log records and stale handoff metadata, with risk-aware severity and tests.
3. **Improve agent planning support.** Evaluate whether planning protocol templates, task schemas, and orchestrator outputs should encode acceptance criteria, adversarial review, risk, recovery, and future-scope classification.
4. **Continue policy-aware execution work.** Approval lifecycle, trusted identity, replay protection, executor-side enforcement, audit records, simulated executor, and adversarial end-to-end tests.
5. **Continue resource and knowledge roadmap items** based on the next audited priority.

The order may change after the repository audit. Do not start major implementation from this summary alone.

## 7. Verification record
| Date | Commit | Check | Result |
|---|---|---|---|
| 2026-11-10 | `2625ded` | GitHub tree inventory and selected documentation/source inspection | Completed; full repository audit still pending |
| 2026-11-10 | `2625ded` | Automated test suite / CI | Not run in this remote editing session |

Do not report checks as passed unless they ran and passed.

## 8. Risks, known issues, and unknowns
- **Verified:** The orchestrator does not launch or coordinate real agent processes.
- **Verified:** Policy Engine is not a complete execution security boundary.
- **Verified:** Harness adapters are not all validated against real harness versions.
- **Verified:** Continuity documents are not yet checked automatically for presence or freshness.
- **Unknown:** Whether every branch and open PR contains unique work or can be consolidated safely; inspect before merging/deleting.
- **Owner action:** Verify branch protection, required status checks, GitHub App registration, and deployment configuration.
- **Audit gap:** The complete documentation set, all implementation modules, all tests, and all workflow files have not yet been reviewed in this audit cycle.

## 9. Handoff metadata
- **Last reviewed:** 2026-11-10
- **Commit:** `2625ded2f2d160660f4173244a999fc4d2da1311`
- **Updated by:** ChatGPT GitHub integration
- **Working tree:** GitHub commit-based editing; no local working tree was available for inspection.
- **External state:** CI, branch protection, GitHub App deployment, and external service state require direct verification.

## Recovery checklist
- [ ] Read root `AGENTS.md` and this file.
- [ ] Read `docs/PROJECT-INTELLIGENCE-AND-CONTINUITY.md`.
- [ ] Read recent `docs/WORKLOG.md` entries.
- [ ] Verify current branch, commit, and working tree.
- [ ] Confirm implementation and tests for the task.
- [ ] Preserve all existing work and obtain required approvals.
- [ ] Update this file and the work log before handoff.
