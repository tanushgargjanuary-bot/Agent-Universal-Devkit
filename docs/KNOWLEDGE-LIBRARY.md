# Engineering Knowledge & Methods Library

## Purpose

The Knowledge Library is a native, versioned collection of engineering methods that agents can retrieve when a task needs them. It stores original explanations and examples in this repository, not just external links.

## Trust lifecycle

`draft → review → approved → monitored → deprecated`

- Draft material is being written.
- Review material is undergoing technical review.
- Approved material has a named reviewer, approval date, exact reviewed version, and verification sources.
- Monitored material remains in use but needs freshness checks.
- Deprecated material must not be used for new decisions.

Approval applies to an exact content version. Any content change invalidates that approval until the changed version is reviewed again. A registry status alone is not proof of correctness.

## Native-content policy

Write original explanations, examples, derivations, pseudocode, and implementation guidance. Do not paste complete university notes, textbooks, paid course material, or proprietary documentation. Verify claims against reliable sources and provide attribution. Record licenses for third-party code or content.

## Knowledge item types

- `algorithm`: preconditions, procedure, complexity, correctness reasoning, and trade-offs.
- `data_structure`: operations, invariants, complexity, and use cases.
- `mathematical_method`: concepts, notation, assumptions, derivation, and limitations.
- `formula`: focused relation, symbol definitions, domain, assumptions, and worked example.
- `pattern`: reusable engineering structure and trade-offs.
- `protocol`: message flow, state, security properties, and interoperability.
- `procedure`: repeatable engineering workflow or diagnostic method.

## Retrieval contract

The current Knowledge Engine uses deterministic metadata matching. It validates registry structure and relationships, matches explicit tags and phrases, applies exclusions and capability requirements, reports reasons and prerequisite chains, and defaults to approved material only.

Draft preview requires an explicit status override. Preview results are not validated guidance. An item is ready only when it is approved and its prerequisite chain is approved.

The engine does not understand arbitrary paraphrases, prove applicability, or replace technical judgement. Semantic retrieval should be added only after a benchmark shows measurable improvement.

## Quality standards

Algorithm entries should state the problem, preconditions, procedure, pseudocode, complexity assumptions, correctness reasoning, edge cases, alternatives, and independent tests.

Mathematics entries should define notation and variables, state assumptions and units, show derivation, include a worked example, and discuss numerical stability and limitations.

For numerical methods, use tolerances, conditioning checks, and independent known-answer or property-based tests. Do not use the candidate implementation as its only test oracle.

## Current collection

The initial library covers complexity analysis, graph traversal, shortest-path selection, linear algebra, probability, optimisation, Bayes' theorem, gradient descent, and least squares. These entries are drafts unless the registry records a valid approval attestation. Do not assume they are approved.

## Layout

- `knowledge/algorithms/`: algorithm explanations.
- `knowledge/mathematics/`: mathematics, statistics, and optimisation.
- `knowledge/mathematics/formulas/`: focused formula cards.
- `knowledge/implementations/`: reference implementations used by tests.
- `knowledge/registry.json`: machine-readable index and activation metadata.
- `schemas/knowledge-item.schema.json`: item contract.
- `core/knowledge-engine/`: local retrieval and validation logic.

## Maintenance

Keep stable IDs. Increment the item version when technical content changes. Re-review formulas, complexity claims, algorithm guarantees, assumptions, and reference implementations. Mark stale material for review or deprecate it. Never treat old approval as current after content changes.
