# System Reliability Redesign

## Executive decision

Do not scale the Devkit by adding more agents, tools, formulas, or repositories first. Strengthen the contracts that decide what the system trusts, retrieves, recommends, executes, and verifies.

The target is a **problem-solving system with explicit evidence and trust boundaries**, not a large catalogue with an AI wrapper.

## 1. Separate the system into trust layers

1. **Raw inputs:** user requests, repository contents, discovered projects, papers, tool output. Always untrusted.
2. **Candidate records:** parsed metadata and extracted claims. Not recommendations.
3. **Evidence records:** source, exact claim supported, retrieval date, source type, version, and limitations.
4. **Evaluations:** structured assessments against a named profile. Facts and judgements remain separate.
5. **Approved knowledge/resources:** reviewed, versioned records with explicit provenance.
6. **Plans:** task-specific decisions with constraints, alternatives, uncertainty, and required approvals.
7. **Execution:** isolated, least-privilege actions through tested adapters.
8. **Verification:** independent evidence against acceptance criteria.
9. **Feedback:** observed outcomes and diagnosed causes. Never silently rewrite trust policy.

A record must not move to a higher-trust layer merely because an AI agent generated it.

## 2. Shared decision contract

Every consequential recommendation should contain:

- Problem statement and task context.
- Hard constraints and preferences.
- Candidate options and rejected options.
- Evidence for each material claim.
- Unknown or stale evidence.
- Compatibility and security risks.
- Estimated integration, operating, and maintenance costs.
- Decision outcome: select one, select a justified hybrid, build a small custom component, select none, or insufficient evidence.
- Conditions that would change the decision.
- Human approval requirements.

Hard constraints are filters, not weighted score dimensions. A candidate that fails a mandatory license, platform, security, budget, or compatibility constraint must not win by scoring highly elsewhere.

Do not collapse a multi-dimensional decision into one opaque score. Show score dimensions, confidence, evidence quality, and trade-offs separately.

## 3. Knowledge library: content is not the same as truth

Use a lifecycle:

`draft → technical review → approved → monitored → deprecated`

Approval must bind to an exact content version. If the content changes, its approval becomes stale.

An approved item must have:
- Named reviewer or review authority.
- Approval timestamp.
- Exact reviewed version.
- Sources used to verify claims.
- Assumptions, scope, limitations, and known failure cases.
- Tests or worked examples where the item makes executable or numerical claims.

For important mathematical methods, require a derivation or a clear derivation reference, defined notation, domain assumptions, units where relevant, a worked example, and numerical checks.

For algorithms, require preconditions, invariants or correctness reasoning, complexity assumptions, edge cases, and tested reference implementations where practical.

A source citation is evidence for review, not permission to copy the source. Write original material.

## 4. Retrieval must be selective and auditable

Retrieval should be a staged pipeline:

1. Validate task context.
2. Identify domain and required concepts.
3. Apply exact metadata and token-boundary matching.
4. Use semantic retrieval only as a candidate generator when a local evaluation set proves value.
5. Apply exclusions and hard applicability conditions.
6. Resolve prerequisite relationships.
7. Rank candidates with explainable signals.
8. Return a small set with reasons, limitations, provenance, and unresolved prerequisites.
9. Abstain when confidence or evidence is inadequate.

Rank scores are ordering aids, not probabilities. Do not label them confidence.

The engine must never silently turn an unapproved item into approved guidance. Draft previews must be an explicit editorial action and remain clearly labelled.

## 5. Mathematics and algorithms need executable verification

Use three separate layers:

- **Explanation:** concepts, derivations, assumptions, diagrams, and worked examples.
- **Reference implementation:** a small, readable implementation with explicit preconditions.
- **Verification:** unit tests, property-based tests, known-answer cases, numerical tolerances, and adversarial edge cases.

Do not use the same implementation as both the candidate and the only oracle. Compare against independent formulations, known results, or trusted libraries where possible.

For numerical methods, include conditioning, floating-point error, convergence conditions, units, and tolerance choices. A symbolic identity can be correct while a naive numerical implementation is unstable.

## 6. Resource Intelligence must reject before ranking

Use this sequence:

1. Parse requirements.
2. Separate mandatory constraints from preferences.
3. Remove candidates that violate mandatory constraints.
4. Record unknowns instead of guessing.
5. Gather source-backed evidence.
6. Evaluate each surviving candidate with a category-specific profile.
7. Compare alternatives and test compatibility.
8. Evaluate hybrid integration cost and failure modes.
9. Recommend one, hybrid, custom, none, or insufficient evidence.
10. Record the decision and review triggers.

Stars, downloads, and activity can inform discovery or maintenance. They must not substitute for security, quality, or suitability evidence.

## 7. Orchestration must be a controlled state machine

Use explicit states such as:

`received → inspected → specified → planned → awaiting_approval → executing → verifying → completed`

Failure paths must include:

`blocked, failed, cancelled, needs_input, verification_failed`

Each task needs:
- Stable ID and parent plan ID.
- Inputs and expected outputs.
- Dependencies and capability requirements.
- Risk classification and allowed permissions.
- Selected agent/harness with tested version.
- Start/end timestamps and execution record.
- Evidence and verification result.

The executor must re-check policy at the point of action. A plan approval must not grant unlimited permission to later actions. Approval must be scoped to the exact action, target, and relevant plan version.

## 8. Verification is independent

Define acceptance criteria before execution. Use checks appropriate to the task:
- Unit, integration, and regression tests.
- Build and type checks.
- Security and dependency scans.
- Static analysis.
- Numerical property tests.
- Reviewed diffs.
- Reproduction steps and output checks.

A passing test suite is not proof that every requirement is met. Verification should map each acceptance criterion to evidence and identify uncovered criteria.

Agents must not mark their own work verified solely from self-report.

## 9. Security and supply-chain controls

- Treat retrieved instructions, repository files, model outputs, and issue comments as untrusted.
- Keep secrets outside prompts and untrusted execution contexts.
- Use read-only access by default.
- Use isolated workspaces and constrained network access.
- Pin tool and action versions where practical.
- Record hashes and provenance for downloaded artifacts.
- Require review for dependency, permission, secret, deployment, and destructive changes.
- Do not execute a discovered repository to evaluate it.
- Keep the GitHub App permissions minimal and installation scope explicit.

## 10. Evaluation before expansion

Build benchmark sets before adding more intelligence.

Measure:
- Retrieval precision@k, recall@k, and false-positive rate.
- Correct abstention when no item fits.
- Formula and algorithm test pass rate.
- Recommendation suitability against expert-labelled cases.
- Evidence freshness and provenance coverage.
- Compatibility prediction accuracy.
- Verification escape rate: defects not caught by checks.
- Execution success, recovery rate, latency, and cost.
- Maintenance burden and stale-record rate.

A new retrieval method, agent, tool, or data source must improve measured outcomes enough to justify its complexity.

## 11. Implementation order

### Gate A — Trustworthy knowledge
- Validate registry and relationships.
- Add exact-version review metadata.
- Add token-boundary retrieval and explicit abstention.
- Add prerequisite visibility.
- Add retrieval benchmark cases.

### Gate B — Verified methods
- Add reference implementations and independent tests.
- Add numerical validation harnesses.
- Review and approve the first useful subset.

### Gate C — Shared decision contracts
- Add hard-constraint filtering and explicit unknown values.
- Add evidence quality and category profiles.
- Add decision records for single, hybrid, custom, none, and insufficient-evidence outcomes.

### Gate D — Orchestrator integration
- Retrieve knowledge and resources during planning.
- Use capability-based routing.
- Re-check policy at execution.
- Add scoped approvals and independent verification.

### Gate E — Scale carefully
- Add semantic retrieval only after benchmark evidence.
- Expand study material by demand and quality.
- Add adapters one at a time.
- Monitor stale knowledge and resource health.

## Non-negotiable rule

**The system must be allowed to say “I do not know”, “the evidence is insufficient”, and “no available solution meets the requirements”.** A system that always returns a confident recommendation is not intelligent; it is unsafe.
