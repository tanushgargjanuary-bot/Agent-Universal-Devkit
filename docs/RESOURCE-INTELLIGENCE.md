# Resource Intelligence

Resource discovery and orchestration are equal, independent priorities in the Devkit.

## Resource lifecycle

1. Discover candidate projects from GitHub and trusted sources.
2. Deduplicate candidates against the approved catalog and previous discoveries.
3. Inspect upstream documentation, source, releases, maintenance, security signals, and license.
4. Compare candidates with existing alternatives.
5. Record evidence and evaluation scores.
6. Propose one of four outcomes: adopt A, adopt B, use a justified hybrid, or use neither.
7. Submit catalog changes for review.
8. Re-check approved entries and mark stale or risky resources.

## Discovery is not endorsement

The scheduled discovery workflow searches recent repositories by engineering topic.
It produces a review queue. It does not automatically install, approve, or recommend
a repository. Stars and recent activity are discovery signals only.

The initial discovery uses GitHub Search API and therefore has API rate limits and
search-index limitations. It is not a complete view of GitHub or a true real-time
trending feed.

## Comparing alternatives

Use the resource engine in `core/resource-engine/`. It ranks resources using
explicit 0-5 evaluations and configurable weights. Each evaluation must include
evidence links.

A hybrid is suggested only when:
- At least one resource explicitly declares the other as complementary.
- The combination adds a capability.
- Both resources meet the compatibility threshold.
- Integration cost stays within the configured limit.

The engine does not inspect source code or prove compatibility by itself. Agents
must gather evidence and score resources honestly. Unknown facts must remain
unknown, not be guessed.

## Adoption rules

- Prefer maintained, secure, well-documented projects with suitable licenses.
- Do not equate stars with quality.
- Check transitive dependencies and installation scripts before execution.
- Pin versions for reproducible use.
- Prefer upstream links over copying source code.
- Keep alternatives and rejected candidates with reasons where useful.
- Re-evaluate when project needs change; there is no permanent universal winner.
