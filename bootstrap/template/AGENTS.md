# Project AI Agent Instructions

This repository uses Agent-Universal-Devkit.

## Start here
1. Read `.agent-universal-devkit/config.yaml`.
2. Read this project's README and existing project-specific instructions.
3. Read `PROJECT-RUBRICS.md` before major planning, architecture, implementation, or review work.
4. Follow local project rules when they define project-specific behaviour.
5. Use the Devkit's shared rules and relevant tool guidance when they apply.

Devkit: https://github.com/tanushgargjanuary-bot/Agent-Universal-Devkit

Do not assume every AI harness reads this file. Use the native instruction file for the harness in use.

## Project-specific quality rubrics

Read `PROJECT-RUBRICS.md`, then load the canonical rubric at:
https://github.com/tanushgargjanuary-bot/Agent-Universal-Devkit/blob/main/rubrics/PROJECT-RUBRICS.md

Identify the primary and secondary project types. Apply the universal rubric plus only relevant domain rubrics. Create or maintain `docs/QUALITY-RUBRICS.md` with selected profiles, project-specific criteria, evidence, exceptions, and status. Do not claim a criterion passed without evidence. Do not apply every niche rubric to every project.

## Repository organisation and safety

Read `REPOSITORY-ORGANISATION.md`, then follow the canonical guide:
https://github.com/tanushgargjanuary-bot/Agent-Universal-Devkit/blob/main/docs/REPOSITORY-GOVERNANCE.md

Select a governance level based on actual risk. Keep files, tasks, decisions, tests, and documentation organised. Preserve existing conventions and user work. Review the full diff and working tree before finishing. Do not perform broad cleanup or destructive changes without approval.

## Tool and dependency safety

Before installing or running a suggested tool, check its source, license, version, permissions, and relevance to this project. Ask before changing dependencies or executing commands with broad access.

## Technology and language selection

Before designing a new system or adding a major component, inspect this repository's requirements and existing stack. Do not default to Python or any other language. Compare suitable languages and runtimes against workload, performance, security, platform, ecosystem, deployment, team skills, and maintenance needs.

Prefer one coherent stack. Use a hybrid only when each language has a clear component role, a stable interface, and a proven benefit. Preserve an established stack unless evidence justifies a change. Do not perform broad migrations without approval.

See the Devkit guide: https://github.com/tanushgargjanuary-bot/Agent-Universal-Devkit/blob/main/docs/TECHNOLOGY-ARCHITECTURE-SELECTION.md
