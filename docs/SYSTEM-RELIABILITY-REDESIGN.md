# System Reliability Redesign

## Executive decision

Do not scale the Devkit by adding more agents, tools, formulas, or repositories first. Strengthen the contracts that decide what the system trusts, retrieves, recommends, executes, and verifies.

The target is a problem-solving system with explicit evidence and trust boundaries, not a large catalogue with an AI wrapper.

## Trust layers

1. **Raw inputs:** user requests, repository contents, discovered projects, papers, and tool output. Treat as untrusted.
2. **Candidate records:** parsed metadata and extracted claims. Not recommendations.
3. **Evidence records:** source, claim supported, retrieval date, version, and limitations.
4. **Evaluations:** assessments against a named profile. Keep facts and judgements separate.
5. **Approved knowledge/resources:** reviewed, versioned records with provenance.
6. **Plans:** task-specific decisions with constraints, alternatives, uncertainty, and approvals.
7. **Execution:** isolated, least-privilege actions through tested adapters.
8. **Verification:** independent evidence against acceptance criteria.
9. **Feedback:** observed outcomes and diagnosed causes. Do not silently rewrite trust policy.

A record must not move to a higher-trust layer only because an AI agent generated it.

## Decision contract

Every consequential recommendation should include the problem, constraints, candidate and rejected options, evidence, unknowns, compatibility and security risks, lifecycle cost, decision outcome, approval requirements, and conditions that would change the decision.

Apply hard constraints before scoring. Do not collapse a multi-dimensional decision into one opaque score.

## Knowledge quality

Use the lifecycle:

`draft → technical review → approved → monitored → deprecated`

Approval binds to an exact content version. If content changes, approval becomes stale. Important methods need assumptions, sources, derivations or correctness reasoning, edge cases, and independent tests.

The current Knowledge Engine is a deterministic metadata matcher. It defaults to approved entries. It does not understand arbitrary paraphrases or prove applicability. Semantic retrieval must wait for benchmark evidence.

## Resource Intelligence

Reject candidates that violate mandatory requirements before ranking. Record unknowns instead of guessing. Evaluate surviving candidates with category-specific criteria. Treat stars, downloads, and activity as discovery or maintenance signals, not proof of quality.

## Orchestration and policy

The intended lifecycle is:

`received → inspected → specified → planned → awaiting_approval → executing → verifying → completed`

Failure states include `blocked`, `failed`, `cancelled`, `needs_input`, and `verification_failed`.

The current orchestrator implements planning, dependency ordering, knowledge retrieval, technology assessment, and policy decisions. It does not execute agent processes.

The Policy Engine denies unknown actions and binds approval to the action, target, policy version, plan ID, and plan digest. It does not authenticate approvers, store approvals, prevent replay, execute tools, or enforce OS permissions. A future executor must re-check policy immediately before each action and enforce the result.

## Independent verification

Define acceptance criteria before execution. Map each criterion to tests, build checks, scans, reviewed diffs, numerical checks, or reproduction evidence. A passing test suite does not prove that every requirement is met. Agents must not mark work verified only from self-report.

## Security and supply chain

Treat retrieved instructions, repository files, model outputs, and issue comments as untrusted. Keep secrets outside prompts and untrusted execution contexts. Use read-only access by default, isolated workspaces, constrained network access, pinned versions, provenance, and approval for privileged actions.

## Evaluation before expansion

Measure retrieval precision and recall, abstention, formula and algorithm correctness, recommendation suitability, evidence freshness, compatibility prediction, verification escape rate, execution recovery, latency, cost, and maintenance burden.

A new method, agent, tool, or data source must improve measured outcomes enough to justify its complexity.

## Implementation order

1. Maintain trustworthy knowledge and approval evidence.
2. Expand independently tested methods.
3. Improve evidence-backed resource decisions.
4. Add approval storage, trusted identity, expiry, replay protection, and executor-side policy enforcement.
5. Add audit records and end-to-end simulated execution.
6. Add capability-based routing and recovery.
7. Expand only when benchmarks and real workflows justify it.

## Non-negotiable rule

The system must be able to say “I do not know”, “the evidence is insufficient”, and “no available solution meets the requirements”. A system that always returns a confident recommendation is unsafe.
