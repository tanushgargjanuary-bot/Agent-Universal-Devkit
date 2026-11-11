# Product Principles

## Purpose

Agent-Universal-Devkit is a modular problem-solving ecosystem for agents and the people who direct them. It connects requirements, knowledge, resources, planning, policy decisions, controlled execution, and independent verification.

The product is the quality of the decision and result. Catalog size, agent count, and feature count are not success measures.

## Non-negotiable principles

1. **Problem first:** understand requirements and acceptance criteria before selecting tools or agents.
2. **Evidence first:** identify sources and uncertainty for important claims.
3. **Outcome driven:** choose methods by fit, not popularity.
4. **Modular:** use clear contracts and independent tests.
5. **Composable:** avoid one mandatory runtime.
6. **Verifiable:** an agent's completion claim is not proof.
7. **Secure by default:** treat external content and executable artefacts as untrusted.
8. **Controlled evolution:** protect policy, permissions, and trust roots.
9. **Cost aware:** include compute, API, license, integration, operation, and maintenance costs.
10. **Honest uncertainty:** allow abstention when evidence is insufficient.
11. **Portable:** avoid mandatory dependence on one vendor, model, harness, language, or deployment mode.
12. **Progressively simple:** keep the default path small.
13. **Domain extensible:** add specialist capability through optional packs.
14. **One problem front door:** users should be able to describe a supported problem in plain language; DEVKIT selects the workflow and capabilities.
15. **Shared lifecycle:** workflows reuse common problem, context, evidence, plan, action, verification, and memory contracts.
16. **Build the connective layer:** integrate mature specialist tools; build shared orchestration, evidence, policy, and verification where they add value.
17. **Graceful limits:** support human-led, agent-led, hybrid, and unsupported outcomes. Never force a problem into an unsafe or unsuitable automation path.

## Decision rules

- Apply hard requirements before weighted comparisons.
- Keep facts, assessments, assumptions, and decisions distinct.
- Do not turn missing evidence into a claim.
- Do not hide trade-offs in one score.
- Recommend a hybrid only when its benefits justify integration risks.
- Prefer the simplest approach that satisfies requirements.
- Record consequential decisions and rejected options.
- Use approval according to risk, not as a blanket requirement.
- Extend an existing capability before creating a competing subsystem.
- Keep domain-specific logic out of the core unless multiple domains need the same stable primitive.

## Unified problem-solving experience

DEVKIT should present one coherent entry point for supported problems. Named
features such as repo-scan, debugging, dependency analysis, security review,
and release readiness are workflows over reusable capabilities, not separate
products with disconnected state.

"All features in one place" means a common interface and shared lifecycle. It
does not mean one monolith or reimplementation of mature external tools. The
core stays small; specialist logic belongs in reusable capabilities and domain
packs. See [Unified Problem-Solving Model](UNIFIED-PROBLEM-SOLVING-MODEL.md).

## Product structure

- **Universal core:** requirements, evidence, knowledge retrieval, resource evaluation, planning, policy, execution contracts, verification, and feedback.
- **Domain packs:** specialist methods, knowledge, skills, workflows, tools, and benchmarks.
- **Integration packs:** adapters for models, agent harnesses, MCP, source control, browsers, terminals, storage, CI, and deployment.
- **Interfaces:** CLI, library, desktop, web, headless automation, and hosted modes may use the same contracts.

## Cross-repository product direction

DEVKIT Core is the reusable framework. DEVKIT Hub is the proposed configured control plane for an explicitly registered portfolio of repositories. Hub registration must not grant permissions. Every target requires its own access check, allowlist, policy decision, and approval. The Hub is not implemented yet; see `docs/CROSS-REPOSITORY-OPERATIONS.md`.

## Continuity and agent handoff

Repository-first handoff is a product requirement. Canonical state, work history, decisions, verification evidence, and next actions must survive a change of agent or chat session. An automated Context Exporter is a planned tool, not an existing capability; see `docs/CONTEXT-EXPORT-SPEC.md`.

## Two equal priorities

**Resource Intelligence** discovers, evaluates, relates, and maintains resources and knowledge.

**Agent Orchestration** plans, routes, coordinates, executes, and verifies work.

Neither priority is subordinate.

## Current product boundary

The repository has working foundations for resource evaluation, registry operations, knowledge retrieval, planning, technology assessment, and policy decisions.

The repository implements a deny-by-default Policy Engine, a SQLite Approval Store with Ed25519-signed approval records, expiry, revocation and one-time consumption, and an in-process Execution Gate with plan/dependency validation, adapter routing, and an audit callback. These are orchestration controls, not a complete production security boundary. A production identity provider, protected key lifecycle, durable tamper-evident audit backend, production adapters, OS/container isolation, and validated agent-harness execution remain incomplete. Pack installation, activation, dependency resolution, and safe removal are also future work. See `docs/PROJECT-STATE.md` and `docs/HOST-TRUST-INTEGRATION.md`.

## Non-goals

- Collecting every repository or paper.
- Maximising stars, integrations, or agent count.
- Automatically trusting, installing, or executing discovered resources.
- Replacing every existing agent framework.
- Claiming compatibility without tests.
- Building graph infrastructure, dashboards, or microservices without evidence.
- Allowing an agent to approve its own high-risk actions.
- Copying third-party textbooks, course notes, or proprietary material.

## Definition of success

The Devkit turns real goals into suitable plans and verified outputs. It explains decisions, controls risk and cost, and provides evidence that acceptance criteria are met.

Measure recommendation suitability, evidence coverage, execution outcomes, verification effectiveness, cost, maintenance burden, setup friction, and adaptability.
