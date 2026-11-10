# Test Strategy

Tests must verify implemented behaviour. A file's presence or a documentation claim is not proof of compatibility or correctness.

## Current test areas

- Resource engine: hard constraints, evidence-aware evaluation, and ranking behaviour.
- Resource registry: canonical identity, storage, metadata, and duplicate-review decisions.
- Knowledge Engine: registry validation, matching, prerequisites, approval metadata, and retrieval behaviour.
- Orchestrator: task validation, dependency ordering, knowledge integration, technology assessment, and policy decisions.
- Repository hygiene checker: read-only scan behaviour and JSON report structure.

## Required coverage as systems evolve

- YAML and JSON parsing and schemas.
- Required resource and knowledge metadata.
- Knowledge registry IDs, paths, prerequisites, and referenced files.
- Bootstrap file presence and pointer correctness.
- Duplicate IDs and invalid paths.
- Retrieval precision, recall, and abstention on labelled cases.
- Compatibility claims against tested harness versions.
- Policy allow, deny, approval, mismatch, and stale-plan cases.
- Executor-side policy checks immediately before actions.
- Approval expiry, replay protection, and audit records when those components exist.
- Failure recovery, retries, and idempotency for execution workflows.

## Test integrity

Do not report an integration as compatible because its files exist. Do not mark knowledge approved because its registry record is valid. Schema validation checks structure; technical review checks correctness.

Use independent test oracles where possible. Report the exact commands, runtime versions, and results. Distinguish tests that ran from tests that were not run.
