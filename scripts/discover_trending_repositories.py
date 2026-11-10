#!/usr/bin/env python3
"""Discover GitHub daily/weekly trending repositories; add metadata-filtered candidates only."""
import datetime as dt
import json
import os
import re
import urllib.error
import urllib.parse
import urllib.request
from html.parser import HTMLParser
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CATALOG = ROOT / "catalog/resources.yaml"
REPORT = ROOT / "catalog/inbox/trending-discovery-latest.json"
TOKEN = os.getenv("GITHUB_TOKEN")
MIN_STARS = int(os.getenv("TRENDING_MIN_STARS", "10"))
MAX_PUSH_AGE_DAYS = int(os.getenv("TRENDING_MAX_PUSH_AGE_DAYS", "180"))
AGENT = "Agent-Universal-Devkit-Trending-Discovery/1.0"


class TrendingParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.in_h2 = False
        self.names = []

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == "h2":
            self.in_h2 = True
        elif tag == "a" and self.in_h2:
            parts = attrs.get("href", "").strip("/").split("/")
            if len(parts) == 2 and all(re.fullmatch(r"[A-Za-z0-9_.-]+", part) and part not in {".", ".."} for part in parts):
                name = "/".join(parts)
                if name not in self.names:
                    self.names.append(name)

    def handle_endtag(self, tag):
        if tag == "h2":
            self.in_h2 = False


def get_bytes(url, accept):
    headers = {"Accept": accept, "User-Agent": AGENT}
    if TOKEN:
        headers["Authorization"] = f"Bearer {TOKEN}"
    try:
        with urllib.request.urlopen(urllib.request.Request(url, headers=headers), timeout=30) as response:
            return response.read()
    except urllib.error.HTTPError as exc:
        if exc.code == 404:
            return None
        raise RuntimeError(f"GitHub returned HTTP {exc.code} for {url}") from exc
    except (urllib.error.URLError, TimeoutError) as exc:
        raise RuntimeError(f"Request failed for {url}: {exc}") from exc


def trending(period):
    if period not in ("daily", "weekly"):
        raise ValueError("period must be daily or weekly")
    url = f"https://github.com/trending?since={period}"
    raw = get_bytes(url, "text/html; charset=utf-8")
    if raw is None:
        raise RuntimeError(f"GitHub Trending returned 404 for {period}")
    parser = TrendingParser()
    parser.feed(raw.decode("utf-8", errors="replace"))
    if not parser.names:
        raise RuntimeError(f"No repositories parsed from GitHub Trending ({period}); no catalog changes made")
    return parser.names


def metadata(full_name):
    url = "https://api.github.com/repos/" + "/".join(urllib.parse.quote(x, safe="") for x in full_name.split("/"))
    raw = get_bytes(url, "application/vnd.github+json")
    if raw is None:
        return None
    result = json.loads(raw)
    if result.get("full_name", "").lower() != full_name.lower():
        raise RuntimeError(f"GitHub returned a different repository identity for {full_name}")
    return result


def filter_reasons(repo, now):
    reasons = []
    if repo.get("archived"): reasons.append("archived")
    if repo.get("disabled"): reasons.append("disabled")
    if repo.get("fork"): reasons.append("fork")
    if repo.get("private") or repo.get("visibility") not in (None, "public"): reasons.append("not_public")
    if not str(repo.get("description") or "").strip(): reasons.append("missing_description")
    if int(repo.get("stargazers_count") or 0) < MIN_STARS: reasons.append("below_minimum_stars")
    spdx = str((repo.get("license") or {}).get("spdx_id") or "").upper()
    if not spdx or spdx in ("NOASSERTION", "NONE"): reasons.append("license_not_identified")
    if not repo.get("default_branch"): reasons.append("missing_default_branch")
    pushed = repo.get("pushed_at")
    if not pushed:
        reasons.append("missing_push_timestamp")
    elif (now - dt.datetime.fromisoformat(pushed.replace("Z", "+00:00"))).days > MAX_PUSH_AGE_DAYS:
        reasons.append("stale_repository")
    return reasons


def q(value):
    return json.dumps(str(value), ensure_ascii=False)


def to_record(repo, periods, checked):
    full = repo["full_name"]
    url = repo["html_url"].rstrip("/")
    topics = sorted(set(repo.get("topics") or []))
    license_id = (repo.get("license") or {}).get("spdx_id") or "NOASSERTION"
    evidence = [
        {"claim": f"Listed on GitHub Trending ({p}).", "url": f"https://github.com/trending?since={p}", "checked_at": checked}
        for p in periods
    ]
    evidence.append({"claim": "Repository metadata and license identifier retrieved from GitHub API; no source or dependency audit performed.", "url": url, "checked_at": checked})
    return {
        "id": "github-" + re.sub(r"[^a-z0-9._-]", "-", full.lower().replace("/", "--")),
        "name": full, "url": url, "full_name": full, "kind": "repository",
        "categories": topics or ["trending"], "description": repo["description"].strip(),
        "capabilities": topics,
        "license": {"spdx_id": license_id, "source_url": url, "review_status": "unreviewed"},
        "status": "candidate",
        "compatibility": {"notes": "Trending discovery candidate; compatibility and feature claims have not been independently reviewed."},
        "maintenance": {"status": "not_assessed", "checked_at": checked},
        "security": {"status": "not_assessed", "checked_at": checked},
        "evaluation": {"status": "not_evaluated", "reason": "Passed metadata filters only. Manual project-fit, source, dependency, security, and license review is required."},
        "evidence": evidence,
    }


def render_yaml(r):
    lines = [
        f"- id: {q(r['id'])}", f"  name: {q(r['name'])}", f"  url: {q(r['url'])}",
        f"  full_name: {q(r['full_name'])}", "  kind: repository",
        f"  categories: {json.dumps(r['categories'], ensure_ascii=False)}",
        f"  description: {q(r['description'])}",
        f"  capabilities: {json.dumps(r['capabilities'], ensure_ascii=False)}",
        "  license:", f"    spdx_id: {q(r['license']['spdx_id'])}",
        f"    source_url: {q(r['license']['source_url'])}", "    review_status: unreviewed",
        "  status: candidate", "  compatibility:",
        f"    notes: {q(r['compatibility']['notes'])}", "  maintenance:",
        "    status: not_assessed", f"    checked_at: {q(r['maintenance']['checked_at'])}",
        "  security:", "    status: not_assessed", f"    checked_at: {q(r['security']['checked_at'])}",
        "  evaluation:", "    status: not_evaluated", f"    reason: {q(r['evaluation']['reason'])}",
        "  evidence:",
    ]
    for e in r["evidence"]:
        lines += [f"    - claim: {q(e['claim'])}", f"      url: {q(e['url'])}", f"      checked_at: {q(e['checked_at'])}"]
    return "\n".join("  " + line for line in lines) + "\n"


def append_candidates(text, records):
    existing = {x.lower() for x in re.findall(r"^\s+url:\s*[\"']?(https://github\.com/[A-Za-z0-9_.-]+/[A-Za-z0-9_.-]+)", text, re.M)}
    blocks, added = [], []
    for r in records:
        url = r["url"].lower()
        if url in existing:
            continue
        blocks.append(render_yaml(r))
        added.append(r["full_name"])
        existing.add(url)
    if not blocks:
        return text, []
    separator = "" if text.endswith("\n\n") else "\n" if text.endswith("\n") else "\n\n"
    return text + separator + "\n".join(blocks), added


def main():
    now = dt.datetime.now(dt.timezone.utc)
    checked = now.isoformat(timespec="seconds").replace("+00:00", "Z")
    feeds = {p: trending(p) for p in ("daily", "weekly")}
    periods = {}
    names = {}
    for p, repos in feeds.items():
        for name in repos:
            key = name.lower()
            names.setdefault(key, name)
            periods.setdefault(key, set()).add(p)
    records, rejected, unavailable = [], [], []
    for key, name in sorted(names.items()):
        repo = metadata(name)
        if repo is None:
            unavailable.append(name)
            continue
        reasons = filter_reasons(repo, now)
        if reasons:
            rejected.append({"full_name": name, "reasons": reasons})
        else:
            records.append(to_record(repo, sorted(periods[key]), checked))
    old = CATALOG.read_text(encoding="utf-8")
    new, added = append_candidates(old, records)
    report = {
        "schema_version": 1, "generated_at": checked,
        "source": "GitHub Trending pages and GitHub repository metadata API",
        "periods": {p: {"url": f"https://github.com/trending?since={p}", "repositories": feeds[p]} for p in feeds},
        "metadata_records": len(names) - len(unavailable),
        "accepted_by_metadata_filter": [r["full_name"] for r in records],
        "added_to_catalog_as_candidates": added,
        "already_present": sorted(set(r["full_name"] for r in records) - set(added)),
        "filtered_out": rejected, "unavailable": unavailable,
        "filter_policy": {
            "minimum_stars": MIN_STARS, "maximum_days_since_last_push": MAX_PUSH_AGE_DAYS,
            "exclude_archived_disabled_forks": True, "require_description": True,
            "require_identified_license": True,
            "approval": "Never automatic. All additions remain candidate with unreviewed license status."
        },
        "limitations": [
            "GitHub Trending is HTML, not a stable versioned API. Markup changes can stop parsing.",
            "Metadata filters do not inspect source code, dependencies, advisories, maintainer trust, or project quality.",
            "A license identifier is not a legal review of all assets or linked content.",
            "GitHub Trending is not a complete index of every repository gaining stars."
        ]
    }
    REPORT.parent.mkdir(parents=True, exist_ok=True)
    REPORT.write_text(json.dumps(report, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    if new != old:
        CATALOG.write_text(new, encoding="utf-8")
    print(json.dumps({"daily": len(feeds["daily"]), "weekly": len(feeds["weekly"]), "accepted": len(records), "added": len(added), "filtered": len(rejected), "unavailable": len(unavailable)}, indent=2))


if __name__ == "__main__":
    main()
