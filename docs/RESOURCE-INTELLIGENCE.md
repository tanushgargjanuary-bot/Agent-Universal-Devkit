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

The weekly discovery workflow searches recently active repositories by engineering topic.
It uses low star thresholds and sorts by recent activity so smaller projects can appear.
It also stores weekly star snapshots and estimates star growth between observations.

This is a useful trending signal, not a complete or real-time trending feed. The first
observation creates a baseline; growth estimates become available after later runs.
GitHub Search API has rate limits and search-index limitations.

Discovery creates a review queue. It does not approve, install, or recommend a repository.
Popularity, recency, and star growth are signals, not quality guarantees.

## Comparing alternatives

Use the resource engine in `core/resource-engine/`. It first applies mandatory hard constraints, then ranks eligible resources using explicit 0-5 evaluations and configurable weights. Each evaluation must include evidence links. A high weighted score cannot override a failed hard constraint.

A hybrid is suggested only when:
- At least one resource explicitly declares the other as complementary.
- The combination adds a capability.
- Both resources meet the compatibility threshold.
- Integration cost stays within the configured limit.

The engine does not inspect source code or prove compatibility by itself. Agents
must gather evidence and score resources honestly. Unknown facts must remain unknown, not be guessed. If a mandatory fact is missing, the candidate is excluded and the result reports insufficient evidence rather than treating the missing fact as a pass.

Supported hard constraints include allowed SPDX license IDs, reviewed-license status, minimum security and compatibility scores, maximum integration cost, required platforms, required capabilities, and evidence age. The engine returns rejected candidates with separate violation and unknown reasons. A hybrid must cover every required capability before it can be proposed as a viable outcome.

## Adoption rules

- Prefer maintained, secure, well-documented projects with suitable licenses.
- Do not equate stars with quality.
- Check transitive dependencies and installation scripts before execution.
- Pin versions for reproducible use.
- Prefer upstream links over copying source code.
- Keep alternatives and rejected candidates with reasons where useful.
- Re-evaluate when project needs change; there is no permanent universal winner.
