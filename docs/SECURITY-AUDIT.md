# Public Repository Security Audit

**Audit date:** 2026-11-10  
**Repository:** `tanushgargjanuary-bot/Agent-Universal-Devkit`  
**Visibility:** Public  
**Audited branch:** `main`  
**Audited commit:** `f97f6ae672c1f3eea21aabd52f11009d6445d131`

## Confirmed findings

### Branch protection is disabled

GitHub's branch metadata reports `protected: false`. The repository rulesets endpoint returns an empty list. No branch protection or ruleset is active on `main`.

This is a high-priority control gap. Configure rules for `main`:
- Require pull requests before merging.
- Require at least one approving review.
- Dismiss stale approvals or require approval of the latest push.
- Require conversation resolution.
- Require the relevant quality and CodeQL checks.
- Block force pushes and branch deletion.
- Restrict direct pushes.

Do not treat a passing workflow as a substitute for branch protection.

### Commit author email is exposed

Commit metadata in the public Git history contains the configured author email. This is not an authentication secret, but it is personal contact information.

For future commits:
1. Enable **Keep my email addresses private** in GitHub account email settings.
2. Configure Git to use the account's GitHub `noreply` address.
3. Check the author email before pushing.

Changing the account setting does not rewrite existing commits. Removing old email metadata requires a planned history rewrite. This changes commit IDs and can disrupt branches, pull requests, forks, and clones. Do not rewrite history without a coordinated recovery plan.

### Public code search

The connected GitHub code search returned no matches in the indexed default-branch code for these common indicators:
- PEM private-key headers.
- Common GitHub personal access token prefixes.
- AWS access-key prefixes.
- Google API-key prefixes.
- Slack token prefixes.
- npm token prefixes.
- `client_secret` markers.

This is a narrow search. It is not proof that the repository contains no secrets.

## Controls added

- Root `.gitignore` for common local secret, key, environment, database, log, and build artifacts.
- Public vulnerability reporting guidance in `SECURITY.md`.
- Dependabot updates for the Node.js projects and GitHub Actions.
- Full commit-SHA pins for the GitHub Actions used by repository workflows.
- `persist-credentials: false` for checkout steps. The discovery workflow uses a one-command Git HTTP authorization header for its required branch push.
- CodeQL workflow for JavaScript and Python on main pushes, pull requests, and a weekly schedule.
- Full-history Gitleaks workflow. It checks out complete Git history, verifies the Gitleaks release archive against a pinned SHA-256 digest, and scans available Git refs with redacted output.
- Public commit metadata guidance in `policies/SECURITY.md`.

## Verification status

- Repository visibility and default branch: confirmed through GitHub API.
- Audited `main` commit: `f97f6ae672c1f3eea21aabd52f11009d6445d131`.
- Branch protection: confirmed disabled.
- Repository rulesets: none returned.
- Common secret-pattern code search: no matches in indexed current-branch code.
- **Gitleaks full-history scan:** passed on the audited commit. Run ID: `42762646945`. All job steps completed successfully. No Gitleaks finding was reported.
- **CodeQL:** the JavaScript and Python analysis workflow completed successfully. Run ID: `42762577119`. Initialization and analysis steps completed. This workflow result alone does not establish that the alert inbox is empty. The connected integration could not retrieve the code-scanning alert endpoint for independent alert review.
- **Secret-scanning alerts:** the connected GitHub integration could not read the alert endpoint. The repository owner must inspect **Settings → Security → Code security and analysis** and the **Security** tab.
- **Dependabot:** the current open-PR query returned no open pull requests. This does not prove that Dependabot is enabled or that all dependencies are current.
- Full historical secret scan: Gitleaks scanned the available Git history and refs successfully. This is strong evidence, not a guarantee that every secret type or unreachable Git object was detected.

## Owner actions

1. Enable secret scanning and push protection where available. Review existing alerts.
2. Configure branch protection or a ruleset on `main`.
3. Review the CodeQL alert inbox in GitHub, even though the workflow completed successfully.
4. Set the GitHub `noreply` email for future commits.
5. Review future Gitleaks results. Investigate any finding and rotate exposed credentials before considering history cleanup.
6. Keep Dependabot enabled and review update pull requests individually. Do not merge major updates solely because they are available.

## Scope limitation

This document records observed evidence and explicit gaps. It is not a certification, penetration test, or proof of security. Re-run the checks after material repository, permission, workflow, or dependency changes.
