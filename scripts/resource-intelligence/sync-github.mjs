#!/usr/bin/env node
import { readFile, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { createRequire } from "node:module";
const require = createRequire(new URL("../../core/resource-registry/package.json", import.meta.url));
const { parse } = require("yaml");
import { ResourceRegistry } from "../../core/resource-registry/src/index.js";

const API = "https://api.github.com";
const USER_AGENT = "Agent-Universal-Devkit-Resource-Intelligence";
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

async function githubGet(url, token) {
  let attempt = 0;
  while (attempt < 5) {
    const response = await fetch(url, {
      headers: {
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
        "User-Agent": USER_AGENT,
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      }
    });
    if (response.ok) return response.json();
    if (response.status === 404) return null;
    const remaining = response.headers.get("x-ratelimit-remaining");
    const reset = Number(response.headers.get("x-ratelimit-reset") ?? 0) * 1000;
    const retryAfter = Number(response.headers.get("retry-after") ?? 0) * 1000;
    if ((response.status === 403 || response.status === 429) &&
        (remaining === "0" || retryAfter > 0)) {
      const wait = retryAfter || Math.max(1000, reset - Date.now() + 1000);
      if (wait > 15 * 60 * 1000) throw new Error(`GitHub rate limit requires waiting ${Math.ceil(wait / 60000)} minutes. Re-run later; completed records are already saved.`);
      await sleep(wait);
      attempt++;
      continue;
    }
    if (response.status >= 500) {
      await sleep(1000 * (2 ** attempt));
      attempt++;
      continue;
    }
    const detail = await response.text();
    throw new Error(`GitHub API ${response.status} for ${url}: ${detail.slice(0, 300)}`);
  }
  throw new Error(`GitHub API retry limit exceeded for ${url}`);
}

async function main() {
  const root = process.cwd();
  const catalogPath = path.resolve(root, process.argv[2] ?? "catalog/resources.yaml");
  const dbPath = path.resolve(root, process.env.DEVKIT_RESOURCE_DB ?? "data/resource-registry.sqlite");
  const reportPath = path.resolve(root, process.env.DEVKIT_RESOURCE_REPORT ?? "reports/resource-health-latest.json");
  const token = process.env.GITHUB_TOKEN;
  if (!token) throw new Error("Set GITHUB_TOKEN before syncing. The sync checks repository, release, and commit metadata and needs authenticated API limits.");
  const catalog = parse(await readFile(catalogPath, "utf8"));
  if (!Array.isArray(catalog?.resources)) throw new Error("Catalog must contain a resources array");
  const resources = catalog.resources.filter(item =>
    ["candidate", "approved"].includes(item.status) && item.full_name ||
    ["candidate", "approved"].includes(item.status) && /^https:\/\/github\.com\//.test(item.url ?? "")
  );
  const registry = await new ResourceRegistry({ dbPath }).open();
  const report = {
    generated_at: new Date().toISOString(),
    source: "GitHub REST API",
    authenticated: Boolean(token),
    total: resources.length,
    synced: 0,
    unavailable: [],
    errors: [],
    records: []
  };
  try {
    for (const item of resources) {
      const fullName = item.full_name ?? new URL(item.url).pathname.split("/").filter(Boolean).slice(0, 2).join("/");
      const encoded = fullName.split("/").map(encodeURIComponent).join("/");
      try {
        const repoData = await githubGet(`${API}/repos/${encoded}`, token);
        if (!repoData) {
          report.unavailable.push({ full_name: fullName, reason: "Repository not found or not publicly accessible." });
          continue;
        }
        const [release, commits] = await Promise.all([
          githubGet(`${API}/repos/${encoded}/releases/latest`, token),
          githubGet(`${API}/repos/${encoded}/commits?per_page=1`, token)
        ]);
        const latestCommit = Array.isArray(commits) ? commits[0] : null;
        const health = {
          checked_at: new Date().toISOString(),
          full_name: repoData.full_name,
          description: repoData.description,
          default_branch: repoData.default_branch,
          visibility: repoData.visibility,
          archived: repoData.archived,
          disabled: repoData.disabled,
          pushed_at: repoData.pushed_at,
          created_at: repoData.created_at,
          updated_at: repoData.updated_at,
          stargazers_count: repoData.stargazers_count,
          forks_count: repoData.forks_count,
          open_issues_count: repoData.open_issues_count,
          license: repoData.license ? {
            spdx_id: repoData.license.spdx_id,
            name: repoData.license.name,
            url: repoData.license.url
          } : null,
          latest_release: release ? {
            tag_name: release.tag_name,
            published_at: release.published_at,
            html_url: release.html_url,
            prerelease: release.prerelease,
            draft: release.draft
          } : null,
          latest_commit: latestCommit ? {
            sha: latestCommit.sha,
            committed_at: latestCommit.commit?.committer?.date ?? null,
            html_url: latestCommit.html_url
          } : null
        };
        const record = registry.upsert({
          ...item,
          full_name: undefined,
          url: `https://github.com/${repoData.full_name}`,
          name: item.name ?? repoData.full_name,
          description: item.description ?? repoData.description ?? "",
          license: item.license ?? {
            spdx_id: repoData.license?.spdx_id ?? "NOASSERTION",
            review_status: "unknown",
            source_url: repoData.license?.url ?? repoData.html_url
          },
          metadata: { ...(item.metadata ?? {}), github_health: health }
        }, { source: "github-api-sync" });
        report.synced++;
        report.records.push({ id: record.id, full_name: repoData.full_name, health });
      } catch (error) {
        report.errors.push({ full_name: fullName, error: error.message });
      }
    }
  } finally {
    registry.close();
  }
  await mkdir(path.dirname(reportPath), { recursive: true });
  await writeFile(reportPath, JSON.stringify(report, null, 2) + "\n", "utf8");
  console.log(JSON.stringify({
    report: reportPath,
    total: report.total,
    synced: report.synced,
    unavailable: report.unavailable.length,
    errors: report.errors.length,
    authenticated: report.authenticated
  }, null, 2));
  if (report.errors.length) process.exitCode = 1;
}
main().catch(error => { console.error(error.message); process.exitCode = 1; });
