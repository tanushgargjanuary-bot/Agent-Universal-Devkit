# Technology and Language Architecture Selection

## Purpose

Every agent working in a new or existing repository must make an evidence-based technology decision. Python is not the default. Neither is JavaScript, TypeScript, Rust, Go, Java, C#, C++, or any other language.

Select the smallest coherent architecture that satisfies the repository's requirements. A single language is often best. A hybrid is valid only when its benefits justify its interfaces, deployment, security, and maintenance costs.

This policy guides engineering decisions. It does not require agents to rewrite an established repository or replace a working stack.

## Mandatory repository intake

Before proposing a language or framework:

1. Inspect the repository tree, current branch, working tree, README, and all applicable agent instructions.
2. Identify existing languages, frameworks, runtimes, package managers, build systems, lockfiles, CI workflows, tests, deployment targets, and infrastructure.
3. Identify the product's purpose, users, workload, data flow, integrations, and operational environment.
4. Identify hard constraints: platform support, latency, throughput, memory, concurrency, offline use, browser/runtime requirements, licensing, security, budget, team skills, and maintenance capacity.
5. Separate observed facts from assumptions and unknowns. Do not infer the architecture from one file or a language's popularity.
6. Preserve existing project conventions unless a documented requirement justifies change.

If the task is a small change inside an established system, use the existing stack. Do not perform a full language-selection exercise unless the task exposes a material mismatch.

## Candidate evaluation

For a new system, or a component whose current stack is inadequate, compare credible candidates against the actual requirements.

Evaluate at least the relevant criteria:

- **Correctness and safety:** type system, memory safety, isolation, concurrency model, and failure handling.
- **Performance:** measured or defensible latency, throughput, memory, startup time, and compute cost.
- **Platform fit:** target operating systems, browser, mobile, embedded, serverless, GPU, and deployment environment.
- **Ecosystem:** mature libraries, SDKs, database drivers, tooling, documentation, and community support.
- **Interoperability:** APIs, FFI, bindings, serialization, RPC, WASM, and compatibility with existing components.
- **Developer productivity:** build speed, debugging, testing, code generation, and team experience.
- **Operations:** deployment, observability, upgrades, supply-chain risk, runtime footprint, and support burden.
- **Security and compliance:** language/runtime risks, dependency posture, auditability, data handling, and license obligations.
- **Lifecycle cost:** implementation, integration, hosting, licensing, hiring, and long-term maintenance.

Apply hard constraints before scoring. Use benchmarks or prototypes when performance or integration is decisive. Do not invent benchmark results or use generic language rankings as proof.

## Architecture outcomes

Choose and record one outcome:

- `single_stack`: one primary language and runtime best meet the requirements.
- `polyglot_hybrid`: multiple languages serve distinct components with explicit contracts and measurable benefits.
- `retain_existing`: keep the current stack because migration has no proven net benefit.
- `incremental_migration`: replace a bounded component in stages, with compatibility and rollback plans.
- `insufficient_evidence`: requirements or evidence are not strong enough to choose responsibly.

A hybrid design must explain:

1. Why one language cannot meet the relevant requirements as well.
2. Which component uses each language and why.
3. The boundary between components (for example HTTP/gRPC, message queue, FFI, WASM, or a stable file contract).
4. Data formats, schema ownership, versioning, error handling, timeouts, retries, and observability.
5. Build, test, deploy, security, and dependency management for every runtime.
6. Integration and operational costs, failure modes, and ownership.
7. How to test the boundary and recover from component failure.

Do not split a system into microservices or add another language merely because it is technically possible. Avoid duplicated business logic and unnecessary cross-language calls.

## Common decision patterns (not defaults)

These are starting hypotheses only. Validate them against current versions, libraries, benchmarks, deployment targets, and team constraints.

| Workload | Candidates worth evaluating | Typical reason |
|---|---|---|
| Data science, ML experimentation, model integration | Python, R, Julia, C++/CUDA, Rust | Python has a broad ML ecosystem; native/GPU code may be needed for performance or deployment |
| High-throughput network services | Go, Rust, Java, C#, TypeScript/Node.js | Concurrency, latency, ecosystem, operational fit |
| Memory-sensitive systems, runtimes, security-critical components | Rust, C, C++ | Control, predictable resource use, systems integration; assess memory-safety risks |
| Browser interfaces and full-stack web | TypeScript, JavaScript, WebAssembly languages | Browser-native execution and web ecosystem |
| Mobile applications | Kotlin, Swift, Dart, TypeScript | Native platform integration or cross-platform needs |
| Enterprise services | Java, Kotlin, C#, Go, TypeScript | Existing platform, tooling, integration, and support |
| CLI and developer tools | Rust, Go, Python, TypeScript | Distribution, startup, portability, ecosystem |
| Embedded and hardware control | C, C++, Rust, MicroPython | Hardware support, footprint, determinism, vendor SDKs |
| Data pipelines and analytics | SQL, Python, Scala, Java, Go | Data platform compatibility, transformation needs, scale |

Never treat this table as a recommendation without repository-specific evidence.

## Required architecture decision record

For consequential stack decisions, create or update a short ADR in the repository's existing decision-record location. Include:

- Context, goals, non-goals, and constraints.
- Existing stack and evidence gathered.
- Candidate languages/runtimes/frameworks considered.
- Hard constraints and comparison criteria.
- Selected outcome and component boundaries.
- Rejected options and reasons.
- Evidence, benchmarks, assumptions, and unknowns.
- Security, licensing, deployment, and maintenance implications.
- Migration, rollback, and validation plan where applicable.
- Review triggers (for example workload growth, new platform, team change, or runtime end-of-life).

For a small task, a concise note in the task plan is enough. Do not create an ADR for every trivial code change.

## Implementation gates

Before changing the stack:

1. Confirm the decision addresses a real requirement or measured problem.
2. Check official language/runtime documentation and relevant framework support.
3. Verify supported versions, license, maintenance, security advisories, and dependency health.
4. Build a small proof of concept if compatibility or performance is uncertain.
5. Define tests and acceptance criteria before migration.
6. Estimate migration, training, deployment, and ongoing maintenance costs.
7. Obtain approval before adding dependencies, changing infrastructure, or performing a broad migration.
8. Migrate incrementally where possible. Keep a rollback path.
9. Run tests, static analysis, security checks, and representative benchmarks.
10. Update the ADR and project documentation with actual results.

## Non-negotiable rules

- Never select Python merely because the agent is most familiar with it.
- Never select a language because it is fashionable or has the highest benchmark in an unrelated test.
- Never introduce a second or third language without a clear component boundary and justified benefit.
- Never rewrite a working project solely to standardise its language.
- Never hide uncertainty. Ask for missing requirements or mark the decision provisional.
- Never claim a language is objectively "best" without naming the workload and constraints.
- Prefer coherent, boring, supportable architecture over novelty.


## Orchestrator implementation

The current orchestrator includes an opt-in deterministic assessment module at `core/orchestrator/src/technology-decision.js`.

It:
- Inspects supplied repository paths and optional manifest contents. It does not execute code.
- Reports detected language, package-manager, and framework signals with limitations.
- Compares at least two candidate architectures supplied by the caller.
- Checks explicit workload capabilities, required platforms, and security controls.
- Ranks feasible candidates using supplied cost estimates and configurable weights.
- Abstains when evidence is missing or no candidate satisfies hard requirements.
- Marks new-language additions, hybrid designs, and migrations as requiring human approval.
- Attaches the assessment to an orchestration plan when the caller supplies `technologyAssessment`.

It does not yet discover candidate architectures automatically, validate claims in supplied evidence, benchmark implementations, generate an ADR, or execute an approved migration. Candidate discovery and evidence verification remain required future work. The engine is a proposal aid, not an autonomous architect.
