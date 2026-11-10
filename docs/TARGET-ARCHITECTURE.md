# Target Architecture

## Architectural objective

Build a small, domain-neutral core that supports many kinds of engineering and
technical problem-solving through optional domain and integration packs.
Resource Intelligence and Agent Orchestration remain equal priorities. The
native Knowledge Library supports both.

Do not translate every logical capability into a separate package, service,
agent, database, or process. Split only when reuse, independent testing,
deployment, scaling, or ownership justifies it.

## Logical lifecycle

1. **Experience:** receive a goal through CLI, library, API, desktop, web, or automation.
2. **Requirements:** define outcomes, constraints, assumptions, risks, and acceptance criteria.
3. **Intelligence:** discover relevant resources, knowledge, agents, skills, and tools.
4. **Evaluation:** verify evidence, apply hard constraints, compare options, and expose uncertainty.
5. **Solution design:** choose a single resource, a hybrid, a custom component, or abstain.
6. **Planning:** decompose the solution and map tasks to capabilities.
7. **Policy:** check identity, permissions, budgets, approvals, and execution boundaries.
8. **Execution:** use replaceable harness and tool adapters in an appropriate environment.
9. **Verification:** test outputs independently against acceptance criteria.
10. **Feedback:** record results, diagnose failures, and propose controlled improvements.

## Architecture layers

| Layer | Responsibility | Keep it simple |
|---|---|---|
| Experience | CLI, API, desktop, web, automation | Start with CLI/library; reuse contracts. |
| Core kernel | Contracts, task lifecycle, policy hooks, capability model | No domain-specific workflows or vendor lock-in. |
| Intelligence | Resource discovery, evaluation, knowledge retrieval, evidence | Start deterministic; add semantic methods only when measured. |
| Orchestration | Planning, dependency management, routing, execution state | Use one clear task model. |
| Adapters | Models, harnesses, MCP, tools, files, browsers, terminals, CI | Add one tested adapter at a time. |
| Domain packs | Specialist methods, knowledge, skills, workflows, tests | Optional and independently versioned. |
| Data and memory | Registry, knowledge records, event history, task artifacts | Use local files and SQLite first. |
| Verification and observability | Tests, evidence, traces, cost, outcomes | Collect only data needed to debug and improve. |

## Universal core contracts

Use versioned schemas for goals, requirements, constraints, acceptance criteria,
capabilities, agents, tools, resources, skills, domain packs, evidence,
provenance, evaluations, decisions, knowledge items, relationships, plans, task
states, permissions, execution requests, budgets, artifacts, verification
results, feedback, and audit events.

Keep facts, assessments, assumptions, decisions, and observed outcomes separate.
Every important assessment or relationship needs provenance, a checked date,
and confidence or evidence quality where applicable.

## Capability model

Describe what a component can do, not only which product it belongs to. A
capability record should state its stable ID and version, inputs and outputs,
supported operations, required permissions and data access, runtime and
platform requirements, cost and latency where known, evidence, tests,
limitations, and compatibility.

Task routing matches required capabilities and constraints. It must not select
an agent only because its name or model appears suitable.

## Packs

### Domain packs

A domain pack can contain specialist knowledge and methods, agent skills,
workflows, tool recommendations, schemas, templates, evaluation profiles,
verification tests, examples, and benchmark cases.

Initial candidate domains include software, AI/ML, data, cybersecurity,
infrastructure, mathematics and research, hardware and robotics, simulation
and game development, technical product operations, and design/accessibility.

### Integration packs

An integration pack connects an external provider or system through a
documented adapter. Examples include model APIs, coding-agent harnesses, MCP
servers, source control, issue trackers, browser automation, local execution,
databases, CI, and deployment.

Packs are optional. Each pack declares compatibility, permissions, setup,
versioning, support status, and removal behavior. No pack may silently widen
the core's permissions.

## Resource and knowledge architecture

Use the resource registry for canonical identities, metadata, status, evidence,
health history, and relationships. Use the resource engine for requirement-based
evaluation. Keep the native Knowledge Library separate from external links.

Represent relationships as explicit, versioned data first. Examples include
requires, alternative_to, complements, implements, compatible_with, and
conflicts_with. Do not infer verified relationships from co-occurrence. Add
graph indexes or graph databases only when real query needs justify them.

Start with SQLite for local structured state, versioned JSON/YAML/Markdown for
reviewable source-of-truth records, and filesystem/object storage for large
artifacts when needed. Distributed databases, vector stores, graph databases,
message buses, and hosted control planes are upgrade paths, not prerequisites.

## Interfaces and deployment

The same contracts should support local CLI/library use, headless CI,
desktop/web control surfaces, and hosted or self-managed services. Do not
implement every interface before a real user workflow requires it.

Keep user experience task-oriented:
1. State the goal.
2. Show the recommended plan and important trade-offs.
3. Ask for approval only when risk or policy requires it.
4. Show progress and meaningful decisions.
5. Present verified outputs and remaining limitations.

Advanced configuration should remain available without overwhelming the
default path.

## Trust and execution boundaries

- External content is untrusted data, never privileged instructions.
- Discovery does not imply approval.
- Retrieval does not imply permission to execute.
- Use least privilege, version pinning, isolation, and risk-based approvals.
- Keep secrets out of prompts, logs, and untrusted tools.
- High-risk actions require explicit approval and auditable evidence.
- An executor cannot approve its own high-risk action.
- Verification must be independent of the agent's completion statement.

## Evolution strategy

Build one complete vertical workflow at a time. Keep stable contracts small.
Extract a pack when multiple real workflows need the same specialist capability.
Add complexity only when benchmarks or operational evidence show that the simple
implementation is inadequate.
