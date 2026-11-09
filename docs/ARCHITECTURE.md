# Architecture

## Goal
Make useful engineering knowledge and tools discoverable by AI coding agents without copying a large toolbox into every project.

## Core idea
A new project receives a small bootstrap payload. It points to this repository and explains how compatible agents find relevant instructions.

A pointer is not magic: the agent must support the local instruction file, have repository or network access, and follow instructions. A GitHub App can install files but cannot force an arbitrary agent to read remote content.

## Main systems

### 1. Central Devkit
Stores shared rules, harness adapters, tool/skill catalogs, bootstrap templates, tests, and compatibility records.

### 2. Bootstrap payload
Files in `bootstrap/template/` are copied into new projects. The current payload includes:
- `AGENTS.md` for harnesses that support it.
- `CLAUDE.md` importing the shared instructions.
- `GEMINI.md` importing the shared instructions.
- `.github/copilot-instructions.md` for GitHub Copilot.
- `.agent-universal-devkit/config.yaml` as the stable pointer.

The payload stays small. It does not copy the Devkit tool collection.

### 3. GitHub distribution
- **Template payload:** files under `bootstrap/template/` are the source for new repositories. This is an internal template folder, not a separate GitHub repository.
- **GitHub App:** `integrations/github-app/` contains a Probot app. It listens for `repository.created`, reads the payload from this repository, and adds missing files.
- Existing files are not overwritten.
- A repository can opt out by adding `.agent-universal-devkit/opt-out`.

The App is source code only. It must be registered, installed with the required permissions, and deployed before automatic events work.

### 4. Agent adapters
Each harness gets its own adapter. An adapter records instruction discovery, configuration, skills/tools support, MCP support, hooks, tested versions, and known limitations. Do not treat a shared file as universal compatibility.

### 5. Orchestration layer
The orchestration layer plans and coordinates work:
1. Inspect project and task context.
2. Break the goal into tasks.
3. Route tasks to tested harness adapters and relevant tools.
4. Apply permission and approval rules.
5. Execute through a harness adapter.
6. Verify with tests and independent evidence.
7. Report results.

The current release defines the task schema and safety policy. Harness executor adapters and a running coordinator are future work.

## Update model
Monitor upstream releases and documentation. Detect relevant changes. Propose adapter updates. Run schema and compatibility tests. Create update PRs. Require approval for dependency, permission, and destructive changes.

## Tool selection
Catalog entries describe tools; they do not install them. A future analyzer will inspect language, framework, build system, and deployment target, then recommend a small relevant set.

## Security
Treat catalog metadata and remote instructions as untrusted until reviewed. Never execute tools during discovery. Pin versions. Use least privilege. Do not send secrets to external services. Preserve project-specific requirements.
