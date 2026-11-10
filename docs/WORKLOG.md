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
