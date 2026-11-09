#!/usr/bin/env python3
"""Discover recently active GitHub repositories and estimate star growth."""
import datetime as dt
import json
import os
import urllib.parse
import urllib.request
from pathlib import Path

CATEGORIES = [
    "artificial-intelligence", "machine-learning", "cybersecurity",
    "devops", "developer-tools", "testing", "web-development",
    "database", "automation", "data-engineering", "performance",
    "observability", "documentation", "browser-automation"
]
OUTPUT = Path("catalog/inbox/discovery-candidates.json")
HISTORY = Path("catalog/inbox/repository-history.json")
TOKEN = os.getenv("GITHUB_TOKEN")
DAYS = int(os.getenv("DISCOVERY_DAYS", "30"))
MIN_STARS = int(os.getenv("DISCOVERY_MIN_STARS", "5"))
PER_CATEGORY = int(os.getenv("DISCOVERY_PER_CATEGORY", "20"))

def github_search(query):
    params = urllib.parse.urlencode({
        "q": query, "sort": "updated", "order": "desc",
        "per_page": PER_CATEGORY
    })
    request = urllib.request.Request(
        "https://api.github.com/search/repositories?" + params,
        headers={
            "Accept": "application/vnd.github+json",
            "X-GitHub-Api-Version": "2022-11-28",
            **({"Authorization": f"Bearer {TOKEN}"} if TOKEN else {})
        }
    )
    with urllib.request.urlopen(request, timeout=30) as response:
        return json.load(response).get("items", [])

def load_json(path, fallback):
    if not path.exists():
        return fallback
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError):
        return fallback

def main():
    now = dt.datetime.now(dt.timezone.utc)
    cutoff = (now - dt.timedelta(days=DAYS)).date().isoformat()
    found = {}
    errors = []

    # Search recently active repositories, not only the most-starred projects.
    # This gives smaller, less visible projects a chance to enter the review queue.
    for category in CATEGORIES:
        query = f"topic:{category} pushed:>{cutoff} stars:>={MIN_STARS} archived:false"
        try:
            for repo in github_search(query):
                key = repo["full_name"].lower()
                item = found.setdefault(key, {
                    "full_name": repo["full_name"],
                    "url": repo["html_url"],
                    "description": repo.get("description"),
                    "topics": repo.get("topics", []),
                    "stars": repo.get("stargazers_count", 0),
                    "forks": repo.get("forks_count", 0),
                    "open_issues": repo.get("open_issues_count", 0),
                    "license": (repo.get("license") or {}).get("spdx_id"),
                    "created_at": repo.get("created_at"),
                    "pushed_at": repo.get("pushed_at"),
                    "archived": repo.get("archived", False),
                    "default_branch": repo.get("default_branch"),
                    "discovery_categories": []
                })
                if category not in item["discovery_categories"]:
                    item["discovery_categories"].append(category)
        except Exception as exc:
            errors.append({"category": category, "error": str(exc)})

    if not found and len(errors) == len(CATEGORIES):
        raise SystemExit("All GitHub searches failed; keeping the previous discovery files.")

    history_data = load_json(HISTORY, {"schema_version": 1, "repositories": {}})
    history = history_data.get("repositories", {})
    for key, item in found.items():
        record = history.setdefault(key, {"full_name": item["full_name"], "snapshots": []})
        previous = record["snapshots"][-1] if record["snapshots"] else None
        snapshot = {"checked_at": now.isoformat(), "stars": item["stars"]}
        record["snapshots"] = (record["snapshots"] + [snapshot])[-12:]
        item["star_growth_since_last_check"] = None
        item["star_growth_period_days"] = None
        if previous:
            previous_time = dt.datetime.fromisoformat(previous["checked_at"])
            elapsed = max((now - previous_time).total_seconds() / 86400, 0.01)
            growth = item["stars"] - previous["stars"]
            item["star_growth_since_last_check"] = growth
            item["star_growth_period_days"] = round(elapsed, 2)
            item["estimated_weekly_star_growth"] = round(growth / elapsed * 7, 2)
        else:
            item["estimated_weekly_star_growth"] = None

    candidates = sorted(
        found.values(),
        key=lambda item: (
            -(item["estimated_weekly_star_growth"] or -1),
            -item["stars"],
            item["full_name"].lower()
        )
    )
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT.write_text(json.dumps({
        "schema_version": 1,
        "generated_at": now.isoformat(),
        "discovery_window_days": DAYS,
        "minimum_stars": MIN_STARS,
        "candidate_count": len(candidates),
        "candidates": candidates,
        "errors": errors,
        "notice": "Candidates only. Recent activity and star growth are discovery signals, not quality or approval signals. Review source, license, security, maintenance, and project fit."
    }, indent=2) + "\n", encoding="utf-8")
    HISTORY.write_text(json.dumps({
        "schema_version": 1,
        "updated_at": now.isoformat(),
        "repositories": history
    }, indent=2) + "\n", encoding="utf-8")
    print(f"Wrote {len(candidates)} candidates; {len(errors)} category searches failed.")

if __name__ == "__main__":
    main()
