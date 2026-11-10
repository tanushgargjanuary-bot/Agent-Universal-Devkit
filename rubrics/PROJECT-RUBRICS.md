# Project-Type Engineering Rubrics

This file defines quality criteria for projects connected to Agent-Universal-Devkit. Agents MUST select rubrics from the project's actual purpose. Do not apply every niche checklist to every project.

## 1. How to select and apply rubrics

1. Read the target repository's README, instructions, source tree, tests, deployment files, and stated goals.
2. Identify its primary project type and any secondary types. A project can use several profiles.
3. Select the common rubric plus every relevant domain rubric below.
4. Mark each criterion as **required**, **recommended**, **not applicable**, or **blocked**. Give a short reason for not-applicable or blocked items.
5. Convert applicable criteria into requirements, architecture decisions, implementation tasks, tests, and review checks.
6. Define project-specific acceptance thresholds before implementation when a criterion needs a measurable threshold.
7. At review time, attach evidence: tests, source references, measurements, threat models, citations, reproducible commands, screenshots, or documented human review.
8. Record unresolved risks and accepted trade-offs. Do not claim a rubric passed without evidence.

### Priority levels

- **Critical:** failure can cause serious harm, security compromise, data loss, invalid research, or legal/regulatory exposure. Must be addressed before the affected release or operation.
- **High:** materially affects correctness, reliability, user trust, or maintainability.
- **Normal:** improves quality and reduces future cost.
- **Contextual:** apply only when the project has the relevant feature, user group, environment, or risk.

Rubrics guide engineering decisions. They do not replace laws, standards, domain experts, formal certification, or project-specific requirements.

## 2. Universal rubric — apply to every project

| Property | Review questions | Expected evidence |
|---|---|---|
| Problem clarity | Is the user problem and intended outcome clear? | Problem statement, target users, use cases |
| Simplicity | Is this the simplest design that meets real requirements? Is complexity justified? | Architecture rationale, removed/avoided complexity |
| Maintainability | Can another developer understand, debug, and change it? | Clear structure, naming, docs, tests, ownership |
| Flexibility | Can likely changes be made without a rewrite? Are extension points justified? | Stable interfaces, modular boundaries, migration notes |
| Security | Are assets, trust boundaries, secrets, permissions, and threats understood? | Threat review, secret handling, access controls, security tests |
| Reliability | Does it fail safely and recover where possible? | Error handling, failure tests, recovery procedures |
| Correctness | Are important outputs checked against defined expectations? | Acceptance tests, invariants, independent checks |
| Usability | Can intended users complete core tasks without avoidable friction? | Task flows, usability checks, clear errors |
| Accessibility | Can people with relevant disabilities use the product? | Applicable accessibility checks and manual review |
| Performance | Does it meet workload and latency needs without premature optimisation? | Baseline and workload measurements |
| Compatibility | Are supported platforms, versions, interfaces, and dependencies explicit? | Compatibility matrix and CI coverage |
| Portability | Can it run in the intended environments without hidden machine-specific assumptions? | Reproducible setup and environment documentation |
| Observability | Can failures and important behaviour be understood without exposing sensitive data? | Useful logs, metrics, traces, diagnostic guidance |
| Testability | Can important behaviour be tested in isolation and end to end? | Automated tests, fixtures, deterministic test setup |
| Documentation | Can users install, configure, operate, and troubleshoot it? | README, setup, usage, architecture, troubleshooting |
| Cost efficiency | Are development, runtime, API, hosting, and maintenance costs proportionate? | Cost assumptions, budgets, measurements where relevant |
| Dependency discipline | Are dependencies necessary, maintained, licensed, and bounded? | Dependency inventory, version policy, license checks |
| Data handling | Is data minimised, validated, protected, retained, and deleted appropriately? | Data flow, validation, retention and deletion rules |
| Scalability | Does the design meet plausible growth needs without speculative infrastructure? | Workload assumptions, bottleneck analysis |
| Interoperability | Are external interfaces documented and robust to change? | API/schema contracts, integration tests |
| Reproducibility | Can another person reproduce setup, builds, tests, and important results? | Lockfiles, scripts, pinned inputs, repeatable procedures |
| Legal and ethical fit | Are licenses, rights, privacy, consent, and foreseeable misuse considered? | License notices, data provenance, risk decisions |
| Release quality | Is there a safe, reversible release process? | Release checklist, versioning, rollback or recovery plan |

## 3. Domain rubrics

### 3.1 Software engineering and developer tools
- Functional correctness: acceptance criteria cover normal, boundary, and failure cases.
- Architecture quality: modules have clear responsibilities and low unnecessary coupling.
- API and interface stability: contracts are versioned and breaking changes are controlled.
- Code quality: consistent style, useful names, small units, and limited duplication.
- Test pyramid: unit, integration, and end-to-end tests match actual risk.
- Developer experience: setup, local development, debugging, and contribution are clear.
- Build integrity: builds are repeatable and CI checks the required paths.
- Migration safety: schema and data changes have tested migration and recovery paths.
Evidence: tests, CI, API contracts, architecture decisions, migration tests.

### 3.2 Cybersecurity products, tools, and labs
- Threat modelling: assets, actors, trust boundaries, attack paths, and abuse cases are documented.
- Secure defaults: safe configuration is the default; unsafe modes are explicit.
- Least privilege: permissions and credentials are scoped to the minimum required.
- Input and output safety: validate untrusted input and safely handle generated output.
- Authentication and authorisation: identity, roles, session handling, and access checks are correct.
- Secrets and cryptography: use established libraries, sound key handling, and no custom cryptography without expert review.
- Auditability: security-relevant actions create useful, tamper-resistant records where required.
- Vulnerability management: dependency, static, dynamic, and configuration checks match the threat model.
- Isolation: untrusted code, files, and workloads run with controlled boundaries.
- Responsible operation: testing scope, authorisation, rate limits, and disclosure rules are explicit.
Evidence: threat model, abuse-case tests, security scans, permission tests, audit review, authorised test plan.

### 3.3 Security research and vulnerability research
- Research question: the claim or vulnerability class under study is precise.
- Authorisation and scope: targets and testing permissions are documented.
- Method transparency: tools, versions, configurations, and steps are recorded.
- Reproducibility: findings include safe reproduction steps and environment details.
- Evidence quality: claims distinguish observation, inference, and speculation.
- Impact analysis: severity and exploitability are justified, not inflated.
- Responsible disclosure: reporting, coordination, and publication timing are considered.
- Safety: proof-of-concept material avoids unnecessary harm and exposure.
Evidence: scoped methodology, reproducible lab, logs, evidence chain, disclosure record.

### 3.4 AI and machine learning
- Problem framing: task, baseline, target metric, and decision threshold are defined.
- Data provenance: source, licence, consent, collection, and permitted use are recorded.
- Data quality: missing values, leakage, duplicates, imbalance, and label quality are assessed.
- Split integrity: train, validation, and test data prevent leakage.
- Baselines: simple and credible baselines are measured before complex models.
- Evaluation: metrics match the real use case; uncertainty and subgroup performance are reported.
- Reproducibility: data versions, code, seeds, configurations, and model artefacts are tracked.
- Robustness: distribution shift, adversarial input, and failure modes are tested where relevant.
- Fairness and privacy: applicable harms, sensitive attributes, and privacy risks are assessed.
- Deployment operations: latency, throughput, drift, rollback, and inference cost are measured.
- Model limitations: intended use, non-use, and known failure cases are documented.
Evidence: dataset cards, experiment records, baseline comparisons, evaluation reports, model cards, monitoring plan.

### 3.5 Data engineering, analytics, and business intelligence
- Data lineage: source-to-output transformations are traceable.
- Schema contracts: types, nullability, keys, and change rules are defined.
- Data quality: completeness, accuracy, freshness, uniqueness, and validity are measured.
- Pipeline reliability: retries, idempotency, backfills, and failure recovery are tested.
- Privacy and access: sensitive fields are minimised and access is controlled.
- Metric definitions: business terms and calculations have one documented meaning.
- Reconciliation: important totals are checked against trusted sources.
- Performance and cost: query, storage, and compute costs are monitored.
- Visual integrity: charts do not mislead through scales, aggregation, or missing context.
Evidence: lineage, schemas, data tests, reconciliation reports, metric catalogue, cost profile.

### 3.6 Scientific and academic research
- Research question: scope, hypotheses, and contribution are explicit.
- Source quality: primary sources and reputable scholarly sources are prioritised.
- Citations: claims, quotations, datasets, and borrowed methods are cited accurately.
- Literature coverage: relevant supporting and conflicting work is considered.
- Methodology: methods fit the question and are described in enough detail to assess.
- Reproducibility: materials, code, data, parameters, and analysis steps are available where permitted.
- Statistical validity: assumptions, sample size, uncertainty, multiple testing, and effect sizes are addressed.
- Limitations: confounders, threats to validity, and uncertainty are stated.
- Integrity: no fabricated sources, data, results, or selective reporting.
- Ethics: consent, privacy, safety, and research approvals are addressed where applicable.
Evidence: bibliography, source notes, protocol, analysis scripts, data provenance, limitations section.

### 3.7 Literature reviews and knowledge synthesis
- Search strategy: databases, search terms, dates, and inclusion rules are recorded.
- Selection transparency: screening and exclusion reasons are traceable.
- Source appraisal: quality and bias are assessed.
- Synthesis: compare findings; do not only summarise papers one by one.
- Contradictions: conflicting results and possible causes are discussed.
- Citation integrity: every material claim maps to a source.
- Coverage limits: language, date, access, and search limitations are stated.
Evidence: search log, selection table, appraisal notes, claim-to-source map.

### 3.8 Web applications and SaaS
- User journeys: primary tasks and user roles are defined.
- Authentication and authorisation: server-side checks protect every sensitive operation.
- Data isolation: tenant and user data cannot cross boundaries.
- Web security: injection, CSRF, XSS, SSRF, file upload, and session risks are assessed as applicable.
- Accessibility: keyboard, screen reader, contrast, focus, and responsive behaviour are checked.
- Performance: page load, API latency, and key user flows meet targets.
- Privacy: collection, consent, retention, export, and deletion are clear.
- Operational readiness: backups, monitoring, incident response, and rollback exist.
Evidence: user-flow tests, security tests, accessibility review, performance measurements, operational runbook.

### 3.9 APIs, SDKs, and integrations
- Contract clarity: request, response, errors, and versioning are documented.
- Compatibility: supported provider and API versions are tested.
- Authentication: credentials are scoped and never logged.
- Resilience: timeouts, retries, backoff, rate limits, and idempotency are handled.
- Error semantics: errors are actionable and stable.
- Data mapping: conversions preserve meaning and handle missing fields.
- Observability: request identifiers and safe diagnostics support troubleshooting.
- Change handling: provider changes are detected and compatibility is revalidated.
Evidence: OpenAPI/schema, contract tests, compatibility matrix, failure tests.

### 3.10 CLI and developer experience tools
- Discoverability: commands, help, examples, and errors are clear.
- Safe behaviour: destructive actions require explicit intent and offer dry-run where practical.
- Automation: stable exit codes and machine-readable output are available where useful.
- Portability: shell and operating-system support are explicit.
- Configuration: precedence and secret handling are documented.
- Recovery: interrupted operations do not corrupt user data.
Evidence: CLI help snapshots, integration tests, dry-run tests, platform matrix.

### 3.11 Desktop and mobile applications
- Platform fit: native conventions and supported OS versions are clear.
- Permissions: request only permissions needed for a feature.
- Local data: storage, encryption, backup, and deletion are considered.
- Offline behaviour: sync conflicts and reconnect behaviour are defined where relevant.
- Updates: upgrades and rollback do not corrupt user data.
- Accessibility: platform accessibility APIs and input methods are tested.
- Resource use: battery, memory, CPU, and storage use are measured.
Evidence: device/platform tests, permission review, sync tests, resource profile.

### 3.12 Cloud, infrastructure, and DevOps
- Infrastructure as code: infrastructure changes are reviewable and repeatable.
- Identity and access: roles, workload identities, and secrets follow least privilege.
- Network boundaries: ingress, egress, segmentation, and exposure are justified.
- Reliability: availability targets, redundancy, and failure domains are explicit.
- Recovery: backups are verified and recovery objectives are tested.
- Observability: service health, logs, metrics, traces, and alerts support response.
- Cost control: budgets, resource limits, and waste checks exist.
- Change safety: staged rollout, rollback, and drift detection are available.
Evidence: IaC review, policy checks, restore test, SLOs, dashboards, cost report.

### 3.13 Distributed systems and backend platforms
- Consistency: consistency guarantees and trade-offs are explicit.
- Failure handling: partial failure, duplicate delivery, and network partitions are considered.
- Idempotency: retries do not create unintended duplicate effects.
- Concurrency: race conditions and ordering assumptions are tested.
- Data integrity: transactions and invariants are protected.
- Capacity: load, backpressure, and saturation behaviour are measured.
- Operability: failure diagnosis and recovery procedures are documented.
Evidence: architecture decision records, fault-injection tests, load tests, consistency tests.

### 3.14 Hardware, embedded systems, and IoT
- Hardware constraints: CPU, memory, power, storage, and thermal limits are measured.
- Electrical safety: voltage, current, isolation, and component ratings are respected.
- Firmware integrity: boot, update, and recovery paths are protected.
- Communication: protocols, timeouts, authentication, and malformed messages are tested.
- Real-time behaviour: timing constraints and worst-case latency are measured where required.
- Physical access: debug ports and exposed interfaces are assessed.
- Lifecycle: component availability, repair, and firmware support are considered.
Evidence: schematics, BOM, bench tests, timing measurements, firmware security review.

### 3.15 Robotics and autonomous systems
- Operational safety: hazards, safe states, and emergency stop behaviour are defined.
- Control stability: controllers are tested across expected operating conditions.
- Sensor integrity: calibration, drift, noise, and sensor failure are handled.
- Actuator limits: physical limits and collision risks are enforced.
- Environment robustness: lighting, terrain, weather, and unexpected obstacles are considered.
- Simulation-to-real gap: simulation assumptions are checked against physical tests.
- Human interaction: safe distance, signalling, and override controls are defined.
Evidence: hazard analysis, simulation tests, controlled physical tests, safety validation.

### 3.16 Game development and simulation
- Core loop: gameplay or simulation goals are clear and testable.
- Performance: frame time, memory, loading, and target hardware budgets are measured.
- Determinism: simulation and replay requirements are explicit.
- Physics and state: important rules and state transitions are tested.
- Save integrity: save migration, corruption handling, and recovery are considered.
- Multiplayer: authority, synchronisation, latency, and cheating risks are assessed where relevant.
- Accessibility: controls, readability, and difficulty options are considered.
- Content pipeline: assets, licences, provenance, and build integration are controlled.
Evidence: gameplay tests, profiling captures, deterministic tests, save migration tests.

### 3.17 Mathematics, algorithms, and numerical software
- Formal definitions: variables, domains, assumptions, and notation are precise.
- Correctness: algorithm claims and proofs match the implemented method.
- Numerical stability: conditioning, precision, overflow, and error propagation are assessed.
- Complexity: time and space bounds are stated where meaningful.
- Edge cases: degenerate, boundary, and adversarial inputs are tested.
- Independent validation: compare against trusted implementations or analytical results.
- Reproducibility: examples and computational experiments can be repeated.
Evidence: derivations, proofs, property tests, numerical error tests, cross-checks.

### 3.18 Education, tutorials, and learning platforms
- Learning outcomes: measurable outcomes and prerequisites are explicit.
- Accuracy: explanations are checked against reliable sources.
- Pedagogy: concepts progress from foundations to application.
- Assessment: exercises test understanding, not only recall.
- Feedback: errors explain why an answer is wrong and how to improve.
- Accessibility: content supports different needs and devices.
- Attribution: sources, licences, and adapted material are acknowledged.
Evidence: curriculum map, source list, reviewed examples, assessment results, accessibility checks.

### 3.19 Content, media, and creative production
- Audience and intent: purpose, audience, format, and distribution are clear.
- Accuracy: factual claims are checked and sources are retained.
- Rights: assets, music, fonts, and source material have valid usage rights.
- Attribution: required credits and disclosures are present.
- Consistency: style and terminology match the brief.
- Accessibility: captions, transcripts, alt text, and readable layouts are provided where relevant.
- Platform fit: technical format and publishing requirements are met.
Evidence: source sheet, asset licence records, editorial checklist, platform validation.

### 3.20 Design systems, UX, and accessibility
- User research: design decisions reflect observed user needs.
- Task success: key journeys are tested with intended users.
- Consistency: components, tokens, and interaction patterns are coherent.
- Accessibility: applicable WCAG or platform criteria are tested.
- Responsive behaviour: layouts work across target viewports and input modes.
- Content clarity: labels, errors, and instructions are understandable.
- Design handoff: states, spacing, tokens, and behaviour are specified.
Evidence: research notes, prototypes, usability results, accessibility audit, component documentation.

### 3.21 Business systems, finance, and operations
- Business rules: calculations and workflows are explicit and approved.
- Financial correctness: rounding, currency, tax, and reconciliation rules are tested where relevant.
- Audit trail: material changes and approvals are traceable.
- Permissions: role separation and approval thresholds are enforced.
- Data protection: personal and financial data receive appropriate controls.
- Exception handling: reversals, disputes, and corrections are supported.
- Reporting: definitions, periods, and source data are clear.
Evidence: signed-off rules, reconciliation tests, audit samples, access matrix, exception tests.

### 3.22 Automation and agentic workflows
- Scope: goals, allowed actions, and stop conditions are explicit.
- Tool permissions: tools receive only the access required for the task.
- Untrusted input: external content is treated as data, not trusted instructions.
- Human approval: consequential, destructive, financial, or external actions have appropriate gates.
- State and recovery: checkpoints, retries, and idempotency prevent unsafe repetition.
- Verification: completion is checked independently of the agent's claim.
- Traceability: plans, tool calls, decisions, and outcomes are logged safely.
- Cost limits: token, time, tool, and financial budgets are bounded.
- Prompt-injection resistance: tool outputs and retrieved content cannot override system policy.
Evidence: permission manifest, approval tests, adversarial tests, execution traces, verification reports.

### 3.23 Privacy and data governance
- Data inventory: personal and sensitive data are identified.
- Purpose limitation: each data field has a clear purpose.
- Minimisation: do not collect or retain unnecessary data.
- Consent and legal basis: applicable requirements are addressed.
- Access and deletion: users can exercise relevant rights.
- Retention: retention periods and deletion processes are defined.
- Sharing: processors, transfers, and external disclosures are documented.
- Incident response: privacy incidents can be detected and handled.
Evidence: data map, retention schedule, access tests, deletion tests, privacy review.

### 3.24 Blockchain and smart contracts
- Threat modelling: economic, protocol, key, and governance risks are considered.
- Contract correctness: invariants and state transitions are tested.
- Access control: privileged functions and upgrade authority are explicit.
- Economic assumptions: incentives, oracle dependencies, and manipulation risks are analysed.
- Key management: signing and recovery processes are secure.
- Audit: independent review is required for material value at risk.
- Deployment safety: testnet, staged release, monitoring, and emergency controls are defined.
Evidence: formal invariants, fuzz tests, independent audit, deployment checklist, monitoring plan.

### 3.25 Search, knowledge bases, and retrieval systems
- Source provenance: every indexed item retains source and version information.
- Freshness: update and staleness policies are defined.
- Retrieval quality: precision, recall, and abstention are measured on labelled cases.
- Citation fidelity: generated answers map claims to retrieved sources.
- Access control: retrieval respects source permissions.
- Poisoning resistance: untrusted content cannot alter system policy or trusted metadata.
- Deletion propagation: removed or restricted sources are handled correctly.
- Evaluation: benchmark coverage includes hard negatives and changing corpora.
Evidence: provenance metadata, retrieval benchmark, citation checks, permission tests, deletion tests.

### 3.26 Scientific instrumentation and laboratory systems
- Calibration: calibration sources, intervals, and uncertainty are recorded.
- Measurement integrity: units, precision, and error bounds are explicit.
- Traceability: instrument, operator, sample, and procedure are linked.
- Environmental conditions: relevant conditions are recorded.
- Safety: physical, chemical, biological, and electrical hazards are controlled as applicable.
- Data integrity: raw observations are preserved and changes are auditable.
Evidence: calibration certificates, lab protocol, instrument logs, uncertainty analysis, safety review.

### 3.27 Healthcare and safety-critical decision support
- Clinical or domain oversight: qualified experts define and review intended use.
- Intended-use boundaries: unsupported diagnosis or treatment claims are prohibited.
- Safety hazards: foreseeable harm and failure paths are assessed.
- Data privacy: health data receive strict access and retention controls.
- Validation: performance is tested on representative populations and workflows.
- Human factors: users understand uncertainty and retain appropriate decision authority.
- Regulatory review: applicable legal and regulatory requirements are identified before deployment.
Evidence: expert review, validation protocol, hazard analysis, privacy assessment, regulatory assessment. This rubric is not a substitute for professional or regulatory approval.

### 3.28 Legal, policy, and compliance research
- Authority: primary legal texts and official guidance are prioritised.
- Jurisdiction: location, effective date, and applicable scope are explicit.
- Citations: claims link to exact sources and relevant sections.
- Currency: amendments, repeals, and current status are checked.
- Interpretation: law, guidance, commentary, and opinion are distinguished.
- Uncertainty: unsettled or fact-dependent issues are stated.
- Review: qualified legal or compliance review is obtained where needed.
Evidence: source register, jurisdiction table, date checked, pinpoint citations, reviewer notes. This rubric does not make an AI agent a lawyer.

### 3.29 Finance, trading, and quantitative analysis
- Data integrity: source, timestamps, survivorship, and look-ahead bias are checked.
- Method validity: assumptions and model limits are explicit.
- Backtest quality: fees, slippage, liquidity, and out-of-sample tests are included.
- Risk: drawdown, tail risk, leverage, and exposure are measured.
- Reproducibility: data snapshots and code versions are recorded.
- Governance: limits, approvals, and monitoring are defined.
- Communication: projections are not presented as guarantees.
Evidence: data audit, backtest protocol, risk report, independent reproduction, approval record.

### 3.30 Product management and product experiments
- User problem: evidence supports the problem and target segment.
- Hypothesis: expected change and measurable outcome are stated.
- Experiment design: control, sample, duration, and stopping rules are appropriate.
- Metrics: guardrail and primary metrics are defined before results.
- Bias: selection, novelty, and measurement bias are considered.
- Decision record: results, uncertainty, and follow-up decisions are documented.
Evidence: product brief, experiment protocol, metric definitions, results, decision log.

## 4. Cross-domain projects

For mixed projects, combine only relevant profiles. Examples:

- Cybersecurity research platform: universal + cybersecurity + research + web/API as applicable.
- AI medical decision support: universal + AI/ML + healthcare + privacy + security.
- Robotics simulator: universal + robotics + simulation/game + mathematics.
- Financial analytics dashboard: universal + finance + data engineering + web/UX.
- AI coding agent: universal + AI/ML + automation/agentic workflows + software engineering + security.

Do not mechanically combine every listed rubric. Select criteria based on actual components, users, data, risks, and deployment context.

## 5. Project rubric record

Each project should keep a short record, for example `docs/QUALITY-RUBRICS.md`:

- Project type(s) and why they apply.
- Selected rubric profiles and version.
- Critical and high-priority criteria.
- Project-specific thresholds and acceptance tests.
- Criteria marked not applicable, with reasons.
- Evidence links and review status.
- Accepted risks, owners, and review date.

Suggested status values: `not-assessed`, `planned`, `in-progress`, `pass`, `fail`, `blocked`, `not-applicable`, `accepted-risk`.

## 6. Rules for agents

- Read this file before major architecture or implementation work in a connected repository.
- Read the project-specific `docs/QUALITY-RUBRICS.md` if it exists.
- If the project type is unclear, infer a provisional type from repository evidence and ask one focused question only when the uncertainty changes important design choices.
- Do not impose a niche rubric that does not fit the project.
- Do not weaken a critical criterion merely to make a checklist pass.
- Do not invent evidence or report unrun tests as passed.
- Explain trade-offs in plain language. Keep the default workflow simple, but preserve expert controls.
- Reassess the selected rubrics when project scope changes.
