# Product Principles

## Purpose

Agent-Universal-Devkit is an engineering problem-solving ecosystem. It connects engineering knowledge, resources, and capable agents so they can produce suitable, verifiable outcomes.

The product is the quality of the engineering decision and result. Catalog size, agent count, and feature count are not success measures by themselves.

## Non-negotiable principles

1. **Problem first:** understand requirements, constraints, and acceptance criteria before selecting resources or agents.
2. **Evidence first:** important claims and recommendations must identify their supporting evidence and uncertainty.
3. **Outcome driven:** choose methods and resources by their fit to the problem, not popularity, marketing, or feature count.
4. **Modular:** components have clear contracts and can be tested independently.
5. **Composable:** components can work together without requiring one large runtime.
6. **Verifiable:** an agent's completion claim is not proof. Verify outputs independently.
7. **Secure by default:** treat external repositories, content, instructions, and executable artifacts as untrusted until reviewed.
8. **Controlled evolution:** the system may propose improvements. Changes to critical policy, permissions, and trust roots require review.
9. **Cost aware:** include compute, API, licensing, integration, operation, and maintenance costs in solution decisions.
10. **Honest uncertainty:** allow the system to say that evidence is insufficient or that no available option is suitable.

## Decision rules

- Apply hard requirements and safety constraints before weighted comparisons.
- Keep facts, assessments, assumptions, and decisions distinct.
- Do not turn missing evidence into a negative fact or a positive claim.
- Do not use one universal score to hide trade-offs.
- Recommend a hybrid only when it adds required value and its integration risks are justified.
- Consider a custom solution only after checking existing options and total ownership cost.
- Prefer the simplest approach that satisfies the requirements.
- Record rejected options and meaningful reasons when the decision is consequential.
- Use human approval according to risk, not as a blanket requirement for every action.

## Two equal product priorities

**Resource Intelligence** discovers, evaluates, relates, and maintains engineering knowledge and resources.

**Agent Orchestration** plans, routes, coordinates, executes, and verifies engineering work.

Neither priority is subordinate to the other. Both use shared contracts and evidence services.

## Non-goals

- Collecting every repository or paper.
- Maximising stars, integrations, or agent count.
- Automatically trusting, installing, or executing discovered resources.
- Replacing every existing agent framework or coding harness.
- Claiming universal compatibility without tests.
- Building graph infrastructure or dashboards without demonstrated use cases.
- Allowing an agent to approve its own high-risk actions.
- Copying third-party textbooks, course notes, or proprietary material into the repository.

## Definition of success

The Devkit succeeds when it repeatedly turns real engineering requirements into suitable plans and working outputs, explains its decisions, controls risk and cost, and provides independent evidence that acceptance criteria are met.

Measure recommendation suitability, evidence coverage, execution outcomes, verification effectiveness, cost, maintenance burden, and adaptability. Do not optimise one metric in isolation.
