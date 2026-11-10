# Target Architecture

## Objective

Build a small, domain-neutral core for engineering problem-solving. Extend it through optional domain, integration, and interface packs. Resource Intelligence and Agent Orchestration remain equal priorities. The native Knowledge Library supports both.

Do not translate every capability into a separate service, agent, database, or process. Split only when reuse, independent testing, deployment, scaling, or ownership justifies it.

## Logical lifecycle

1. Receive a goal.
2. Define requirements, constraints, assumptions, risks, and acceptance criteria.
3. Discover resources, knowledge, agents, skills, and tools.
4. Verify evidence and apply hard constraints.
5. Design a solution and expose uncertainty.
6. Plan tasks and map them to capabilities.
7. Evaluate policy, permissions, budgets, and approval requirements.
8. Execute through least-privilege adapters.
9. Verify outputs independently.
10. Record results and diagnosed failures.

## Current implementation versus target

| Area | Current state |
|---|---|
| Resource Intelligence | Catalog, comparison engine, SQLite registry, GitHub metadata sync, and human-reviewed deduplication |
| Knowledge | Native library, registry validation, deterministic approved-only retrieval, and content-bound approval checks |
| Technology decisions | Opt-in assessment of supplied candidates and workload requirements |
| Orchestration | Task planning, dependency ordering, knowledge retrieval, and policy evaluation |
| Policy | Versioned action catalogue, deny-by-default unknown actions, scoped approval records, trusted verifier callback |
| Execution | No complete executor or agent-process control |
| Packs | Manifest and governance contract; no runtime installer or loader |
| Interfaces | Repository code and scripts; no complete user-facing control plane |
| GitHub App | Source code exists; not registered or deployed |

## Core contracts

Use versioned schemas for goals, requirements, constraints, acceptance criteria, capabilities, agents, tools, resources, evidence, provenance, evaluations, decisions, knowledge items, plans, task states, permissions, execution requests, budgets, artifacts, verification results, and audit events.

Keep facts, assessments, assumptions, decisions, and observed outcomes separate.

## Capability model

A capability record should state its stable ID and version, inputs and outputs, operations, permissions, data access, runtime and platform requirements, cost and latency where known, evidence, tests, limitations, and compatibility.

Route tasks by required capabilities and constraints. Do not select an agent only by its name or model.

## Packs

Domain packs contain specialist knowledge, skills, workflows, schemas, templates, evaluation profiles, tests, and benchmarks.

Integration packs connect providers and systems through documented adapters. They declare compatibility, permissions, setup, versioning, support status, and removal behaviour.

Packs are optional. No pack may silently widen global permissions. The current manifest schema is a contract, not an installer.

## Resource and knowledge architecture

Use the resource registry for canonical identities, metadata, status, evidence, health history, and relationships. Use the resource engine for requirement-based evaluation. Keep native knowledge separate from external links.

Start with SQLite, versioned JSON/YAML/Markdown, and filesystem storage. Add vector stores, graph databases, message buses, or hosted control planes only when measured needs justify them.

## Policy and execution boundary

Policy evaluation is not enforcement. The current Policy Engine does not authenticate people, manage approval lifecycle, prevent replay, execute actions, or enforce OS/container permissions.

A future executor must re-check policy immediately before every action, validate scoped approval through a trusted integration, enforce least privilege, and record auditable results. Do not describe the target architecture as implemented until these components exist and pass end-to-end tests.

## Trust rules

- External content is untrusted data, not privileged instruction.
- Discovery does not imply approval.
- Retrieval does not imply permission to execute.
- Use least privilege, version pinning, isolation, and risk-based approvals.
- Keep secrets out of prompts, logs, and untrusted tools.
- Verification must be independent of the agent's completion statement.

## Evolution strategy

Build one complete vertical workflow at a time. Extract stable contracts from repeated use. Add complexity only when benchmarks or operational evidence show that the simpler design is inadequate.
