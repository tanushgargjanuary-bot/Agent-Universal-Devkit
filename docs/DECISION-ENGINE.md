# Decision Engine

## Purpose

The Decision Engine chooses a suitable engineering approach for a specific problem. It must not select the most popular resource or blindly choose the highest numeric score.

## Required input

A decision request should include:
- Problem statement and expected outcome.
- Functional and non-functional requirements.
- Hard constraints and prohibited approaches.
- Required capabilities.
- Environment, language, platform, and compatibility needs.
- Security, privacy, and licensing constraints.
- Budget and operational limits.
- Acceptance criteria.
- Known assumptions and unknowns.

If key requirements are missing, ask for clarification or mark the decision provisional.

## Decision pipeline

1. **Clarify:** identify ambiguity, constraints, and acceptance criteria.
2. **Discover:** find candidate resources, methods, algorithms, and architectures.
3. **Collect evidence:** inspect primary documentation, source, releases, tests, licenses, advisories, and reproducible benchmarks.
4. **Apply hard gates:** remove candidates that violate mandatory requirements or safety constraints.
5. **Assess:** evaluate remaining candidates with category-specific criteria.
6. **Compare:** identify strengths, weaknesses, uncertainty, and trade-offs.
7. **Compose:** test whether a combination adds required capability without unacceptable overlap or integration cost.
8. **Decide:** choose A, B, a justified hybrid, a custom approach, neither, or gather more evidence.
9. **Validate:** test the selected approach against acceptance criteria.
10. **Record:** store evidence, assumptions, decision rationale, limitations, and review conditions.

## Evidence model

Keep these concepts separate:

- **Fact:** directly supported by an identified source or test.
- **Assessment:** interpretation of one or more facts.
- **Assumption:** a condition accepted temporarily but not verified.
- **Unknown:** information not established.
- **Decision:** selected action and rationale.
- **Outcome:** observed result after implementation or testing.

Evidence records should identify the claim, source, source type, checked date, and relevant excerpt or test artifact where practical. Prefer primary sources. A source URL alone does not prove every claim about that source.

## Scoring and uncertainty

Scoring is a comparison aid, not truth.

- Apply hard gates before scoring.
- Use criteria and weights that match the task.
- Explain why each criterion matters.
- Do not silently convert unknown values to zero or a high score.
- Report evidence coverage and confidence separately from suitability.
- Show critical trade-offs instead of hiding them in one aggregate number.
- Run sensitivity checks when small weight changes alter the winner.
- Avoid false precision. Scores should not imply measurement accuracy that the evidence does not support.

A candidate with incomplete evidence may remain under investigation. Missing information is not proof of poor quality.

## Hybrid decisions

A hybrid is viable only when:
- It covers a required capability that a single option does not cover adequately, or materially improves a required outcome.
- Interfaces and versions are compatible or can be integrated with a bounded effort.
- Security, privacy, and license constraints are satisfied.
- Capability overlap and operational complexity are acceptable.
- Integration can be tested.

Repository declarations of complementarity are useful evidence, but are not mandatory. Agents may discover a possible combination. They must label it as a hypothesis until compatibility and integration are verified.

## Decision outcomes

Use one of these explicit outcomes:
- `select_single`: use one candidate.
- `select_hybrid`: combine candidates with a validated reason.
- `custom_solution`: build a missing component when justified.
- `select_none`: available candidates fail hard requirements.
- `insufficient_evidence`: do not claim a winner yet.

## Required decision report

Include:
- Requirements and constraints used.
- Selected outcome and rationale.
- Candidates considered.
- Rejected candidates and reasons.
- Evidence and checked dates.
- Unknowns, assumptions, and confidence.
- Cost and integration estimate.
- Security and license considerations.
- Validation plan and acceptance results.
- Conditions that should trigger a re-evaluation.

## Evaluation quality controls

Use benchmark tasks with known requirements and independently assessed outcomes. Track recommendation suitability, evidence coverage, false claims, execution success, verification misses, cost, and maintenance burden. Do not let one metric dominate. Diagnose whether failures came from requirements, evidence, resource defects, agent mistakes, integration, environment, or an unknown cause before changing resource assessments.
