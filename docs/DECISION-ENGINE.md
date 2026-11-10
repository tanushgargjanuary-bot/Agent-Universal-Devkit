# Decision Engine

## Purpose

The Decision Engine helps select an engineering approach for a defined problem. It must not select the most popular resource or blindly choose the highest numeric score.

## Required input

A decision request should include the problem, expected outcome, requirements, hard constraints, required capabilities, environment, security and license needs, budget, acceptance criteria, assumptions, and unknowns.

If key requirements are missing, ask for clarification or mark the decision provisional.

## Decision pipeline

1. Clarify the goal, constraints, and acceptance criteria.
2. Discover candidate resources, methods, algorithms, and architectures.
3. Collect primary-source evidence.
4. Apply hard requirements and safety gates.
5. Assess viable candidates with task-specific criteria.
6. Compare trade-offs and uncertainty.
7. Test whether a hybrid adds enough value to justify integration cost.
8. Select one, a justified hybrid, a custom approach, none, or insufficient evidence.
9. Validate against acceptance criteria.
10. Record evidence, assumptions, decision, limitations, and review triggers.

## Technology decisions

For language, runtime, framework, or component-boundary decisions, follow [Technology and Language Architecture Selection](TECHNOLOGY-ARCHITECTURE-SELECTION.md).

The current Technology Decision Engine is an opt-in proposal aid. It can inspect a bounded repository snapshot and compare caller-supplied candidates against explicit workload requirements. It does not discover candidates, independently verify supplied evidence, execute code, or apply migrations. Require human approval before stack additions, hybrid adoption, or migrations.

## Evidence model

Keep these concepts separate:

- **Fact:** supported by an identified source or test.
- **Assessment:** interpretation of one or more facts.
- **Assumption:** a condition accepted temporarily but not verified.
- **Unknown:** information not established.
- **Decision:** selected action and rationale.
- **Outcome:** observed result after implementation or testing.

Prefer primary sources. Record the claim, source, source type, checked date, and relevant excerpt or test artifact where practical.

## Scoring and uncertainty

- Apply hard gates before scoring.
- Use criteria and weights that match the task.
- Do not silently convert unknown values to zero or a high score.
- Report evidence coverage and confidence separately from suitability.
- Show critical trade-offs instead of hiding them in one score.
- Run sensitivity checks when small weight changes alter the winner.
- Avoid false precision.

## Hybrid decisions

A hybrid is viable only when it covers a required capability or materially improves an outcome, interfaces are compatible, security and license constraints are satisfied, integration cost is acceptable, and the combination can be tested.

A discovered relationship is a hypothesis until compatibility is verified.

## Decision outcomes

- `select_single`
- `select_hybrid`
- `custom_solution`
- `select_none`
- `insufficient_evidence`

## Required decision report

Include requirements, constraints, outcome, rationale, candidates, rejected options, evidence, checked dates, unknowns, assumptions, confidence, cost, security and license considerations, validation results, and re-evaluation triggers.

## Evaluation quality controls

Use benchmark tasks with known requirements and independently assessed outcomes. Track suitability, evidence coverage, false claims, execution success, verification misses, cost, and maintenance burden. Diagnose failure causes before changing resource assessments.
