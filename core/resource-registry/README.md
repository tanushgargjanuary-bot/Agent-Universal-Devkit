# Resource Registry

SQLite-backed storage for the Devkit's external resource catalog. The registry manages canonical identity, metadata, status, content hashes, event history, health snapshots, and human-reviewed duplicate decisions.

## Requirements and setup

Requires Node.js 22.13+ for the built-in SQLite API.

```bash
npm install --prefix core/resource-registry
node core/resource-registry/bin/resource-registry.js init
```

## Quick start

```bash
node core/resource-registry/bin/resource-registry.js add --url https://github.com/github/spec-kit --name "Spec Kit" --description "Structured workflows for AI-assisted development" --category agent-workflows --capability specification
node core/resource-registry/bin/resource-registry.js list --status candidate --limit 50
node core/resource-registry/bin/resource-registry.js dedupe
node core/resource-registry/bin/resource-registry.js reviews
node core/resource-registry/bin/resource-registry.js stats
```

Use `--db PATH` to select a database. The default is `data/resource-registry.sqlite`. Keep this database and generated reports out of Git. Commit reviewable exports and schema changes instead.

## Commands

`init`, `add`, `list`, `search`, `dedupe`, `reviews`, `review`, and `stats`. List filters run before pagination. Search and review queues use bounded limits. Deduplication uses category/capability blocking, with explicit record and comparison limits. It stops with an error when a limit is exceeded; it does not silently skip records. Only an explicit `duplicate_keep_left` or `duplicate_keep_right` decision deprecates a record.

Run tests from the repository root:

```bash
npm test --prefix core/resource-registry
npm run lint --prefix core/resource-registry
```

## GitHub metadata synchronization

Set a read-only GitHub token and run:

```powershell
$env:GITHUB_TOKEN = "YOUR_GITHUB_TOKEN"
node scripts/resource-intelligence/sync-github.mjs
```

The sync reads candidate and approved entries from `catalog/resources.yaml`. It records repository identity, description, default branch, archive status, activity timestamps, stars, forks, license metadata, latest release, and latest commit.

The sync uses GitHub's REST API, retries rate limits and transient server errors, and saves each completed record. Re-run after interruption. It does not approve resources, install code, or execute repository contents.

This is metadata synchronization. It is not source review, dependency auditing, security certification, or a complete license assessment.

## Deduplication

The first version uses canonical identity, declared capability overlap, category overlap, and lexical similarity. It proposes duplicate and overlap reviews. It never deletes records automatically.

A human must classify a pair as duplicate, alternative, complement, or distinct. Only an explicit duplicate decision can mark a record deprecated. History remains stored.

## Commands

`init`, `add`, `list`, `search`, `dedupe`, `reviews`, `review`, and `stats`.

## Limits

- Similarity is heuristic, not semantic proof.
- Capability tags require evidence and consistent vocabulary.
- GitHub sync does not inspect source code, transitive dependencies, advisories, or full license terms.
- Embedding-based similarity, scheduled refresh, and export commands are not implemented.
- The registry does not approve, install, or execute external repositories.
- Back up the SQLite file regularly.
