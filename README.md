# Agent-Universal-Devkit

A central engineering ecosystem for AI agents and the repositories they work on.

The Devkit has **two equal priorities**:

1. **Resource Intelligence:** discover, evaluate, compare, and maintain excellent open-source repositories, tools, libraries, frameworks, and reusable engineering resources.
2. **Agent Orchestration:** help AI agents plan, route, coordinate, execute, and verify engineering work.

## What it provides

- A curated, evidence-backed open-source resource catalog.
- Automated GitHub discovery for new and growing projects.
- Comparison of similar tools, including justified hybrid recommendations.
- Shared engineering knowledge, instructions, and harness adapters.
- A general orchestration core that is not tied to one model or vendor.
- A small bootstrap payload and optional GitHub App distribution.

## Main systems

| Directory | Purpose |
|---|---|
| `catalog/` | Approved resources, tools, skills, and discovery candidates |
| `core/resource-engine/` | Evidence-based resource comparison and hybrid suggestions |
| `core/orchestrator/` | Task planning, dependency ordering, and safety gates |
| `agents/` | Instructions and harness adapters |
| `bootstrap/template/` | Small files installed in new repositories |
| `integrations/` | GitHub distribution and future protocol integrations |
| `knowledge/` | Engineering guides and reference material |
| `evaluations/` | Quality and compatibility evaluations |
| `docs/` | Architecture, resource intelligence, and roadmap |

## Important rules

- Popularity is a discovery signal, not proof of quality.
- Discovery candidates are not approved recommendations.
- Compare alternatives against the actual project requirements.
- Suggest a hybrid only when it adds real capability without unjustified complexity.
- Do not install or execute catalog entries automatically.
- Keep the resource ecosystem useful even when the orchestrator is not running.
- Keep orchestration useful even when no curated resource is suitable.

Read [Architecture](docs/ARCHITECTURE.md), [Resource Intelligence](docs/RESOURCE-INTELLIGENCE.md), and [Roadmap](docs/ROADMAP.md).

## Current status

The resource comparison engine and scheduled discovery workflow are initial implementations.
The discovery workflow proposes candidate updates for review; it does not approve resources.
The orchestrator is still a planning and safety core, not yet a multi-agent execution service.
The GitHub App is source code only and is not registered or deployed.

## License

The Devkit's original code and documentation are licensed under MIT. Third-party
resources retain their own licenses and terms.
