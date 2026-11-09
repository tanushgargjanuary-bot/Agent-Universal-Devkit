#!/usr/bin/env python3
"""Find recent GitHub repositories for human/agent review; never auto-approve them."""
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
TOKEN = os.getenv("GITHUB_TOKEN")
DAYS = int(os.getenv("DISCOVERY_DAYS", "30"))
MIN_STARS = int(os.getenv("DISCOVERY_MIN_STARS", "15"))
PER_CATEGORY = int(os.getenv("DISCOVERY_PER_CATEGORY", "10"))

def github_search(query):
    params = urllib.parse.urlencode({"q": query, "sort": "stars", "order": "desc", "per_page": PER_CATEGORY})
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

def main():
    cutoff = (dt.datetime.now(dt.timezone.utc) - dt.timedelta(days=DAYS)).date().isoformat()
    found = {}
    errors = []
    for category in CATEGORIES:
        query = f"topic:{category} created:>{cutoff} stars:>={MIN_STARS} archived:false"
        try:
            for repo in github_search(query):
                found[repo["full_name"].lower()] = {
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
                    "discovery_category": category,
                    "discovery_query": query
                }
        except Exception as exc:
            errors.append({"category": category, "error": str(exc)})

    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    payload = {
        "schema_version": 1,
        "generated_at": dt.datetime.now(dt.timezone.utc).isoformat(),
        "discovery_window_days": DAYS,
        "minimum_stars": MIN_STARS,
        "candidate_count": len(found),
        "candidates": sorted(found.values(), key=lambda item: (-item["stars"], item["full_name"].lower())),
        "errors": errors,
        "notice": "Discovery candidates only. Popularity is not an approval or quality signal. Review license, code, security, maintenance, and fit before catalog adoption."
    }
    OUTPUT.write_text(json.dumps(payload, indent=2) + "\n", encoding="utf-8")
    print(f"Wrote {len(found)} candidates; {len(errors)} category searches failed.")

if __name__ == "__main__":
    main()
