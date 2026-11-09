# Engineering Knowledge & Methods Library

## Purpose

The Knowledge Library is a native, versioned collection of engineering methods that agents can retrieve and apply when a task needs them.

It includes algorithms, data structures, mathematics, statistics, optimisation methods, design patterns, protocols, security concepts, and engineering procedures. The repository stores the explanatory material itself, not only links to external notes.

## Native-content policy

- Write original explanations, examples, derivations, pseudocode, and implementation guidance.
- Do not paste complete university notes, textbooks, paid course material, or proprietary documentation.
- Use external sources to verify facts and provide attribution. Keep source references distinct from the authored explanation.
- Record licenses for any third-party content or code included.
- Prefer small, testable knowledge units over enormous unstructured documents.
- Review technical claims, equations, edge cases, and examples before marking an item approved.

## Knowledge item types

- `algorithm`: procedure, preconditions, complexity, correctness reasoning, pseudocode, and trade-offs.
- `data_structure`: operations, invariants, complexity, and use cases.
- `mathematical_method`: concepts, equations, variable definitions, assumptions, derivation, and limitations.
- `formula`: a focused relation with units, domain, assumptions, and examples.
- `pattern`: reusable engineering structure and trade-offs.
- `protocol`: message flow, state, security properties, and interoperability.
- `procedure`: repeatable engineering workflow or diagnostic method.

## Activation and retrieval

Every item declares:
- Domains and tags.
- Positive activation signals such as task phrases, capabilities, and concepts.
- Exclusion signals for common false matches.
- Prerequisites and related items.
- Expected inputs and outputs where relevant.

The initial Knowledge Engine uses deterministic metadata matching. It ranks candidates and explains which signals matched. It must prefer a small relevant set over returning the entire library.

The retrieval result is a suggestion, not an instruction to execute. The agent must check assumptions, task constraints, and correctness before applying the method. When signals are weak or contradictory, return no result or ask for clarification.

Semantic retrieval and embeddings may be added later, but they must preserve explainability and work without a paid API.

## Quality standard for algorithms

A useful algorithm entry should explain:
1. Problem solved and when to use it.
2. Preconditions and input assumptions.
3. Core idea and step-by-step operation.
4. Pseudocode or a reference implementation where useful.
5. Time and space complexity, including important cases.
6. Correctness intuition or invariant.
7. Edge cases and failure modes.
8. Alternatives and trade-offs.
9. Tests or validation examples.

## Quality standard for mathematics

A useful mathematics entry should explain:
1. The problem or concept it models.
2. Notation and every variable.
3. Formula and units, where applicable.
4. Assumptions and domain of validity.
5. Derivation or reasoning, not only the final equation.
6. A worked example.
7. Common mistakes and numerical limitations.
8. How an engineer or agent should use the result.
9. Related concepts and prerequisites.

Formula cards should be small enough to retrieve independently. A formula card must define every symbol, state its assumptions, explain when not to use it, and include a worked example where practical.

## Initial native material

The first pack covers:
- Complexity analysis and asymptotic notation.
- Graph traversal with BFS and DFS.
- Shortest paths with Dijkstra and Bellman-Ford selection guidance.
- Linear algebra foundations for engineering and machine learning.
- Probability and Bayes' rule.
- Optimisation and gradient-based methods.
- Focused cards for Bayes' theorem, gradient descent, and least squares.

This is a starting set, not a claim of complete or advanced coverage. Expand by domain and validate each item before approval.

## Directory layout

- `knowledge/algorithms/`: algorithm explanations.
- `knowledge/mathematics/`: mathematics, statistics, and optimisation.
- `knowledge/mathematics/formulas/`: focused formula cards.
- `knowledge/registry.json`: machine-readable index and activation metadata.
- `schemas/knowledge-item.schema.json`: item contract.
- `core/knowledge-engine/`: local retrieval and ranking logic.

## Maintenance

Each item has a status, version, and source references. Changes to formulas, complexity claims, or algorithm behaviour require tests or independent technical review. Outdated items should be marked and replaced through review, not silently rewritten.
