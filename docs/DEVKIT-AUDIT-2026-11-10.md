# DEVKIT Repository Audit — 2026-11-10

## Executive result

The repository has a strong set of documented foundations. The latest repository-hygiene, continuity, GitHub-bootstrap unit-test, and secret-history workflows passed on commit `a81276314e720ea86fc84a91b9befa6ba055fd5d`.

However, DEVKIT is **not ready for autonomous execution**. Several contracts are incomplete or inconsistent. The Resource Registry has concrete correctness defects. The GitHub bootstrap app is not deployed and does not update existing repositories.

This is a targeted static audit, not a formal penetration test or a full runtime certification.

## Audit scope

Reviewed:

- Every Markdown document under `docs/`.
- Root and bootstrap agent instructions, harness instruction files, subsystem READMEs, and project templates.
- Resource Engine, Resource Registry, Knowledge Engine, Orchestrator, Policy Engine, Technology Decision Engine, and GitHub App source.
- Relevant schemas, package manifests, tests, CI workflows, Dependabot configuration, resource and knowledge registries.
- Branches, open pull requests, open issues, repository metadata, and available GitHub Actions results.

Not fully verified:

- All package test suites were not executed in this audit session.
- The GitHub App was not installed or tested against a live webhook.
- Production deployment, branch protection, required status checks, and repository rulesets were not verified. The branch-protection endpoint did not grant access.
- No full dependency vulnerability or penetration test was run.

## Findings

### P1 — Fix before adding real executor adapters

#### 1. Approval digest does not bind the complete execution plan

**Evidence:** `core/orchestrator/src/index.js`, `createPlanDigest()`.

The digest includes the goal, repository, risk, and selected task fields. It omits execution-relevant fields such as preferred harness, tools, required capabilities, evidence, knowledge retrieval, and technology decision data.

If an executor uses these fields, they can change without changing the approval digest. An approval may then refer to a different execution route or context.

**Required action:** Define one canonical, versioned plan representation. Include every field that can affect scope, target, routing, permissions, or execution. Add tampering tests for each field.

#### 2. Policy definitions have two sources of truth

**Evidence:** `core/orchestrator/policy.yaml` and `core/orchestrator/src/policy-engine.js`.

The JavaScript engine uses hard-coded `ACTION_RULES`. It does not load the YAML policy. The YAML describes broad high/critical approval requirements, while the JavaScript rules use action-specific requirements. Some actions, including `run_tests` and `create_branch`, can pass without approval at critical risk.

**Required action:** Choose one authoritative policy source or generate the runtime catalogue from the policy file. Add parity tests. Explicitly classify test execution, branch creation, dependency changes, network access, and untrusted code.

#### 3. Orchestrator task schema does not match planner output

**Evidence:** `core/orchestrator/src/index.js` and `core/orchestrator/task.schema.json`.

The planner spreads input task fields and adds `knowledge_retrieval`. The schema rejects additional properties and does not define that field or several planner inputs. The planner does not validate its output against the schema.

**Required action:** Separate input and output schemas, define all supported fields, and validate every generated plan before policy evaluation or handoff.

### P1/P2 — Resource Registry correctness

#### 4. Registry CLI import path is incorrect

**Evidence:** `core/resource-registry/bin/resource-registry.js`.

The CLI imports `./src/index.js` from the `bin/` directory. The module is in the sibling `src/` directory. The relative import should be `../src/index.js`.

**Impact:** The documented CLI entry point cannot resolve its registry module.

#### 5. Registry updates can downgrade approved records

**Evidence:** `core/resource-registry/src/index.js`, resource validation and upsert logic.

A missing status defaults to `candidate`. The upsert conflict update writes that status over the existing record. A metadata-only update can therefore downgrade an approved record.

**Required action:** Preserve the existing status unless an explicit, validated status transition is requested. Add regression tests for approved, deprecated, and candidate records.

#### 6. Registry filtering happens after pagination

**Evidence:** `ResourceRegistry.list()` in `core/resource-registry/src/index.js`.

The SQL query applies LIMIT/OFFSET before status/category filtering in JavaScript. A filtered request can return fewer records than available and skip matching records on later pages.

**Required action:** Apply filters in SQL before LIMIT/OFFSET. Test pagination across mixed statuses and categories.

#### 7. Registry package has no CI coverage

**Evidence:** `core/resource-registry/package.json`, `.github/workflows/`, and `.github/dependabot.yml`.

The package has tests, but no dedicated workflow runs them. The package is also absent from Dependabot's npm directory list. No package lockfile was found.

**Required action:** Add a Node 22.13+ test workflow, lock dependencies, add the package to Dependabot, and test the CLI entry point.

### P2 — Resource and knowledge quality

#### 8. Hybrid resource selection can miss valid pairs and undercount cost

**Evidence:** `core/resource-engine/src/index.js`.

Hybrid search only combines the highest-ranked single resource with each lower-ranked resource. It can miss a valid pair that does not include the top-ranked resource. The integration-cost check uses the maximum individual cost, not the combined cost.

**Required action:** Evaluate all eligible pairs, calculate combined integration cost, and rank valid combinations. Add tests for pairs that exclude the top-ranked resource and for combined-cost limits.

#### 9. Knowledge Library has no approved entries

**Evidence:** `knowledge/registry.json`.

There are nine registered knowledge items. All nine have status `draft`. The Knowledge Engine retrieves approved-only entries, so the current production registry provides no approved knowledge to plans.

**Required action:** Independently review a small, high-value initial set. Approve only exact reviewed versions. Add real-task retrieval tests and retain the draft status for unverified entries.

### P2 — Distribution and operations

#### 10. Repository continuity is not yet deployed across existing repositories

**Evidence:** `integrations/github-app/README.md` and `integrations/github-app/src/index.js`.

The bootstrap app now has a tested allow-list for agent instructions, project rubrics, state/work-log templates, governance configuration, and the local checker. It only handles newly created repositories. It is not deployed. It never overwrites existing files, so it does not update old installations.

**Required action:** Design a versioned managed-file manifest. Update only files that still match the previously installed version. If a user changed a managed file, open a review PR instead of overwriting it. Deploy the app only after live webhook, permissions, opt-out, and failure tests pass.

#### 11. GitHub App dependency and runtime validation are incomplete

**Evidence:** `integrations/github-app/package.json` and its CI workflow.

The tests cover the bootstrap function with mocks. They do not install dependencies or start the Probot application. No lockfile was found. A Probot major-version Dependabot PR is open.

**Required action:** Add a lockfile, dependency installation, startup smoke test, and webhook integration tests before deployment.

#### 12. Duplicate CI runs increase noise

**Evidence:** `.github/workflows/resource-engine-tests.yml`, `resource-quality.yml`, `orchestrator-tests.yml`, and `orchestration-quality.yml`.

Some package test commands run in more than one workflow for the same changes.

**Required action:** Consolidate overlapping checks or separate their responsibilities clearly.

### P3 — Repository maintenance

#### 13. GitHub About description is empty

The repository API reports `description: null`. Add a short, accurate description. This requires repository metadata write access.

#### 14. Branch and PR cleanup is still required

The repository has `main`, seven feature branches, and four Dependabot branches. Six feature branches appear fully behind `main` with no unique commits. `feat/technology-decision-engine` is diverged; its technology-decision source file matches the current main version, but the full branch diff still needs review before deletion.

Four open PRs are Dependabot updates: #4, #13, #14, and #15. Review their checks and compatibility before merging. Do not merge or delete based only on branch names.

Open issue #9 records the persistent idea-capture and Vibecoder product direction. Keep it as a separate product-scope decision, not an automatic expansion of the current implementation.

#### 15. Repository protection is unverified

The branch-protection endpoint did not grant access during this audit. The owner must verify required status checks, branch protection or rulesets, and permissions on `main`.

## Verified current status

- Default branch: `main`.
- Latest audited commit: `a81276314e720ea86fc84a91b9befa6ba055fd5d`.
- Repository hygiene: **passed** — 124 files scanned, 0 errors, 0 warnings, 0 notes.
- Continuity diff enforcement: **passed**.
- GitHub bootstrap app tests: **passed**.
- Secret-history scan: **passed**.
- CodeQL: running when this audit snapshot was recorded.
- Core Resource Registry, Knowledge Engine, Resource Engine, and Orchestrator package suites were not all executed as part of this audit.

## Recommended implementation order

1. Fix Resource Registry CLI, status preservation, and filtered pagination. Add dedicated CI and dependency locking.
2. Fix plan digest coverage, policy source-of-truth, and task schema validation. Treat these as blockers before executor adapters.
3. Add adversarial policy tests for critical-risk actions, untrusted test execution, approval replay, and changed routing.
4. Build a safe existing-repository update mechanism and deploy the GitHub App after live tests.
5. Review and approve a small set of Knowledge Library entries.
6. Improve hybrid resource search and combined-cost calculation.
7. Consolidate stale branches, review Dependabot PRs, add the About description, and verify branch protection.

## Final assessment

DEVKIT has a useful foundation and a stronger continuity system after this work. It is not yet a universal autonomous engineering platform. The next major jump should be **correctness and enforceable execution contracts**, not a larger feature surface.
