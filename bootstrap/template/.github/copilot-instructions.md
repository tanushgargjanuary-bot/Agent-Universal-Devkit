# GitHub Copilot instructions

This repository uses Agent-Universal-Devkit.

1. Read `AGENTS.md` and `.agent-universal-devkit/config.yaml`.
2. Follow project-specific instructions and existing conventions.
3. Use only Devkit tools relevant to this project.
4. Check tool source, license, version, and permissions before use.
5. Do not install dependencies or run high-risk commands without approval.

Devkit: https://github.com/tanushgargjanuary-bot/Agent-Universal-Devkit

## README demonstrations

For every new repository and major user-facing feature, follow `docs/README-DEMO-STANDARD.md`. For short, visually demonstrable workflows, actively attempt the highest-quality suitable animated GIF from the real, running project. Use screenshots for static states, video for longer workflows, and a working interactive demo when useful. For CLI/API/library/data/infrastructure projects, add a real terminal recording, reproducible command/output, runnable example, request/response, notebook, plot, or architecture view. The README must contain a tangible, verified demo artifact or runnable alternative. Never fabricate behaviour or expose secrets. Record a reason and an alternative when a GIF or visual/interactive format is unsafe, infeasible, or a poor fit.

## Technology architecture

Do not assume Python or any other language is the default. Inspect the repository's purpose, existing stack, runtime, tests, deployment target, and constraints before selecting technology. Prefer the simplest coherent stack. Use multiple languages only when component boundaries and benefits are clear. Preserve existing architecture unless evidence justifies a change. Do not perform broad migrations without approval.

Full guidance: https://github.com/tanushgargjanuary-bot/Agent-Universal-Devkit/blob/main/docs/TECHNOLOGY-ARCHITECTURE-SELECTION.md
