# Engineering Knowledge & Methods Library

## Purpose

The Knowledge Library is a native, versioned collection of engineering methods that agents can retrieve when a task needs them. It stores original explanations and examples in this repository, not just external links.

## Trust lifecycle

`draft → review → approved → monitored → deprecated`

- Draft material is being written.
- Review material is undergoing technical review.
- Approved material has a named reviewer, approval date, exact reviewed version, and verification sources.
- Monitored material remains in use but requires periodic freshness checks.
- Deprecated material must not be used for new decisions.

Approval applies to an exact content version. Any content change invalidates that approval until the changed version is reviewed again. A registry status alone is not proof of correctness.

## Native-content policy

- Write original explanations, examples, derivations, pseudocode, and implementation guidance.
- Do not paste complete university notes, textbooks, paid course material, or proprietary documentation.
- Use external sources to verify facts and provide attribution.
- Record licenses for third-party code or content.
- Prefer small, testable knowledge units over enormous unstructured documents.
- Keep source claims separate from the explanation authored for this repository.

## Knowledge item types

- `algorithm`: preconditions, procedure, complexity, correctness reasoning, and trade-offs.
- `data_structure`: operations, invariants, complexity, and use cases.
- `mathematical_method`: concepts, notation, assumptions, derivation, and limitations.
- `formula`: focused relation, symbol definitions, domain, assumptions, and worked example.
- `pattern`: reusable engineering structure and trade-offs.
- `protocol`: message flow, state, security properties, and interoperability.
- `procedure`: repeatable engineering workflow or diagnostic method.

## Retrieval contract

The current engine uses deterministic metadata matching. It:
- Validates the registry and relationship graph.
- Uses exact tags and token-boundary phrase matching.
- Rejects domain-only matches.
- Applies explicit exclusions and capability requirements.
- Reports reasons and prerequisite chains.
- Defaults to approved material only.
- Labels rank scores as ordering aids, not probabilities or correctness scores.

Draft preview requires an explicit status override. Preview results are never marked ready to apply. An item is ready only when it is approved and its full prerequisite chain is approved.

This is still a deterministic first-stage retriever. It does not understand arbitrary paraphrases, prove applicability, or replace technical judgement. Semantic retrieval may be added only after a benchmark demonstrates a useful improvement.

## Quality standard for algorithms

Each important algorithm entry should explain:
1. Problem solved and when to use it.
2. Preconditions and input assumptions.
3. Core idea and operation.
4. Pseudocode and a readable reference implementation where useful.
5. Time and space complexity, including assumptions and cases.
6. Correctness intuition, invariant, or proof sketch.
7. Edge cases and failure modes.
8. Alternatives and trade-offs.
9. Independent tests or validation examples.

## Quality standard for mathematics

Each important mathematics entry should explain:
1. The problem or concept it models.
2. Notation and every variable.
3. Formula, units, and domain of validity.
4. Assumptions and conditions.
5. Derivation or reasoning, not only the final equation.
6. A worked example with independently checked results.
7. Numerical stability and limitations where relevant.
8. Common mistakes and cases where the method must not be used.
9. Related concepts and prerequisites.

For numerical methods, use tolerances, conditioning checks, and known-answer or property-based tests. Do not use the candidate implementation as its only test oracle.

## Initial native material

The first pack covers complexity analysis, graph traversal, shortest-path selection, linear algebra, probability, optimisation, Bayes' theorem, gradient descent, and least squares. This is a starting set, not a complete advanced curriculum.

## Layout

- `knowledge/algorithms/`: algorithm explanations.
- `knowledge/mathematics/`: mathematics, statistics, and optimisation.
- `knowledge/mathematics/formulas/`: focused formula cards.
- `knowledge/registry.json`: machine-readable index and activation metadata.
- `schemas/knowledge-item.schema.json`: item contract.
- `core/knowledge-engine/`: local retrieval and validation logic.

## Maintenance

Keep stable IDs. Increment the item version when technical content changes. Re-review changes to formulas, complexity claims, algorithm guarantees, assumptions, or reference implementations. Mark stale material for review or deprecate it; do not silently treat old approval as current.
