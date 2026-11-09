# Agent-Universal-Devkit

A central, modular engineering toolkit for AI coding agents and the repositories they work in.

The Devkit provides:
- Shared engineering instructions and native harness entry points.
- A curated registry of tools, skills, and workflows.
- A small bootstrap payload for new repositories.
- A GitHub App that can distribute the bootstrap payload on repository creation.
- An orchestration core for planning, routing, approval checks, and verification.

## Design rule

**Centralise discovery and knowledge. Distribute only small pointers and project-specific configuration.**

Do not copy the whole Devkit into every project. Do not install every tool by default. Recommend tools based on project needs.

## Main systems

| Directory | Purpose |
|---|---|
| `agents/` | Instructions and adapters for AI harnesses |
| `bootstrap/template/` | Small files installed in new repositories |
| `catalog/` | Machine-readable tool, skill, and harness registries |
| `core/orchestrator/` | Task planning, dependency ordering, and safety gates |
| `integrations/github-app/` | GitHub App bootstrap webhook handler |
| `policies/` | Security and engineering policies |
| `docs/` | Architecture and roadmap |

## Current status

The first bootstrap webhook handler and orchestration core are in place. The GitHub App is not yet registered or deployed. Harness execution adapters are not yet implemented.

Read [Architecture](docs/ARCHITECTURE.md), [Roadmap](docs/ROADMAP.md), and [Contributing](CONTRIBUTING.md).

## Safety

- Never run an unreviewed tool just because it appears in the catalog.
- Pin versions for reproducible builds.
- Review licenses before adopting third-party software.
- Do not expose secrets in logs, prompts, issues, or pull requests.
- Require approval before installing dependencies, changing permissions, or applying destructive actions.

## License

The Devkit's original code and documentation are licensed under the MIT License. Third-party tools keep their own licenses.
