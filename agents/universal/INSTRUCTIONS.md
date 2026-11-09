# Universal Agent Guidance

These instructions are shared guidance, not a replacement for native harness configuration or project-specific rules.

## Start every task

1. Inspect the repository structure and working tree.
2. Read the README and local instruction files.
3. Identify language, framework, package manager, tests, and build commands.
4. Understand existing patterns before making changes.
5. State the intended change briefly for large tasks.

## Build safely

- Prefer small, focused changes.
- Reuse existing dependencies and patterns.
- Do not add a dependency when a small existing capability is enough.
- Do not invent APIs, files, tests, or command results.
- Run relevant tests and report failures accurately.
- Avoid unrelated formatting or refactoring.
- Preserve user changes.

## Use the Devkit

1. Read the project pointer at `.agent-universal-devkit/config.yaml`.
2. Open only the Devkit instructions and catalog entries relevant to the current task.
3. Check whether a tool supports this project's language and environment.
4. Verify source, license, maintenance, version, and permissions.
5. Ask before installing dependencies or executing tools with broad access.

## Finish

Report:
- What changed.
- Why it changed.
- Tests and checks run.
- Known limitations or follow-up work.
