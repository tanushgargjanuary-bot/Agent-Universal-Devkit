# Resource Registry

SQLite-backed storage for the Devkit's growing repository and tool catalog.

## Quick start

Requires Node.js 22+ for the built-in `node:sqlite` API.

```bash
node core/resource-registry/bin/resource-registry.js init
node core/resource-registry/bin/resource-registry.js add --url https://github.com/github/spec-kit --name "Spec Kit" --description "Structured workflows for AI-assisted development" --category agent-workflows --capability specification
node core/resource-registry/bin/resource-registry.js list
node core/resource-registry/bin/resource-registry.js dedupe
node core/resource-registry/bin/resource-registry.js reviews
```

Use `--db PATH` to select a database. The default is
`data/resource-registry.sqlite`. Keep this file out of Git. Commit reviewable
exports and schema changes instead.

## Stored data

- Canonical GitHub owner/repository identity and URL.
- Name, description, kind, categories, capabilities, and lifecycle status.
- License and source metadata.
- Stable content hash and change event history.
- Duplicate-pair review proposals and human decisions.

The unique constraint on canonical repository identity prevents multiple
records for the same repository. URL suffixes such as branches and README paths
are normalized to the repository root.

## Deduplication

The first version uses:
1. Exact canonical identity.
2. Declared capability overlap.
3. Category overlap.
4. Lexical similarity across names and descriptions.

The engine classifies exact duplicates, high overlap, and partial overlap.
It never deletes records automatically. A human must classify a pair as
duplicate, alternative, complement, or distinct. Only an explicit duplicate
decision can mark one record deprecated. History remains stored.

## Commands

`init`, `add`, `list`, `search`, `dedupe`, `reviews`, and `stats`.

The API currently supports human decisions via `reviewPair()`. The CLI review
decision command is not implemented yet.

## Limits

- Similarity is heuristic, not semantic proof.
- Capability tags require evidence and consistent vocabulary.
- GitHub ingestion, embedding-based similarity, scheduled refresh, and export
  commands are not implemented yet.
- The registry does not approve, install, or execute external repositories.
- Back up the SQLite file regularly.
