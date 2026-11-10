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
| Read-only project discovery and repo-scan | Initial MVP implemented | `core/project-intelligence/` | Bounded metadata scan with path/manifest entry-point candidates; no code execution, semantic source analysis, vulnerability feeds, or persistent scan history |
| README demonstration guidance | Standard and bootstrap instructions implemented; scanner heuristic implemented | `docs/README-DEMO-STANDARD.md`, `bootstrap/template/AGENTS.md`, `core/project-intelligence/` | Does not judge visual quality or prove media/demo functionality |
| Repo-scan CLI and report rendering | Initial read-only CLI with JSON and Markdown output | `core/project-intelligence/bin/`, `src/report.js` | Local package CLI only; stdout output; no persistent history or full audit |
| Architecture and entry-point signals | Initial deterministic path/manifest heuristics | `core/project-intelligence/` | Candidate paths and workspace hints only; not a verified runtime architecture graph |
| Capability filtering and ranking | Initial deterministic selector implemented | `core/capability-engine/` | In-memory metadata filter/ranker; no persistence, runtime compatibility proof, composition, or execution |
| Shared schema and problem contracts | Initial foundation implemented | `core/schema-engine/`, `core/problem-engine/` | Six versioned record types; no persistence, cross-record store, capability registry, or end-to-end workflow |
| Resource catalog and comparison | Implemented foundation | `catalog/`, `core/resource-engine/`, subsystem docs | Evidence quality, freshness, and breadth remain incomplete |
| Resource registry | Implemented foundation | `core/resource-registry/` | Metadata sync is not source or dependency auditing |
| Native knowledge library | Implemented foundation | `knowledge/`, `core/knowledge-engine/` | Retrieval is deterministic metadata matching, not semantic understanding |
| Task planning | Implemented foundation | `core/orchestrator/` | Does not launch agent processes |
| Policy Engine | Implemented decision core | `core/orchestrator/src/policy-engine.js`, policy docs | No approval store, identity provider, replay control, or executor enforcement |
| Repository governance and quality rubrics | Implemented guidance and checker | `docs/REPOSITORY-GOVERNANCE.md`, `rubrics/`, `bootstrap/template/` | Governance-level policy enforcement remains incomplete |
| Project intelligence and continuity protocol | Guidance, templates, static checks, and diff-based CI enforcement implemented | `docs/PROJECT-INTELLIGENCE-AND-CONTINUITY.md`, `bootstrap/template/docs/`, repository-hygiene scripts | Checks cannot prove semantic accuracy or recover uncommitted work after a hard environment loss |
| Pack runtime | Planned | `docs/PACK-MODEL.md`, roadmap | Dependency resolution, activation, and safe removal are not implemented |
| Harness adapters and execution | Mostly planned | `agents/`, `integrations/`, architecture docs | No complete, validated multi-harness execution path |

## 3. Architecture map

| Component/path | Responsibility | Documentation |
|---|---|---|
| `catalog/` | External resource candidates and discovery metadata | `docs/RESOURCE-INTELLIGENCE.md` |
| `knowledge/` | Original engineering knowledge and registry | `docs/KNOWLEDGE-LIBRARY.md` |
| `core/schema-engine/` | Shared validation for the supported JSON Schema subset | `core/schema-engine/README.md` |
| `core/project-intelligence/` | Read-only repository discovery and initial repo-scan findings | `core/project-intelligence/README.md` |
| `core/capability-engine/` | Filters/ranks capability records using problem context and explicit permissions | `core/capability-engine/README.md` |
| `core/problem-engine/` | Problem, evidence, finding, capability, plan, and verification contracts | `core/problem-engine/README.md` |
| `core/knowledge-engine/` | Deterministic knowledge retrieval and validation | `core/knowledge-engine/README.md` |
| `core/resource-engine/` | Requirement-based resource evaluation | Package and tests |
| `core/resource-registry/` | SQLite resource identity, metadata, and review history | `core/resource-registry/README.md` |
| `core/orchestrator/` | Task planning, technology assessment, and policy evaluation | `core/orchestrator/README.md` |
| `agents/` | Shared agent guidance and harness entry points | `agents/universal/INSTRUCTIONS.md` |
| `integrations/` | External system integrations | Subsystem READMEs |
| `bootstrap/template/` | Small local governance and continuity entry points | `docs/REPOSITORY-GOVERNANCE.md` |
| `schemas/` | Machine-readable contracts | Schema files |
| `scripts/` | Discovery and repository maintenance | Script docs |
| `docs/` | Product, architecture, security, quality, continuity, README demo standard, and roadmap records | This directory |
| `rubrics/` | Universal and specialist project quality criteria | `rubrics/PROJECT-RUBRICS.md` |

## 4. Setup and operation
- **Runtime:** Node.js 22+ is required by several subsystems; resource registry documents Node.js 22.13+.
- **Hygiene check:** `node scripts/repository-hygiene/check.mjs`
- **Repo scan:** `node core/project-intelligence/bin/repo-scan.js . --format markdown` (JSON is the default)
- **Subsystem tests:** Run `npm test` from each subsystem package directory where defined. Shared contract tests run in `.github/workflows/problem-engine-tests.yml`.
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
1. **Fix and verify architecture-signal CI.** Correct the Markdown renderer syntax and align the fixture with the scanner's intentional exclusion of generated directories. Then rerun all relevant checks.
2. **Add deeper deterministic checks.** Improve dependency, test, CI, configuration, and documentation analysis without executing untrusted project code.
3. **Complete capability infrastructure.** Add provenance, compatibility validation, registry persistence, and safe composition.
2. **Expand repo-scan carefully.** Add labelled fixtures and deterministic checks only when evidence quality and false-positive rates are measured. Keep scans read-only and bounded.
3. **Build project context assembly.** Add useful architecture and entry-point context without running untrusted code.
4. **Complete capability infrastructure.** Add provenance, compatibility validation, registry persistence, and safe composition. The current selector is in-memory and metadata-based only.
5. **Prove a find-to-fix-to-verify workflow.** Keep execution disabled until the plan digest, policy source, task schema, trusted approval lifecycle, and executor-side enforcement gaps are closed.
6. **Remediate audited Resource Registry defects and add package CI.** Correct the CLI import, preserve status on metadata updates, filter before pagination, and add lockfile/CI coverage.
7. **Improve resource and knowledge quality.** Review initial knowledge entries, improve hybrid resource selection, and add benchmarks.
8. **Complete distribution and repository maintenance.** Build safe updates for existing repositories, validate GitHub App runtime, review stale branches and Dependabot PRs, and verify owner-only protection settings.

The previous targeted audit remains relevant. Its P1 correctness and policy findings are blockers before real executor adapters.

## 7. Verification record
| Date | Commit | Check | Result |
|---|---|---|---|
| 2026-11-10 | `2625ded` | GitHub tree inventory and selected documentation/source inspection | Completed; full repository audit still pending |
| 2026-11-10 | `2625ded` | Automated test suite / CI | Not run in that remote editing session |
| 2026-11-10 | `62c4907` | Shared Schema Engine tests | Failed: 5 passed, 1 failed; the test exposed that Date objects passed the object type check |
| 2026-11-10 | `62c4907` | Shared Problem Engine tests | Skipped because the schema-engine step failed first |
| 2026-11-10 | `de0ea26` | Shared contract workflow | Passed: schema engine 6/6, problem engine 7/7, knowledge engine 30/30 |
| 2026-11-10 | `de0ea26` | Repository hygiene and continuity diff | Passed: 142 files, 0 errors, 0 warnings, 0 notes; continuity diff passed |
| 2026-11-10 | `de0ea26` | Secret history scan | Passed |
| 2026-11-10 | `cf35039` | Shared Contract Tests | Passed: schema engine 6/6, problem engine 7/7, capability engine 8/8, knowledge engine 30/30 |
| 2026-11-10 | `cf35039` | Repository hygiene and continuity diff | Passed: 142 files, zero errors, warnings, or notes; continuity diff passed |
| 2026-11-10 | `cf35039` | Secret history scan | Passed |
| 2026-11-10 | `cf35039` | CodeQL | Still running at handoff update |
| 2026-11-10 | `05d15fd` | Shared Contract Tests | Passed: schema 6/6, problem 7/7, capability 9/9, knowledge 30/30 |
| 2026-11-10 | `d5bfb45` | Project Intelligence tests | Passed: 7/7 |
| 2026-11-10 | `cf2e593` | Repository hygiene | Passed |
| 2026-11-10 | `cf2e593` | Secret history scan | Passed |
| 2026-11-10 | `cf2e593` | CodeQL | Passed |
| 2026-11-10 | `af9bee8` | Repository hygiene | Passed |
| 2026-11-10 | `af9bee8` | GitHub bootstrap app tests | Passed |
| 2026-11-10 | `af9bee8` | Secret history scan | Passed |
| 2026-11-10 | `af9bee8` | Shared Contract Tests | Failed: schema and problem suites passed; Project Intelligence failed to parse due to an async README read block placed inside a synchronous framework detector |
| 2026-11-10 | `51b0cfc` | Shared Contract Tests | Passed: schema 6/6, problem 7/7, project intelligence 10/10, capability 9/9, knowledge 30/30 |
| 2026-11-10 | `51b0cfc` | Repository hygiene and continuity diff | Passed: 152 files, zero errors, warnings, or notes; continuity diff passed |
| 2026-11-10 | `51b0cfc` | Secret history scan | Passed |
| 2026-11-10 | `51b0cfc` | CodeQL | In progress at verification update |
| 2026-11-10 | `be4768b` | Shared Contract Tests | Passed: schema 6/6, problem 7/7, project intelligence 17/17, capability 9/9, knowledge 30/30 |
| 2026-11-10 | `be4768b` | Repository hygiene | Failed continuity diff because implementation changes lacked updated project state and work log; hygiene unit tests passed, repository scan was skipped |
| 2026-11-10 | `be4768b` | Secret history scan | Passed |
| 2026-11-10 | `be4768b` | CodeQL | In progress at verification update |
| 2026-11-10 | `9ffeea2` | Repository hygiene and continuity diff | Passed: 155 files, zero errors, warnings, or notes; continuity diff passed |
| 2026-11-10 | `9ffeea2` | Secret history scan | Passed |
| 2026-11-10 | `9ffeea2` | CodeQL | In progress at verification update |
| 2026-11-10 | `c0ebcbc` | Shared Contract Tests | Failed: schema 6/6 and problem 7/7 passed; Project Intelligence exposed a Markdown renderer syntax error and a fixture expectation for a file under the intentionally skipped `dist/` directory |
| 2026-11-10 | `c0ebcbc` | Repository hygiene | Passed; continuity diff passed |
| 2026-11-10 | `c0ebcbc` | Secret history scan | Passed |
| 2026-11-10 | `c0ebcbc` | CodeQL | In progress at verification update |
| 2026-11-10 | `0a3faa4` | Shared Contract Tests | Failed: schema 6/6, problem 7/7, CLI tests 7/7 passed; one Project Intelligence fixture assertion still referenced the old `dist/index.js` path after it was moved to `lib/index.js` |
| 2026-11-10 | `0a3faa4` | Repository hygiene | Pending result |

Do not report checks as passed unless they ran and passed.

## 8. Risks, known issues, and unknowns
- **Verified:** The initial shared contract layer defines six record types.
- **Verified:** The initial repo-scan is a bounded metadata scanner. It does not inspect source semantics, run tests, access the network, or prove security.
- **Verified:** The README demo standard is guidance; the repo-scan demo heuristic does not validate media quality or functionality.
- **Verified:** The capability selector filters and ranks metadata declarations only. It does not prove runtime compatibility or execute capabilities. It does not provide storage, cross-record integrity, capability discovery, execution, or approvals.
- **Verified:** The orchestrator does not launch or coordinate real agent processes.
- **Verified:** Policy Engine is not a complete execution security boundary.
- **Verified:** Harness adapters are not all validated against real harness versions.
- **Verified:** Continuity presence, structure, placeholder completion, review-date freshness, and changed-file update requirements are checked by CI. The diff check requires a new dated work-log entry; L2–L4 cannot disable the checks or lower governance in the same change set. Semantic accuracy remains an agent/human responsibility.
- **Verified audit findings:** Resource Registry CLI has an incorrect relative import; registry filtering applies LIMIT before status/category filtering; registry updates can reset status to candidate; plan digest omits execution-relevant routing fields; policy YAML and JavaScript rules are not a single runtime source of truth.
- **Unknown:** Whether every branch and open PR contains unique work or can be consolidated safely; inspect before merging/deleting.
- **Owner action:** Verify branch protection, required status checks, GitHub App registration, and deployment configuration.
- **Audit gap:** Documentation and agent instructions were reviewed. Core source, tests, manifests, workflows, GitHub App, and branch/PR state received a targeted static audit. Full package test execution, live webhook validation, dependency audit, and owner-only settings remain unverified.

## 9. Handoff metadata
- **Last reviewed:** 2026-11-10
- **Commit:** `9ffeea27c30882f84ceaa0e27f6bcf947f6b75cb` (before architecture-signal work; verify new HEAD after commit).
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
