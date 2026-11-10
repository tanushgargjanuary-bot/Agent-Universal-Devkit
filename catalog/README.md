# External Resource Catalog

This is the human-readable index. Structured records live in `catalog/resources.yaml`. The SQLite registry in `core/resource-registry/` stores working metadata and duplicate-review history.

**Catalog inclusion is not endorsement.** Entries are candidates unless an explicit approval process says otherwise. Check licensing, maintenance, security, compatibility, and task fit before use.

## How to evaluate a candidate

1. Confirm the upstream repository and canonical identity.
2. Read the primary documentation and source.
3. Check the license and terms for linked assets, datasets, APIs, and documentation.
4. Check releases, maintenance, known advisories, dependencies, and platform support.
5. Map capabilities to the actual task requirements.
6. Identify permissions, data access, network access, and execution risks.
7. Record evidence, checked dates, unknowns, and limitations.
8. Apply mandatory constraints before any weighted comparison.
9. Approve only through the repository's defined review process.

## Resource groups

The catalog includes general engineering references, security and learning resources, AI engineering, agent workflows, memory and control surfaces, and specialist frontend and game-development candidates.

Use the structured catalog as the source of truth for candidate metadata. Do not assume this summary is a complete list.

## Explicit exclusions

Some resources are intentionally excluded when their scope does not match the universal Devkit. Exclusion is not a statement that a resource is poor quality. It means the resource does not fit the current product scope.

## Rules

- Discovery candidates are not approved recommendations.
- Do not equate stars with quality.
- Verify upstream activity, releases, advisories, license, and terms.
- A repository license does not automatically cover linked books, papers, photos, datasets, APIs, or websites.
- Do not copy or execute catalog content automatically.
- Compare capabilities at component or skill level, not only repository level.
- Mark stale entries and preserve review history.
