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
| README runnable-example signal | Initial heuristic implemented | `core/project-intelligence/src/index.js` | Recognises known CLI commands inside Demo/Examples sections; does not prove the command works |
| README demonstration guidance | Standard and bootstrap instructions implemented; scanner heuristic implemented | `docs/README-DEMO-STANDARD.md`, `bootstrap/template/AGENTS.md`, `core/project-intelligence/` | Does not judge visual quality or prove media/demo functionality |
| Repo-scan CLI and report rendering | Initial read-only CLI with JSON and Markdown output | `core/project-intelligence/bin/`, `src/report.js` | Local package CLI only; stdout output; no persistent history or full audit |
| Architecture and entry-point signals | Initial deterministic path/manifest heuristics | `core/project-intelligence/` | Candidate paths and workspace hints only; not a verified runtime architecture graph |
| Capability filtering and ranking | Initial deterministic selector implemented | `core/capability-engine/` | In-memory metadata filter/ranker; no persistence, runtime compatibility proof, composition, or execution |
| Shared schema and problem contracts | Initial foundation implemented | `core/schema-engine/`, `core/problem-engine/` | Six versioned record types; no persistence, cross-record store, capability registry, or end-to-end workflow |
| Resource catalog and comparison | Implemented foundation | `catalog/`, `core/resource-engine/`, subsystem docs | Evidence quality, freshness, and breadth remain incomplete |
| Daily and weekly trending resource intake | Implemented in PR #16; Python compilation, 5 unit tests, repository hygiene, continuity, secret-history scan, and CodeQL passed | `.github/workflows/resource-discovery.yml`, `scripts/discover_trending_repositories.py`, `docs/TRENDING-RESOURCE-DISCOVERY.md` | Metadata-only filters include public visibility and repository identity checks; candidates remain unapproved; GitHub Trending HTML can change |
| Resource registry | Implemented foundation; pagination, bounded search, blocked deduplication, lifecycle-preserving metadata refresh, CLI entry point, and dedicated CI added in the latest hardening pass | `core/resource-registry/`, `.github/workflows/resource-registry-tests.yml` | Heuristic deduplication still needs labelled benchmarks; metadata sync is not source or dependency auditing |
| Native knowledge library | Implemented foundation | `knowledge/`, `core/knowledge-engine/` | Retrieval is deterministic metadata matching, not semantic understanding |
| Task planning | Implemented foundation | `core/orchestrator/` | Does not launch agent processes |
| Policy Engine | Implemented decision core; canonical JSON action rules and routing-complete plan digest added | `core/orchestrator/src/policy-engine.js`, `core/orchestrator/policy.rules.json`, `core/orchestrator/policy.yaml` | No approval store, identity provider, replay control, expiry enforcement, or executor enforcement |
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
1. **Expand repo-scan fixture validation.** The labelled synthetic corpus now covers Node, Python, Rust, Go, JVM (Maven and Gradle), .NET, PHP, Ruby, and a mixed Node/Python/Rust workspace. Next validate entry-point and workspace signals, then measure precision, recall, and false-positive rates against independently labelled repositories.
2. **Build project context assembly.** Produce a bounded, evidence-linked context pack with project purpose, architecture signals, entry-point candidates, package/workspace layout, test/build commands, conventions, and known limitations. Never invent commands or infer unverified runtime behaviour.
3. **Expand deterministic checks.** Add dependency, test, CI, configuration, and documentation checks only where source evidence is available. Keep read-only defaults and bounded file access.
4. **Complete capability infrastructure.** Add provenance, compatibility validation, registry persistence, and safe composition. The current selector is in-memory and metadata-based only.
5. **Complete the trusted approval lifecycle.** The plan digest now binds repository and task routing fields, technology decisions, and policy version; runtime action rules now load from one canonical JSON catalogue referenced by `policy.yaml`. SQLite approval storage, Ed25519 signatures, expiry, authenticated-decision callbacks, rejection, revocation, and state-transition controls are now implemented. The Approval Store is now connected to a new Execution Gate. The gate revalidates plan digests, checks policy and live approval status per action, routes only to adapters that meet harness/capability contracts, requires an audit callback, and executes sequentially. Next integrate a real identity provider, protected key management, durable audit storage, and least-privilege adapters. Keep execution disabled until those integrations are tested.
6. **Improve Resource Registry evidence quality.** Add labelled deduplication benchmarks and review-consistency tests. The dedicated registry workflow now passes 12/12 tests; this does not validate semantic accuracy or production-scale performance.
7. **Improve resource and knowledge quality.** Review initial knowledge entries, improve hybrid resource selection, and add benchmarks.
8. **Review automated trending candidates.** Inspect each daily/weekly discovery PR, verify source/dependencies/security/license/project fit, and approve only reviewed resources.
9. **Complete distribution and repository maintenance.** Build safe updates for existing repositories, validate GitHub App runtime, review stale branches and Dependabot PRs, and verify owner-only protection settings.

The previous targeted audit remains relevant. Its P1 correctness and policy findings are blockers before real executor adapters. The README Demonstration Standard is included in bootstrap instructions and templates; new repositories must include a real demo artifact or a justified, runnable alternative.

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

| 2026-11-10 | `5d58845` | Daily/weekly trending discovery | Merged after Python tests, repository hygiene, continuity, secret-history scan, and CodeQL passed. Live discovery remains pending. |
| 2026-11-10 | `7223d57` | Consolidated dependency maintenance (PR #17) | Merged Actions checkout v7.0.1, setup-node v7.1.0, setup-python v7.1.0, and Probot ^14.3.7 after repository hygiene, all subsystem tests, CodeQL, and secret-history scan passed. External Kilo review could not run because the account lacked credits; CodeRabbit skipped review. |

Do not report checks as passed unless they ran and passed.

| 2026-11-10 | `3246000` | Shared Contract Tests | Passed: schema 6/6, problem 7/7, project intelligence 19/19, capability 9/9, knowledge 30/30 |
| 2026-11-10 | `3246000` | Repository hygiene and continuity diff | Passed: 155 files, zero errors, warnings, or notes; continuity diff passed |
| 2026-11-10 | `3246000` | Secret history scan | Passed |
| 2026-11-10 | `3246000` | CodeQL | Passed |

| 2026-11-10 | `56d2d5a` | GitHub bootstrap app tests | Failed: 6 passed, 1 failed; the new test over-matched the standard's warning text rather than an actual placeholder link |
| 2026-11-10 | `11cba99` | GitHub bootstrap app tests | Passed: 7/7 |
| 2026-11-10 | `11cba99` | Repository hygiene and continuity diff | Passed: 155 files, zero errors/warnings/notes; continuity diff passed |
| 2026-11-10 | `11cba99` | Secret history scan | Passed |
| 2026-11-10 | `11cba99` | CodeQL | Passed |
| 2026-11-10 | pending | Repo-scan ecosystem fixture and README runnable-example tests | Awaiting CI |

| 2026-11-10 | `013e056` | Project Intelligence tests | Failed: 22 passed, 1 failed; the runnable README command detector did not recognise the fenced CLI example. The labelled ecosystem corpus passed. |
| 2026-11-10 | pending | Corrected README command detector | Awaiting CI rerun |
| 2026-11-10 | `a55d779` | Trending discovery implementation | Added daily/weekly feeds, metadata filters, candidate catalog append, and unit tests |\n| 2026-11-10 | PR #16 | Trending discovery validation | Python compile, 5 unit tests, repository hygiene scan, continuity diff, secret history scan, and CodeQL passed |

| 2026-11-10 | `02b7a2f` | Project Intelligence tests | Failed: 22 passed, 1 failed; the new test fixture used literal `\\n` text instead of newline characters, so the README heading parser received one line. |
| 2026-11-10 | pending | Corrected README test fixture | Awaiting CI rerun |

| 2026-11-10 | `0587f93` | Project Intelligence tests | Failed: 22 passed, 1 failed; the generic H1 title `# Example` was misclassified as a demo section, so the installation command under H2 was counted. |
| 2026-11-10 | pending | Restrict README demo sections to H2 or deeper | Awaiting CI rerun |

| 2026-11-11 | `a28d9ae` | Resource Registry hardening | Pagination, bounded search, category/capability candidate blocking, CLI import correction, and approval-status preservation implemented. Regression tests and dedicated CI added; workflow result pending. |

| 2026-11-11 | `407679a` | Resource Registry tests | Failed: 11/12 passed. The remaining failure was a legacy test fixture with no shared tags; corrected in `012837e`. |
| 2026-11-11 | `012837e` | Resource Registry Tests | Passed: syntax check and 12/12 tests. |
| 2026-11-11 | `9272cc0` | Repository hygiene and continuity diff | Passed: hygiene tests, trending-discovery tests, continuity diff, and repository scan. Secret-history scan passed; CodeQL still running at this handoff update. |

| 2026-11-11 | `1d2b92e` | Policy Engine hardening | Canonical action rules moved to policy.rules.json; policy.yaml references it. Plan digest includes routing fields and technology decision. Latest orchestrator core CI passed 35/35 tests; orchestration quality, hygiene, continuity, and secret-history checks passed. CodeQL pending. |

| 2026-11-11 | `450f020` | Policy CI | First orchestrator run: 33/34 tests passed. One existing integration fixture used pending status; corrected to approved. Critical-risk mutation coverage expanded. Awaiting rerun. |

| 2026-11-11 | `89891a5` | Approval Store | First CI run exposed a DDL separator error. Fixed. Latest Orchestrator Core Tests passed 43/43; Orchestration quality, repository hygiene, and secret-history scan passed. CodeQL pending. |

| 2026-11-11 | `execution-gate` | Execution Gate | Initial run passed 57/57. Follow-up fixes normalise adapter IDs before duplicate checks and redact raw adapter exception text from audit events; rerun pending. |

## 8. Risks, known issues, and unknowns
- **Verified:** The initial shared contract layer defines six record types.
- **Verified:** The initial repo-scan is a bounded metadata scanner. It does not inspect source semantics, run tests, access the network, or prove security.
- **Verified:** The README demo standard is guidance; the repo-scan demo heuristic does not validate media quality or functionality.
- **Verified:** The capability selector filters and ranks metadata declarations only. It does not prove runtime compatibility or execute capabilities. It does not provide storage, cross-record integrity, capability discovery, execution, or approvals.
- **Verified:** The orchestrator does not launch or coordinate real agent processes.
- **Verified:** Policy Engine is not a complete execution security boundary.
- **Verified:** Harness adapters are not all validated against real harness versions.
- **Verified:** Continuity presence, structure, placeholder completion, review-date freshness, and changed-file update requirements are checked by CI. The diff check requires a new dated work-log entry; L2–L4 cannot disable the checks or lower governance in the same change set. Semantic accuracy remains an agent/human responsibility.
- **Verified audit findings (partly remediated in latest main commits):** Resource Registry CLI import, filter-before-pagination, metadata status preservation, bounded search, and deduplication workload limits have code changes and regression tests; dedicated CI passed 12/12 tests on 2026-11-11. Orchestration plan-digest coverage and duplicated action-rule definitions have code changes and regression tests; the orchestrator workflow is awaiting verification. Approval storage, authenticated identity, expiry/replay protection, and executor enforcement remain unimplemented.
- **Verified branch audit:** Six non-main branches are fully behind `main` with zero unique commits. Three squash-merged branches retain unique commit ancestry, but their changed content was checked against `main`: PR #17 dependency/workflow files match, PR #16 discovery code/tests/docs match and its workflow pins are older, and PR #5 technology-decision code matches while its schema/tests/docs on `main` contain later changes. All nine non-main branches are safe to delete; no branch-deletion action is available in the connected GitHub interface, so owner-side deletion remains.
- **Owner action:** Delete the nine audited non-main branches; verify branch protection, required status checks, GitHub App registration, deployment configuration, and repository visibility. Live GitHub metadata currently reports `public`, despite the earlier instruction that the repository had been made private.
- **Audit gap:** Documentation and agent instructions were reviewed. Core source, tests, manifests, workflows, GitHub App, and branch/PR state received a targeted static audit. Full package test execution, live webhook validation, dependency audit, and owner-only settings remain unverified.

## 9. Handoff metadata
- **Last reviewed:** 2026-11-11
- **Commit:** `9272cc021876686d59221549e97951b6afddba72` (verify current `main` HEAD before next task).
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
