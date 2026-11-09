# Contributing

## Before adding a tool

Every tool entry must explain:
- What problem it solves.
- Which project types need it.
- Supported operating systems and runtimes.
- License and source repository.
- How it is installed or invoked.
- Security and permission risks.
- How its version and health are checked.

## Rules

- Prefer links and versioned integration instructions over vendoring third-party code.
- Do not copy third-party repositories into this repository unless there is a clear reason and license review.
- Keep agent-specific behavior in that harness's adapter directory.
- Add tests for catalog and bootstrap changes.
- Update the relevant documentation.
- Do not mark an integration as supported until it has been tested.

## Pull requests

Include the problem, the proposed change, validation performed, security impact, and compatibility impact.
