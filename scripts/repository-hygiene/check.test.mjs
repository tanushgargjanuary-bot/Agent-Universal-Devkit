import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

const script = path.join(import.meta.dirname, "check.mjs");
function fixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "devkit-hygiene-"));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  fs.writeFileSync(path.join(root, "README.md"), "# Example\n");
  fs.writeFileSync(path.join(root, ".gitignore"), "node_modules/\n");
  fs.writeFileSync(path.join(root, "AGENTS.md"), "# Rules\n");
  return root;
}
function run(root, ...args) {
  return spawnSync(process.execPath, [script, "--root", root, "--format", "json", ...args], { encoding: "utf8" });
}

test("clean minimal repository returns a valid report", t => {
  const root = fixture(t);
  const result = run(root);
  assert.equal(result.status, 0, result.stderr);
  const report = JSON.parse(result.stdout);
  assert.equal(report.schemaVersion, 1);
  assert.equal(report.summary.errors, 0);
  assert.equal(report.summary.filesScanned, 3);
});

test("detects likely credentials without printing their value", t => {
  const root = fixture(t);
  const secret = "ghp_" + "A".repeat(36);
  fs.writeFileSync(path.join(root, "config.js"), 'const token = "' + secret + '";\n');
  const result = run(root);
  const report = JSON.parse(result.stdout);
  assert.equal(result.status, 1);
  assert.equal(report.findings.some(x => x.rule === "POSSIBLE_SECRET" && x.path === "config.js"), true);
  assert.equal(result.stdout.includes(secret), false);
});

test("reports generated files and vague names as warnings", t => {
  const root = fixture(t);
  fs.mkdirSync(path.join(root, "temp2"));
  fs.writeFileSync(path.join(root, "temp2", "backup.zip"), "placeholder");
  const result = run(root);
  const report = JSON.parse(result.stdout);
  assert.equal(result.status, 0);
  assert.equal(report.findings.some(x => x.rule === "VAGUE_DIRECTORY_NAME"), true);
  assert.equal(report.findings.some(x => x.rule === "GENERATED_OR_BINARY_FILE"), true);
});

test("missing README is an error", t => {
  const root = fixture(t);
  fs.unlinkSync(path.join(root, "README.md"));
  const result = run(root);
  const report = JSON.parse(result.stdout);
  assert.equal(result.status, 1);
  assert.equal(report.findings[0].rule, "README_MISSING");
});

test("honours exclusions and governance config", t => {
  const root = fixture(t);
  fs.mkdirSync(path.join(root, ".devkit"));
  fs.mkdirSync(path.join(root, "generated"));
  fs.writeFileSync(path.join(root, "generated", "artifact.zip"), "placeholder");
  fs.writeFileSync(path.join(root, ".devkit", "governance.json"), JSON.stringify({
    schemaVersion: 1, level: "L3", excludePaths: ["generated"]
  }));
  const result = run(root);
  const report = JSON.parse(result.stdout);
  assert.equal(report.governanceLevel, "L3");
  assert.equal(report.findings.some(x => x.path.startsWith("generated/")), false);
});

test("rejects unsupported config schema", t => {
  const root = fixture(t);
  fs.mkdirSync(path.join(root, ".devkit"));
  fs.writeFileSync(path.join(root, ".devkit", "governance.json"), '{"schemaVersion":99,"level":"L2"}');
  const result = run(root);
  assert.equal(result.status, 2);
  assert.match(result.stderr, /Unsupported governance config/);
});
