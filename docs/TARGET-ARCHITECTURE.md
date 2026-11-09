# Target Architecture

## Architectural objective

Keep Resource Intelligence and Agent Orchestration as equal, independently useful systems. Connect them through stable contracts, shared evidence, and a common engineering knowledge model.

## Logical flow

1. **Requirements:** turn a goal into constraints, assumptions, acceptance criteria, and measurable outcomes.
2. **Intelligence:** discover and retrieve relevant resources, methods, algorithms, formulas, and prior engineering knowledge.
3. **Evaluation:** inspect evidence, apply hard constraints, assess alternatives, and expose uncertainty.
4. **Solution design:** compare complete approaches, including a single resource, a justified hybrid, a custom component, or no adoption.
5. **Planning and orchestration:** decompose the chosen approach, match tasks to agent capabilities, apply policy, and execute through tested adapters.
6. **Verification:** check outputs against acceptance criteria using independent tests and evidence.
7. **Feedback:** record outcomes and diagnosed failure causes. Propose improvements through controlled review.

## Logical components

| Capability | Responsibility | Initial implementation boundary |
|---|---|---|
| Requirements | Requirements, constraints, acceptance criteria | Core module; no separate service yet |
| Discovery | Find candidate resources and knowledge | Existing scripts and source adapters |
| Evaluation | Category-specific evidence assessment | Shared contract plus specialised profiles |
| Comparison | Compare candidates against a task | Existing resource engine, to be refined |
| Knowledge library | Native algorithms, mathematics, patterns, and methods | Versioned Markdown and JSON records |
| Knowledge retrieval | Select relevant material from task signals | Deterministic local engine first |
| Knowledge relationships | Alternatives, prerequisites, dependencies, complements | Structured records before graph infrastructure |
| Solution design | Compare complete architectures and trade-offs | Start as a documented planning capability |
| Agent registry and routing | Match task needs to tested agent capabilities | Orchestration module |
| Execution | Run work through approved adapters | Add one tested adapter at a time |
| Verification | Check results independently | Task-specific verification contracts |
| Feedback | Record outcomes and propose improvements | Audited records; no automatic policy changes |

These are capabilities, not a requirement to create one package, service, or agent for every row. Split components only when independent testing, reuse, deployment, or ownership justifies it.

## Shared contracts

Use versioned schemas for:
- Requirements and acceptance criteria.
- Resources and category-specific evaluations.
- Knowledge items and activation metadata.
- Relationships and evidence.
- Agent capabilities and execution requests.
- Plans, task states, verification results, and feedback.

Keep facts, assessments, assumptions, decisions, and observed outcomes separate. Every important relationship or assessment should have provenance, a checked date, and confidence or evidence quality where applicable.

## Knowledge architecture

The native Knowledge Library stores original, maintained material in the repository. It is not a link directory or a copy of external course notes.

Each knowledge item has:
- A stable ID, type, title, and version.
- Domains, tags, prerequisites, and activation signals.
- Problem fit, assumptions, limitations, and avoid-when conditions.
- Explanations, derivations or pseudocode where relevant.
- Complexity or computational considerations where relevant.
- Examples and validation tests where applicable.
- Sources for factual checking and attribution.

The Knowledge Engine initially uses deterministic metadata and phrase matching. It returns ranked candidates with reasons. An agent must inspect the task and selected material before applying it. Retrieval does not automatically execute code or prove that a method is correct for a specific task.

## Knowledge relationships

Represent relationships as explicit, versioned data first. Examples include `requires`, `prerequisite_of`, `alternative_to`, `complements`, `implements`, `compatible_with`, and `conflicts_with`.

Do not infer a verified relationship from co-occurrence. Store evidence, provenance, confidence, and verification time. Add graph indexes or a graph database only when query volume or use cases justify them.

## Trust and execution boundaries

- External content is untrusted data, never privileged instructions.
- Discovery does not imply approval.
- Retrieval does not imply permission to execute.
- Use least privilege, version pinning, isolated execution, and risk-based approvals.
- Keep secrets out of prompts, logs, and untrusted tools.
- High-risk and critical actions require explicit approval and auditable evidence.
- An executor cannot approve its own high-risk action.
- Verification must be independent of the agent's completion statement.

## Evolution strategy

Build the smallest useful implementation for each capability. Preserve stable contracts. Use real benchmark tasks to decide when a module needs more sophisticated algorithms, semantic retrieval, graph infrastructure, or additional adapters.
