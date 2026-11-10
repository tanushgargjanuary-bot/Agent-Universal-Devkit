# Daily and weekly trending resource discovery

DEVKIT checks GitHub Trending daily and weekly once per day.

## Flow

1. Read both public Trending feeds.
2. Extract every repository shown in each feed.
3. Retrieve repository metadata from the GitHub API.
4. Apply deterministic metadata filters.
5. Append new qualifying repositories to `catalog/resources.yaml` as `status: candidate`.
6. Mark the license as `unreviewed`, maintenance/security as `not_assessed`, and evaluation as `not_evaluated`.
7. Open or update a review pull request. Never approve, install, execute, or recommend a candidate automatically.

## Filters

A repository must not be archived, disabled, or a fork. It must have a description, at least 10 stars, an identified SPDX license, a default branch, and a push within the last 180 days. Set `TRENDING_MIN_STARS` or `TRENDING_MAX_PUSH_AGE_DAYS` to change the thresholds.

These filters only determine whether a repository enters the candidate catalog. They do not prove quality or safety.

## Evidence and human review

The workflow writes `catalog/inbox/trending-discovery-latest.json`. It records both feeds, accepted and rejected candidates, reasons, and limitations. Catalog entries link to their Trending feed and upstream repository.

A human reviewer must inspect source, dependencies, maintenance, security, compatibility, project fit, and license terms before approval. A GitHub license identifier is not legal approval for linked assets or data.

## Safety and limitations

- The workflow does not clone, install, build, or execute discovered repositories.
- It does not inspect source code or dependencies. It is not a security audit.
- GitHub Trending is HTML, not a stable API. If its markup changes or either feed cannot be parsed, the run fails before catalog changes are written.
- GitHub Trending is not a complete index of every repository gaining stars. The existing topic-based discovery remains a complementary feed.
- API failures stop the run. A 404 repository is recorded as unavailable.

## Test

```bash
cd scripts
python -m unittest -v test_discover_trending_repositories.py
```
