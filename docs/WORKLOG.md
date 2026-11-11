# DEVKIT Project Work Log

Record meaningful work sessions so a different person or AI agent can continue without access to prior chats. Entries are factual. Do not log secrets or sensitive personal data. Do not rewrite old entries to conceal failures; add a correction entry instead.

## History

### 2026-11-11 — Complete agent handoff and cross-repository documentation

- **Scope:** Documentation-only completeness audit and reconciliation. No runtime capability is claimed as implemented.
- **Changes:** Added the canonical Agent Operating Model with session lifecycle, P0–P4 permissions, approval requirements, harness compatibility, multi-agent coordination, failure states, and completion criteria. Added the DEVKIT Hub / Cross-Repository Operations architecture with per-target access control, registry and plan contracts, partial-failure semantics, security gates, and staged delivery. Added the Context Export Specification with manifest, provenance, freshness, redaction, validation, and clean-room acceptance requirements. Added a Decision Register that separates recorded decisions from unknown historical context.
- **Reconciliation:** Aligned the intake order in HANDOFF.md, AGENTS.md, and AGENT-ONBOARDING.md. Corrected the next milestone to Project Context Assembly, followed by Context Export. Kept Host Trust Integration as a hard prerequisite for production adapters and write-capable execution. Corrected stale product-boundary wording about approval and replay protection. Linked the Hub and context-export specifications from the README, architecture, project state, and roadmap.
- **Commits:** 98d7b90, 3996dda, 60a3f11, 46ceae2, c145f31, 28ed8a9, 61a98ce, 711c265, be1f79d, a7e0f09, e66175d, 99ff98f, 70a311b, a4754a4, 35db803.
- **Verification:** Documentation changes were applied through GitHub's file API on main. No local checkout was available, so Markdown linting, link checking, repository hygiene, package tests, and a clean-room handoff test were not run in this session. Current CI must be checked before treating the documentation pass as verified.
- **Known limits:** The Context Exporter, DEVKIT Hub runtime, portfolio registry, cross-repository planner, permission broker, durable operation ledger, production adapters, and host-trust services are not implemented by this documentation work. Historical failed experiments not preserved in Git or the work log remain unknown.
- **Next action:** Build Project Context Assembly as the next engineering milestone. Then implement the Context Exporter and run a clean-room test. Start Hub Phase 0 only after those foundations are validated. Do not enable production write execution before Host Trust Integration and independent security review.

### 2026-11-10 — Add project intelligence and continuity protocol
- **Commit:** `2625ded2f2d160660f4173244a999fc4d2da1311`
- **Goal:** Make connected repositories recoverable across agent failures, context loss, and changes of AI environment. Add a robust planning protocol and future-scope discipline.
- **Changes:** Added `docs/PROJECT-INTELLIGENCE-AND-CONTINUITY.md`; added bootstrap templates for `docs/PROJECT-STATE.md` and `docs/WORKLOG.md`; updated root and bootstrap agent instructions, repository organisation guidance, README, CONTRIBUTING, and roadmap.
- **Verification:** Inspected the complete Git tree (115 files) and selected governance, bootstrap, subsystem, and workflow docs. GitHub commit and main ref update succeeded. Automated tests and CI were not run in this remote editing session.
- **Decisions:** Keep one concise project-state handoff record and one chronological work log. Link to canonical documentation rather than copying it. Require planning and devil's advocate review proportional to task risk. Classify future ideas separately from accepted scope.
- **Open risks / blockers:** Automated continuity-document presence and freshness checks are not implemented. Full DEVKIT repository audit is pending. Bootstrap installer behaviour must be checked before claiming templates are automatically installed.
- **Next action:** Complete the full DEVKIT audit, then implement and test continuity enforcement in the hygiene checker and bootstrap workflow.

### 2026-11-10 — Enforce continuity updates across code and documentation changes
- **Commits:** `26d1471`, `43afa67`
- **Goal:** Prevent meaningful project changes from being merged without a durable handoff update.
- **Changes:** Added a Git-diff continuity checker. Implementation/configuration changes require both project-state and work-log updates. Documentation-only changes require a work-log entry. L1 repositories receive warnings; L2–L4 receive errors. CI now runs the diff check for relevant project paths.
- **Verification:** Awaiting the GitHub Actions run for this commit. Do not treat the check as passed until the run completes.
- **Open risks / blockers:** Static checks cannot verify the quality or truth of a handoff entry. The bootstrap app is not deployed and does not update existing repositories.
- **Next action:** Verify CI, finish the DEVKIT audit, and prioritise the existing-repository update mechanism.

### 2026-11-10 — Require substantive continuity records
- **Commit:** `113bceadd5a15bf08fdbe93d8e3f63c65b7a1143`
- **Goal:** Prevent empty template fields or empty work-log edits from satisfying the continuity gate.
- **Changes:** Added project-state placeholder detection and required a new dated work-log entry for each meaningful code or documentation change.
- **Verification:** Awaiting GitHub Actions after correcting regex escaping in the checker implementation.
- **Open risks / blockers:** The checker still cannot prove that a work-log entry is accurate or that project-state content fully describes the implementation.
- **Next action:** Verify CI and complete the remaining DEVKIT audit.

### 2026-11-10 — Tighten work-log entry validation
- **Commit:** `072275ac3debc66e5fbf18620c46a66a828610f9`
- **Goal:** Ensure a documentation update contains a new dated work-log entry, not only a file touch.
- **Changes:** Added placeholder checks for unfilled project-state templates. The diff checker now compares work-log entries against the base commit and requires a new dated entry.
- **Verification:** Awaiting GitHub Actions.
- **Open risks / blockers:** The checker verifies structure and changed entries, not factual accuracy.
- **Next action:** Verify the new tests and finish the DEVKIT audit.

### 2026-11-10 — Correct continuity checker regex regression
- **Commit:** `75ba2e9c2bf2d13395d2d39aef8ef6d98ac95af7`
- **Goal:** Restore the canonical checker syntax after the first placeholder-check implementation escaped existing path expressions incorrectly.
- **Changes:** Reapplied the placeholder and work-log-entry checks on top of the last passing checker implementation without changing existing escape sequences.
- **Verification:** Awaiting GitHub Actions.
- **Open risks / blockers:** The new checks must pass in CI before they are considered active.
- **Next action:** Verify tests, then finish the DEVKIT audit.

### 2026-11-10 — Prevent continuity policy bypass
- **Commit:** `a81276314e720ea86fc84a91b9befa6ba055fd5d`
- **Goal:** Prevent L2–L4 repositories from disabling continuity checks or lowering governance level to bypass them.
- **Changes:** L2–L4 enforce continuity checks even if configuration attempts to disable them. The diff checker compares base and head governance levels and rejects downgrades. L1 opt-out remains available.
- **Verification:** Awaiting GitHub Actions.
- **Open risks / blockers:** The owner must protect governance configuration and review any L1 classification.
- **Next action:** Verify adversarial tests and finish the DEVKIT audit.

### 2026-11-10 — Complete targeted DEVKIT audit
- **Audited commit:** `a81276314e720ea86fc84a91b9befa6ba055fd5d`
- **Report:** `docs/DEVKIT-AUDIT-2026-11-10.md`
- **Scope:** All `docs/` Markdown files, root/bootstrap agent instructions, harness and subsystem READMEs, core engine source and tests, package manifests, schemas, CI workflows, GitHub App, registries, branches, PRs, issues, and repository metadata.
- **Findings:** Approval digest omits execution-relevant plan fields; policy YAML and JavaScript rules are separate sources; task schema and planner output disagree; Resource Registry CLI import path is wrong; registry upserts can reset status; list filters run after pagination; registry has no CI; hybrid search is incomplete; all nine knowledge entries are drafts; GitHub App is not deployed and cannot update existing repositories.
- **Verification:** Repository hygiene passed on `a812763` (124 files, 0 errors, 0 warnings, 0 notes); continuity diff enforcement passed; GitHub bootstrap tests passed; secret-history scan passed. CodeQL was still running. All core package suites were not run in this audit.
- **Owner actions:** Add GitHub About description and verify branch protection/rulesets. 
- **Next action:** Fix Resource Registry correctness and CI, then close orchestrator approval-contract gaps before building executor adapters.

### 2026-11-10 — Document continuity enforcement boundaries
- **Commit:** `7899c83ac467a7ced3d8ad949f657d8e2a6d5108`
- **Goal:** Make the governance-level restrictions explicit to repository owners and agents.
- **Changes:** Documented that L2–L4 cannot disable continuity checks or downgrade governance in the same change set. L1 opt-out remains available for genuine prototypes.
- **Verification:** Documentation-only update; continuity diff CI will verify a new work-log entry.
- **Next action:** Begin the first remediation phase from the audit report.

### 2026-11-10 — Reconcile continuity work-log references
- **Commit:** recorded in Git history with this entry.
- **Goal:** Replace temporary pending commit references after the related CI runs completed.
- **Changes:** Recorded the final commit identifiers for the continuity checker fixes, governance bypass protection, and governance documentation.
- **Verification:** Repository hygiene and secret-history workflows passed on the latest documentation commit.
- **Next action:** Start Resource Registry remediation from the audit report.

### 2026-11-10 — Capture exploratory broader product vision
- **Commit:** `6f67735ed6d2936636287813f7471a9da29bb62e`
- **Goal:** Preserve an expanded direction for repo-scan and adjacent developer capabilities without silently expanding the approved project scope.
- **Changes:** Added `notes/DEVKIT-BROADER-VISION-NOTES.md`. It frames repo-scan as the entry point to a Project Intelligence lifecycle: discover, understand, assess, explain, prioritise, plan, act, verify, remember, and monitor. It records candidate capability families, a shared project model, user workflows, safety requirements, possible sequencing, success measures, and a devil's-advocate review.
- **Status and boundary:** The note explicitly states that it is informal, non-professional, non-authoritative, for convenience only, and not an official project document or approved scope. Canonical vision, principles, architecture, and roadmap remain authoritative.
- **Verification:** Confirmed the note was created on `main`. No code or runtime behaviour changed; no test suite was run.
- **Decision:** Treat Project Intelligence as an exploratory umbrella direction and repo-scan as a possible first entry point. Do not promote candidate features into the roadmap without explicit review and a validated use case.
- **Next action:** When implementation is requested, inspect current code and define a narrow, evidence-backed repo-scan MVP before changing architecture or adding scanner breadth.

### 2026-11-10 — Define unified problem-solving workbench direction
- **Commits:** `03ba239`, `54bfb42`, `86a2da0`, `3084b20`, `56fda19`
- **Goal:** Define how DEVKIT can support a broad range of developer and technical problems through one coherent product experience, without becoming a monolith or a disconnected collection of utilities.
- **Changes:** Added `docs/UNIFIED-PROBLEM-SOLVING-MODEL.md` as a canonical strategy document. Updated Vision and Scope, Product Principles, Roadmap, and README to describe one user-facing problem-solving workbench, a shared lifecycle, reusable specialist capabilities, domain packs, integration adapters, and multiple interfaces over common contracts.
- **Decisions:** "All features in one place" means one entry point and shared problem lifecycle, not one giant implementation. Users describe outcomes; DEVKIT selects capabilities and existing tools. Workflows must share context, evidence, findings, plans, actions, verification, and memory contracts. Integrate mature tools instead of rebuilding them. Support human-led, agent-led, hybrid, and unsupported outcomes. Repo-scan is the first candidate workflow, not the whole product.
- **Scope boundary:** Broad domain support is a strategic direction, not a claim of current capability and not approval to build every listed feature immediately. The first proof must be a complete, narrow workflow from problem intake to independently verified outcome.
- **Verification:** Documentation changes were committed to `main` and are being checked by fetching the resulting files. No code or runtime behaviour changed; no test suite was run.
- **Open risks:** The shared contracts, capability discovery, project context layer, and end-to-end execution lifecycle are not yet implemented as a complete system. The current Policy Engine remains a decision core, not executor-side enforcement.
- **Next action:** Before implementing repo-scan breadth, design and validate the shared problem/evidence/finding/capability/plan/verification contracts, then prove one end-to-end repo-scan-to-verified-fix workflow.

### 2026-11-10 — Implement the first shared problem-contract foundation
- **Commit:** Recorded in Git history for this implementation change.
- **Goal:** Start the unified problem-solving workbench with reusable, versioned contracts instead of disconnected feature-specific data models.
- **Changes:** Added `core/schema-engine/` with a dependency-free validator for a documented JSON Schema subset. Added `core/problem-engine/` with versioned schemas and APIs for problem, evidence, finding, capability, plan, and verification records. Added semantic validation for plan step uniqueness, dependency references, self-dependencies, cycles, and verification outcome consistency. Preserved the Knowledge Engine's validator import through a compatibility re-export. Added package documentation, adversarial tests, and a dedicated GitHub Actions workflow. Updated architecture, README, roadmap, and project state.
- **Decisions:** Keep records versioned and reject unknown fields. A capability declaration is descriptive metadata, not permission to execute. A plan is not an approval. Verification summaries must agree with individual checks. Use a small supported schema subset and test every supported keyword rather than claiming full JSON Schema compliance.
- **Verification:** The shared-contract workflow is added and will run after this commit. Results are pending. No tests are claimed as passed until the workflow completes.
- **Limitations:** No persistent store, cross-record reference resolution, capability registry, capability selection, problem intake, execution adapter, approval lifecycle, or end-to-end workflow is implemented yet.
- **Next action:** Verify shared-contract CI. Then design the capability registry and selection contract, followed by read-only project discovery and the first repo-scan workflow.

### 2026-11-10 — Correct shared schema validation and contract test cases
- **Commit:** Pending Git history.
- **Trigger:** The first Shared Contract Tests workflow failed. Five schema-engine tests passed. One test showed that a JavaScript Date object passed the JSON Schema `object` type check. The Problem Engine and Knowledge Engine test steps were skipped because the workflow stopped after the first failure.
- **Changes:** Changed the schema engine's object type check to accept only plain JSON objects. Rewrote the problem-contract tests with explicit invalid-record fixtures and readable test cases. Added a check that completed verification steps must include evidence. Unrun checks remain exempt from that evidence requirement.
- **Verification:** The corrected workflow run is pending. The initial failure remains recorded; it is not hidden or overwritten.
- **Next action:** Confirm all three workflow test steps pass. Then proceed to capability registry and selection design.

### 2026-11-10 — Verify and harden the shared contract foundation
- **Commit:** `de0ea2625f188469b628053cfcb40ad1f8c05a7a`
- **Goal:** Correct the first CI failure and ensure shared records reject non-JSON object instances and unsupported verification claims.
- **Changes:** Restricted JSON Schema object values to plain objects. Rewrote problem-engine tests to cover invalid records, duplicate steps, missing/self dependencies, cycles, evidence requirements, and inconsistent verification summaries.
- **Verification:** Shared Contract Tests passed: schema engine 6/6, problem engine 7/7, knowledge engine 30/30. Repository hygiene passed: 142 files, zero errors, warnings, or notes. Continuity diff passed. Secret history scan passed. CodeQL was still running when this entry was prepared.
- **Decision:** Keep the schema validator's supported subset explicit. Do not claim full JSON Schema support.
- **Next action:** Build a deterministic capability selector that checks problem fit, explicit permissions, execution modes, active status, and verification support before a capability can be recommended.

### 2026-11-10 — Add deterministic capability filtering and ranking
- **Commit:** `cf35039276dcd771f5d3817f1cbdbbc92205e257`
- **Goal:** Give the unified workbench a shared way to find suitable specialist capabilities without hard-coding feature names into every workflow.
- **Changes:** Added `core/capability-engine/`. It validates capability records, filters by problem domain and optional problem type, requires explicit permission grants, defaults to read-only/recommend modes, requires declared verification methods, gates experimental capabilities behind opt-in, rejects duplicate IDs, and ranks candidates deterministically by user preference, domain match, declared cost, and ID. Added tests, package documentation, CI coverage, and architecture/roadmap updates.
- **Verification:** Shared Contract Tests passed: schema engine 6/6, problem engine 7/7, capability engine 8/8, knowledge engine 30/30. Repository hygiene passed: 142 files, zero errors, warnings, or notes. Continuity diff passed. Secret history scan passed. CodeQL was still running at the time of this entry.
- **Decisions:** The selector returns a recommendation and alternatives; it does not invoke capabilities. Missing permission is a hard rejection. Experimental capabilities require explicit opt-in. The ranking is deterministic metadata ranking, not a quality guarantee.
- **Limitations:** No persistent capability registry, provenance review, compatibility proof against live tools, capability composition, or execution adapter exists yet.
- **Next action:** Add capability provenance and compatibility checks. Then build read-only project discovery and the first repo-scan workflow over the shared problem/evidence/finding/capability contracts.

### 2026-11-10 — Tighten capability compatibility filtering
- **Commit:** Pending Git history.
- **Goal:** Prevent the capability selector from recommending a capability that lacks required inputs or cannot produce the requested output.
- **Changes:** Added optional `required_input_types` to the capability contract. The selector now checks available input types and required output types before permission and execution-mode checks. Added tests for missing inputs, unsupported outputs, and explicit write-mode rejection. Fixed the shared-contract workflow path filter so capability-engine changes also trigger tests on pull requests.
- **Verification:** The previous selector suite passed 8/8 tests. The expanded suite and updated workflow are pending CI.
- **Next action:** Confirm the expanded selector tests and pull-request path trigger. Then move to read-only project discovery and repo-scan.

### 2026-11-10 — Verify capability input/output and execution-mode filters
- **Commit:** `05d15fd87c64ade8fe025b4caa68638a38e73ee6`
- **Goal:** Make capability matching reject missing required inputs, unsupported requested outputs, and disallowed execution modes before ranking.
- **Changes:** Added optional `required_input_types` to capability records. Added `available_input_types` and `required_output_types` selector constraints. Added explicit tests for read-only defaults, write-mode rejection, missing inputs, and unsupported outputs. Fixed the shared-contract workflow's pull-request path filter for the capability engine.
- **Verification:** Shared Contract Tests passed: schema engine 6/6, problem engine 7/7, capability engine 9/9, knowledge engine 30/30. Repository hygiene passed: 142 files, zero errors, warnings, or notes. Continuity diff passed. Secret history scan passed. CodeQL remained in progress.
- **Decision:** The selector must reject a candidate before ranking if required inputs, outputs, permissions, execution modes, domain, problem type, status, or verification declarations do not fit.
- **Limitations:** Selection is still deterministic metadata filtering/ranking. It does not prove runtime compatibility, persist capabilities, compose workflows, or execute them.
- **Next action:** Build read-only project discovery and a first repo-scan workflow. Keep write execution disabled until policy and executor gaps are fixed.

### 2026-11-10 — Build the first read-only repo-scan workflow
- **Commit:** Pending Git history.
- **Goal:** Prove the shared problem/evidence/finding/capability foundation with a useful repository assessment workflow.
- **Changes:** Added `core/project-intelligence/` with bounded repository discovery and deterministic checks for README, license, CI, test signals, dependency lockfiles, and malformed package manifests. The scanner emits shared Evidence and Finding records. It skips dependency/generated directories, does not follow symlinks, enforces file/depth/manifest-size limits, and suppresses absence findings when discovery is incomplete. Added tests, package documentation, CI coverage, and architecture/roadmap updates.
- **Safety:** The scanner is read-only. It does not execute repository scripts, install dependencies, access the network, or run tests. It does not claim full security, source-quality, or runtime analysis.
- **Verification:** CI results are pending. Do not claim this workflow is complete until the new package tests, repository hygiene, continuity, secret scan, and CodeQL checks are reviewed.
- **Next action:** Review false-positive behaviour on more fixture repositories, then add additional scanners only when they can produce reproducible evidence.

### 2026-11-10 — Correct repo-scan language-count test expectation
- **Commit:** Pending Git history.
- **Trigger:** The first Project Intelligence test run passed six of seven tests. The discovery fixture contains two TypeScript files, but the assertion expected one.
- **Changes:** Corrected the expected TypeScript file count to two. No scanner behaviour was changed.
- **Verification:** The corrected shared-contract workflow is pending. The initial failure remains recorded.
- **Next action:** Confirm the full shared-contract, hygiene, secret scan, and CodeQL results.

### 2026-11-10 — Record repo-scan verification and reconcile continuity state
- **Commit:** Pending Git history.
- **Goal:** Record the corrected repo-scan test results and satisfy the repository's project-state continuity gate.
- **Verification:** Shared Contract Tests passed: schema engine 6/6, problem engine 7/7, project intelligence 7/7, capability engine 9/9, knowledge engine 30/30. Repository hygiene unit tests passed 13/13. The first continuity diff run failed because the test-only correction changed an implementation path without updating PROJECT-STATE. This commit updates the state record. Secret history scan passed. CodeQL was still running.
- **Changes:** Updated the verification table and handoff state to record the repo-scan result and the continuity-check failure accurately.
- **Next action:** Confirm the continuity diff passes on this commit, then review CodeQL and continue scanner hardening.

### 2026-11-10 — Establish the README Demonstration Standard and extend repo-scan
- **Commit:** Pending Git history.
- **Goal:** Make new repositories and major user-facing features easy to understand through real product demonstrations, not README prose alone.
- **Changes:** Added `docs/README-DEMO-STANDARD.md`. It prefers high-quality short animated GIFs for workflows, screenshots for static states, video for longer sequences, working interactive demos where useful, and terminal/API/notebook/runnable examples for non-visual projects. It requires real working behaviour, alt text, captions, reproduction steps, optimised media, verified local assets/links, and protection of secrets/private data. Updated root and bootstrap agent instructions, Copilot guidance, universal agent guidance, the continuity protocol, and GitHub App bootstrap allow-list/tests. Extended Project Intelligence to detect a limited set of README demo signals and emit a low-severity suspected finding when none is detected. Badge-only images do not count. Oversized or unreadable READMEs do not trigger absence findings.
- **Decisions:** A GIF is preferred, not mandatory when it is a poor fit. Do not fabricate screenshots or force visual demos for CLI/library projects. Provide the best real alternative and record why. README scanning is heuristic only; it does not render images, validate links, judge visual quality, or prove functionality.
- **Verification:** New Project Intelligence and GitHub App bootstrap tests are added. CI results are pending.
- **Next action:** Review the new scanner tests and bootstrap workflow results. Then improve repo-scan coverage with labelled fixtures and architecture/context extraction.

### 2026-11-10 — Correct README demo scanner placement after CI failure
- **Commit:** Pending Git history.
- **Trigger:** The first Shared Contract Tests run passed schema-engine 6/6 and problem-engine 7/7, then failed to parse Project Intelligence. CI showed an `await` statement inside the synchronous framework detector.
- **Cause:** The README inspection block was inserted at the first dependency-manifest marker, which belonged to framework detection rather than repository discovery.
- **Changes:** Moved README reading and demo detection into the asynchronous repository-discovery function. Kept framework detection synchronous. Added a real symlinked-README fixture so the scanner proves it does not follow README symlinks. Added the missing Project Intelligence pull-request path filter.
- **Verification:** Corrected tests and workflow are pending. The failed run remains recorded. Repository hygiene, GitHub bootstrap app tests, and secret history scan passed on the original feature commit.
- **Next action:** Confirm all Project Intelligence, shared contract, repository hygiene, bootstrap, secret scan, and CodeQL checks.

### 2026-11-10 — Verify README demonstration policy and repo-scan heuristics
- **Commit:** `51b0cfc23a992525194d0aa3b151047d348199cb`
- **Goal:** Correct the first README scanner CI failure and verify the new policy, bootstrap, and detection behaviour.
- **Changes:** Moved asynchronous README inspection into repository discovery, added a symlinked README fixture, and added the missing Project Intelligence pull-request path filter.
- **Verification:** Shared Contract Tests passed: schema engine 6/6, problem engine 7/7, project intelligence 10/10, capability engine 9/9, knowledge engine 30/30. Repository hygiene passed: 152 files, zero errors, warnings, or notes; continuity diff passed. Secret history scan passed. CodeQL was still running at this update.
- **Decision:** README demo detection remains a low-confidence signal, not a quality or functionality verdict. The README standard allows a project-appropriate alternative when a GIF or screenshot is not suitable.
- **Next action:** Add a user-facing read-only CLI that emits structured JSON or readable Markdown. Then expand repository understanding with architecture and entry-point evidence.

### 2026-11-10 — Add a read-only repo-scan CLI and Markdown report
- **Commit:** `be4768b3c5cbb43009d9c8f15ab524a6f1ab8f0d`
- **Goal:** Make the initial repo-scan usable without writing a custom JavaScript integration.
- **Changes:** Added the `repo-scan` package executable with a repository path and `--format json|markdown`. Added a Markdown report renderer that escapes untrusted text, includes project profile, finding severity/status/confidence, evidence, coverage, and limitations. The CLI writes to stdout, does not create files, and does not execute project scripts, install dependencies, or access the network. Updated package and root README usage.
- **Verification:** Shared Contract Tests passed: schema 6/6, problem 7/7, project intelligence 17/17, capability 9/9, knowledge 30/30. Secret history scan passed. Repository hygiene unit tests passed, but the continuity diff failed because this implementation commit did not update PROJECT-STATE and WORKLOG; the repository scan step was skipped. CodeQL was still running at this update.
- **Correction:** This follow-up updates the continuity records. The continuity failure is recorded, not concealed.
- **Next action:** Improve deterministic project architecture and entry-point discovery with labelled fixtures and explicit coverage limits.

### 2026-11-10 — Add deterministic architecture and entry-point signals
- **Commit:** Pending Git history.
- **Goal:** Help developers and agents locate likely application entry points and understand broad repository layout before deeper source analysis.
- **Changes:** Added candidate detection from common source paths and root package manifest fields (`main`, `module`, `browser`, and `bin`). Added launch-script names, top-level components, workspace candidates, and coarse architecture signals to the repository profile. The Markdown report now displays these fields. Root package manifest selection is deterministic and does not allow a nested package manifest to overwrite the root manifest.
- **Safety and limits:** No source files are parsed or executed for this feature. Entry points are candidates, not verified runtime entry points. Workspace folders are hints, not proof of a monorepo. No dependency graph or semantic architecture graph is claimed.
- **Verification:** New multi-package and nested-manifest tests are added. Shared Contract Tests and repository hygiene results are pending.
- **Next action:** Build a labelled fixture corpus across supported ecosystems and use it to measure discovery accuracy before adding more heuristics.

### 2026-11-10 — Correct architecture-signal renderer and fixture failures
- **Commit:** Pending Git history.
- **Trigger:** The first architecture-signal CI run passed schema-engine and problem-engine tests but failed Project Intelligence. The Markdown report renderer had a malformed array closure. A separate fixture expected a declared entry point under `dist/` to be inventoried, but `dist/` is deliberately excluded from repository discovery.
- **Changes:** Corrected the Markdown renderer's architecture section and changed the fixture to use a non-generated `lib/` path. The scanner continues to mark declared manifest targets absent from its bounded inventory when they are in excluded/generated directories.
- **Verification:** Corrected shared tests are pending. Repository hygiene and secret history scan passed on the original architecture-signal commit. The failure remains recorded.
- **Next action:** Confirm the corrected Project Intelligence tests, then run the scanner against representative multi-ecosystem fixtures before expanding heuristics.

### 2026-11-10 — Correct stale entry-point fixture assertion
- **Commit:** Pending Git history.
- **Trigger:** The corrected report renderer and CLI tests passed. One entry-point test still asserted the old `dist/index.js` path after the fixture was moved to `lib/index.js` because generated directories are intentionally excluded.
- **Changes:** Updated the assertion to check the actual `lib/index.js` manifest target.
- **Verification:** Corrected Shared Contract Tests and repository hygiene are pending. The previous failure remains recorded.
- **Next action:** Confirm all shared subsystem tests and repository hygiene pass before expanding repo-scan.

### 2026-11-10 — Make README demonstrations a mandatory bootstrap requirement
- **Commit:** Pending Git history.
- **Goal:** Ensure every AI agent that starts work in a newly bootstrapped repository is instructed to produce a real, high-quality project demonstration.
- **Changes:** Strengthened the canonical README Demonstration Standard and its bootstrap copy. Short visual workflows now default to an actively attempted, highest-quality suitable animated GIF captured from the real running project. Static workflows use screenshots; longer workflows use video; interactive products use working demos; CLI, API, library, data, and infrastructure projects use a real terminal capture or the strongest runnable, verifiable alternative. Added a reproducible CLI demo command and accurate workflow diagram to the DEVKIT README; explicitly deferred a terminal GIF until it can be captured from a verified live run.
- **Safety:** No fabricated screenshots, terminal output, live links, or unimplemented behaviour. No secrets or private data in demos.
- **Verification:** The parent commit `3246000` passed shared tests (schema 6/6, problem 7/7, project intelligence 19/19, capability 9/9, knowledge 30/30), repository hygiene (155 files, zero errors/warnings/notes), continuity diff, secret history scan, and CodeQL. The new bootstrap tests and instructions are pending CI.
- **Next action:** Verify the bootstrap instruction propagation and then build a labelled multi-ecosystem fixture corpus for repo-scan.

### 2026-11-10 — Narrow the README demo placeholder test
- **Commit:** Pending Git history.
- **Trigger:** The new bootstrap instruction test passed its propagation assertions but failed the placeholder check. It searched for the text `example.com` anywhere, which also appears in the standard's warning that finished READMEs must not use placeholder URLs.
- **Change:** Narrowed the assertion to reject an actual Markdown link to `https://example.com/`, not a textual warning about placeholders.
- **Verification:** The first bootstrap run had 6 passed and 1 failed. The corrected test and full CI rerun are pending. No implementation failure was observed.
- **Next action:** Confirm bootstrap tests, repository hygiene/continuity, secret-history scan, and CodeQL.

### 2026-11-10 — Add runnable README examples and a labelled ecosystem fixture corpus
- **Commit:** Pending Git history.
- **Goal:** Make README demo detection recognise runnable CLI demonstrations and establish repeatable evidence for supported ecosystem detection.
- **Changes:** Added a conservative parser for fenced command blocks inside Demo/Examples/Screenshots sections. It recognises a bounded set of common CLI commands and ignores installation commands outside those sections. Added labelled synthetic fixtures for Node/Express, Python/FastAPI, Rust, Go, JVM (Maven and Gradle), .NET, PHP/Composer, Ruby/Bundler, and a mixed Node/Python/Rust workspace. Tests assert ecosystems, language signals, frameworks, and manifest paths. Documented the exact heuristic limits.
- **Safety:** Fixture files are data only. The scanner does not execute fixture commands or project scripts. Runnable-example detection is a README signal, not proof that the command succeeds.
- **Verification:** New Project Intelligence tests and CI results are pending. The preceding bootstrap test passed 7/7; repository hygiene passed with 155 files and zero errors/warnings/notes; continuity diff, secret history scan, and CodeQL passed on commit `11cba99`.
- **Next action:** Run the complete test workflow. Then validate entry-point/workspace discovery and build the bounded agent context pack.

### 2026-11-10 — Correct runnable README command detection
- **Commit:** Pending Git history.
- **Trigger:** The first fixture-corpus run passed the ecosystem recognition test and 22 of 23 Project Intelligence tests. The new runnable README example test showed that the first line-by-line fence parser did not recognise the CLI block.
- **Change:** Replaced the stateful line parser with section-bounded heading parsing and fenced-code extraction. A signal is emitted only when a recognised command appears in a fenced block under a Demo/Examples/Screenshots section. Installation commands outside those sections remain excluded.
- **Verification:** Corrected Project Intelligence and full CI are pending. The failed run remains recorded.
- **Next action:** Confirm the parser test and the complete fixture corpus pass.

### 2026-11-10 — Correct the README runnable-example test fixture
- **Commit:** Pending Git history.
- **Trigger:** The second Project Intelligence run still passed 22 of 23 tests. Inspection of the failing fixture showed that the test wrote literal backslash-n sequences instead of newline characters. The production heading and fenced-code parser was not receiving separate Markdown lines.
- **Change:** Rebuilt the test README from an array of lines joined with actual newline characters. Kept the negative installation-section case.
- **Verification:** Corrected Project Intelligence and full CI are pending. The ecosystem fixture corpus passed in both runs.
- **Next action:** Confirm both runnable-example tests and all ecosystem fixture cases pass.

### 2026-11-10 — Prevent README title headings from becoming demo sections
- **Commit:** Pending Git history.
- **Trigger:** The corrected positive README example test passed. The negative test exposed that a generic H1 document title, `# Example`, was treated as a demo section and caused an installation command in a later H2 section to be counted.
- **Change:** Require recognised demo/example headings to be H2 or deeper. This matches common README structure and avoids treating the project title as a demonstration section.
- **Verification:** Corrected Project Intelligence and full CI are pending.
- **Next action:** Confirm the positive and negative README tests, ecosystem fixture corpus, and full CI.

### 2026-11-10 — Add daily and weekly trending resource intake
- **Goal:** Discover GitHub repositories trending over daily and weekly windows, apply deterministic intake filters, and add qualifying projects to the resource catalog without treating popularity as approval.
- **Changes:** Added a standard-library-only GitHub Trending page parser and GitHub API metadata enrichment. Added filters for archived, disabled, forked, undescribed, low-star, unlicensed, missing-default-branch, and stale repositories. New records are appended to `catalog/resources.yaml` as `status: candidate`; license review remains `unreviewed`; maintenance/security remain `not_assessed`; evaluation remains `not_evaluated`. Added a JSON report with both feeds, accepted/rejected results, reasons, and limitations. The resource-discovery workflow now runs daily, tests the filters, and opens or updates a review PR. Its automation branch push handles both first creation and later lease-protected updates.
- **Safety:** Discovery does not clone, install, build, or execute external repositories. It does not approve, install, or recommend resources. Both feeds must parse before catalog changes are written. API failures stop the run; 404 repositories are recorded as unavailable. GitHub Trending is HTML, not a stable API, so markup changes can require maintenance.
- **README demo policy:** Root, universal-agent, and bootstrap instructions already require agents to attempt the highest-quality suitable animated GIF for short visual workflows. They require screenshots, video, interactive demos, or verified runnable alternatives when these fit better. They prohibit fabricated media.
- **Verification:** Added unit tests for feed parsing, metadata filters, candidate status/provenance, and idempotent catalog updates. CI has not run on this branch yet. The first scheduled run has not been observed.
- **Next action:** Run CI, then trigger the workflow manually and inspect the resulting candidate PR before merging.

### 2026-11-10 — Verify trending discovery pull-request checks
- **Verification:** Repository hygiene workflow passed. Python compilation passed. Trending discovery unit tests passed (5/5). Continuity diff and repository hygiene scan passed. Secret history scan passed. CodeQL was still running at the time of this update.
- **Correction:** The generated YAML candidate block is indented under the existing `resources:` list. A regression test checks this indentation and idempotent append behaviour. The workflow also handles a missing automation branch on its first run and uses a lease-protected update when the branch already exists.
- **Next action:** Wait for CodeQL, then review the PR's required checks. Run the discovery workflow after merge and inspect the first generated candidate PR.

### 2026-11-10 — Harden trending repository intake
- **Changes:** Reject non-public repositories and validate owner/repository path segments before constructing GitHub API URLs. Confirm the API returns the requested canonical repository identity. Added regression coverage for malformed paths and private repository metadata.
- **Verification:** The previous repository-hygiene run passed the parser, filter, YAML indentation, and idempotency tests. The new security checks and first-run-safe workflow push are awaiting the next CI run.
- **Next action:** Confirm the latest repository-hygiene, secret-history, and CodeQL checks. Keep the PR open until required checks complete.

### 2026-11-10 — Confirm post-hardening trending discovery checks
- **Verification:** On the squashed PR head, Python compilation passed; all 5 trending-discovery unit tests passed; repository hygiene, continuity diff, and secret history scan passed. CodeQL analysis was still running at the time of this entry.
- **Scope:** This validates parser/filter logic and generated YAML indentation. It does not validate the live GitHub Trending page markup or complete a live discovery run.
- **Next action:** Wait for CodeQL. After merge, run the scheduled/manual discovery and inspect the generated candidate entries before approving them.


### 2026-11-10 — Complete PR #16 review and CI verification
- **Review:** Inspected the complete PR patch, including the daily/weekly feed parser, GitHub API enrichment, candidate filters, catalog writer, workflow, tests, and documentation.
- **Documentation correction:** Updated the project-state verification record after CodeQL completed. Corrected a malformed literal newline in the verification table.
- **Verification:** Repository hygiene passed, Python compilation passed, all 5 trending-discovery unit tests passed, continuity diff passed, secret history scan passed, and CodeQL passed on the PR head.
- **Limitations:** No live GitHub Trending run has been completed yet. The parser still depends on GitHub's HTML structure. Candidate records remain unapproved and require human review.
- **Next action:** Merge after required checks are green, trigger the discovery workflow, inspect the generated report and catalog output, then remove the merged feature branch.


### 2026-11-10 — Consolidate stale Dependabot updates
- **Goal:** Preserve the useful dependency updates from PRs #4, #13, #14, and #15 without merging stale, diverged branches.
- **Changes:** Reapplied the intended updates onto the current main tree in one review branch. The proposed updates pin actions/checkout to v7.0.1, actions/setup-node to v7.1.0, actions/setup-python to v7.1.0, and Probot to ^14.3.7. No package lockfile exists for the GitHub App.
- **Review:** The original branches were behind and diverged from main. PRs #13 and #15 failed continuity enforcement because their workflow changes did not update the required continuity documents. The setup-python and Probot PRs were also substantially behind main. Their intended dependency changes are carried forward from a fresh main-based branch.
- **Verification:** The old Probot PR's GitHub App tests and CodeQL passed. The old setup-node PR's non-hygiene test suites and CodeQL passed. The old setup-python PR's CodeQL and secret scan passed. The two old workflow PRs failed the continuity gate. These results do not validate the consolidated commit. Fresh CI is required.
- **Next action:** Review the consolidated diff and wait for all required checks before merging. Close superseded Dependabot PRs only after the replacement PR is open.


### 2026-11-10 — Merge all actionable DEVKIT pull requests
- **PR #16:** Merged daily and weekly GitHub Trending resource discovery to main as squash commit `5d58845`. Required checks passed: repository hygiene, Python compilation, 5 trending-discovery tests, continuity diff, secret-history scan, and CodeQL.
- **Dependabot PRs #4, #13, #14, and #15:** Closed as superseded, not discarded. Their intended dependency changes were consolidated into PR #17 from current main.
- **PR #17:** Merged as squash commit `7223d57`. Updates: actions/checkout v7.0.1, actions/setup-node v7.1.0, actions/setup-python v7.1.0, and Probot ^14.3.7. Fresh checks passed: repository hygiene, resource quality, resource engine, orchestrator core, shared contracts, knowledge quality, knowledge engine, orchestration quality, GitHub bootstrap app tests, CodeQL, and secret-history scan. CodeFactor passed. CodeRabbit skipped its review. Kilo review required action because the account had insufficient credits; it was not treated as a passing review.
- **PR inventory:** No open pull requests remain at the time of this update.
- **Branch audit:** Six old feature branches are fully behind main with zero unique commits. Three squash-merged feature branches (PRs #5, #16, #17) retain their original branch commits, but their content is represented by the merged PRs. All nine non-main branches are candidates for deletion after this audit. No branch deletion action is available in the connected GitHub interface, so deletion remains an owner-side cleanup action.
- **Protected branch:** Keep `main`. Do not delete it.
- **Next action:** Delete the nine audited non-main branches in GitHub. Keep the technology-decision implementation; its branch is safe to delete because PR #5 is merged and its changes are present in main.


### 2026-11-11 — Resource Registry hardening

- **Commits:** \`ba1fb25\`, \`598f198\`, \`2425ff9\`, \`56726a6\`, \`a28d9ae\`.
- **Goal:** Fix registry query and deduplication correctness; add package CI; preserve lifecycle decisions during metadata refresh.
- **Changes:** SQL-level status/category filtering before pagination; bounded search and CLI numeric options; category/capability blocking for duplicate candidates; explicit record/comparison limits that fail rather than silently truncate; corrected CLI module import; preserve existing resource status when sync omits \`status\`; added regression tests for pagination, limits, metadata status, and CLI startup; added dedicated Resource Registry workflow and updated subsystem documentation.
- **Verification:** GitHub source and commit diffs inspected. Automated test workflow has not yet returned a completed result. Do not treat tests as passed until CI is green.
- **Remaining:** Confirm the workflow run, inspect failures, add labelled deduplication benchmarks, and continue orchestration/policy audit.


## 2026-11-11 — Resource Registry hardening

- **Commits:** `ba1fb25`, `598f198`, `2425ff9`, `56726a6`, `a28d9ae`, `eab55e3`, `407679a`.
- **Goal:** Fix registry query and deduplication correctness; add package CI; preserve lifecycle decisions during metadata refresh.
- **Changes:** SQL-level status/category filtering before pagination; bounded search and CLI numeric options; category/capability blocking for duplicate candidates; explicit record/comparison limits; correct CLI import; preserve existing resource status during metadata refresh; normalise `.git` repository URLs with subpaths; reject URL credentials and non-standard ports; retain untagged duplicate-review pairs; add regression tests and dedicated CI.
- **Verification:** Initial CI exposed three defects in URL normalisation and untagged-pair handling. These are fixed in `407679a`; the next workflow run is pending. Repository hygiene previously rejected a malformed work-log append; this entry uses proper Markdown lines.
- **Remaining:** Confirm the next workflow run, inspect failures, add labelled deduplication benchmarks, and continue orchestration/policy audit.


### 2026-11-11 — Resource Registry test fixture correction

- **Commit:** pending at handoff update.
- **Finding:** The remaining CI failure came from a legacy review test that created two resources with no shared category or capability tags. Under the new candidate-blocking contract, that pair is not proposed for review.
- **Change:** Updated the test fixture to declare a shared category and capability. This preserves the production rule that untagged unrelated records are not treated as likely overlaps.
- **Verification:** Awaiting the next Resource Registry workflow run.


### 2026-11-11 — Resource Registry CI passed; branch audit completed

- **Verification:** Resource Registry workflow passed syntax checks and 12/12 tests on `012837e`. Repository hygiene and continuity diff passed on `9272cc0`; trending-discovery tests passed; secret-history scan passed. CodeQL was still running at the time of this entry.
- **Branch audit:** Six non-main branches are fully behind `main` with zero unique commits. The three squash-merged branches were compared file-by-file: PR #17 dependency/workflow files match `main`; PR #16 discovery code/tests/docs match and its workflow uses older action pins; PR #5 technology-decision implementation matches while the branch's schema/tests/docs are stale relative to `main`. All nine non-main branches are safe to delete. The connected GitHub interface has no branch deletion action; deletion remains an owner-side task.
- **Owner action:** Confirm repository visibility. GitHub metadata reports `public`, although the prior project discussion stated the repository had been made private. Delete the nine audited branches in GitHub after confirming visibility.
- **Next:** Continue the orchestration/policy audit. Fix plan-digest coverage and make policy configuration a single validated source of truth before adding executor adapters.


### 2026-11-11 — Policy source and plan-digest hardening

- **Commit:** `17ff5d8` and `1d2b92e`.
- **Changes:** Moved the runtime action catalogue to `core/orchestrator/policy.rules.json`; made `policy.yaml` reference the canonical file instead of duplicating action and risk rules; bumped the policy version to `1.1.0`; included policy version, repository languages/frameworks, technology decision, task context, dependencies, required capabilities, preferred harness, tools, and action targets in the plan digest; canonicalised object keys and set-like arrays; validated digest inputs; required approval records to have approved status; made malformed approval collections fail closed.
- **Tests added:** Digest invalidation when routing fields change; stable digest under object-key and set-like-array reordering; invalid routing list and duplicate task ID rejection; approved-status and malformed approval collection checks; YAML-to-canonical-JSON linkage.
- **Verification:** Awaiting orchestrator and shared-contract CI. Do not report these tests as passed until the workflow completes.
- **Remaining:** Authenticated approval storage, approver identity, expiry/replay protection, and executor-side enforcement remain unimplemented.


### 2026-11-11 — Policy approval fixture and critical-risk coverage

- **Finding:** The first policy CI run found one orchestration integration test still created a pending approval record. The hardened policy correctly rejected it because the record did not have approved status.
- **Fix:** Updated the integration fixture to use an explicitly approved record. Added critical-risk coverage for branch creation and test execution, which are now treated as mutating actions at critical risk.
- **Verification:** The initial run had 33/34 tests passing. The corrected test suite and repository continuity checks are awaiting rerun.


### 2026-11-11 — Policy Engine CI green

- **Commit:** `b14bb0b`.
- **Verification:** Orchestrator Core Tests passed 35/35. Orchestration quality passed. Repository hygiene, continuity diff, trending-discovery tests, and secret-history scan passed. CodeQL remained in progress at the time of this entry.
- **Correction:** Updated the existing orchestrator integration fixture to mark the human approval as explicitly approved. Added critical-risk approval requirements for branch creation and test execution.
- **Remaining:** Authenticated approval storage, approver identity, expiry/replay protection, and executor-side enforcement remain unimplemented. Do not enable executor actions yet.


### 2026-11-11 — Signed approval store

- **Changes:** Added SQLite-backed approval requests and event history; trusted approver-authentication callback; Ed25519-signed approval records; expiry enforcement; pending/approved/rejected/revoked/expired states; single-transition controls; signature and exact-scope verification; live database status checks so revocation invalidates stale approval objects; expired requests can be renewed without reusing an old signature.
- **Tests:** Request idempotency, approval and policy integration, invalid credentials, repeated approval, signature/scope tampering, wrong public key, revocation, expiry/renewal, malformed scopes, and rejection.
- **Security boundary:** The host must supply a real identity verifier and manage private signing keys outside Git. This does not yet enforce executor actions. Keep execution disabled.
- **Verification:** Awaiting CI.


### 2026-11-11 — Approval Store DDL correction

- **Finding:** The first Approval Store CI run failed all eight store tests during SQLite initialisation. The DDL statements were joined without semicolon separators.
- **Fix:** Added explicit statement separators to the schema bootstrap. No approval logic or test expectations were weakened.
- **Verification:** Awaiting rerun.


### 2026-11-11 — Approval Store CI green

- **Commit:** `89891a5`.
- **Verification:** Orchestrator Core Tests passed 43/43. Orchestration quality passed. Repository hygiene and continuity diff passed. Secret-history scan passed. CodeQL remained in progress at the time of this entry.
- **Correction:** The initial Approval Store run failed during SQLite schema creation because the DDL statements lacked separators. The schema bootstrap was corrected; the full approval lifecycle suite now passes.
- **Security boundary:** The store signs records and enforces expiry/revocation, but the host still needs a real authentication provider and protected private-key management. Executor-side enforcement is not implemented.


### 2026-11-11 — Execution Gate and adapter contract

- **Changes:** Added a standard adapter invocation gate that revalidates plan digests, evaluates policy for each exact action/target, loads and verifies current approval records, checks adapter action/harness/capability compatibility, requires a durable audit callback, and executes sequentially.
- **Contract:** Adapters declare stable ID/version, supported actions, capabilities, optional harness ID, and an execute function. The gate rejects ambiguous matches and refuses direct plan execution when audit is not configured. There are no built-in adapters yet.
- **Tests:** Adapter contract validation, duplicate IDs, digest tampering, capability/harness mismatch, ambiguity, missing audit sink, pre-execution audit failure, missing approvals, signed approval success, revocation, critical-risk test approval, dry-run, unknown actions, and partial results after adapter failure.
- **Security boundary:** This is the required host integration path, not an OS sandbox. Hosts must not expose raw adapters for direct invocation. Production identity, key management, durable audit storage, and adapter isolation remain open.
- **Verification:** Awaiting CI.


### 2026-11-11 — Execution Gate contract edge-case hardening

- **Finding:** Review of the first green Execution Gate run found that adapter IDs with surrounding whitespace could bypass the duplicate check before being normalised. Failure audit events also included raw adapter error messages, which could leak sensitive details.
- **Fix:** Check duplicate IDs after normalisation. Audit failure events now record only error type/code, not raw exception text.
- **Verification:** The first gate run passed 57/57 tests. The new regression case and redacted audit event behavior require a rerun.


### 2026-11-11 — Execution Gate dependency and audit hardening

- **Changes:** Evaluate policy before adapter lookup; audit policy denials; validate dependency existence and topological order even when a caller recomputes the plan digest; bind adapter execute methods to their original instance; add regression coverage for dependency order and post-execution audit failure.
- **Verification:** Initial Execution Gate implementation passed 57/57 tests. The follow-up edge-case fixes require CI rerun.


### 2026-11-11 — Execution Gate CI green

- **Commit:** `90a5e92`.
- **Verification:** Orchestrator Core Tests passed 61/61. Orchestration quality, repository hygiene, continuity diff, and secret-history scan passed. CodeQL remained queued at the time of this entry.
- **Hardening:** Policy is evaluated before adapter resolution; denials are audited; dependency order is checked independently of the plan digest; adapter IDs are normalised before duplicate checks; adapter methods retain their owning instance; raw adapter exception messages are not written to audit events.
- **Remaining:** No built-in adapters exist. Production identity provider, protected key management, durable audit sink, adapter isolation, and executor-specific least privilege remain host integration work. The gate is not an OS sandbox.


### 2026-11-11 — One-time approval consumption

- **Finding:** The first Execution Gate allowed the same still-valid approval to authorise repeated executions until expiry. That is replay, even though approval state transitions were single-use.
- **Fix:** Added an atomic approval-consumption ledger. The gate consumes a signed approval immediately before adapter execution. Verification rejects consumed approvals, including stale copies. Execution IDs are included in audit events.
- **Tests:** Direct double-consumption rejection and end-to-end prevention of replay through the Execution Gate.
- **Verification:** Awaiting CI.


### 2026-11-11 — Approval replay prevention and state update

- **Changes:** Approval records now have an atomic one-time consumption ledger. Execution Gate consumes a verified approval immediately before execution. A consumed approval cannot authorise a second run; stale approval objects fail verification.
- **Verification:** Orchestrator Core Tests passed on the initial gate implementation; one-time consumption changes are awaiting CI. Repository hygiene identified a missing component-status update; this commit adds Approval Store and Execution Gate rows to the state document.


### 2026-11-11 — One-time approval consumption verified

- **Commit:** `c5565a1`.
- **Verification:** Orchestrator Core Tests passed 63/63. Orchestration quality passed. Repository hygiene, continuity diff, and repository scan passed on the follow-up documentation commit. Secret-history scan passed on the implementation commit. CodeQL remained pending at the time of this entry.
- **Security effect:** A signed approval is now consumed atomically immediately before an adapter runs. A second execution using the same approval is denied. Revocation and consumption both invalidate stale approval objects.
- **Remaining:** Production identity provider, private-key provisioning/rotation, durable audit sink, and least-privilege adapters remain host integration work. The gate is not an OS sandbox.


### 2026-11-11 — Agent handoff and documentation consistency hardening

- **Goal:** Make a fresh AI agent able to resume DEVKIT without access to prior chat history.
- **Findings:** Root README and orchestrator README still described approval storage, replay protection, and executor enforcement as unimplemented. The roadmap also marked completed Approval Store and Execution Gate work as pending. The existing project-state record contained a stale risk statement.
- **Changes:** Added root `HANDOFF.md` as the startup map; made it the first required intake step in `AGENTS.md`; documented the product mission, architecture, owner workflow preferences, current implementation boundaries, verification snapshot, external owner actions, and next work. Reconciled README, orchestrator README, roadmap, and project-state with the implemented Approval Store and Execution Gate without overstating production readiness.
- **Verification basis:** Reviewed source and tests on `main` at `72172341b537e320db22eb11fd94e57efcd36e12`. Orchestrator Core Tests passed 63/63 on `c5565a1`; CodeQL, repository hygiene, and secret-history scan passed on `7217234`. These are historical results; rerun relevant checks after this documentation commit.
- **Open owner actions:** GitHub currently reports repository visibility as public despite the earlier instruction that it was made private; verify in GitHub Settings. Re-check nine non-main branches before deletion. Verify branch protection and GitHub App deployment externally.
- **Next:** Build the production host trust integration (identity, protected key lifecycle, durable audit), then a read-only adapter behind the Execution Gate; continue Resource Intelligence in parallel.


### 2026-11-11 — Handoff CI and intake corrections

- **Review correction:** Fixed the numbered intake sequence in `AGENTS.md` and removed a stale project-state claim that orchestrator verification was pending.
- **Verification:** On handoff commit `80bbaae`, Orchestrator Core Tests passed 63/63; orchestration quality, repository hygiene including continuity enforcement, and secret-history scan passed. CodeQL was still running at the time of this record.
- **Next:** Confirm CodeQL completion. Re-check the public/private visibility mismatch and external GitHub settings with the owner.

### 2026-11-11 — Repository coherence review and host trust contract

- **Reviewed HEAD:** `3d692d665c370afcb9695f9f9257d1d5aca69582`.
- **Repository state:** `main` is protected. No open PRs were found. Nine non-main branches remain; prior file-level audit records all nine as safe to delete, but this GitHub connection has no branch-deletion action. Latest HEAD CI: repository hygiene, CodeQL, and secret-history scan passed. Orchestrator core and orchestration quality passed on parent `80bbaae`.
- **Coherence assessment:** Product pillars and current implementation boundaries are consistent across the README, handoff, architecture, project state, and roadmap. DEVKIT remains a foundations-stage repository, not a complete workbench. Approval Store and Execution Gate status are correctly separated from production readiness.
- **Finding:** The host trust boundary was described in several files but had no single, normative contract or acceptance gate. A callback alone cannot prove identity assurance, key custody/rotation, audit durability/tamper evidence, or process isolation.
- **Change:** Added `docs/HOST-TRUST-INTEGRATION.md` with provider-neutral interfaces, security invariants, failure/recovery semantics, adversarial tests, and a production acceptance gate. Linked it from the roadmap, project state, README, and orchestrator README.
- **Verification:** Live GitHub Actions metadata was inspected. No local checkout was available; no package tests were executed in this session. Checks are reported only for their exact commit SHAs.
- **Next:** Implement the versioned identity, key-provider, audit-event, and executor schemas plus contract tests. Keep execution disabled until the deployment boundary passes independent review.

### 2026-11-11 — Continuity gate correction after documentation audit

- **Finding:** The first documentation update caused continuity CI to fail because the changed `core/orchestrator/README.md` is classified as an implementation path. The checker requires both the project state and a new dated work-log entry for such a path.
- **Correction:** Updated the canonical project-state architecture map and added this dated entry. No continuity rule was weakened.
- **Verification:** The latest workflow before this correction reported the repository hygiene unit tests and trending discovery tests passing; continuity diff failed only on the missing project-state/work-log update. A fresh run is required after this correction.

### 2026-11-11 — Refresh handoff review metadata

- **Change:** Updated the project-state reviewed-source reference to the latest coherence-review documentation snapshot, `3263224`.
- **Reason:** The prior reference still pointed to the pre-review baseline and no longer identified the reviewed snapshot.
- **Verification:** The follow-up continuity CI run on `cac71a1` passed all steps, including 13 hygiene tests, five trending-discovery tests, continuity diff, and the 167-file repository scan with zero findings. CodeQL and secret-history scan passed on `3263224`.

### 2026-11-11 — Project-state snapshot metadata refresh

- **Change:** Updated the handoff metadata to identify the latest reviewed coherence snapshot, `3263224`.
- **Continuity:** This update is recorded as a separate dated work-log entry so the documentation-only continuity check can verify it.
- **Verification:** The continuity job initially rejected the state-only commit because this work-log record was not yet present in the parent snapshot. The subsequent work-log commit will trigger the canonical continuity gate again.

### 2026-11-11 — Self-contained agent onboarding brief

- **Goal:** Make a replacement agent able to understand DEVKIT and choose the next task using repository contents alone, without prior chat history.
- **Changes:** Added `docs/AGENT-ONBOARDING.md` as a concise but self-contained orientation: mission, principles, architecture map, implemented/incomplete boundaries, verified repository snapshot, exact next milestone, acceptance criteria, operating protocol, read-only permission limits, and source-of-truth precedence. Updated `HANDOFF.md` to make the onboarding brief mandatory and refreshed its stale snapshot, CI evidence, and next-work recommendation. Removed a duplicate host-trust milestone in project state and refreshed its reviewed snapshot.
- **Current evidence checked:** Live `main` HEAD `ef0d9f2`; zero open PRs; nine non-main branches; repository hygiene, CodeQL, and secret-history scan passed on `ef0d9f2`. Branch protection is flagged as enabled, but required status-check enforcement reports off. Repository visibility reports public.
- **Next:** Build the Project Context Assembly Engine in small, evidence-backed stages as specified in `docs/AGENT-ONBOARDING.md`. Keep production execution disabled until the host trust contract is implemented and independently reviewed.
- **Limits:** Repository documentation cannot transfer credentials, permissions, hidden chat state, or unrecorded owner intent. Read-only access permits analysis and planning, not pushes, merges, settings changes, or deployment.
