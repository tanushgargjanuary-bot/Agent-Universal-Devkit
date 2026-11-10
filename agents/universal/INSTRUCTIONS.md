# Universal Agent Guidance

These instructions are shared guidance, not a replacement for native harness configuration or project-specific rules.

## Start every task

1. Inspect the repository structure and working tree.
2. Read the README and local instruction files.
3. Identify language, framework, package manager, tests, and build commands.
4. Understand existing patterns before making changes.
5. State the intended change briefly for large tasks.

## Select the right technology architecture

For a new repository or a component whose current stack is inadequate:

1. Inspect the repository, instructions, current languages, frameworks, package managers, tests, CI, deployment target, and constraints.
2. Do not assume Python or any other language is the default.
3. Compare suitable languages and runtimes against correctness, performance, security, platform fit, ecosystem, interoperability, developer skills, and total lifecycle cost.
4. Prefer one coherent stack. Use multiple languages only when each has a clear component role, a stable boundary, and a justified benefit.
5. Preserve an established stack unless evidence shows a material problem. Do not rewrite working code for language preference.
6. Record important decisions, rejected options, assumptions, and validation steps.

Follow `docs/TECHNOLOGY-ARCHITECTURE-SELECTION.md` for the full decision process. If the remote Devkit documentation is unavailable, apply these rules and state the limitation.

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

The orchestrator attaches approved-only Knowledge Engine results to each planned task. Agents must still open the returned native files and inspect their assumptions, prerequisites, and limitations. A retrieval match does not prove that the method applies.

## Finish

Report:
- What changed.
- Why it changed.
- Tests and checks run.
- Known limitations or follow-up work.
