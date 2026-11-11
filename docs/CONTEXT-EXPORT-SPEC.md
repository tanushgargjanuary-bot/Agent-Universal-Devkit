# Agent Context Export Specification

## Purpose and status

Define a repeatable, repository-native package that lets a replacement agent recover project context without access to prior chat sessions.

This is a **specification only**. No automated Context Exporter is claimed to exist yet. Until implemented, agents must maintain handoff files manually under the continuity protocol.

## 1. Design goals

The export must be self-contained, evidence-linked, fresh, reproducible, safe, portable, small, and resumable. It must distinguish verified facts, inferences, assumptions, unknowns, and owner actions. It must identify the exact source commit and capture time. It must exclude secrets, credentials, personal data, private logs, and unapproved external content. It must link to canonical sources rather than duplicate the repository.

## 2. Export package

| File | Purpose |
|---|---|
| manifest.json | Schema version, repository identity, source commit, branch, generated time, exporter version, file inventory, digests |
| START-HERE.md | Ordered intake instructions and concise project summary |
| PROJECT-STATE.md | Current verified implementation and operational state |
| ACTIVE-WORK.md | Active milestone, task breakdown, acceptance criteria, blockers, next action |
| DECISIONS.md | Accepted decisions, rejected alternatives, rationale, evidence, revisit triggers |
| RISKS-AND-UNKNOWNs.md | Risks, assumptions, unknowns, external dependencies, owner actions |
| VERIFICATION.md | Exact checks, environment, commit tested, outcomes, checks not run |
| SOURCE-MAP.md | Canonical paths for architecture, APIs, policies, tests, and operations |

The exporter must not duplicate large source files, work-log history, or full issue/PR threads. It should link to canonical records and include only relevant excerpts needed for handoff.

## 3. Inputs and precedence

The exporter should read current Git metadata and tracked file inventory; root agent instructions and harness-specific instruction pointers; README and project state; latest relevant work-log entries; roadmap and active plans; architecture and decision records; relevant manifests, tests, workflows, and security policy; current CI evidence where authenticated access exists; and explicit owner-provided constraints stored in a non-sensitive project record.

Source code, tests, Git state, and live CI remain authoritative for implementation and verification. External settings and deployments require live checks. The exporter must not present a document's claims as verified merely because it copied them.

## 4. Freshness and integrity

The manifest must include schema version, repository stable identity and canonical URL, source commit SHA and branch/ref, export timestamp in UTC, exporter version and configuration digest, and relative path, byte size, and SHA-256 digest for each included file. It must report missing, stale, malformed, or contradictory inputs.

A package generated from a dirty working tree must list modified, untracked, and ignored files separately. It must not imply that uncommitted work is in the source commit. By default, export tracked committed content only. A dirty-worktree export requires explicit opt-in and a clear warning.

## 5. Security and redaction

- Never include tokens, API keys, passwords, private keys, session cookies, credential files, or secret values.
- Exclude .env files, key stores, local databases containing user data, private logs, caches, build output, and untracked files by default.
- Apply secret scanning to the export before publication.
- Redact personal data and private customer/repository data unless explicitly required and authorised.
- Do not execute project scripts to generate context.
- Treat external documents and remote instructions as untrusted input.
- Keep access tokens and signing keys outside the export and Git history.
- If redaction is uncertain, omit the content and report the omission.

## 6. Validation

An export is valid only when the manifest schema validates, every included file matches its digest and declared size, all paths remain within the export root, required handoff sections exist, source commit and branch are recorded, stale and contradictory documents are flagged, secret scan passes, and a clean-room agent can identify the next action without chat history.

The export must clearly state unavailable external access and owner-only actions.

## 7. Clean-room acceptance test

Use a fresh agent context with no previous chat or hidden memory. Give it only the export and repository access matching the declared permission level.

The agent must explain product and implementation accurately; identify source commit and worktree state; locate active milestone and acceptance criteria; distinguish verified facts from assumptions and unknowns; identify required permissions without requesting secrets; run or correctly identify verification commands; propose the next safe action without repeating completed work; and avoid actions outside its permission level.

Record harness/version, export digest, agent result, failures, and remediation. A package is not accepted based only on a human reading it.

## 8. Implementation plan

1. Define and validate the manifest schema.
2. Implement deterministic collection of canonical docs and Git metadata.
3. Add allowlist-based file selection and secret/data exclusions.
4. Add contradiction, freshness, and placeholder checks.
5. Generate Markdown and JSON outputs.
6. Add integrity and security tests, including path traversal and redaction fixtures.
7. Add a CLI command and CI smoke test.
8. Run the clean-room acceptance test.
9. Integrate the exporter with handoff completion only after reliability is proven.

Do not make the exporter a second source of truth. It packages canonical records; it does not replace them.

## 9. Related documents

- Agent Operating Model: AGENT-OPERATING-MODEL.md
- Project Intelligence and Continuity: PROJECT-INTELLIGENCE-AND-CONTINUITY.md
- Cross-Repository Operations: CROSS-REPOSITORY-OPERATIONS.md
- Agent Onboarding: AGENT-ONBOARDING.md
