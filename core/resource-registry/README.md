# Resource Registry

SQLite-backed storage for the Devkit's growing repository and tool catalog.

## Setup

Requires Node.js 22.13+ for the built-in SQLite API.

Install the registry's local dependency:

```bash
npm install --prefix core/resource-registry
```

## Quick start

```bash
node core/resource-registry/bin/resource-registry.js init
node core/resource-registry/bin/resource-registry.js add --url https://github.com/github/spec-kit --name "Spec Kit" --description "Structured workflows for AI-assisted development" --category agent-workflows --capability specification
node core/resource-registry/bin/resource-registry.js list
node core/resource-registry/bin/resource-registry.js dedupe
node core/resource-registry/bin/resource-registry.js reviews
node core/resource-registry/bin/resource-registry.js stats
```

Use `--db PATH` to select a database. The default is
`data/resource-registry.sqlite`. Keep this file out of Git. Commit reviewable
exports and schema changes instead.

## GitHub catalog synchronization

Set a GitHub token with read access to public repository metadata, then run:

```bash
# PowerShell
$env:GITHUB_TOKEN = "YOUR_GITHUB_TOKEN"
node scripts/resource-intelligence/sync-github.mjs
```

The sync reads candidate and approved entries from catalog/resources.yaml.
It records repository identity, description, default branch, archive status,
activity timestamps, stars, forks, license metadata, latest release, and latest
commit in the registry. It writes a health report to
reports/resource-health-latest.json.

The sync is sequential, uses GitHub's REST API, retries rate limits and transient
server errors, and saves each completed record before moving to the next one.
Re-run after interruption. It does not approve resources, change catalog status,
install code, or execute repository contents. Use a fine-grained token with
read-only public repository metadata permissions. Never commit the token,
SQLite database, or generated health report.

## Stored data

- Canonical GitHub owner/repository identity and URL.
- Name, description, kind, categories, capabilities, and lifecycle status.
- License and source metadata.
- Stable content hash and change event history.
- Duplicate-pair review proposals and human decisions.
- Latest GitHub health snapshot in each resource's metadata.

The unique constraint on canonical repository identity prevents multiple
records for the same repository. URL suffixes such as branches and README paths
are normalized to the repository root.

## Deduplication

The first version uses exact canonical identity, declared capability overlap,
category overlap, and lexical similarity across names and descriptions.

The engine classifies exact duplicates, high overlap, and partial overlap.
It never deletes records automatically. A human must classify a pair as
duplicate, alternative, complement, or distinct. Only an explicit duplicate
decision can mark one record deprecated. History remains stored.

## Commands

`init`, `add`, `list`, `search`, `dedupe`, `reviews`, `review`, and
`stats`.

The API currently supports human decisions via `reviewPair()`. The CLI exposes
the same operation through the `review` command.

## Limits

- Similarity is heuristic, not semantic proof.
- Capability tags require evidence and consistent vocabulary.
- GitHub sync checks public repository metadata; it does not audit source code,
  advisories, transitive dependencies, or the full license terms.
- Embedding-based similarity, scheduled refresh, and export commands are not
  implemented yet.
- The registry does not approve, install, or execute external repositories.
- Back up the SQLite file regularly.
