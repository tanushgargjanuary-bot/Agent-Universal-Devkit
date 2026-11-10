# Product Principles

## Purpose

Agent-Universal-Devkit is a modular problem-solving ecosystem for agents and the
people who direct them. It connects requirements, knowledge, resources, tools,
agents, controlled execution, and independent verification.

The product is the quality of the decision and result. Catalog size, agent
count, and feature count are not success measures.

## Non-negotiable principles

1. **Problem first:** understand requirements, constraints, and acceptance criteria before selecting tools or agents.
2. **Evidence first:** important claims and recommendations identify their sources and uncertainty.
3. **Outcome driven:** choose methods by fit, not popularity or feature count.
4. **Modular:** components have clear contracts and can be tested independently.
5. **Composable:** components work together without requiring one large runtime.
6. **Verifiable:** an agent's completion claim is not proof. Verify outputs independently.
7. **Secure by default:** treat external content and executable artifacts as untrusted until reviewed.
8. **Controlled evolution:** critical policy, permissions, and trust roots require review.
9. **Cost aware:** include compute, API, licensing, integration, operation, and maintenance costs.
10. **Honest uncertainty:** allow abstention when evidence is insufficient.
11. **Portable:** avoid mandatory dependence on one model, vendor, harness, language, or deployment mode.
12. **Progressively simple:** keep the default path small; expose advanced controls only when needed.
13. **Domain extensible:** add specialist capability through optional packs, not by bloating the universal core.

## Decision rules

- Apply hard requirements and safety constraints before weighted comparisons.
- Keep facts, assessments, assumptions, and decisions distinct.
- Do not turn missing evidence into a negative fact or positive claim.
- Do not use one score to hide trade-offs.
- Recommend a hybrid only when it adds required value and its integration risks are justified.
- Consider a custom solution only after checking existing options and total ownership cost.
- Prefer the simplest approach that satisfies requirements.
- Record rejected options and meaningful reasons for consequential decisions.
- Use human approval according to risk, not as a blanket requirement for every action.
- Extend an existing capability before creating a competing subsystem.
- Keep domain-specific logic out of the core unless multiple domains need the same stable primitive.

## Product structure

**Universal core:** requirements, evidence, knowledge retrieval, resource evaluation,
planning, policy, execution contracts, verification, and feedback.

**Domain packs:** specialist knowledge, skills, workflows, tools, schemas, and
benchmarks for software, AI/ML, cybersecurity, research, robotics, game
development, and other validated domains.

**Integration packs:** adapters for models, agent harnesses, MCP, source control,
browsers, terminals, storage, CI, and deployment.

**Interfaces:** CLI, library, desktop, web, headless automation, and hosted modes
may use the same contracts. They are delivery choices, not separate products.

## Two equal product priorities

**Resource Intelligence** discovers, evaluates, relates, and maintains resources
and knowledge.

**Agent Orchestration** plans, routes, coordinates, executes, and verifies work.

The native Knowledge Library supports both. Neither priority is subordinate.

## Non-goals

- Collecting every repository or paper.
- Maximising stars, integrations, or agent count.
- Automatically trusting, installing, or executing discovered resources.
- Replacing every existing agent framework or coding harness.
- Claiming universal compatibility without tests.
- Building graph infrastructure, dashboards, or microservices without evidence.
- Allowing an agent to approve its own high-risk actions.
- Copying third-party textbooks, course notes, or proprietary material.

## Definition of success

The Devkit turns real goals into suitable plans and verified outputs. It explains
decisions, controls risk and cost, and provides evidence that acceptance criteria
are met.

Measure recommendation suitability, evidence coverage, execution outcomes,
verification effectiveness, cost, maintenance burden, setup friction, and
adaptability. Do not optimise one metric in isolation.
