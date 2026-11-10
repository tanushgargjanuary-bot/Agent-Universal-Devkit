# Public Repository Security Audit

**Last recorded audit:** 2026-11-10  
**Repository:** `tanushgargjanuary-bot/Agent-Universal-Devkit`  
**Visibility:** Public  
**Branch audited:** `main`  
**Audit commit:** `f97f6ae672c1f3eea21aabd52f11009d6445d131`

## Audit status

This is a historical evidence record. It does not describe a fresh security audit of the current `main` head. Re-run the checks after material workflow, permission, dependency, or repository changes. Do not use old scan results as current assurance.

## Policy Engine hardening — 2026-11-11

A code-level hardening pass was committed after the historical audit:

- Runtime action rules now load from core/orchestrator/policy.rules.json.
- core/orchestrator/policy.yaml references that canonical file and no longer duplicates action lists or risk permission tables.
- Policy version is part of the plan digest.
- Plan digest coverage includes repository identity/default branch/languages/frameworks, technology decision, task context, dependencies, capabilities, preferred harness, tools, and action targets.
- Object keys and set-like arrays are canonicalised before hashing.
- Approval records must have an explicit approved status and pass a trusted verifier.
- Malformed approval collections fail closed.

This is a source-level change, not a complete security boundary. It does not add authenticated approval storage, expiry, replay protection, executor-side enforcement, or OS/container isolation. The orchestrator core workflow passed 35/35 tests on commit `b14bb0b`; orchestration quality, repository hygiene, continuity checks, and secret-history scan also passed. CodeQL was still running at the time of the record. This section does not replace a fresh security audit.

## Findings recorded in the audit

### Branch protection was disabled

At the recorded audit commit, GitHub branch metadata reported `protected: false`, and the rulesets endpoint returned an empty list.

Owner action:
- Require pull requests before merging.
- Require at least one approving review.
- Dismiss stale approvals or require approval of the latest push.
- Require conversation resolution and relevant status checks.
- Block force pushes and branch deletion.
- Restrict direct pushes.

This finding must be rechecked against current repository settings.

### Commit author email was exposed

The recorded public Git history contained the configured author email. This is personal contact information, not an authentication secret.

Owner action:
1. Enable GitHub's private email setting.
2. Configure Git to use the account's GitHub `noreply` address.
3. Check author metadata before pushing.

Changing the account setting does not rewrite existing commits. A history rewrite changes commit IDs and can disrupt branches, pull requests, forks, and clones. Do not rewrite shared history without a coordinated recovery plan.

### Secret-pattern search was limited

The recorded indexed code search found no matches for several common token and private-key patterns. This was a narrow search, not proof that the repository contained no secrets.

## Controls recorded as added

- Root `.gitignore` for common local secret, key, environment, database, log, and build artefacts.
- Vulnerability reporting guidance.
- Dependabot configuration.
- Full commit-SHA pins for GitHub Actions used by repository workflows.
- `persist-credentials: false` for checkout steps where configured.
- CodeQL workflow for JavaScript and Python.
- Full-history Gitleaks workflow with pinned release verification and redacted output.

The presence of a workflow does not prove that it passed on the current commit.

## Historical verification evidence

The prior audit recorded:
- Gitleaks full-history scan passed on commit `f97f6ae672c1f3eea21aabd52f11009d6445d131`, run ID `42762646945`.
- CodeQL analysis completed successfully on that audited snapshot, run ID `42762577119`.
- The integration could not independently retrieve code-scanning alert details.
- The integration could not independently retrieve secret-scanning alert details.
- Branch protection was disabled at that time.

These results are historical. Check the current Actions runs and GitHub Security tab before making current claims.

## Owner actions

1. Recheck and configure branch protection or a ruleset on `main`.
2. Enable secret scanning and push protection where available. Review alerts.
3. Review current CodeQL alerts in GitHub.
4. Use the GitHub `noreply` email for future commits.
5. Review current Gitleaks results and rotate any exposed credential before considering history cleanup.
6. Keep Dependabot enabled and review updates individually.

## Scope limitation

This document is not a certification, penetration test, or proof of security. A passing automated scan covers only the configured rules and scanned content. Independent review remains necessary.


## Approval Store verification — 2026-11-11

- The new Approval Store test suite and existing orchestrator suite passed 43/43 tests on commit `89891a5`.
- Orchestration quality, repository hygiene, continuity checks, and secret-history scan passed.
- The store signs approvals with Ed25519, binds them to exact plan/action scope, enforces expiry, prevents repeat transitions, and checks current persisted status so revocation invalidates stale approval objects.
- Production authentication and private-key provisioning/rotation remain host responsibilities. The store is not an executor sandbox and does not prevent adapters from bypassing policy unless they are wired through an enforcement gate.
- CodeQL was still running when this record was written.
