#!/usr/bin/env node
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";

function parseArgs(argv) {
  const args = { root: process.cwd(), base: null, head: null };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--root") args.root = path.resolve(argv[++i] ?? "");
    else if (arg === "--base") args.base = argv[++i] ?? "";
    else if (arg === "--head") args.head = argv[++i] ?? "";
    else if (arg === "--help" || arg === "-h") args.help = true;
    else throw new Error("Unknown argument: " + arg);
  }
  return args;
}

function eventRange() {
  const eventPath = process.env.GITHUB_EVENT_PATH;
  const event = eventPath ? JSON.parse(readFileSync(eventPath, "utf8")) : {};
  if (event.pull_request?.base?.sha) {
    return { base: event.pull_request.base.sha, head: process.env.GITHUB_SHA || event.pull_request.head?.sha, separator: "..." };
  }
  if (event.before && event.after) {
    return { base: event.before, head: event.after, separator: ".." };
  }
  return null;
}

function readPolicy(root) {
  try {
    const config = JSON.parse(readFileSync(path.join(root, ".devkit", "governance.json"), "utf8"));
    return {
      level: ["L1", "L2", "L3", "L4"].includes(config.level) ? config.level : "L2",
      enabled: config.checks?.requireContinuityUpdates !== false
    };
  } catch {
    return { level: "L2", enabled: true };
  }
}

function git(root, args) {
  return execFileSync("git", args, { cwd: root, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).trim();
}

function isImplementationPath(file) {
  if (file === "catalog/inbox/discovery-candidates.json" || file === "catalog/inbox/repository-history.json") return false;
  return /^(core|integrations|scripts|schemas|agents|bootstrap|\.github|\.devkit|knowledge|rubrics|catalog)\//.test(file) ||
    /^(manifest\.yaml|package\.json|package-lock\.json|pnpm-lock\.yaml|yarn\.lock|Cargo\.toml|Cargo\.lock|pyproject\.toml|requirements\.txt|Dockerfile|Makefile|LICENSE|SECURITY\.md)$/i.test(file);
}

function isDocumentationPath(file) {
  return file.startsWith("docs/") ||
    ["README", "README.md", "AGENTS.md", "CONTRIBUTING.md", "SECURITY.md"].includes(file) ||
    /(^|\/)(README|README\.md|AGENTS\.md|CONTRIBUTING\.md)$/.test(file);
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    process.stdout.write("Usage: node scripts/repository-hygiene/check-continuity-diff.mjs [--root PATH] [--base SHA --head SHA]\n");
    return;
  }
  const range = args.base && args.head
    ? { base: args.base, head: args.head, separator: "..." }
    : eventRange();
  if (!range?.base || !range?.head || /^0+$/.test(range.base)) {
    process.stdout.write("Continuity diff check skipped: no comparable base commit is available.\n");
    return;
  }
  if (!/^[a-f0-9]{40}$/i.test(range.base) || !/^[a-f0-9]{40}$/i.test(range.head)) {
    throw new Error("Base and head must be full Git commit SHAs");
  }

  const policy = readPolicy(args.root);
  if (!policy.enabled) {
    process.stdout.write("Continuity diff check disabled by repository governance config.\n");
    return;
  }
  git(args.root, ["cat-file", "-e", range.base + "^{commit}"]);
  git(args.root, ["cat-file", "-e", range.head + "^{commit}"]);
  const changed = git(args.root, ["diff", "--name-only", "--diff-filter=ACMR", range.base + range.separator + range.head])
    .split(/\r?\n/).filter(Boolean);
  const implementationChanges = changed.filter(isImplementationPath);
  const documentationChanges = changed.filter(isDocumentationPath);
  const hasWorklog = changed.includes("docs/WORKLOG.md");
  const hasProjectState = changed.includes("docs/PROJECT-STATE.md");
  const findings = [];
  const severity = policy.level === "L1" ? "warning" : "error";

  if (implementationChanges.length) {
    if (!hasWorklog) findings.push({ rule: "WORKLOG_NOT_UPDATED", message: "Implementation or configuration changed without updating docs/WORKLOG.md." });
    if (!hasProjectState) findings.push({ rule: "PROJECT_STATE_NOT_UPDATED", message: "Implementation or configuration changed without reviewing and updating docs/PROJECT-STATE.md." });
  } else if (documentationChanges.length && !hasWorklog && changed.some(file => file !== "docs/WORKLOG.md")) {
    findings.push({ rule: "WORKLOG_NOT_UPDATED", message: "Documentation changed without recording the meaningful change in docs/WORKLOG.md." });
  }

  if (findings.length) {
    for (const finding of findings) process.stdout.write("[" + severity.toUpperCase() + "] " + finding.rule + " — " + finding.message + "\n");
    process.stdout.write("Implementation files: " + implementationChanges.join(", ") + "\n");
    process.stdout.write("Changed files: " + changed.join(", ") + "\n");
    if (severity === "error") process.exitCode = 1;
    return;
  }
  process.stdout.write("Continuity diff check passed (" + changed.length + " changed files).\n");
}

try { main(); }
catch (error) {
  process.stderr.write("Continuity diff check failed: " + error.message + "\n");
  process.exitCode = 2;
}
