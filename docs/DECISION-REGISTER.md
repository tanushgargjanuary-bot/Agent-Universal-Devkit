# Decision Register

## Purpose and status

This register is the index of consequential product and architecture decisions that are currently supported by repository records. It is not a reconstructed transcript of every past discussion. Historical work-log entries remain the record of what happened. When the original rationale is not preserved, this register says so instead of inventing it.

Use a full Architecture Decision Record for new decisions that materially affect architecture, security, data, compatibility, cost, or are expensive to reverse. Add a dated work-log entry when a decision changes.

## Accepted decisions

| ID | Decision | Current rationale/evidence | Revisit when |
|---|---|---|---|
| D-001 | Keep a small universal core with optional domain, integration, and interface packs. | Product principles and pack model define stable shared contracts; domain-specific logic should remain outside the core unless multiple domains need it. | Real workloads show a stable shared primitive or a pack boundary is failing. |
| D-002 | Keep Resource Intelligence and Agent Orchestration as equal product priorities. | README and product principles define both as central pillars. | Owner explicitly changes product strategy. |
| D-003 | Use evidence and hard constraints before weighted ranking. | Resource evaluation and product principles require hard requirements first and preserve uncertainty. | Benchmarks show a better decision method without weakening constraints. |
| D-004 | Treat discovery as candidate intake, not approval. | Trending discovery and resource registry preserve review and approval as separate states. | A reviewed trust model supports a narrowly scoped automated approval class. |
| D-005 | Deny unknown policy actions by default. | Canonical versioned policy rules and orchestrator tests enforce fail-closed decisions. | A security-reviewed policy redesign provides an equally safe explicit default. |
| D-006 | Keep approval bound to exact action, target, policy version, and plan digest; consume one-time approvals once. | Approval Store and Execution Gate implement signed records, expiry, revocation, and replay rejection. | A reviewed change to approval semantics is required. |
| D-007 | Treat the Execution Gate as an orchestration boundary, not a sandbox. | No production adapter, host identity provider, durable audit backend, or OS/container isolation exists. | Host-trust contract, isolated adapters, adversarial tests, and independent security review pass. |
| D-008 | Keep routine work on main; avoid unnecessary branches and PRs. | Owner working preference recorded in HANDOFF.md and AGENTS.md. | Platform constraints, risky parallel work, or explicit owner direction requires isolation. |
| D-009 | Keep the Hub distinct from DEVKIT Core. | Proposed cross-repository architecture separates reusable contracts from a configured privileged control plane. | Implementation evidence shows a different separation is simpler and safer. This is proposed, not yet implemented. |
| D-010 | Make repository-first continuity the default handoff mechanism. | Continuity protocol requires state, work log, evidence, and next actions in the repository. | Clean-room tests show the current approach is insufficient or too costly. |

## Rejected or deferred approaches

The following are current product constraints, not claims that every alternative was implemented and experimentally rejected:

- Do not replace every coding agent, harness, or specialist tool. Integrate mature tools when they fit.
- Do not build a marketplace before resource trust, compatibility, update, and removal flows are proven.
- Do not introduce a graph database, microservices, dashboards, or a large framework without measured need.
- Do not use popularity, stars, or recency as a quality guarantee.
- Do not automatically install or execute discovered resources.
- Do not enable direct write-capable execution before host trust and isolation gates pass.
- Do not make the Context Exporter a second source of truth. It must package canonical records.
- Do not infer cross-repository authority from Hub registration or organisation membership.

## Unknown historical context

Older chats may contain experiments, rejected implementation details, cost comparisons, or decisions that were not committed to this repository. Those details are not reliably recoverable from current files alone. Agents must not invent them. If a historical choice materially affects a new decision, mark it unknown and ask the owner only when the uncertainty blocks safe progress.

## Decision record template

For a consequential new decision, create an ADR with:

- ID, title, status, date, owner/reviewer role.
- Context and evidence.
- Decision and scope.
- Alternatives, including doing nothing.
- Reasons and trade-offs.
- Security, operational, and cost impact.
- Migration/recovery plan.
- Revisit triggers and links to implementation/tests.
