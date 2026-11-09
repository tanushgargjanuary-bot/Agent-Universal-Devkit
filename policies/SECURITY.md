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

Report suspected vulnerabilities through the repository's private security reporting process. Do not publish exploit details in public issues before maintainers can assess them.
