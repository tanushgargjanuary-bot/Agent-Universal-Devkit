# Roadmap

The Devkit aims for broad problem-solving capability through a small universal core and optional domain, integration, and interface packs. Resource Intelligence and Agent Orchestration have equal priority. The native Knowledge Library supports both.

Status marks refer to repository implementation, not external configuration. A checked item does not imply that every production control is active.

## Strategic direction — Unified Problem-Solving Workbench

The long-term product direction is one coherent entry point for a broad range
of supported problems. It uses a shared problem lifecycle and common contracts,
with reusable specialist capabilities, domain packs, and integration adapters.
This is a product direction, not a claim that broad support already exists.

- [ ] Define and validate the complete shared problem, context, evidence, finding, capability, plan, action, execution, approval, verification, and memory model.
- [x] Implement initial versioned contracts for problem, evidence, finding, capability, plan, and verification records.
- [x] Add a dependency-free schema engine for the documented contract-schema subset, with tests and CI.
- [x] Add deterministic capability filtering and ranking with deny-by-default permission and execution-mode checks; no persistence or execution yet.
- [ ] Establish project intelligence and safe context assembly as reusable services.
- [x] Build an initial read-only repo-scan workflow over shared problem, evidence, and finding contracts.
- [x] Add README demo-signal detection and include the README Demonstration Standard in bootstrap agent instructions and templates.
- [ ] Expand repo-scan with project-type-aware checks, labelled fixtures, and false-positive benchmarks.
- [ ] Validate deterministic entry-point and workspace signals across labelled multi-ecosystem fixtures.
- [ ] Convert findings into prioritised plans with measurable acceptance criteria.
- [ ] Demonstrate one complete find → plan → approved change → verify → remember workflow.
- [ ] Add reusable debugging, dependency, test, security, environment, documentation, and PR workflows.
- [ ] Integrate mature specialist tools and existing agents through tested adapters.
- [ ] Add domain packs only after representative workflows and verification methods are validated.
- [ ] Expose the same workflows through CLI/MCP first; add other interfaces when justified.

Detailed design and constraints: [Unified Problem-Solving Model](UNIFIED-PROBLEM-SOLVING-MODEL.md).

## Gate A — Trustworthy foundations

- [x] Establish repository structure, product principles, and target architecture.
- [x] Add resource discovery, comparison, and evidence-aware evaluation.
- [x] Add initial orchestration planning and risk gates.
- [x] Add native knowledge records and deterministic retrieval.
- [x] Add registry integrity checks, token-boundary matching, and prerequisite visibility.
- [x] Add auditable knowledge review metadata and exact-content digest checks.
- [x] Add scoped schema validation and retrieval regression cases in CI.
- [x] Add independent reference implementations and formula tests.
- [x] Add evidence-based technology architecture selection with approval gates.
- [ ] Configure required branch protection and status checks on `main` (owner action).
- [ ] Expand independent tests across the remaining algorithm and formula library.

## Gate B — Resource Intelligence

- [x] Add hard-constraint filtering before weighted evaluation.
- [x] Add canonical repository identity and a SQLite resource registry.
- [x] Add conservative overlap proposals and human-reviewed duplicate decisions.
- [x] Add GitHub metadata synchronisation with rate-limit handling and resumable records.
- [ ] Track release, archive, advisory, license, and activity health over time.
- [ ] Add evidence provenance, conflicting-evidence reconciliation, and freshness scoring.
- [ ] Add category-specific evaluation profiles and relationship classification.
- [ ] Add an agent-facing resource search API and CLI.
- [ ] Add semantic similarity only after labelled benchmarks show clear gains.
- [ ] Generate periodic catalog health and consolidation reports.

## Gate C — Universal capability and pack model

- [x] Define the universal core and optional domain, integration, and interface packs.
- [x] Define an initial versioned pack manifest schema and governance contract.
- [ ] Add pack dependency resolution, compatibility checks, enable/disable, and safe removal.
- [ ] Build the first complete software-engineering pack.
- [ ] Prototype AI/ML, cybersecurity, data, research, and other domain packs from real tasks.
- [ ] Add tested integration packs for selected agent harnesses and MCP tools.
- [ ] Avoid a marketplace until discovery, trust, compatibility, and update flows are proven.

## Gate D — Repository governance and quality

- [x] Add risk-based repository governance and agent workspace hygiene guidance.
- [x] Add a read-only repository hygiene checker, JSON output, tests, and CI scan.
- [x] Add a universal project quality rubric and specialist profiles.
- [x] Add bootstrap entry points for local repository governance and quality records.
- [x] Add a project intelligence and continuity protocol, with project-state and work-log templates for context-independent handoff.
- [x] Add automated continuity-document presence, structure, and freshness checks.
- [x] Require continuity record updates for implementation/configuration changes and work-log entries for documentation-only changes.
- [x] Expand the tested GitHub bootstrap payload to include handoff templates and the local hygiene checker.
- [ ] Add governance-level policy enforcement and a versioned bootstrap installer.
- [ ] Add rubric-aware planning and evidence-based quality reporting to the orchestrator.

## Gate E — Knowledge depth

- [ ] Expand algorithms, data structures, mathematics, statistics, optimisation, numerical methods, and information theory.
- [ ] Add worked problems, derivations, examples, and independent tests.
- [ ] Add prerequisites and related-concept navigation.
- [ ] Add domain-specific knowledge packs.
- [ ] Use semantic retrieval only if benchmarks prove measurable improvement.

## Gate F — Policy-aware orchestration

- [x] Retrieve approved knowledge during planning with reasons, limitations, and prerequisite status.
- [x] Add opt-in technology architecture assessment with evidence and human approval gates.
- [x] Add a versioned action policy catalogue with deny-by-default handling for unknown actions.
- [x] Bind approval requests to the exact action, target, policy version, and plan digest.
- [x] Require a trusted approval-verification callback; reject unverified or stale approvals.
- [ ] Add approval request storage and lifecycle management.
- [ ] Add trusted human identity integration, expiry, and replay protection.
- [ ] Add executor adapters that enforce policy immediately before action.
- [ ] Add tamper-evident execution audit records.
- [ ] Add a simulated executor and end-to-end approval tests.
- [ ] Add requirements extraction and measurable acceptance criteria.
- [ ] Retrieve and compare approved resources during planning.
- [ ] Add capability-based agent and harness routing.
- [ ] Add run history, retries, recovery paths, and cost controls.

## Gate G — Complete solution intelligence

- [ ] Compare complete architectures, not only individual tools.
- [ ] Support single, hybrid, custom, none, and insufficient-evidence outcomes.
- [ ] Include lifecycle cost, security, licensing, integration, and maintenance.
- [ ] Record rejected options and conditions that would change decisions.
- [ ] Benchmark recommendation quality against independently labelled cases.
- [ ] Generate and validate architecture decision records.

## Gate H — Interfaces and controlled evolution

- [ ] Improve CLI and library ergonomics before adding more interfaces.
- [ ] Add API and headless CI interfaces using the same contracts.
- [ ] Add desktop/web control surfaces only when validated workflows need them.
- [ ] Register and deploy the GitHub App.
- [ ] Add supply-chain review, controlled update PRs, and health monitoring.
- [ ] Record compatibility, benchmark results, and known limitations.

A capability is not complete until its contract, tests, evidence, security model, and documentation exist. A policy decision is not runtime enforcement. A pack is not supported until compatibility and removal behaviour are tested. Knowledge approval is tied to an exact reviewed version. Broad scope does not justify a bloated core.
