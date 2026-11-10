# Contributing

## Before changing the repository

1. Read `AGENTS.md`, `README.md`, and the relevant subsystem documentation.
2. Inspect the current implementation and tests.
3. Identify the problem, scope, acceptance criteria, and risks.
4. Check whether an existing capability can be extended instead of duplicated.

## Before adding a resource or tool

Every entry must explain:
- What problem it solves.
- Which project types need it.
- Supported operating systems and runtimes.
- License and source repository.
- Installation or invocation method.
- Security, data, and permission risks.
- How version and health are checked.
- Evidence and known limitations.

Do not install or execute a candidate during discovery.

## Engineering rules

- Prefer links and versioned integration instructions over vendoring third-party code.
- Review license obligations before copying code or content.
- Keep harness-specific behaviour in its adapter directory.
- Add tests for behaviour changes and important edge cases.
- Validate schemas, configuration, and scripts where applicable.
- Update affected documentation and the roadmap.
- Do not mark an integration as supported until it has been tested against a recorded version.
- Do not claim policy enforcement until an executor enforces the decision at the action boundary.
- Preserve existing conventions. Avoid unrelated formatting and broad refactoring.

## Pull requests

Include:
- Problem and intended outcome.
- Scope and important design decisions.
- Tests and checks actually run.
- Security and permission impact.
- Compatibility impact.
- Known limitations and follow-up work.

Keep changes focused and reviewable. Never include secrets, private keys, local environment files, or personal data.
