# Resource Intelligence and Registry

## Lifecycle

1. Discover candidates from GitHub and trusted sources.
2. Normalize canonical identity and upsert records into the SQLite registry.
3. Inspect upstream docs, releases, maintenance, security, license, dependencies,
   and terms.
4. Extract capabilities, platforms, integration points, and evidence.
5. Detect exact duplicates and likely functional overlap.
6. Classify relationships as duplicate, alternative, complement, or distinct.
7. Compare viable resources against actual requirements.
8. Approve only after hard constraints and evidence checks pass.
9. Re-check approved entries and mark stale or risky resources.

## Registry

The local registry lives in `core/resource-registry/`. It creates a SQLite file
at `data/resource-registry.sqlite` by default. Do not commit this database.
The registry stores canonical identities, metadata, tags, status, content hashes,
event history, and duplicate review decisions.

See `core/resource-registry/README.md`.

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

Use `core/resource-engine/` for requirement-based comparisons. It applies
mandatory constraints before weighted ranking. Unknown facts remain unknown.
Evidence must support every scored claim.

## Limits

The first registry version uses deterministic lexical similarity and declared
capabilities. It works offline and is explainable, but it can miss synonyms or
flag unrelated projects that share generic words. The review queue prevents
heuristic matches from deprecating useful tools. GitHub API ingestion, embeddings,
scheduled refresh, and richer evidence checks are future work.
