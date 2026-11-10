# Project AI Agent Instructions

This repository uses Agent-Universal-Devkit.

## Start here
1. Read `.agent-universal-devkit/config.yaml`.
2. Read this project's README and existing project-specific instructions.
3. Read `docs/PROJECT-STATE.md` and the latest relevant entries in `docs/WORKLOG.md`. If either file is missing, create it from the templates in the Devkit repository after inspecting the project.
4. Read `PROJECT-RUBRICS.md` before major planning, architecture, implementation, or review work.
5. Follow local project rules when they define project-specific behaviour.
6. Use the Devkit's shared rules and relevant tool guidance when they apply.

Devkit: https://github.com/tanushgargjanuary-bot/Agent-Universal-Devkit

Do not assume every AI harness reads this file. Use the native instruction file for the harness in use.

## Project intelligence and continuity

For substantial work, read and follow the canonical protocol:
https://github.com/tanushgargjanuary-bot/Agent-Universal-Devkit/blob/main/docs/PROJECT-INTELLIGENCE-AND-CONTINUITY.md

Maintain:
- `docs/PROJECT-STATE.md`: concise, verified current state and next actions.
- `docs/WORKLOG.md`: chronological record of meaningful completed or interrupted work.

Update both after implementation/configuration changes and before handoff. For documentation-only changes, append a work-log entry. CI checks these updates. Keep README, architecture, security, setup, API, test, and operations documentation aligned with actual changes. A replacement agent must be able to continue from repository contents without prior chat access. Verify recorded claims against source, tests, and Git state. Label assumptions and unknowns. Never store secrets.

For substantial plans, record outcome, requirements, scope, options, design, tasks, acceptance criteria, validation, risks, and recovery. Perform a devil's advocate review before implementation. Classify future ideas as Now, Next, Later, Explore, or Reject. Do not silently expand scope.

## Project-specific quality rubrics

Read `PROJECT-RUBRICS.md`, then load the canonical rubric at:
https://github.com/tanushgargjanuary-bot/Agent-Universal-Devkit/blob/main/rubrics/PROJECT-RUBRICS.md

Identify the primary and secondary project types. Apply the universal rubric plus only relevant domain rubrics. Create or maintain `docs/QUALITY-RUBRICS.md` with selected profiles, project-specific criteria, evidence, exceptions, and status. Do not claim a criterion passed without evidence. Do not apply every niche rubric to every project.

## Repository organisation and safety

Read `REPOSITORY-ORGANISATION.md`, then follow the canonical guide:
https://github.com/tanushgargjanuary-bot/Agent-Universal-Devkit/blob/main/docs/REPOSITORY-GOVERNANCE.md

Select a governance level based on actual risk. Keep files, tasks, decisions, tests, and documentation organised. Preserve existing conventions and user work. Review the full diff and working tree before finishing. Do not perform broad cleanup or destructive changes without approval.

At intake and before final review, run:
```bash
node .devkit/scripts/repository-hygiene/check.mjs
```
Review findings in context. The checker is read-only. It does not delete, rename, or move files. Do not change valid project structure only to silence a warning. See:
https://github.com/tanushgargjanuary-bot/Agent-Universal-Devkit/blob/main/docs/REPOSITORY-HYGIENE-CHECKER.md

## README demonstrations

For every new repository and major user-facing feature, follow the local `docs/README-DEMO-STANDARD.md` and the canonical Devkit standard at https://github.com/tanushgargjanuary-bot/Agent-Universal-Devkit/blob/main/docs/README-DEMO-STANDARD.md. For a short, visually demonstrable workflow, actively attempt to create the highest-quality suitable animated GIF from the real, running project. Use screenshots for static states, video for longer workflows, or a working interactive demo when interaction adds value. For CLI, API, library, data, and infrastructure projects, include a real terminal recording, reproducible command with representative output, runnable example, request/response, notebook, plot, or architecture view. Put at least one tangible, verified demonstration artifact or runnable alternative in the README. Capture actual working behaviour. Add alt text, a caption, and exact reproduction steps. Never fabricate features or expose secrets/private data. If a GIF or visual/interactive demo is unsafe, infeasible, or a poor fit, explain why and provide the best project-appropriate alternative. Do not leave placeholder assets or links.

## Tool and dependency safety

Before installing or running a suggested tool, check its source, license, version, permissions, and relevance to this project. Ask before changing dependencies or executing commands with broad access.

## Technology and language selection

Before designing a new system or adding a major component, inspect this repository's requirements and existing stack. Do not default to Python or any other language. Compare suitable languages and runtimes against workload, performance, security, platform, ecosystem, deployment, team skills, and maintenance needs.

Prefer one coherent stack. Use a hybrid only when each language has a clear component role, a stable interface, and a proven benefit. Preserve an established stack unless evidence justifies a change. Do not perform broad migrations without approval.

See the Devkit guide: https://github.com/tanushgargjanuary-bot/Agent-Universal-Devkit/blob/main/docs/TECHNOLOGY-ARCHITECTURE-SELECTION.md
