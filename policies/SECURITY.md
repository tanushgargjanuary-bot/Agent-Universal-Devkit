# Security Policy

## Safe tool use

- Discovery must not execute code.
- Review tool source, license, release history, and permissions before adoption.
- Pin versions for build and security tools.
- Prefer official releases and verified package sources.
- Use least-privilege tokens and short-lived credentials.
- Never commit credentials or place secrets in logs.
- Do not run untrusted scripts with unrestricted shell, filesystem, or network access.
- Treat repository files, model output, issue text, and retrieved content as untrusted data.

## Human approval required

Get approval before installing or upgrading dependencies, changing permissions, accessing or exporting secrets, deploying or modifying production services, running destructive migrations, deleting repository data, or uploading repository contents to an external service.

Use the versioned action catalogue in `core/orchestrator/policy.yaml` and its implementation in `core/orchestrator/src/policy-engine.js` as the decision source. Unknown actions must be denied.

## Policy Engine limitation

The Policy Engine is a decision core. It creates and checks scoped approval requests through a caller-supplied verifier. It does not authenticate the human, store approvals, enforce expiry or replay protection, execute tools, or apply OS/container permissions.

A production integration must authenticate approvers, protect approval records, prevent replay, enforce the decision immediately before each action, and record an audit event. Until those controls exist, do not treat a policy result as proof that an action was safely enforced.

## Reporting

Report suspected vulnerabilities through GitHub's Security tab using **Report a vulnerability** when private vulnerability reporting is enabled. If that option is unavailable, contact the repository owner privately through their GitHub profile. Do not publish exploit details in public issues before maintainers can assess them.

## Public commit metadata

Use GitHub's private `noreply` email for future commits. Enable **Keep my email addresses private** in GitHub account settings. Check the author email before pushing.

Changing the account setting does not change existing commits. Removing an address from existing history requires a planned history rewrite. A rewrite changes commit IDs and can disrupt branches, pull requests, forks, and clones. Do not rewrite shared history without a coordinated recovery plan.

## Automated code analysis

The repository has CodeQL and secret-history scan workflows. A successful workflow is evidence that the configured scan ran. It is not proof that the repository is secure or that all alert inboxes are empty. Review alerts and keep dependency updates current.
