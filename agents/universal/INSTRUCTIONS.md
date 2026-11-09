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

## Use native engineering knowledge when relevant

1. For tasks involving algorithms, data structures, mathematics, statistics, optimisation, security methods, protocols, or engineering procedures, inspect `knowledge/registry.json`.
2. Match the task's actual requirements and concepts against item activation metadata. Retrieve only relevant items.
3. Use approved items for engineering decisions. Draft and review items are not validated guidance.
4. Read prerequisites, assumptions, limitations, and related items before applying a method.
5. Verify important equations, complexity claims, algorithm guarantees, and edge cases independently.
6. Treat retrieval as a suggestion. It does not authorise code execution or prove that a method fits the task.
7. If the library has no suitable approved item, proceed with independently verified methods. Do not force an irrelevant match.

The current local Knowledge Engine is a deterministic retrieval component. It is not yet integrated into the orchestration runtime.

## Finish

Report:
- What changed.
- Why it changed.
- Tests and checks run.
- Known limitations or follow-up work.
