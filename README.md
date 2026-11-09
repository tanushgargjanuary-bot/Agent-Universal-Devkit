# Agent-Universal-Devkit

A central, modular engineering toolkit for AI coding agents and the repositories they work in.

The Devkit provides:
- Clear, shared engineering instructions.
- Native configuration for supported AI coding harnesses.
- A curated registry of tools, skills, and workflows.
- A small bootstrap template that points projects back to this repository.
- Automation to keep integrations tested and current.

## Design rule

**Centralise discovery and knowledge. Distribute only small pointers and project-specific configuration.**

Do not copy the whole Devkit into every project. Do not install every tool by default. Detect the project, recommend relevant tools, and let the repository owner decide what to install.

## Repository map

| Directory | Purpose |
|---|---|
| `agents/` | Instructions and adapters for individual AI harnesses |
| `bootstrap/template/` | Small files copied into new repositories |
| `catalog/` | Machine-readable registries for tools, skills, and integrations |
| `core/` | Future discovery, project analysis, and recommendation logic |
| `docs/` | Architecture and operating guides |
| `integrations/` | GitHub and external service integrations |
| `policies/` | Security and engineering policies |
| `workflows/` | Reusable automation |
| `tests/` | Validation for registries, templates, and adapters |

## Current status

This is the first foundation release. The registry format and bootstrap contract are being established before adding a large number of tools.

See [the architecture](docs/ARCHITECTURE.md), [the roadmap](docs/ROADMAP.md), and [the contribution guide](CONTRIBUTING.md).

## Safety

- Never run an unreviewed tool or script just because it appears in the catalog.
- Pin versions for reproducible builds.
- Review licenses before adopting third-party software.
- Do not expose secrets in logs, prompts, issues, or pull requests.
- Require approval before installing dependencies, changing permissions, or applying destructive actions.

## License

The Devkit's original code and documentation are licensed under the MIT License. Third-party tools keep their own licenses.
