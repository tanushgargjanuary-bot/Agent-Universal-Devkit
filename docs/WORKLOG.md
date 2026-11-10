# DEVKIT Project Work Log

Record meaningful work sessions so a different person or AI agent can continue without access to prior chats. Entries are factual. Do not log secrets or sensitive personal data. Do not rewrite old entries to conceal failures; add a correction entry instead.

## History

### 2026-11-10 — Add project intelligence and continuity protocol
- **Commit:** `2625ded2f2d160660f4173244a999fc4d2da1311`
- **Goal:** Make connected repositories recoverable across agent failures, context loss, and changes of AI environment. Add a robust planning protocol and future-scope discipline.
- **Changes:** Added `docs/PROJECT-INTELLIGENCE-AND-CONTINUITY.md`; added bootstrap templates for `docs/PROJECT-STATE.md` and `docs/WORKLOG.md`; updated root and bootstrap agent instructions, repository organisation guidance, README, CONTRIBUTING, and roadmap.
- **Verification:** Inspected the complete Git tree (115 files) and selected governance, bootstrap, subsystem, and workflow docs. GitHub commit and main ref update succeeded. Automated tests and CI were not run in this remote editing session.
- **Decisions:** Keep one concise project-state handoff record and one chronological work log. Link to canonical documentation rather than copying it. Require planning and devil's advocate review proportional to task risk. Classify future ideas separately from accepted scope.
- **Open risks / blockers:** Automated continuity-document presence and freshness checks are not implemented. Full DEVKIT repository audit is pending. Bootstrap installer behaviour must be checked before claiming templates are automatically installed.
- **Next action:** Complete the full DEVKIT audit, then implement and test continuity enforcement in the hygiene checker and bootstrap workflow.

### 2026-11-10 — Enforce continuity updates across code and documentation changes
- **Commits:** `26d1471`, `43afa67`
- **Goal:** Prevent meaningful project changes from being merged without a durable handoff update.
- **Changes:** Added a Git-diff continuity checker. Implementation/configuration changes require both project-state and work-log updates. Documentation-only changes require a work-log entry. L1 repositories receive warnings; L2–L4 receive errors. CI now runs the diff check for relevant project paths.
- **Verification:** Awaiting the GitHub Actions run for this commit. Do not treat the check as passed until the run completes.
- **Open risks / blockers:** Static checks cannot verify the quality or truth of a handoff entry. The bootstrap app is not deployed and does not update existing repositories.
- **Next action:** Verify CI, finish the DEVKIT audit, and prioritise the existing-repository update mechanism.

### 2026-11-10 — Require substantive continuity records
- **Commit:** `113bceadd5a15bf08fdbe93d8e3f63c65b7a1143`
- **Goal:** Prevent empty template fields or empty work-log edits from satisfying the continuity gate.
- **Changes:** Added project-state placeholder detection and required a new dated work-log entry for each meaningful code or documentation change.
- **Verification:** Awaiting GitHub Actions after correcting regex escaping in the checker implementation.
- **Open risks / blockers:** The checker still cannot prove that a work-log entry is accurate or that project-state content fully describes the implementation.
- **Next action:** Verify CI and complete the remaining DEVKIT audit.

### 2026-11-10 — Tighten work-log entry validation
- **Commit:** `072275ac3debc66e5fbf18620c46a66a828610f9`
- **Goal:** Ensure a documentation update contains a new dated work-log entry, not only a file touch.
- **Changes:** Added placeholder checks for unfilled project-state templates. The diff checker now compares work-log entries against the base commit and requires a new dated entry.
- **Verification:** Awaiting GitHub Actions.
- **Open risks / blockers:** The checker verifies structure and changed entries, not factual accuracy.
- **Next action:** Verify the new tests and finish the DEVKIT audit.

### 2026-11-10 — Correct continuity checker regex regression
- **Commit:** `75ba2e9c2bf2d13395d2d39aef8ef6d98ac95af7`
- **Goal:** Restore the canonical checker syntax after the first placeholder-check implementation escaped existing path expressions incorrectly.
- **Changes:** Reapplied the placeholder and work-log-entry checks on top of the last passing checker implementation without changing existing escape sequences.
- **Verification:** Awaiting GitHub Actions.
- **Open risks / blockers:** The new checks must pass in CI before they are considered active.
- **Next action:** Verify tests, then finish the DEVKIT audit.

### 2026-11-10 — Prevent continuity policy bypass
- **Commit:** `a81276314e720ea86fc84a91b9befa6ba055fd5d`
- **Goal:** Prevent L2–L4 repositories from disabling continuity checks or lowering governance level to bypass them.
- **Changes:** L2–L4 enforce continuity checks even if configuration attempts to disable them. The diff checker compares base and head governance levels and rejects downgrades. L1 opt-out remains available.
- **Verification:** Awaiting GitHub Actions.
- **Open risks / blockers:** The owner must protect governance configuration and review any L1 classification.
- **Next action:** Verify adversarial tests and finish the DEVKIT audit.

### 2026-11-10 — Complete targeted DEVKIT audit
- **Audited commit:** `a81276314e720ea86fc84a91b9befa6ba055fd5d`
- **Report:** `docs/DEVKIT-AUDIT-2026-11-10.md`
- **Scope:** All `docs/` Markdown files, root/bootstrap agent instructions, harness and subsystem READMEs, core engine source and tests, package manifests, schemas, CI workflows, GitHub App, registries, branches, PRs, issues, and repository metadata.
- **Findings:** Approval digest omits execution-relevant plan fields; policy YAML and JavaScript rules are separate sources; task schema and planner output disagree; Resource Registry CLI import path is wrong; registry upserts can reset status; list filters run after pagination; registry has no CI; hybrid search is incomplete; all nine knowledge entries are drafts; GitHub App is not deployed and cannot update existing repositories.
- **Verification:** Repository hygiene passed on `a812763` (124 files, 0 errors, 0 warnings, 0 notes); continuity diff enforcement passed; GitHub bootstrap tests passed; secret-history scan passed. CodeQL was still running. All core package suites were not run in this audit.
- **Owner actions:** Add GitHub About description and verify branch protection/rulesets. 
- **Next action:** Fix Resource Registry correctness and CI, then close orchestrator approval-contract gaps before building executor adapters.

### 2026-11-10 — Document continuity enforcement boundaries
- **Commit:** `7899c83ac467a7ced3d8ad949f657d8e2a6d5108`
- **Goal:** Make the governance-level restrictions explicit to repository owners and agents.
- **Changes:** Documented that L2–L4 cannot disable continuity checks or downgrade governance in the same change set. L1 opt-out remains available for genuine prototypes.
- **Verification:** Documentation-only update; continuity diff CI will verify a new work-log entry.
- **Next action:** Begin the first remediation phase from the audit report.

### 2026-11-10 — Reconcile continuity work-log references
- **Commit:** recorded in Git history with this entry.
- **Goal:** Replace temporary pending commit references after the related CI runs completed.
- **Changes:** Recorded the final commit identifiers for the continuity checker fixes, governance bypass protection, and governance documentation.
- **Verification:** Repository hygiene and secret-history workflows passed on the latest documentation commit.
- **Next action:** Start Resource Registry remediation from the audit report.

### 2026-11-10 — Capture exploratory broader product vision
- **Commit:** `6f67735ed6d2936636287813f7471a9da29bb62e`
- **Goal:** Preserve an expanded direction for repo-scan and adjacent developer capabilities without silently expanding the approved project scope.
- **Changes:** Added `notes/DEVKIT-BROADER-VISION-NOTES.md`. It frames repo-scan as the entry point to a Project Intelligence lifecycle: discover, understand, assess, explain, prioritise, plan, act, verify, remember, and monitor. It records candidate capability families, a shared project model, user workflows, safety requirements, possible sequencing, success measures, and a devil's-advocate review.
- **Status and boundary:** The note explicitly states that it is informal, non-professional, non-authoritative, for convenience only, and not an official project document or approved scope. Canonical vision, principles, architecture, and roadmap remain authoritative.
- **Verification:** Confirmed the note was created on `main`. No code or runtime behaviour changed; no test suite was run.
- **Decision:** Treat Project Intelligence as an exploratory umbrella direction and repo-scan as a possible first entry point. Do not promote candidate features into the roadmap without explicit review and a validated use case.
- **Next action:** When implementation is requested, inspect current code and define a narrow, evidence-backed repo-scan MVP before changing architecture or adding scanner breadth.

### 2026-11-10 — Define unified problem-solving workbench direction
- **Commits:** `03ba239`, `54bfb42`, `86a2da0`, `3084b20`, `56fda19`
- **Goal:** Define how DEVKIT can support a broad range of developer and technical problems through one coherent product experience, without becoming a monolith or a disconnected collection of utilities.
- **Changes:** Added `docs/UNIFIED-PROBLEM-SOLVING-MODEL.md` as a canonical strategy document. Updated Vision and Scope, Product Principles, Roadmap, and README to describe one user-facing problem-solving workbench, a shared lifecycle, reusable specialist capabilities, domain packs, integration adapters, and multiple interfaces over common contracts.
- **Decisions:** "All features in one place" means one entry point and shared problem lifecycle, not one giant implementation. Users describe outcomes; DEVKIT selects capabilities and existing tools. Workflows must share context, evidence, findings, plans, actions, verification, and memory contracts. Integrate mature tools instead of rebuilding them. Support human-led, agent-led, hybrid, and unsupported outcomes. Repo-scan is the first candidate workflow, not the whole product.
- **Scope boundary:** Broad domain support is a strategic direction, not a claim of current capability and not approval to build every listed feature immediately. The first proof must be a complete, narrow workflow from problem intake to independently verified outcome.
- **Verification:** Documentation changes were committed to `main` and are being checked by fetching the resulting files. No code or runtime behaviour changed; no test suite was run.
- **Open risks:** The shared contracts, capability discovery, project context layer, and end-to-end execution lifecycle are not yet implemented as a complete system. The current Policy Engine remains a decision core, not executor-side enforcement.
- **Next action:** Before implementing repo-scan breadth, design and validate the shared problem/evidence/finding/capability/plan/verification contracts, then prove one end-to-end repo-scan-to-verified-fix workflow.

### 2026-11-10 — Implement the first shared problem-contract foundation
- **Commit:** Recorded in Git history for this implementation change.
- **Goal:** Start the unified problem-solving workbench with reusable, versioned contracts instead of disconnected feature-specific data models.
- **Changes:** Added `core/schema-engine/` with a dependency-free validator for a documented JSON Schema subset. Added `core/problem-engine/` with versioned schemas and APIs for problem, evidence, finding, capability, plan, and verification records. Added semantic validation for plan step uniqueness, dependency references, self-dependencies, cycles, and verification outcome consistency. Preserved the Knowledge Engine's validator import through a compatibility re-export. Added package documentation, adversarial tests, and a dedicated GitHub Actions workflow. Updated architecture, README, roadmap, and project state.
- **Decisions:** Keep records versioned and reject unknown fields. A capability declaration is descriptive metadata, not permission to execute. A plan is not an approval. Verification summaries must agree with individual checks. Use a small supported schema subset and test every supported keyword rather than claiming full JSON Schema compliance.
- **Verification:** The shared-contract workflow is added and will run after this commit. Results are pending. No tests are claimed as passed until the workflow completes.
- **Limitations:** No persistent store, cross-record reference resolution, capability registry, capability selection, problem intake, execution adapter, approval lifecycle, or end-to-end workflow is implemented yet.
- **Next action:** Verify shared-contract CI. Then design the capability registry and selection contract, followed by read-only project discovery and the first repo-scan workflow.

### 2026-11-10 — Correct shared schema validation and contract test cases
- **Commit:** Pending Git history.
- **Trigger:** The first Shared Contract Tests workflow failed. Five schema-engine tests passed. One test showed that a JavaScript Date object passed the JSON Schema `object` type check. The Problem Engine and Knowledge Engine test steps were skipped because the workflow stopped after the first failure.
- **Changes:** Changed the schema engine's object type check to accept only plain JSON objects. Rewrote the problem-contract tests with explicit invalid-record fixtures and readable test cases. Added a check that completed verification steps must include evidence. Unrun checks remain exempt from that evidence requirement.
- **Verification:** The corrected workflow run is pending. The initial failure remains recorded; it is not hidden or overwritten.
- **Next action:** Confirm all three workflow test steps pass. Then proceed to capability registry and selection design.

### 2026-11-10 — Verify and harden the shared contract foundation
- **Commit:** `de0ea2625f188469b628053cfcb40ad1f8c05a7a`
- **Goal:** Correct the first CI failure and ensure shared records reject non-JSON object instances and unsupported verification claims.
- **Changes:** Restricted JSON Schema object values to plain objects. Rewrote problem-engine tests to cover invalid records, duplicate steps, missing/self dependencies, cycles, evidence requirements, and inconsistent verification summaries.
- **Verification:** Shared Contract Tests passed: schema engine 6/6, problem engine 7/7, knowledge engine 30/30. Repository hygiene passed: 142 files, zero errors, warnings, or notes. Continuity diff passed. Secret history scan passed. CodeQL was still running when this entry was prepared.
- **Decision:** Keep the schema validator's supported subset explicit. Do not claim full JSON Schema support.
- **Next action:** Build a deterministic capability selector that checks problem fit, explicit permissions, execution modes, active status, and verification support before a capability can be recommended.
