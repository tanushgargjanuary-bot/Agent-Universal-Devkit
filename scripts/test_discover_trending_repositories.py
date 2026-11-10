import datetime as dt
import unittest
from discover_trending_repositories import TrendingParser, append_candidates, filter_reasons, to_record, render_yaml


class TrendingDiscoveryTests(unittest.TestCase):
    def test_parser_extracts_unique_repositories_from_h2(self):
        p = TrendingParser()
        p.feed('<a href="/noise/outside">x</a><h2><a href="/../api">bad</a></h2><h2><a href="/acme/a">a</a></h2><h2><a href="/acme/b">b</a></h2><h2><a href="/acme/a">again</a></h2>')
        self.assertEqual(p.names, ["acme/a", "acme/b"])

    def test_filter_rejects_bad_metadata(self):
        now = dt.datetime(2026, 11, 10, tzinfo=dt.timezone.utc)
        repo = {"archived": True, "fork": True, "private": True, "visibility": "private", "description": "", "stargazers_count": 1,
                "license": {"spdx_id": "NOASSERTION"}, "pushed_at": "2025-01-01T00:00:00Z"}
        reasons = filter_reasons(repo, now)
        for expected in ("archived", "fork", "not_public", "missing_description", "below_minimum_stars", "license_not_identified", "stale_repository", "missing_default_branch"):
            self.assertIn(expected, reasons)

    def test_filter_accepts_recent_licensed_repository(self):
        now = dt.datetime(2026, 11, 10, tzinfo=dt.timezone.utc)
        repo = {"archived": False, "fork": False, "private": False, "visibility": "public", "description": "Useful", "stargazers_count": 100,
                "license": {"spdx_id": "MIT"}, "pushed_at": "2026-11-09T00:00:00Z", "default_branch": "main"}
        self.assertEqual(filter_reasons(repo, now), [])

    def test_records_are_never_approved(self):
        repo = {"full_name": "acme/a", "html_url": "https://github.com/acme/a", "description": "Useful", "topics": ["tools"], "license": {"spdx_id": "MIT"}}
        r = to_record(repo, ["daily", "weekly"], "2026-11-10T00:00:00Z")
        self.assertEqual(r["status"], "candidate")
        self.assertEqual(r["license"]["review_status"], "unreviewed")
        self.assertEqual(len(r["evidence"]), 3)
        rendered = render_yaml(r)
        self.assertTrue(rendered.startswith("  - id:"))
        self.assertIn("\n    status: candidate", rendered)

    def test_append_is_idempotent(self):
        repo = {"full_name": "acme/a", "html_url": "https://github.com/acme/a", "description": "Useful", "topics": ["tools"], "license": {"spdx_id": "MIT"}}
        r = to_record(repo, ["daily"], "2026-11-10T00:00:00Z")
        original = "resources:\n  - id: old\n    url: https://github.com/acme/old\n"
        updated, added = append_candidates(original, [r])
        self.assertEqual(added, ["acme/a"])
        again, added_again = append_candidates(updated, [r])
        self.assertEqual(added_again, [])
        self.assertEqual(again, updated)


if __name__ == "__main__":
    unittest.main()
