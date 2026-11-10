# Agent-Universal-Devkit

A modular, vendor-neutral ecosystem for AI agents and the people who direct them. It connects engineering knowledge, resources, planning, controlled execution, and independent verification.

The long-term vision is broader than coding agents. A small universal core supports optional domain packs (software, AI/ML, cybersecurity, research, robotics, game development, and more) and integration packs (models, agent harnesses, MCP, tools, CI, and deployment). The default workflow stays simple. Advanced capabilities remain optional.

Read [Vision and Scope](docs/VISION-AND-SCOPE.md) and [Pack Model](docs/PACK-MODEL.md) before expanding the architecture.

The Devkit has **two equal priorities**:

1. **Resource Intelligence:** discover, evaluate, compare, and maintain excellent open-source resources.
2. **Agent Orchestration:** plan, route, coordinate, execute, and verify engineering work.

It also maintains a native **Engineering Knowledge & Methods Library**. This library contains original explanations of algorithms, mathematics, formulas, patterns, protocols, and engineering procedures. A local Knowledge Engine retrieves relevant material when task signals indicate it is useful.

## What it provides

- An evidence-backed resource catalog and automated discovery.
- Comparison of alternatives, including justified hybrid and custom approaches.
- Evidence-based language and technology architecture selection for every new repository.
- Hard filters for mandatory license, security, compatibility, platform, integration-cost, capability, and evidence-freshness requirements.
- Native engineering study material stored in the repository, not only external links.
- Context-triggered retrieval of algorithms and mathematical methods.
- Shared engineering knowledge, agent instructions, and harness adapters.
- A vendor-neutral orchestration foundation.

## Main systems

| Directory | Purpose |
|---|---|
| `catalog/` | Curated resources, tools, skills, and discovery candidates |
| `knowledge/` | Original algorithms, mathematics, and engineering methods |
| `core/knowledge-engine/` | Local, explainable knowledge retrieval |
| `core/resource-engine/` | Evidence-based resource comparison |
| `core/resource-registry/` | SQLite-backed resource storage, canonical identity, GitHub health sync, and deduplication review |
| `core/orchestrator/` | Task planning, dependency ordering, and safety gates |
| `agents/` | Instructions and harness adapters |
| `bootstrap/template/` | Small files installed in new repositories |
| `integrations/` | GitHub distribution and future protocol integrations |
| `schemas/` | Machine-readable contracts |
| `scripts/` | Discovery and maintenance automation |
| `docs/` | Product principles, vision, architecture, decisions, and roadmap |

## Important rules

- Popularity is a discovery signal, not proof of quality.
- Discovery candidates are not approved recommendations.
- Select methods and resources against actual requirements.
- Knowledge retrieval is a suggestion, not automatic execution.
- Every formula and algorithm must state assumptions and limitations.
- Do not copy third-party course notes or textbooks.
- Do not install or execute catalog entries automatically.
- Verify engineering outputs independently.

Read [Vision and Scope](docs/VISION-AND-SCOPE.md), [Technology Architecture Selection](docs/TECHNOLOGY-ARCHITECTURE-SELECTION.md), [Product Principles](docs/PRODUCT-PRINCIPLES.md), [Target Architecture](docs/TARGET-ARCHITECTURE.md), [Decision Engine](docs/DECISION-ENGINE.md), [Knowledge Library](docs/KNOWLEDGE-LIBRARY.md), [Resource Intelligence](docs/RESOURCE-INTELLIGENCE.md), [Pack Model](docs/PACK-MODEL.md), and [Roadmap](docs/ROADMAP.md).

## Current status

The resource comparison engine now applies mandatory hard constraints before weighted ranking. The knowledge engine has schema checks, content-bound approval metadata, GitHub-backed reviewer and commit verification, a two-pull-request approval procedure, a technical review checklist, and a labelled retrieval regression benchmark. These are early quality gates, not proof of complete correctness. Knowledge entries remain drafts and require technical review before production reliance. Required branch protection is documented but is not confirmed as enabled. The orchestrator does not yet run multi-agent workflows. The GitHub App is source code only and is not registered or deployed.

## Security

See [SECURITY.md](SECURITY.md) for vulnerability reporting, [the security policy](policies/SECURITY.md) for safe tool use, least privilege, and approval requirements, and the [public repository security audit](docs/SECURITY-AUDIT.md) for verified findings and remaining owner actions. Do not commit credentials, private keys, local environment files, or personal data.

## License

The Devkit's original code and documentation are licensed under MIT. Third-party resources retain their own licenses and terms.
