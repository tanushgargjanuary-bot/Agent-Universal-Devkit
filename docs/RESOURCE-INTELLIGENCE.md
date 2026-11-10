# Resource Intelligence and Registry

## Lifecycle

1. Discover candidates from GitHub and trusted sources.
2. Normalize canonical identity and upsert records into the SQLite registry.
3. Synchronize repository metadata and health signals from the GitHub REST API.
4. Inspect upstream docs, releases, maintenance, security, license, dependencies,
   and terms.
5. Extract capabilities, platforms, integration points, and evidence.
6. Detect exact duplicates and likely functional overlap.
7. Classify relationships as duplicate, alternative, complement, dependency,
   conflict, or distinct.
8. Compare viable resources against actual requirements.
9. Approve only after hard constraints and evidence checks pass.
10. Re-check approved entries and mark stale or risky resources.

## Automated GitHub synchronization

Run scripts/resource-intelligence/sync-github.mjs after installing the
registry package dependency. The script reads candidate and approved records
from catalog/resources.yaml and requests repository, latest release, and latest
commit metadata from GitHub. It stores snapshots in the SQLite registry and
writes a JSON health report.

Use a fine-grained, read-only GitHub token. The script handles rate limits and
transient server failures, saves completed records, and can be re-run after an
interruption. It does not change approval status, install repositories, inspect
source code, or treat popularity as quality.

This is metadata synchronization, not a full security or license audit.
Security advisories, dependency analysis, code-level review, and legal review
remain separate work.

## Registry

The local registry lives in core/resource-registry/. It creates a SQLite file
at data/resource-registry.sqlite by default. Do not commit this database.
The registry stores canonical identities, metadata, tags, status, content hashes,
event history, and duplicate review decisions.

See core/resource-registry/README.md.

## Deduplication rules

A single similarity score is not sufficient to remove content.

- Exact canonical identity means duplicate records.
- High capability, category, and text overlap creates a human review.
- Partial overlap requires classification.
- Human review decides duplicate, alternative, complement, or distinct.
- Only an explicit duplicate decision can deprecate a record.
- Records are not physically deleted. Deprecation preserves history.

Do not merge tools only because they share a category. Agent systems can differ
in harness support, permissions, storage, lifecycle, and deployment model.

## Discovery vs endorsement

Discovery creates candidates. It does not approve, install, or recommend a
repository. Popularity and recency are weak signals, not quality guarantees.

Use core/resource-engine/ for requirement-based comparisons. It applies
mandatory constraints before weighted ranking. Unknown facts remain unknown.
Evidence must support every scored claim.

## Limits

The registry uses deterministic lexical similarity and declared capabilities.
It is explainable, but it can miss synonyms or flag unrelated projects that
share generic words. The review queue prevents heuristic matches from
deprecating useful tools. GitHub sync provides metadata, not source-code review,
security certification, or a complete license assessment. Embeddings,
scheduled refresh, and richer evidence checks remain future work.
