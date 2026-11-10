# Resource Registry

The Resource Registry stores external repositories and tools as normalized records
in SQLite. It supports hundreds or thousands of entries without turning the
catalog into a single manually edited markdown file.

## Quick start

Requires Node.js 22+ (the built-in `node:sqlite` API).

```bash
node core/resource-registry/bin/resource-registry.js init
node core/resource-registry/bin/resource-registry.js add \
  --url https://github.com/github/spec-kit \
  --name "Spec Kit" \
  --description "Structured workflows for spec-driven AI-assisted development" \
  --category agent-workflows \
  --capability specification
node core/resource-registry/bin/resource-registry.js list
node core/resource-registry/bin/resource-registry.js dedupe
node core/resource-registry/bin/resource-registry.js reviews
```

Use `--db PATH` to select another database. The default database is
`data/resource-registry.sqlite`. Keep the database out of Git. Store curated,
reviewable exports in the catalog files.

## Record model

- Canonical GitHub identity (owner/repository), plus repository URL.
- Name, description, kind, categories, capabilities, and lifecycle status.
- License and arbitrary source metadata.
- A stable content hash and an event history.
- Duplicate-pair review state and human decision.

The registry has a unique constraint on canonical repository identity. A URL
with a branch or file suffix resolves to the repository root. A second URL for
the same repository updates the same row.

## Deduplication model

The first version combines:
1. **Exact identity:** same canonical owner/repository.
2. **Capability overlap:** shared declared capabilities.
3. **Category overlap:** shared function categories.
4. **Text similarity:** token Jaccard similarity of name, description, and tags.

The scan proposes:
- `exact_duplicate` — one repository identity accidentally represented twice.
- `high_overlap` — likely functional overlap; human review required.
- `partial_overlap` — possibly an alternative or complement.

It does not use stars as a quality metric. It does not auto-delete or auto-deprecate
records. A human must explicitly choose a duplicate winner. Alternatives and
complements remain separate.

## Commands

`init`, `add`, `list`, `search`, `dedupe`, `reviews`, and `stats`.

The initial CLI provides import and inspection primitives. Review decisions are
available through the JavaScript API (`reviewPair`) and will be exposed in a
later CLI/API iteration.

## Limits

- Similarity is heuristic, not semantic proof.
- Capability tags must be normalized and evidence-backed to improve quality.
- It does not yet crawl GitHub at scale or call an embedding model.
- It does not auto-approve, install, or execute repositories.
- Run periodic backups of the SQLite database.
