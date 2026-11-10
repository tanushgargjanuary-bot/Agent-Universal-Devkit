#!/usr/bin/env node
import { randomUUID } from "node:crypto";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { createRecord } from "../../problem-engine/src/index.js";
import { scanRepository } from "../src/index.js";
import { renderMarkdownReport } from "../src/report.js";

export function parseArgs(args) {
  if (!Array.isArray(args) || args.some((arg) => typeof arg !== "string")) throw new TypeError("arguments must be an array of strings");
  const parsed = { root: ".", format: "json", help: false };
  let rootProvided = false;
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === "--help" || arg === "-h") {
      parsed.help = true;
      continue;
    }
    if (arg === "--format") {
      const value = args[index + 1];
      if (!value) throw new TypeError("--format requires json or markdown");
      index += 1;
      parsed.format = value;
      continue;
    }
    if (arg.startsWith("--format=")) {
      parsed.format = arg.slice("--format=".length);
      continue;
    }
    if (arg.startsWith("-")) throw new TypeError("unknown option: " + arg);
    if (rootProvided) throw new TypeError("only one repository path may be supplied");
    parsed.root = arg;
    rootProvided = true;
  }
  if (!["json", "markdown"].includes(parsed.format)) throw new TypeError("format must be json or markdown");
  return parsed;
}

export function usage() {
  return [
    "Usage: repo-scan [repository-path] [--format json|markdown]",
    "",
    "Options:",
    "  --format json       Emit machine-readable JSON (default).",
    "  --format markdown   Emit a readable Markdown report.",
    "  -h, --help          Show this help.",
    "",
    "Safety: read-only. Does not run project scripts, install dependencies, or access the network."
  ].join("\n") + "\n";
}

export async function main(args = process.argv.slice(2), io = {}) {
  const stdout = io.stdout ?? process.stdout;
  const stderr = io.stderr ?? process.stderr;
  try {
    const options = parseArgs(args);
    if (options.help) {
      stdout.write(usage());
      return 0;
    }
    const problem = createRecord("problem", {
      id: "repo-scan-" + randomUUID(),
      goal: "Assess repository health and identify evidence-backed improvement opportunities",
      created_at: new Date().toISOString(),
      priority: "normal",
      constraints: ["Read-only repository inspection", "Do not execute repository code", "Do not access the network"],
      domain_hints: ["software"]
    });
    const report = await scanRepository(path.resolve(options.root), problem);
    stdout.write(options.format === "markdown" ? renderMarkdownReport(report) : JSON.stringify(report, null, 2) + "\n");
    return 0;
  } catch (error) {
    stderr.write("repo-scan: " + (error?.message ?? String(error)) + "\n");
    return 2;
  }
}

const invokedPath = process.argv[1];
if (invokedPath && import.meta.url === pathToFileURL(invokedPath).href) {
  process.exitCode = await main();
}
