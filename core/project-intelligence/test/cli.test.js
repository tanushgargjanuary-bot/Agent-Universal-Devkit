import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { main, parseArgs, usage } from "../bin/repo-scan.js";
import { renderMarkdownReport } from "../src/report.js";

async function fixture(t) {
  const root = await mkdtemp(path.join(os.tmpdir(), "devkit-repo-scan-cli-"));
  t.after(() => rm(root, { recursive: true, force: true }));
  await mkdir(path.join(root, "docs", "assets"), { recursive: true });
  await writeFile(path.join(root, "README.md"), "# Example\n\n![Screenshot](docs/assets/dashboard-screenshot.png)\n");
  await writeFile(path.join(root, "docs", "assets", "dashboard-screenshot.png"), "fixture");
  await writeFile(path.join(root, "LICENSE"), "MIT");
  return root;
}

function outputCapture() {
  return {
    stdout: { value: "", write(chunk) { this.value += chunk; } },
    stderr: { value: "", write(chunk) { this.value += chunk; } }
  };
}

test("parses default, path, and format arguments", () => {
  assert.deepEqual(parseArgs([]), { root: ".", format: "json", help: false });
  assert.deepEqual(parseArgs(["./project", "--format", "markdown"]), { root: "./project", format: "markdown", help: false });
  assert.deepEqual(parseArgs(["--format=json", "./project"]), { root: "./project", format: "json", help: false });
});

test("rejects unknown flags, duplicate paths, and unsupported formats", () => {
  assert.throws(() => parseArgs(["--unknown"]), /unknown option/);
  assert.throws(() => parseArgs(["one", "two"]), /only one repository path/);
  assert.throws(() => parseArgs(["--format", "html"]), /format must be/);
  assert.throws(() => parseArgs(["--format"]), /requires json or markdown/);
});

test("prints help without scanning a repository", async () => {
  const io = outputCapture();
  const code = await main(["--help"], io);
  assert.equal(code, 0);
  assert.equal(io.stdout.value, usage());
  assert.equal(io.stderr.value, "");
});

test("emits valid JSON by default", async (t) => {
  const root = await fixture(t);
  const io = outputCapture();
  const code = await main([root], io);
  assert.equal(code, 0);
  const report = JSON.parse(io.stdout.value);
  assert.equal(report.profile.root_name, path.basename(root));
  assert.equal(report.profile.has_readme_demo, true);
  assert.equal(io.stderr.value, "");
});

test("emits readable Markdown without trusting repository text as markup", async (t) => {
  const root = await fixture(t);
  const io = outputCapture();
  const code = await main([root, "--format", "markdown"], io);
  assert.equal(code, 0);
  assert.ok(io.stdout.value.startsWith("# Repository scan:"));
  assert.ok(io.stdout.value.includes("## Project profile"));
  assert.ok(io.stdout.value.includes("## Findings"));
  assert.ok(io.stdout.value.includes("## Limitations"));
  assert.equal(io.stderr.value, "");
});

test("returns a controlled error for an invalid repository path", async () => {
  const io = outputCapture();
  const code = await main(["/path/that/does/not/exist"], io);
  assert.equal(code, 2);
  assert.ok(io.stderr.value.startsWith("repo-scan:"));
  assert.equal(io.stdout.value, "");
});

test("escapes untrusted repository strings in Markdown output", () => {
  const rendered = renderMarkdownReport({
    scan_id: "scan-1",
    profile: { root_name: "demo-project", captured_at: "2026-11-10T12:00:00Z", languages: {}, ecosystems: [], frameworks: [] },
    findings: [{
      title: "[click](https://example.invalid)",
      severity: "low",
      status: "suspected",
      confidence: 0.5,
      rule_id: "repo.test",
      affected_paths: ["src/[unsafe].js"],
      description: "Untrusted text"
    }],
    evidence: [],
    coverage: [],
    limitations: []
  });
  assert.ok(rendered.includes("\\[click\\]\\(https://example\\.invalid\\)"));
  assert.equal(rendered.includes("[click](https://example.invalid)"), false);
});
