# Resource Intelligence and Registry

## Purpose

Resource Intelligence discovers and evaluates external tools, libraries, repositories, skills, and engineering references. It supports the Agent Orchestration priority. It does not automatically endorse, install, or execute discovered resources.

## Lifecycle

1. Discover candidates from GitHub and trusted sources.
2. Normalize canonical identity and store records in the SQLite registry.
3. Synchronize repository metadata and health signals.
4. Inspect upstream documentation, releases, maintenance, security, license, dependencies, and terms.
5. Extract capabilities, platforms, integration points, and evidence.
6. Detect exact duplicates and likely functional overlap.
7. Classify relationships as duplicate, alternative, complement, dependency, conflict, or distinct.
8. Compare viable resources against actual requirements.
9. Approve only after hard constraints and evidence checks pass.
10. Re-check approved entries and mark stale or risky resources.

## GitHub metadata synchronization

Run `scripts/resource-intelligence/sync-github.mjs` after installing the registry package dependency. It reads candidate and approved records from `catalog/resources.yaml`, requests repository, latest release, and latest commit metadata, stores snapshots in SQLite, and writes a JSON health report.

Use a fine-grained, read-only GitHub token. The script handles rate limits and transient server failures, saves completed records, and can be re-run after interruption. It does not change approval status, install repositories, inspect source code, or treat popularity as quality.

This is metadata synchronization, not a full security, dependency, or license audit.

## Registry

The local registry lives in `core/resource-registry/`. It creates a SQLite file at `data/resource-registry.sqlite` by default. Do not commit this database. The registry stores canonical identities, metadata, tags, status, content hashes, event history, and duplicate review decisions.

See [Resource Registry](../core/resource-registry/README.md).

## Deduplication

A single similarity score is not sufficient to remove content.

- Exact canonical identity means duplicate records.
- High capability, category, and text overlap creates a human review.
- Partial overlap requires classification.
- Human review decides duplicate, alternative, complement, or distinct.
- Only an explicit duplicate decision can deprecate a record.
- Records are not physically deleted. Deprecation preserves history.

Do not merge tools only because they share a category. Agent systems can differ in harness support, permissions, storage, lifecycle, and deployment model.

## Discovery versus endorsement

Discovery creates candidates. It does not approve, install, or recommend a repository. Popularity and recency are weak signals, not quality guarantees.

The resource engine applies mandatory constraints before weighted ranking. Unknown facts remain unknown. Evidence must support every scored claim.

## Current limitations

The registry uses deterministic lexical similarity and declared capabilities. It can miss synonyms or flag unrelated projects that share generic words. Human review prevents heuristic matches from deprecating useful tools.

GitHub sync provides metadata, not source-code review, security certification, a complete license assessment, or proof of compatibility. Embeddings, scheduled refresh, richer evidence checks, and an agent-facing search API remain future work.
