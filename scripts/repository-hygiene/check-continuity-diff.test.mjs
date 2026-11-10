import test from "node:test";
import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const script = path.resolve(import.meta.dirname, "check-continuity-diff.mjs");

function repo(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "devkit-continuity-"));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  execFileSync("git", ["init", "-q", root]);
  execFileSync("git", ["-C", root, "config", "user.name", "Devkit Test"]);
  execFileSync("git", ["-C", root, "config", "user.email", "devkit-test@example.invalid"]);
  fs.mkdirSync(path.join(root, "docs"), { recursive: true });
  fs.mkdirSync(path.join(root, ".devkit"), { recursive: true });
  fs.writeFileSync(path.join(root, ".devkit", "governance.json"), JSON.stringify({ schemaVersion: 1, level: "L2" }));
  fs.writeFileSync(path.join(root, "docs", "PROJECT-STATE.md"), "# State\n");
  fs.writeFileSync(path.join(root, "docs", "WORKLOG.md"), "# Work Log\n");
  fs.writeFileSync(path.join(root, "README.md"), "# Project\n");
  execFileSync("git", ["-C", root, "add", "."]);
  execFileSync("git", ["-C", root, "commit", "-qm", "base"]);
  const base = execFileSync("git", ["-C", root, "rev-parse", "HEAD"], { encoding: "utf8" }).trim();
  return { root, base };
}

function commit(root, files, message = "change") {
  for (const [file, content] of Object.entries(files)) {
    const target = path.join(root, file);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, content);
  }
  execFileSync("git", ["-C", root, "add", "."]);
  execFileSync("git", ["-C", root, "commit", "-qm", message]);
  return execFileSync("git", ["-C", root, "rev-parse", "HEAD"], { encoding: "utf8" }).trim();
}

function run(root, base, head) {
  return spawnSync(process.execPath, [script, "--root", root, "--base", base, "--head", head], { encoding: "utf8" });
}

test("requires both continuity records for implementation changes", t => {
  const { root, base } = repo(t);
  const head = commit(root, { "core/example.js": "export const value = 1;\n" });
  const result = run(root, base, head);
  assert.equal(result.status, 1);
  assert.match(result.stdout, /WORKLOG_NOT_UPDATED/);
  assert.match(result.stdout, /PROJECT_STATE_NOT_UPDATED/);
});

test("passes implementation changes when state and work log are updated", t => {
  const { root, base } = repo(t);
  const head = commit(root, {
    "core/example.js": "export const value = 1;\n",
    "docs/PROJECT-STATE.md": "# State\n\nUpdated implementation status.\n",
    "docs/WORKLOG.md": "# Work Log\n\n### 2026-11-10 — Add example\n"
  });
  const result = run(root, base, head);
  assert.equal(result.status, 0, result.stderr + result.stdout);
});

test("requires a work-log entry for documentation-only changes", t => {
  const { root, base } = repo(t);
  const head = commit(root, { "docs/ARCHITECTURE.md": "# Architecture\n" });
  const result = run(root, base, head);
  assert.equal(result.status, 1);
  assert.match(result.stdout, /WORKLOG_NOT_UPDATED/);
  assert.doesNotMatch(result.stdout, /PROJECT_STATE_NOT_UPDATED/);
});

test("does not require continuity updates for automated discovery snapshots", t => {
  const { root, base } = repo(t);
  const head = commit(root, { "catalog/inbox/discovery-candidates.json": '{"candidates":[]}\n' });
  const result = run(root, base, head);
  assert.equal(result.status, 0, result.stderr + result.stdout);
});

test("uses warning severity for L1 prototypes", t => {
  const { root } = repo(t);
  fs.writeFileSync(path.join(root, ".devkit", "governance.json"), JSON.stringify({ schemaVersion: 1, level: "L1" }));
  execFileSync("git", ["-C", root, "add", "."]);
  execFileSync("git", ["-C", root, "commit", "-qm", "set level"]);
  const base = execFileSync("git", ["-C", root, "rev-parse", "HEAD"], { encoding: "utf8" }).trim();
  const head = commit(root, { "core/example.js": "export const value = 1;\n" });
  const result = run(root, base, head);
  assert.equal(result.status, 0, result.stderr + result.stdout);
  assert.match(result.stdout, /\[WARNING\]/);
});
