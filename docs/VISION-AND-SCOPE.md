# Vision and Scope

## Vision

Agent-Universal-Devkit is a modular, vendor-neutral operating system for capable
AI agents and the people who direct them. It helps turn complex goals into
well-reasoned plans, suitable tools and knowledge, controlled execution, and
verified outcomes.

The long-term scope is broader than coding agents. The same foundations should
support technical research, software and systems engineering, AI/ML, data work,
cybersecurity, hardware and robotics, simulation and game development, and
other domains where work can be decomposed, supported by evidence, executed
through tools, and checked against clear outcomes.

The Devkit should use existing agents, models, tools, services, skills, datasets,
and workflows. It should not require one model provider, agent harness,
programming language, runtime, or deployment style.

## The central idea

**One small core. Many optional capabilities.**

The core manages goals, requirements, constraints, acceptance criteria,
knowledge and resource discovery, evidence, evaluation, planning, routing,
policy, permissions, budgets, execution adapters, verification, and feedback.

Domain packs add specialist knowledge, skills, workflows, tools, schemas,
benchmarks, and verification methods. Users enable only the packs needed.

## Scope model

### Universal core

The core remains domain-neutral. It owns stable contracts and lifecycle rules,
not every specialist implementation.

### Domain packs

Initial and possible domains include software engineering, AI/ML, data
engineering, cybersecurity, systems and cloud, mathematics and research,
hardware and robotics, simulation and game development, technical product
operations, design systems, accessibility, and user experience.

This is an extensible list, not a commitment to build every domain now. A pack
must solve a real use case and pass quality, safety, and maintenance checks.

### Integration packs

Integration packs connect the core to agent harnesses, model providers, MCP
servers, source control, issue trackers, browsers, terminals, filesystems,
isolated execution environments, databases, CI, deployment, and observability.

### Delivery modes

The same contracts should support local CLI and library use, desktop and web
control surfaces, headless automation and CI, and hosted or self-managed
services. Do not build every delivery mode at once.

## How broad scope stays simple

1. **Progressive disclosure:** expose a small default workflow; reveal advanced controls only when needed.
2. **Capability packs:** enable only what a task needs.
3. **One registry:** describe tools, skills, knowledge, agents, datasets, and integrations through shared metadata contracts.
4. **One task lifecycle:** plan, approve, execute, verify, and record outcomes consistently.
5. **Replaceable adapters:** isolate vendor-specific APIs and harness behavior.
6. **Risk-based controls:** routine low-risk actions stay simple; sensitive actions receive stronger controls.
7. **Evidence-backed defaults:** recommend a sensible path, explain why, and allow override.
8. **No mandatory platform:** avoid requiring graph databases, vector databases, message brokers, or hosted control planes without evidence.

## What the Devkit is not

- Not a new foundation model or replacement for all agent harnesses.
- Not a giant bundle of every open-source repository.
- Not an automatic installer or executor of discovered code.
- Not a universal autonomous agent that claims to solve every domain.
- Not a microservice for every capability.
- Not a plugin marketplace without quality, compatibility, and security controls.
- Not a dashboard-first product.

## Product boundaries

Every feature must answer: which user problem does it solve; which core or pack
owns it; what is the smallest useful interface; what evidence proves it works;
what are its security, cost, and maintenance implications; and can an existing
capability be extended instead of duplicated?

If a capability has no validated use case, keep it as a proposal.

## Success measures

Measure time to a correct, verified outcome, plan quality, evidence coverage,
verification effectiveness, reuse across domains and harnesses, setup friction,
cost, latency, security incidents, maintenance burden, and duplicate capability
count. Do not optimise repository count, abstraction count, or feature count.

## Evolution strategy

Build vertically. Complete one real workflow from input to verified outcome.
Extract stable contracts from repeated use. Add a domain pack when real use cases
show that a capability should be reusable.

Keep the core small and strict. Let the ecosystem grow around it.
