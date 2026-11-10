# Security Policy

## Safe tool use

- Discovery must not execute code.
- Review tool source, license, release history, and permissions before adoption.
- Pin versions for build and security tools.
- Prefer official releases and verified package sources.
- Use least-privilege tokens and short-lived credentials.
- Never commit credentials or place secrets in logs.
- Do not run untrusted scripts with unrestricted shell, filesystem, or network access.

## Human approval required

Get approval before:
- Installing or upgrading dependencies.
- Changing GitHub App permissions.
- Deploying or modifying production services.
- Running destructive commands or migrations.
- Uploading repository contents to external services.

## Reporting

Report suspected vulnerabilities through GitHub's Security tab using **Report a vulnerability** when private vulnerability reporting is enabled. If that option is unavailable, contact the repository owner privately through their GitHub profile. Do not publish exploit details in public issues before maintainers can assess them.

## Public commit metadata

- Use GitHub's private `noreply` email for Git commits.
- Enable **Keep my email addresses private** in GitHub account email settings.
- Check the author email before pushing commits.
- Changing the account setting does not change existing commits. Removing an address from existing history requires a planned history rewrite. A rewrite changes commit IDs and can disrupt branches, pull requests, forks, and clones. Do not rewrite shared history without a coordinated recovery plan.

## Automated code analysis

The CodeQL workflow scans JavaScript and Python on pushes to `main`, pull requests, and a weekly schedule. A clean scan does not prove that the repository is secure. Review alerts and keep dependency updates current.
