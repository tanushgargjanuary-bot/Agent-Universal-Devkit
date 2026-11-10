import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, mkdir, readFile, rm, symlink, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { createRecord, validateRecord } from "../../problem-engine/src/index.js";
import { discoverRepository, scanRepository } from "../src/index.js";

const timestamp = "2026-11-10T12:00:00Z";
function makeProblem() {
  return createRecord("problem", {
    id: "repo-scan-problem",
    goal: "Assess this repository and identify high-confidence improvement opportunities",
    created_at: timestamp,
    priority: "normal",
    constraints: ["Read-only scan", "Do not execute repository code"],
    domain_hints: ["software"]
  });
}
async function fixture(t) {
  const root = await mkdtemp(path.join(os.tmpdir(), "devkit-project-intel-"));
  t.after(() => rm(root, { recursive: true, force: true }));
  return root;
}
async function put(root, name, content = "") {
  const target = path.join(root, name);
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, content, "utf8");
  return target;
}

test("discovers manifests, frameworks, languages, docs, tests, and CI without running code", async (t) => {
  const root = await fixture(t);
  await put(root, "README.md", "# Example\n\n![Application screenshot](docs/assets/dashboard-screenshot.png)\n");
  await put(root, "docs/assets/dashboard-screenshot.png", "fixture image placeholder");
  await put(root, "LICENSE", "MIT");
  await put(root, "package.json", JSON.stringify({
    dependencies: { next: "1.0.0", react: "1.0.0" },
    scripts: { test: "node test/run.js" }
  }));
  await put(root, "package-lock.json", "{}");
  await put(root, "src/index.ts", "export const value = 1;");
  await put(root, "tests/index.test.ts", "test('example');");
  await put(root, ".github/workflows/ci.yml", "name: CI");
  await put(root, "docs/overview.md", "# Docs");
  await put(root, "node_modules/ignored/index.js", "not scanned");

  const profile = await discoverRepository(root);
  assert.equal(profile.has_readme, true);
  assert.equal(profile.readme_scan_complete, true);
  assert.equal(profile.has_readme_demo, true);
  assert.ok(profile.readme_demo_signals.some((signal) => signal.includes("dashboard-screenshot.png")));
  assert.equal(profile.has_license, true);
  assert.equal(profile.has_ci, true);
  assert.equal(profile.has_tests, true);
  assert.equal(profile.has_docs_directory, true);
  assert.deepEqual(profile.ecosystems, ["node"]);
  assert.deepEqual(profile.frameworks, ["Next.js", "React"]);
  assert.equal(profile.languages.TypeScript, 2);
  assert.equal(profile.skipped_directory_count, 1);
  assert.equal(profile.incomplete, false);

  const report = await scanRepository(root, makeProblem());
  assert.equal(report.findings.length, 0);
  assert.equal(report.summary.finding_count, 0);
  assert.equal(report.evidence.length, 0);
});

test("reports missing project signals with evidence and cautious status", async (t) => {
  const root = await fixture(t);
  const report = await scanRepository(root, makeProblem());
  const rules = new Set(report.findings.map((finding) => finding.rule_id));
  assert.ok(rules.has("repo.documentation.readme-missing"));
  assert.ok(rules.has("repo.ci.not-detected"));
  assert.ok(rules.has("repo.tests.not-detected"));
  assert.ok(rules.has("repo.license.not-detected"));
  assert.equal(report.findings.find((finding) => finding.rule_id === "repo.documentation.readme-missing").status, "verified");
  assert.equal(report.findings.find((finding) => finding.rule_id === "repo.tests.not-detected").status, "suspected");
  assert.ok(report.findings.every((finding) => validateRecord("finding", finding).valid));
  assert.ok(report.evidence.every((record) => validateRecord("evidence", record).valid));
  assert.ok(report.findings.every((finding) => finding.evidence_ids.length === 1));
});

test("reports a missing README demonstration without treating badges as demos", async (t) => {
  const root = await fixture(t);
  await put(root, "README.md", "# Example\n\n![Build](https://img.shields.io/badge/build-passing-green.svg)\n");
  const profile = await discoverRepository(root);
  assert.equal(profile.has_readme, true);
  assert.equal(profile.has_readme_demo, false);
  const report = await scanRepository(root, makeProblem());
  const finding = report.findings.find((entry) => entry.rule_id === "repo.readme.demo-not-detected");
  assert.ok(finding);
  assert.equal(finding.status, "suspected");
  assert.equal(finding.severity, "low");
  assert.deepEqual(finding.affected_paths, ["README.md"]);
  assert.ok(validateRecord("finding", finding).valid);
});

test("recognises explicit live demo links and embedded videos", async (t) => {
  const root = await fixture(t);
  await put(root, "README.md", "# Example\n\n[Try the interactive demo](https://example.invalid/demo)\n");
  let profile = await discoverRepository(root);
  assert.equal(profile.has_readme_demo, true);
  await put(root, "README.md", "# Example\n\n<video src=\"./demo.mp4\" controls></video>\n");
  profile = await discoverRepository(root);
  assert.equal(profile.has_readme_demo, true);
});

test("does not report missing demos when the README cannot be read within limits", async (t) => {
  const root = await fixture(t);
  await put(root, "README.md", "# A README that is larger than the configured limit");
  const profile = await discoverRepository(root, { max_readme_bytes: 10 });
  assert.equal(profile.readme_scan_complete, false);
  assert.equal(profile.readme_errors[0].code, "README_TOO_LARGE");
  const report = await scanRepository(root, makeProblem(), { max_readme_bytes: 10 });
  assert.equal(report.findings.some((entry) => entry.rule_id === "repo.readme.demo-not-detected"), false);
});

test("detects malformed package manifests without executing package scripts", async (t) => {
  const root = await fixture(t);
  await put(root, "package.json", "{ invalid json");
  const report = await scanRepository(root, makeProblem());
  const finding = report.findings.find((entry) => entry.rule_id === "repo.manifest.invalid-json");
  assert.ok(finding);
  assert.equal(finding.severity, "high");
  assert.equal(finding.status, "verified");
  assert.deepEqual(finding.affected_paths, ["package.json"]);
});

test("reports a missing lockfile only when a Node manifest declares dependencies", async (t) => {
  const root = await fixture(t);
  await put(root, "package.json", JSON.stringify({ dependencies: { example: "1.0.0" } }));
  const report = await scanRepository(root, makeProblem());
  assert.ok(report.findings.some((entry) => entry.rule_id === "repo.dependencies.lockfile-missing"));
});

test("does not follow symlinks or scan common dependency directories", async (t) => {
  const root = await fixture(t);
  const outside = await fixture(t);
  await put(outside, "README.md", "outside");
  await symlink(outside, path.join(root, "linked"));
  await put(root, "vendor/secret/index.js", "ignored");
  const profile = await discoverRepository(root);
  assert.equal(profile.symlink_count, 1);
  assert.equal(profile.file_count, 0);
  assert.equal(profile.has_readme, false);
  assert.equal(profile.skipped_directory_count, 1);
  assert.equal(profile.incomplete, false);
});

test("suppresses absence findings when the inventory is truncated", async (t) => {
  const root = await fixture(t);
  await put(root, "a.txt", "a");
  await put(root, "b.txt", "b");
  const report = await scanRepository(root, makeProblem(), { max_files: 1 });
  assert.equal(report.incomplete, true);
  assert.equal(report.findings.length, 0);
  assert.ok(report.limitations.some((item) => item.includes("suppressed")));
});

test("validates roots and scan limits", async (t) => {
  const root = await fixture(t);
  await assert.rejects(() => discoverRepository(path.join(root, "missing")), /ENOENT/);
  await assert.rejects(() => discoverRepository(root, { max_files: 0 }), /max_files/);
  await assert.rejects(() => scanRepository(root, {}), /Invalid problem record/);
});
