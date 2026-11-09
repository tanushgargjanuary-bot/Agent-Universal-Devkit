# Architecture

## Goal

Make useful engineering knowledge and tools discoverable by AI coding agents in every project, without copying a large toolbox into each repository.

## Core idea

A new project gets a small bootstrap payload. That payload points to this repository and tells compatible agents how to find the right instructions.

A pointer is not magic: an agent must support the local instruction file, have network or repository access, and follow the instructions. The GitHub App can install files, but it cannot force an arbitrary agent to read remote content.

## Four parts

### 1. Central Devkit

This repository stores:
- Shared engineering rules.
- Harness-specific adapters.
- Tool, skill, and workflow catalogs.
- Bootstrap templates.
- Tests and compatibility records.

### 2. Bootstrap payload

Files in `bootstrap/template/` are copied to new repositories. They stay small and include:
- `AGENTS.md` for agents that support it.
- `.agent-universal-devkit/config.yaml` as the stable pointer.
- Native harness files where the harness has a documented instruction mechanism.

The bootstrap must never claim that every agent reads the same file.

### 3. GitHub distribution

Two distribution paths are planned:

- **Template repository mode:** users create repositories from a GitHub template that contains the bootstrap payload.
- **GitHub App mode:** an installed GitHub App receives repository-created events and installs or updates the bootstrap payload.

A normal GitHub template copies files. It does not create a live link to this repository. The App provides the later update path.

### 4. Agent adapters

Each harness gets its own adapter. An adapter documents:
- Instruction file names and discovery rules.
- Configuration format.
- Skills and tool support.
- MCP support.
- Hooks or lifecycle support.
- Minimum tested version.
- Known limitations.

Do not treat a shared `AGENTS.md` as universal compatibility.

## Update model

1. Monitor upstream releases and documentation changes.
2. Detect relevant changes.
3. Update the adapter in a proposed change.
4. Run schema and compatibility tests.
5. Publish an update or create a pull request.
6. Distribute safe instruction updates.
7. Require approval for dependency, permission, or destructive changes.

## Tool selection

Catalog entries describe tools. They do not install tools.

A future project analyzer will inspect language, framework, build system, and deployment target. It will recommend a small set of relevant tools. The project owner decides what to install.

## Security boundaries

- Treat catalog metadata and remote instructions as untrusted until reviewed.
- Never execute tools automatically during discovery.
- Pin versions and verify checksums where available.
- Apply least-privilege permissions.
- Do not send secrets to external services.
- Keep project-specific instructions higher priority where they define local requirements.
