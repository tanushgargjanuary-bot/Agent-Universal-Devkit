# DEVKIT Agent Handoff

> **Purpose:** Make this repository recoverable by a new AI agent without access to earlier chats.
> **Authority:** This file is the short startup map. `docs/PROJECT-STATE.md` is the detailed implementation snapshot. Source code, tests, Git state, and current GitHub checks remain authoritative over every document.

## 1. Start here

A replacement agent must follow this order:

1. Read this file completely.
2. Read `AGENTS.md` and any harness-specific instructions.
3. Read `README.md` for product scope and user-facing claims.
4. Read `docs/PROJECT-STATE.md` for implementation truth, architecture map, next actions, verification, and owner actions.
5. Read the latest meaningful entries in `docs/WORKLOG.md`. Treat old pending/failing entries as historical unless the latest entry or current CI confirms they remain open.
6. Read `docs/ROADMAP.md` to distinguish implemented work from accepted future scope.
7. For the task at hand, read the relevant subsystem README, source, tests, schemas, policy, and workflows.
8. Inspect the live repository before editing:
   - `git status --short --branch`
   - `git rev-parse HEAD`
   - `git branch --all --verbose`
   - `git log -12 --oneline --decorate`
   - `git ls-files`
   - current GitHub Actions runs, open PRs, issues, and repository settings where access permits.
9. Run the repository hygiene check and the relevant subsystem tests. Verify every important handoff claim against code and test evidence.
10. Before finishing, update the project state and work log, run the required checks, review the complete diff, and record the exact final commit.

Do not ask the user to repeat information that is already in these files. If a fact is not recorded or cannot be verified, label it **Unknown** and ask only when it blocks safe progress.

## 2. Product identity and intended outcome

**Name:** Agent-Universal-Devkit (DEVKIT).

**Purpose:** A modular, vendor-neutral engineering ecosystem for AI agents and the people who direct them. It combines external resource intelligence, native engineering knowledge, project understanding, planning, policy decisions, controlled execution, and independent verification.

**Long-term outcome:** A unified problem-solving workbench. It should help an agent move from an unclear problem to an evidence-backed plan, safe implementation, independent verification, and durable project memory.

**Two equal product priorities:**

1. **Resource Intelligence:** discover, inspect, compare, relate, evaluate, and maintain external engineering resources.
2. **Agent Orchestration:** understand goals, inspect projects, plan dependent work, select capabilities, evaluate actions, route tasks, execute through controlled adapters, and verify results.

The native Engineering Knowledge & Methods Library supports both pillars.

**Product principles:**
- Small universal core; optional domain, integration, and interface packs.
- Vendor-, model-, language-, and harness-neutral contracts.
- Integrate mature tools and agents where they are better than rebuilding them.
- Evidence before ranking; hard constraints before weighted scores.
- Unknown facts remain unknown. Discovery never means approval.
- Deny unknown actions by default. Use least privilege and scoped human approval.
- Verify outputs independently. An agent's completion statement is not evidence.
- Preserve working stacks and user data. Avoid unnecessary dependencies and complexity.
- Do not claim production readiness, security, compatibility, or functionality without evidence.

**Non-goals:** Replacing every coding agent or tool; claiming universal harness compatibility; unrestricted autonomous execution; automatically approving discovered resources; or treating metadata checks as security audits.

## 3. Collaboration and repository operating preferences

These are project-level working constraints. Follow them unless the owner explicitly changes them:

- Keep work on **`main` by default**. Do not create branches or PRs for routine work. Use an isolated branch only when required by a platform, a risky parallel task, or an explicit owner request.
- Avoid branch sprawl, duplicate PRs, noisy commits, unnecessary refactors, and boilerplate.
- Inspect before changing. Preserve existing work. Make focused, complete changes.
- The owner expects substantive engineering, rigorous edge-case testing, honest limitations, and complete documentation updates.
- Update all affected documentation. A new feature must not leave README, roadmap, architecture, security, or agent instructions contradicting the implementation.
- For new repositories and major user-facing features, follow `docs/README-DEMO-STANDARD.md`. Prefer a high-quality animated GIF for a short visual workflow. Use real screenshots, a working interactive demo, or a reproducible project-appropriate alternative when better. Never fabricate a demo.
- Keep Resource Intelligence and Agent Orchestration as equal priorities.
- Do not enable unrestricted execution or weaken security controls to make a demo pass.

## 4. Architecture map

| Area | Responsibility | Current entry point |
|---|---|---|
| Resource catalog and discovery | Candidate resources, daily/weekly trending intake, metadata and evidence | `catalog/`, `scripts/discover_trending_repositories.py`, `.github/workflows/resource-discovery.yml` |
| Resource evaluation | Requirement-based filtering and ranking | `core/resource-engine/` |
| Resource registry | SQLite identity, metadata sync, deduplication proposals and review history | `core/resource-registry/` |
| Native knowledge | Original engineering methods and registry | `knowledge/`, `core/knowledge-engine/` |
| Shared contracts | Schema validation and problem/evidence/finding/capability/plan/verification records | `core/schema-engine/`, `core/problem-engine/` |
| Project intelligence | Bounded read-only repository scan and evidence-backed findings | `core/project-intelligence/` |
| Capability selection | Deterministic filtering/ranking against declarations and permissions | `core/capability-engine/` |
| Orchestration | Planning, technology assessment, policy, approvals, execution gate | `core/orchestrator/` |
| GitHub integration | Initial GitHub App/bootstrap integration | `integrations/github-app/`, `integrations/github/` |
| Agent guidance | Universal and harness-specific instructions | `AGENTS.md`, `agents/` |
| Bootstrap | Small local governance and continuity files for connected repositories | `bootstrap/template/` |
| Quality and governance | Hygiene, continuity, security and CI workflows | `scripts/repository-hygiene/`, `.github/workflows/` |

Read each package README before changing its code. The detailed component status and limitations are in `docs/PROJECT-STATE.md`.

## 5. Current implementation truth

**Implemented foundations:**
- Resource catalog, requirement-based evaluation, SQLite registry, metadata sync, and conservative deduplication.
- Daily and weekly GitHub Trending discovery. New records are candidates, not approved resources.
- Native knowledge registry and deterministic approved-only retrieval.
- Shared schema/problem contracts and deterministic capability selection.
- Bounded read-only project scan with JSON/Markdown reporting.
- Technology Decision Engine for opt-in comparisons using caller-supplied candidates and evidence.
- Orchestrator planning and dependency ordering.
- Canonical, versioned Policy Engine. Unknown actions are denied. Plan digests bind relevant repository, task, routing, technology-decision, and policy context.
- SQLite Approval Store with Ed25519-signed records, authenticated-decision callback, expiry, rejection, revocation, event history, and one-time consumption.
- Execution Gate that validates plan digest and dependency order, evaluates policy per action, checks current approvals, consumes approvals once, routes to one compatible adapter, requires an audit callback, and executes sequentially.
- Repository governance, README demo standard, project continuity protocol, hygiene checker, and CI checks.

**Partially implemented / important boundaries:**
- The Approval Store's authentication callback is an integration seam, not a production identity provider. The host must validate real credentials.
- Private-key provisioning, rotation, backup, and secure storage are host responsibilities.
- The Execution Gate has no production adapters. It is an orchestration boundary, not an OS/container sandbox.
- The audit callback is required for non-dry-run execution, but the repository does not provide a production durable/tamper-evident audit backend.
- A host must not expose raw adapter methods for direct invocation outside the gate.
- No complete multi-harness agent launch, coordination, retry, recovery, or independent runtime verification system exists.
- Pack manifests exist; pack installation, activation, dependency resolution, and safe removal do not.
- Project scan and trending discovery are bounded/metadata-driven. They do not prove source quality, security, legal compliance, or runtime behaviour.

**Do not describe DEVKIT as a secure autonomous execution platform or a complete unified workbench.**

## 6. Latest verified snapshot

The last reviewed repository snapshot was:

- Repository: `tanushgargjanuary-bot/Agent-Universal-Devkit`
- Default branch: `main`
- Reviewed HEAD: `72172341b537e320db22eb11fd94e57efcd36e12`
- Repository visibility returned by GitHub: **public**.
- Owner previously stated that the repository had been made private. This conflicts with live GitHub metadata. Treat visibility as an **owner action**; do not assume privacy and do not change it without owner direction.

Verification evidence at the last review:
- Orchestrator Core Tests: **63/63 passed** on implementation commit `c5565a1`.
- Orchestration quality: passed on that implementation sequence.
- Repository hygiene and continuity checks: passed on the follow-up documentation sequence.
- Secret-history scan: passed on the implementation and latest documentation commits.
- CodeQL: passed on reviewed HEAD `7217234`.
- Repository hygiene: passed on reviewed HEAD `7217234`.

These are dated results, not a guarantee about a later commit. Re-check current Actions before relying on them.

## 7. Immediate owner actions and repository state

- **Visibility:** Resolve the public/private mismatch in GitHub Settings. Do not put credentials or private keys in this repository.
- **Branches:** GitHub listed nine non-main branches at the last review. Prior content comparison found their changes represented in `main`; the project state records them as candidates for deletion. Re-check each branch against current `main` before deletion. The connected editing path did not provide branch deletion.
- **Branch protection:** Verify rulesets, required checks, review requirements, and force-push/deletion restrictions in GitHub. Documentation cannot prove these settings.
- **GitHub App:** Verify registration, webhook configuration, secret storage, deployment, and live delivery. Repository source/tests do not prove a deployed app works.
- **Secrets and identity:** Use external secret management. Never add tokens, signing keys, webhook secrets, or user credentials to Git history.

## 8. Recommended next work

Keep the two product pillars balanced. For the orchestration path, the safe order is:

1. Define and implement a host integration contract for real approver authentication, protected signing-key lifecycle, and durable audit storage.
2. Add a minimal read-only adapter that can only be invoked through the Execution Gate.
3. Add adversarial tests for direct adapter bypass, replay, revocation races, expiry boundaries, audit failures, malformed plans, cancellation, and partial execution.
4. Add process isolation and least-privilege controls before write-capable adapters.
5. Build bounded project-context assembly so agents can load verified project facts, conventions, commands, architecture, and active work without dumping the entire repository into context.

In parallel, continue Resource Intelligence:
- Run live daily/weekly discovery and review candidate quality.
- Improve evidence provenance, freshness, and conflict handling.
- Benchmark registry deduplication and resource evaluation.

Do not treat this ordering as permission to expand scope. Select one measurable milestone, record acceptance criteria, and finish it before starting unrelated work.

## 9. Required engineering workflow

For each meaningful task:

1. Inspect Git state, relevant files, tests, manifests, workflows, and current CI.
2. Confirm the intended outcome, constraints, and measurable acceptance criteria.
3. Challenge the design: assumptions, simpler options, boundary cases, concurrency, partial failure, security, rollback, and data loss.
4. Make the smallest complete change. Preserve existing conventions and user work.
5. Add regression tests for changed behaviour. Test negative paths and edge cases.
6. Run the relevant package tests, schema/config checks, repository hygiene, and security checks as appropriate.
7. Update all affected canonical docs. For implementation/configuration changes, update both `docs/PROJECT-STATE.md` and `docs/WORKLOG.md`. Update the roadmap when scope status changes.
8. Review the full diff, check for secrets and unrelated changes, and verify the final Git state.
9. Report exact commits, tests run, results, checks not run, limitations, and owner actions.

Useful commands:

```bash
node scripts/repository-hygiene/check.mjs
node core/project-intelligence/bin/repo-scan.js . --format markdown
```

For subsystem tests, read the package README and `package.json`, then run the documented command from that package directory. Several packages require Node.js 22 or later. Do not guess test commands.

## 10. Canonical records and precedence

- **This file:** fast startup map and handoff instructions.
- **`AGENTS.md`:** mandatory repository-wide agent rules.
- **`docs/PROJECT-STATE.md`:** detailed current implementation truth, architecture, next actions, verification, risks, and owner actions.
- **`docs/WORKLOG.md`:** chronological history. Old failures remain as history; the latest verified state wins.
- **`docs/ROADMAP.md`:** accepted future scope and milestone status.
- **Subsystem READMEs/source/tests:** actual component contracts and behaviour.
- **Git history and current CI:** evidence of what changed and what passed.
- **GitHub settings and deployed services:** external state; verify live.

If records conflict, do not silently choose the most optimistic statement. Verify source and tests, correct the stale documents, and record the correction in the work log. If the truth cannot be established, mark it **Unknown**.
