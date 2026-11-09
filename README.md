# Agent-Universal-Devkit

A central engineering ecosystem for AI agents and the repositories they work on.

The Devkit has **two equal priorities**:

1. **Resource Intelligence:** discover, evaluate, compare, and maintain excellent open-source resources.
2. **Agent Orchestration:** plan, route, coordinate, execute, and verify engineering work.

It also maintains a native **Engineering Knowledge & Methods Library**. This library contains original explanations of algorithms, mathematics, formulas, patterns, protocols, and engineering procedures. A local Knowledge Engine retrieves relevant material when task signals indicate it is useful.

## What it provides

- An evidence-backed resource catalog and automated discovery.
- Comparison of alternatives, including justified hybrid and custom approaches.
- Native engineering study material stored in the repository, not only external links.
- Context-triggered retrieval of algorithms and mathematical methods.
- Shared engineering knowledge, agent instructions, and harness adapters.
- A vendor-neutral orchestration foundation.

## Main systems

| Directory | Purpose |
|---|---|
| `catalog/` | Approved resources, tools, skills, and discovery candidates |
| `knowledge/` | Original algorithms, mathematics, and engineering methods |
| `core/knowledge-engine/` | Local, explainable knowledge retrieval |
| `core/resource-engine/` | Evidence-based resource comparison |
| `core/orchestrator/` | Task planning, dependency ordering, and safety gates |
| `agents/` | Instructions and harness adapters |
| `bootstrap/template/` | Small files installed in new repositories |
| `integrations/` | GitHub distribution and future protocol integrations |
| `schemas/` | Machine-readable contracts |
| `scripts/` | Discovery and maintenance automation |
| `docs/` | Product principles, architecture, decisions, and roadmap |

## Important rules

- Popularity is a discovery signal, not proof of quality.
- Discovery candidates are not approved recommendations.
- Select methods and resources against actual requirements.
- Knowledge retrieval is a suggestion, not automatic execution.
- Every formula and algorithm must state assumptions and limitations.
- Do not copy third-party course notes or textbooks.
- Do not install or execute catalog entries automatically.
- Verify engineering outputs independently.

Read [Product Principles](docs/PRODUCT-PRINCIPLES.md), [Target Architecture](docs/TARGET-ARCHITECTURE.md), [Decision Engine](docs/DECISION-ENGINE.md), [Knowledge Library](docs/KNOWLEDGE-LIBRARY.md), [Resource Intelligence](docs/RESOURCE-INTELLIGENCE.md), and [Roadmap](docs/ROADMAP.md).

## Current status

The resource comparison engine, scheduled GitHub discovery, initial orchestration planning core, and first local knowledge retrieval engine are initial implementations. Knowledge entries are drafts and require technical review before production reliance. The orchestrator does not yet run multi-agent workflows. The GitHub App is source code only and is not registered or deployed.

## License

The Devkit's original code and documentation are licensed under MIT. Third-party resources retain their own licenses and terms.
