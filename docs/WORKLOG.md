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
- **Commit:** pending
- **Goal:** Restore the canonical checker syntax after the first placeholder-check implementation escaped existing path expressions incorrectly.
- **Changes:** Reapplied the placeholder and work-log-entry checks on top of the last passing checker implementation without changing existing escape sequences.
- **Verification:** Awaiting GitHub Actions.
- **Open risks / blockers:** The new checks must pass in CI before they are considered active.
- **Next action:** Verify tests, then finish the DEVKIT audit.

### 2026-11-10 — Prevent continuity policy bypass
- **Commit:** pending
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
- **Commit:** pending
- **Goal:** Make the governance-level restrictions explicit to repository owners and agents.
- **Changes:** Documented that L2–L4 cannot disable continuity checks or downgrade governance in the same change set. L1 opt-out remains available for genuine prototypes.
- **Verification:** Documentation-only update; continuity diff CI will verify a new work-log entry.
- **Next action:** Begin the first remediation phase from the audit report.
