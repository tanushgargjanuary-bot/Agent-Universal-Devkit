# DEVKIT Broader Vision — Convenience Notes

> **Status and disclaimer:** This is an informal, non-professional convenience note. It is **not an official project document**, is **not part of the approved DEVKIT scope**, and does not create implementation commitments. It captures ideas for discussion and future reference only. The canonical product direction remains in `docs/VISION-AND-SCOPE.md`, `docs/PRODUCT-PRINCIPLES.md`, and `docs/ROADMAP.md`. If this note conflicts with those files, the canonical documents take precedence.

**Date:** 2026-11-10  
**Status:** Exploratory / non-authoritative  
**Purpose:** Preserve a broader product vision for repo-scan and related developer capabilities without expanding the committed roadmap.

---

## 1. The bigger idea

DEVKIT could evolve into a **Project Intelligence and Engineering Operations System**: a tool that helps a person or AI agent understand a project, decide what should happen next, make controlled changes, verify the result, and preserve what was learned.

The ambition is not to create another linter, code generator, agent framework, or dashboard. It is to connect fragmented developer tools and workflows around one project-level view of reality.

A user should be able to point DEVKIT at a repository and ask:

- What is this project, and how does it work?
- What is healthy, broken, risky, outdated, or unknown?
- What should I fix first, and why?
- What could break if I change this part?
- Can DEVKIT or another agent safely do the work?
- Did the change actually solve the problem?
- What should the next developer or agent know?

The system should support both human-led work and agent-led work. It should not require users to replace their editor, Git provider, CI system, agent harness, or model provider.

## 2. Reframe repo-scan: from a scan command to a project intelligence layer

A one-time scan is useful, but it is not the full product. A scan sees a snapshot. A project intelligence layer maintains a changing, evidence-backed understanding of the project.

### Lifecycle

1. **Discover** — identify languages, frameworks, packages, services, entry points, workflows, and project conventions.
2. **Understand** — map architecture, dependencies, interfaces, data paths, ownership signals, and important decisions.
3. **Assess** — inspect quality, security, reliability, tests, documentation, dependencies, performance evidence, configuration, and agent readiness.
4. **Explain** — turn raw findings into clear impact, evidence, confidence, and likely causes.
5. **Prioritise** — rank work by user impact, risk, urgency, confidence, effort, and dependencies.
6. **Plan** — create a small, reviewable plan with acceptance criteria and rollback or recovery steps.
7. **Act** — route approved work to a person, an existing agent, or a tested execution adapter.
8. **Verify** — run relevant checks and compare actual results with acceptance criteria.
9. **Remember** — record decisions, changes, outcomes, unresolved risks, and useful context.
10. **Monitor** — detect meaningful drift and regressions over time.

This makes repo-scan the entry point and evidence collector for a larger system. It should not become a monolithic scanner that owns every specialist function.

## 3. A shared project model

The features should use shared contracts instead of creating disconnected reports and databases.

Potential core records:

- **Project profile:** project type, stack, runtime, environments, goals, constraints, and conventions.
- **Component:** package, service, module, application, workflow, or external dependency.
- **Relationship:** imports, calls, builds, deploys, reads, writes, depends on, or is owned by.
- **Finding:** a suspected or verified issue with location, evidence, impact, severity, confidence, and status.
- **Evidence:** source, tool, version, timestamp, scope, and reproducible output.
- **Decision:** chosen option, rejected options, rationale, assumptions, and revisit conditions.
- **Change:** files and components affected, intended outcome, risk, and linked work.
- **Verification:** checks run, environment, results, coverage, and remaining uncertainty.
- **Work item:** goal, acceptance criteria, priority, dependencies, owner, and state.
- **History event:** scan, decision, change, approval, test, failure, or handoff.

A shared model would let a scan finding become a planned task, then a code change, then a verified resolution. The same finding should not need to be manually copied between five tools.

Do not build a graph database or event platform just to represent these records. Start with versioned schemas and simple storage. Add more infrastructure only when real workloads justify it.

## 4. Capability families

These are possible product families, not approved commitments.

### A. Project understanding

- **Repo Scan:** broad, evidence-backed repository assessment.
- **Architecture Explorer:** explain modules, services, dependencies, and data flow.
- **Code Navigator:** locate feature implementation, entry points, and related code.
- **Project Memory:** preserve decisions, conventions, constraints, and known failure modes.
- **Documentation Auditor:** find missing, stale, contradictory, and hard-to-follow documentation.
- **Change Impact:** identify likely affected components and tests before a change.

### B. Project health and risk

- **Security Review:** inspect secrets, dependency advisories, unsafe patterns, permissions, and configuration.
- **Dependency Doctor:** identify outdated, vulnerable, abandoned, duplicated, or incompatible dependencies.
- **Test Intelligence:** assess test gaps, weak assertions, flaky tests, slow suites, and regression risk.
- **Reliability Review:** inspect failure handling, retries, timeouts, recovery paths, and operational assumptions.
- **Configuration Doctor:** detect missing variables, inconsistent environments, and configuration drift.
- **Performance Investigation:** use measurements and traces to identify bottlenecks. Static guesses must remain hypotheses.

### C. Problem solving and change

- **Debug Investigator:** connect error messages, logs, traces, source, and recent changes.
- **Root Cause Assistant:** form and test competing explanations instead of guessing from one symptom.
- **Fix Planner:** create a minimal, ordered plan with acceptance criteria.
- **Refactoring Assistant:** propose bounded refactors with behaviour-preservation tests.
- **Migration Planner:** assess framework, runtime, API, and data migrations before changes.
- **PR Intelligence:** review correctness, risk, test adequacy, security, scope, and documentation impact.

### D. Engineering operations

- **Environment Doctor:** diagnose setup and runtime problems.
- **CI Doctor:** explain failing or slow pipelines and suggest safe improvements.
- **Release Readiness:** assess release blockers, migration risk, test evidence, and rollback readiness.
- **Branch and Merge Assistant:** reduce branch drift, explain conflicts, and prepare safe integration.
- **Project Health History:** compare findings, quality signals, and resolved risks over time.
- **Technical Debt Planner:** distinguish urgent risk from acceptable, intentional debt.

### E. Agent operations

- **Agent Readiness Assessment:** determine whether a repository has enough context, tests, permissions, and conventions for agent work.
- **Task Router:** select a suitable existing agent or tool based on capability and constraints.
- **Scope Guard:** detect changes outside the approved task boundary.
- **Policy Enforcement:** check permissions at the point of action through a trusted executor.
- **Verification Gate:** require evidence before declaring work complete.
- **Recovery and Handoff:** let a different agent resume from durable project records.
- **Execution Cost Control:** track time, tokens, compute, and external service cost.

### F. Resource and method intelligence

- Find and compare libraries, tools, services, agent harnesses, datasets, and engineering methods.
- Assess maintenance, compatibility, licensing, security, integration cost, and evidence quality.
- Recommend a single tool or a hybrid only when the trade-off is justified.
- Track resource health and changing compatibility over time.

This family connects to DEVKIT's existing Resource Intelligence pillar. It must not become a popularity-based directory.

## 5. The user experience

The user should describe the outcome, not select internal engines.

Possible entry points:

- **Understand this project**
- **Find what needs attention**
- **Investigate this error**
- **Plan a change**
- **Review this pull request**
- **Improve project quality**
- **Prepare a release**
- **Continue previous work**

A useful default flow:

1. User selects a repository or local project.
2. DEVKIT asks only for missing constraints that materially affect the result.
3. DEVKIT performs a safe, read-only assessment.
4. It presents the most important findings first, with evidence and uncertainty.
5. User selects a finding or goal.
6. DEVKIT proposes a bounded plan.
7. Policy determines what may happen automatically and what needs approval.
8. An agent or human performs the work.
9. DEVKIT verifies the result and updates project history.

Potential interfaces:
- CLI for developers and automation.
- GitHub checks and review comments for repository workflows.
- MCP tools for existing agents.
- A lightweight web or desktop view when project history and multi-step work need it.

Do not build all interfaces first. Prove one complete workflow through the CLI or existing integration path.

## 6. What makes the system valuable

The advantage should not be the number of scanners or AI agents. It should be the connection between evidence and outcomes.

A useful system can answer:

- Which problems are real, and which are only suspicions?
- Which issue has the highest practical impact?
- What evidence supports this conclusion?
- What else could this change affect?
- Which tests can detect a regression?
- What permission does the action require?
- What happened after the fix?
- What remains unresolved?

The product should reduce time spent understanding unfamiliar code, diagnosing failures, coordinating tools, reviewing changes, and recovering lost context.

## 7. Safety and trust requirements

- Read-only scanning is the default.
- Never execute repository scripts or build hooks without an explicit, scoped decision.
- Treat repository content and scan targets as untrusted input.
- Do not upload private source code to external services without clear user consent.
- Redact secrets from output and logs.
- Separate verified defects, likely risks, and unverified suggestions.
- Every important finding must include evidence and a confidence level.
- Support partial scans and report what was not inspected.
- Do not claim that a clean scan proves a project is secure or correct.
- Keep approval separate from execution. Enforce policy at the executor boundary.
- Make changes reviewable and preserve rollback or recovery options.
- Record tool versions and scan scope so results can be reproduced.
- Avoid false precision in health scores. Show underlying evidence and trade-offs.

## 8. Suggested evolution

This is a sequencing hypothesis. It is not a delivery commitment.

### Foundation — make project understanding reliable
- Define shared project and finding schemas.
- Build repository discovery and safe scan orchestration.
- Add a small number of deterministic scanners.
- Generate a concise report with evidence, confidence, limitations, and next steps.
- Produce an agent-ready project context summary.

### Workflow — turn findings into verified work
- Convert findings into prioritised work items.
- Add change-impact analysis.
- Connect relevant tests and verification evidence.
- Link findings, plans, changes, and outcomes.
- Preserve project state and handoffs.

### Operations — support repeated use
- Add scan comparison and project health history.
- Add dependency, environment, CI, and PR intelligence.
- Add controlled continuous scans for meaningful changes.
- Track regressions and resolved findings.

### Agent execution — automate only after trust boundaries work
- Fix plan and approval contracts.
- Establish trusted approval lifecycle and replay protection.
- Build executor adapters with policy checks immediately before actions.
- Add isolated execution, audit records, recovery, and end-to-end tests.
- Connect selected agent harnesses through tested adapters.

### Expansion — extend through evidence
- Add specialist domain packs.
- Add deeper performance, security, migration, and release workflows.
- Add more interfaces only when proven user workflows require them.

## 9. Measures that matter

Measure outcomes rather than feature counts:

- Time to understand an unfamiliar repository.
- Percentage of findings with reproducible evidence.
- False-positive and false-negative rates on labelled test repositories.
- Percentage of findings that lead to useful action.
- Time from finding to verified resolution.
- Regression rate after automated changes.
- Percentage of plans with measurable acceptance criteria.
- Verification effectiveness and escaped defects.
- Setup friction across supported project types.
- Cost and latency per useful result.
- Recovery success after an agent or environment interruption.
- Maintenance cost and overlap between capabilities.

Do not publish a single project-health score unless its components, weighting, uncertainty, and limitations are visible.

## 10. Risks and devil's-advocate review

| Risk | Why it matters | Guardrail |
|---|---|---|
| Scope explosion | A scanner, debugger, reviewer, dashboard, and agent platform could become separate products | Build one end-to-end workflow; reuse shared contracts |
| False findings | Noisy reports destroy trust | Evidence, confidence, labelled benchmarks, and abstention |
| AI hallucination | Plausible explanations may not match source behaviour | Deterministic evidence first; AI may interpret but must not invent evidence |
| Unsafe scanning | Build hooks and scripts can execute untrusted code | Read-only default, explicit execution boundary, isolation |
| Privacy leakage | Source code and secrets may leave the user's environment | Local-first processing and explicit external-service consent |
| Expensive scans | Deep analysis can be slow or costly | Profiles, caching, incremental scans, clear cost controls |
| Overloaded core | Every specialist feature could make the universal core complex | Stable primitives in core; specialist logic in optional packs |
| Weak measurements | A score can hide uncertainty and trade-offs | Show evidence, coverage, confidence, and missing checks |
| Premature automation | Existing policy and executor gaps make autonomous changes unsafe | Fix and test execution contracts before real automated writes |
| Tool duplication | DEVKIT may recreate existing mature tools badly | Integrate proven tools and focus on orchestration, context, evidence, and verification |

### Hard questions before implementation

1. Which developer workflow is painful enough that users will run DEVKIT repeatedly?
2. What can DEVKIT do materially better than a collection of existing linters, security scanners, and AI coding agents?
3. Which findings can be verified deterministically, and which require human judgement?
4. How will the system prove that a recommendation is useful?
5. What is the smallest project model that supports multiple features without overengineering?
6. What data stays local, and what may be sent to external providers?
7. How will the system behave when a scan is incomplete or a tool is unavailable?
8. What is the first supported project profile? What is explicitly unsupported?
9. What must be true before DEVKIT is allowed to modify a repository?
10. Which proposed features should be integrations rather than new implementations?

## 11. Current recommendation

Treat **Project Intelligence** as the broader product direction and **repo-scan** as its first user-facing entry point.

The first implementation should not attempt all scanner categories. Start with repository discovery, a common evidence-backed finding contract, a small set of high-confidence checks, a prioritised report, and an agent-ready context summary. Then prove that a user can select one finding, create a safe plan, fix it, verify it, and preserve the result.

The most important product loop is:

**Understand → Find → Prioritise → Plan → Change → Verify → Remember.**

Everything else should earn its place by improving this loop or serving a clearly validated adjacent workflow.

---

## 12. Relationship to canonical project documents

This note does not amend the official product vision, principles, architecture, or roadmap. Any idea should be promoted into canonical documentation only after explicit product review, a defined user problem, acceptance criteria, security analysis, and an implementation decision.

Canonical references:
- `docs/VISION-AND-SCOPE.md`
- `docs/PRODUCT-PRINCIPLES.md`
- `docs/ARCHITECTURE.md`
- `docs/ROADMAP.md`
- `docs/PROJECT-STATE.md`
