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

## Product structure

- **Universal core:** requirements, evidence, knowledge retrieval, resource evaluation, planning, policy, execution contracts, verification, and feedback.
- **Domain packs:** specialist methods, knowledge, skills, workflows, tools, and benchmarks.
- **Integration packs:** adapters for models, agent harnesses, MCP, source control, browsers, terminals, storage, CI, and deployment.
- **Interfaces:** CLI, library, desktop, web, headless automation, and hosted modes may use the same contracts.

## Two equal priorities

**Resource Intelligence** discovers, evaluates, relates, and maintains resources and knowledge.

**Agent Orchestration** plans, routes, coordinates, executes, and verifies work.

Neither priority is subordinate.

## Current product boundary

The repository has working foundations for resource evaluation, registry operations, knowledge retrieval, planning, technology assessment, and policy decisions.

The Policy Engine is not an execution security boundary. Executor-side enforcement, trusted approval lifecycle, replay protection, audit records, and agent-harness execution remain future work. Pack runtime operations are also future work.

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
