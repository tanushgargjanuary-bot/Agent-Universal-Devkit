# Project State and Agent Handoff

> Keep this file current. It is the first recovery document for a new human or AI agent.
> Replace every prompt below with project-specific facts. Link to canonical documents. Do not record secrets.

## 1. Project identity
- **Name:**
- **Purpose and user problem:**
- **Primary users:**
- **Intended outcome:**
- **Non-goals:**
- **Project status:** prototype / active / maintenance / paused / archived
- **Governance level:** L1 / L2 / L3 / L4 (see Devkit governance guide)

## 2. Current implementation truth
| Capability | Status (implemented/partial/experimental/planned/removed) | Evidence or source | Limitations |
|---|---|---|---|
| | | | |

Only mark a capability implemented when source and relevant tests support the claim.

## 3. Architecture map
| Component/path | Responsibility | Key interfaces/dependencies | Documentation |
|---|---|---|---|
| | | | |

Describe the main data flow and trust boundaries. Link to the architecture document.

## 4. Setup and operation
- **Required runtime/tool versions:**
- **Install/setup:**
- **Run:**
- **Test:**
- **Build/package:**
- **Deploy/release:**
- **Backup/restore or recovery:**
- **Environment variables/configuration:** list names only; never values or secrets.

## 5. Decisions and constraints
| Decision/constraint | Reason | Evidence / ADR / issue | Revisit when |
|---|---|---|---|
| | | | |

## 6. Active work
| Priority | Task | Status | Dependencies/blockers | Acceptance criteria | Issue/PR |
|---|---|---|---|---|---|
| | | | | | |

## 7. Verification record
| Date | Commit | Environment/version | Command/check | Result (pass/fail/skipped) | Notes |
|---|---|---|---|---|---|
| | | | | | |

Do not report a check as passed unless it ran and passed.

## 8. Risks, known issues, and unknowns
- **Verified risks/bugs:**
- **Assumptions:**
- **Unknowns requiring investigation:**
- **External services or owner-only actions:**
- **Security/data limitations:**

Label statements as Verified, Inferred, Assumed, Unknown, or Owner action where needed.

## 9. Next actions
1. [Action, reason, dependency, and completion condition]
2.
3.

## 10. Handoff metadata
- **Last reviewed:** YYYY-MM-DD
- **Commit:** full or short SHA
- **Updated by:** agent/tool label
- **Open worktree changes:** none / describe and identify owner
- **External state not represented in Git:** describe without secrets

## Recovery checklist for a replacement agent
- [ ] Read root agent instructions and this file.
- [ ] Read the latest relevant work-log entries.
- [ ] Verify branch, commit, and working tree.
- [ ] Confirm current implementation against source and tests.
- [ ] Identify uncommitted work and preserve it.
- [ ] Confirm the next action and any required human approval.
