# Unified Problem-Solving Model

## Status

**Product direction:** accepted as a strategic direction for future design.  
**Implementation status:** not implemented as an end-to-end system.  
**Scope rule:** this document defines the intended product model. It does not approve every capability listed here for immediate development.

## 1. Product direction

DEVKIT should become one flexible place where a person or an existing AI agent can bring a problem, understand it, choose a suitable method and resources, perform controlled work, and verify the outcome.

The product should cover a broad range of problems, not only repository scanning or code generation. Initial domains may include:

- Software and systems engineering.
- Debugging, testing, reliability, and maintenance.
- Security and infrastructure.
- Data engineering, analytics, and AI/ML.
- Technical research and knowledge work.
- Hardware, robotics, simulation, and game development.
- Technical operations, documentation, and project workflows.

The domain list is extensible. It is not a promise that DEVKIT can solve every possible problem. A domain is supported only when its methods, tools, safety controls, and verification paths are sufficiently defined and tested.

**The product promise:** one entry point, one coherent workflow, many replaceable capabilities.

## 2. One place does not mean one giant tool

A single monolithic application that reimplements every scanner, debugger, test framework, agent, editor, and deployment platform would be brittle and impossible to maintain.

The closest practical model is a **unified problem-solving workbench**:

- One user-facing entry point.
- One shared problem and project context model.
- One lifecycle for planning, approval, execution, verification, and memory.
- Many specialist capabilities that can be enabled, replaced, or integrated.
- Existing tools and agents remain usable through adapters.

Users should not need to know which internal engine solves a problem. They state the desired outcome. DEVKIT selects and coordinates the suitable capabilities, explains its choices, and asks for missing information only when it matters.

The same capability may be reused by multiple workflows. For example, dependency intelligence can support repo-scan, security review, migration planning, and release readiness. It should exist once as a reusable capability, not as four separate implementations.

## 3. The universal problem lifecycle

Every supported problem should use the same high-level lifecycle:

1. **Intake** — capture the user's goal, desired outcome, constraints, and urgency.
2. **Clarify** — identify missing information and ask only essential questions.
3. **Understand** — inspect relevant project, files, tools, history, and external context within granted access.
4. **Classify** — identify the problem domain, task type, risk, and likely specialist capabilities.
5. **Research** — gather evidence, methods, resources, and competing explanations.
6. **Plan** — define steps, dependencies, acceptance criteria, cost, and recovery options.
7. **Approve** — obtain scoped approval for actions that need it.
8. **Execute** — use a human, an existing agent, an integrated tool, or a tested DEVKIT executor.
9. **Verify** — compare results with acceptance criteria using independent evidence.
10. **Explain** — report what happened, what changed, what remains uncertain, and why.
11. **Remember** — preserve decisions, results, unresolved work, and useful context.
12. **Improve** — use outcomes and feedback to improve future plans and capability selection.

Not every request needs every stage. A simple question may need only intake and research. A production migration needs the full lifecycle. The orchestrator should select the smallest safe workflow that can achieve the requested outcome.

## 4. Shared contracts: the foundation of flexibility

Capabilities must interoperate through versioned contracts. They must not depend on hidden assumptions about one agent, model, repository layout, or UI.

### Core records

- **Problem:** goal, domain hints, constraints, urgency, requested outcome, and user permissions.
- **Context:** project profile, relevant files, environment, history, and user-provided material.
- **Evidence:** source, timestamp, tool/version, scope, reliability, and reproducibility details.
- **Finding:** observation, evidence, impact, severity, confidence, status, and suggested next step.
- **Capability:** supported inputs, outputs, domains, tools, permissions, cost profile, and limitations.
- **Plan:** steps, dependencies, acceptance criteria, risk, required capabilities, and recovery path.
- **Action:** exact operation, target, permissions, parameters, and approval requirements.
- **Approval:** authenticated approver, scope, expiry, policy version, and replay-safe identity.
- **Execution:** actor, environment, inputs, outputs, logs, and resource use.
- **Verification:** acceptance criteria, checks, evidence, result, and remaining uncertainty.
- **Decision:** selected and rejected options, rationale, assumptions, and revisit conditions.
- **Memory event:** durable facts, decisions, outcomes, and unresolved work with provenance.

Use schemas and compatibility tests before choosing complex infrastructure. Do not add a graph database, vector database, message broker, or hosted control plane without measured need.

## 5. Capability architecture

### A. Universal core

The core should own only the primitives that multiple domains need:

- Problem intake and requirements.
- Context and evidence handling.
- Capability discovery and selection.
- Resource and knowledge retrieval.
- Planning and dependency management.
- Policy and approval contracts.
- Execution lifecycle and audit records.
- Verification and acceptance criteria.
- Project memory, continuity, and feedback.
- Cost, time, and risk controls.

The core must not contain every specialist algorithm or scanner.

### B. Specialist capabilities

Examples include:

- Repository and architecture analysis.
- Code navigation and change-impact analysis.
- Debugging and root-cause investigation.
- Test quality and test generation.
- Security and supply-chain review.
- Dependency and migration analysis.
- Environment and CI diagnosis.
- Performance and reliability investigation.
- Documentation and project-memory maintenance.
- Data analysis and ML experiment review.
- Research synthesis and technical method selection.
- Release and operational readiness.

Each capability must declare what it can and cannot do. A capability should be reusable in several workflows.

### C. Domain packs

Domain packs group specialist methods, knowledge, workflows, schemas, benchmarks, and verification procedures. Examples may include software engineering, cybersecurity, AI/ML, data, research, robotics, and simulation.

A pack must be optional, versioned, compatible, auditable, and safely removable. It must not weaken core policy.

### D. Integration adapters

Integrations connect existing tools rather than replacing them:

- AI agents and harnesses.
- Model providers.
- MCP servers.
- Git providers and issue trackers.
- Editors and development environments.
- Browsers, terminals, and filesystems.
- Build systems, test runners, CI, and deployment.
- Databases, observability, and cloud services.

An integration is not trusted merely because it is installed. Its permissions, version, input handling, and behaviour must be tested.

### E. User interfaces

The same workflows should be available through a small set of interfaces over time:

- CLI and local library.
- MCP interface for existing AI agents.
- GitHub integration for repository work.
- Web or desktop workbench for project overview and longer workflows.
- Headless API for automation and CI.

Do not build all interfaces at once. Start with the interfaces that validate a complete workflow.

## 6. One front door, not a list of products

The user-facing experience should begin with a plain-language request, not a catalogue of engine names.

Example:

> "This project is slow, the tests fail sometimes, and I do not know where to start. Find the main causes and give me a safe plan."

DEVKIT should then:

1. Inspect the project within granted access.
2. Separate observed facts from hypotheses.
3. Identify likely performance and test-reliability work.
4. Select the relevant capabilities and tools.
5. Produce a ranked set of findings with evidence.
6. Ask for approval before actions that require it.
7. Execute or hand off the approved work.
8. Verify the changes.
9. Record the outcome and remaining work.

A user may still invoke a specialist capability directly, such as `repo-scan`, `debug`, or `dependency-doctor`. These are named workflows over shared capabilities, not isolated products with separate state models.

## 7. Where repo-scan fits

Repo-scan is the first candidate workflow for the unified model. It should:

- Discover project structure and supported ecosystems.
- Reuse common evidence and finding contracts.
- Run relevant, safe, project-aware checks.
- Explain coverage and unsupported areas.
- Create prioritised findings.
- Feed findings into planning, debugging, security review, test intelligence, and project memory.

Repo-scan must not become the owner of all project intelligence. It is a workflow and a set of reusable inspection capabilities.

## 8. Flexibility and capability selection

DEVKIT should choose capabilities from declared metadata and task requirements, not from hard-coded feature names alone.

Selection should consider:

- Problem type and expected output.
- Required inputs and available context.
- Capability compatibility and version.
- Evidence quality and benchmark results.
- Permissions and security posture.
- Runtime and environment constraints.
- Cost, latency, and resource limits.
- Verification support.
- User preference and ability to override.

The system must support these outcomes:

- One suitable capability.
- A sequence of capabilities.
- A justified combination of capabilities.
- An existing external tool or agent.
- A human-led recommendation.
- No safe or suitable capability found.

It must be able to say **"not supported"** or **"insufficient evidence"**. It must not force every problem into an automated workflow.

## 9. Safety and trust model

Broad capability increases risk. The trust model must be consistent across domains.

- Default to read-only inspection.
- Treat project files, remote content, model output, and tool output as untrusted.
- Do not run scripts, install packages, access secrets, or make network changes without scoped permission.
- Keep sensitive data local unless the user explicitly approves external processing.
- Enforce policy immediately before an action, not only when a plan is created.
- Bind approvals to the exact plan, action, target, parameters, and policy version.
- Use authenticated identity, expiry, and replay protection for approvals.
- Isolate untrusted execution.
- Keep tamper-evident audit records for consequential actions.
- Verify outcomes independently.
- Preserve rollback and recovery paths where possible.
- Report incomplete coverage and uncertainty.
- Never equate a clean scan or passing test suite with proof of total safety or correctness.

The current DEVKIT Policy Engine is only a decision core. The controls above are target requirements, not claims about the current implementation.

## 10. Build versus integrate

DEVKIT should not recreate mature tools without a clear advantage.

**Build** shared context, capability contracts, orchestration, evidence correlation, policy lifecycle, verification coordination, and continuity where these solve cross-tool problems.

**Integrate** specialist linters, scanners, debuggers, test runners, profilers, model providers, agent harnesses, and cloud services when they are mature and suitable.

**Extend** an existing DEVKIT subsystem when it already owns the problem. Avoid duplicate engines with overlapping responsibilities.

A capability should be built only when integration is insufficient, the missing behaviour is strategically important, and maintenance cost is justified.

## 11. Delivery strategy

Do not attempt to implement every domain or feature at once. Prove the universal lifecycle with a small number of real workflows.

### Stage 1 — Shared problem model and project intelligence
- Define versioned problem, evidence, finding, capability, plan, and verification contracts.
- Establish safe project discovery and context assembly.
- Build repo-scan as the first workflow.
- Produce actionable, evidence-backed reports.
- Support export and handoff to existing agents.

### Stage 2 — Findings become work
- Convert findings into bounded plans.
- Add acceptance criteria and change-impact analysis.
- Connect plans to existing tests and CI.
- Record decisions, changes, and verification.
- Demonstrate one complete find-to-fix-to-verify loop.

### Stage 3 — Reusable developer workflows
- Add debugging, dependency, environment, test, security, documentation, and PR workflows.
- Reuse shared capabilities and project state.
- Integrate mature external tools instead of rewriting them.

### Stage 4 — Safe execution and agent interoperability
- Close plan digest, policy source, and schema gaps identified in the repository audit.
- Implement trusted approvals, replay protection, executor-side policy enforcement, isolation, audit, and recovery.
- Validate selected agent and MCP adapters end to end.

### Stage 5 — More domains and interfaces
- Add domain packs based on validated use cases.
- Support data, AI/ML, research, security, robotics, and other domains through real workflows.
- Add web/desktop interfaces when the shared workflow contracts are stable.
- Expand continuous monitoring and project history.

Stages may overlap only when dependencies and safety gates are met. The order is not permission to skip foundational controls.

## 12. Success measures

Measure whether DEVKIT helps users finish work, not how many features it contains:

- Time from problem intake to a useful, verified outcome.
- Correctness and completeness of problem classification.
- Evidence coverage and reproducibility.
- False-positive and false-negative rates.
- Plan quality and acceptance-criteria coverage.
- Verification effectiveness and regression rate.
- Successful reuse of capabilities across workflows.
- Number of duplicated implementations avoided.
- Setup friction and compatibility across environments.
- Cost and latency per useful outcome.
- Safe-action and approval failure rates.
- Recovery success after agent or environment interruption.
- User ability to understand and override decisions.

## 13. Risks and constraints

| Risk | Consequence | Design response |
|---|---|---|
| "Solve everything" scope | Unbounded complexity and weak quality | Support broad domains through bounded, tested capabilities |
| Monolithic core | Slow changes and fragile dependencies | Small core, versioned contracts, optional packs |
| Feature sprawl | Many disconnected tools and duplicated state | One lifecycle, shared records, capability reuse |
| False confidence | Users trust weak or fabricated findings | Evidence provenance, confidence, abstention, benchmarks |
| Unsafe autonomy | Damage, data loss, or disclosure | Read-only default, policy at execution, isolation, approval |
| Integration fragility | Provider and tool changes break workflows | Versioned adapters, compatibility tests, fallbacks |
| Cost explosion | Deep scans and agent workflows become expensive | Incremental work, caching, budgets, user-visible cost |
| Generic lowest-common-denominator design | Specialist workflows become shallow | Domain packs with specialist verification |
| Premature UI work | Dashboard hides incomplete core workflows | Validate CLI/MCP/API workflows first |
| Replacing existing tools | High maintenance with little user value | Integrate proven tools; build the coordination layer |

## 14. Decision rules

1. A new feature must fit an existing lifecycle stage and declare its user problem.
2. Reuse shared contracts. Do not create a separate project, finding, or task model without strong evidence.
3. Prefer one user-facing entry point with specialist workflows available when useful.
4. Keep the core domain-neutral. Put specialist logic in capabilities or domain packs.
5. Integrate mature tools when they provide better results than a new implementation.
6. Every capability must declare scope, permissions, inputs, outputs, cost, limitations, and verification.
7. Do not claim support until representative tests pass.
8. Allow human-led, agent-led, hybrid, and unsupported outcomes.
9. Do not expand the roadmap based only on an attractive feature list.
10. Build vertical workflows and measure real outcomes before scaling the platform.

## 15. Immediate design priority

Before building a large scanner catalogue, define the shared contracts and demonstrate one complete workflow:

**User problem → project context → evidence-backed findings → prioritised plan → approved action → independent verification → durable memory.**

Repo-scan is a suitable first workflow because it can establish project context and findings. The first release should remain narrow enough to test thoroughly, but its contracts must support other problem types without requiring a redesign.
