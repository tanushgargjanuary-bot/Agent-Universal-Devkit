#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const VERSION = 1;
const DEFAULT_IGNORES = new Set([
  ".git", "node_modules", ".venv", "venv", "__pycache__", ".next",
  ".nuxt", ".turbo", "coverage", "dist", "build", ".cache"
]);
const GENERATED_EXTENSIONS = new Set([
  ".exe", ".dll", ".so", ".dylib", ".class", ".jar", ".zip", ".7z",
  ".rar", ".tar", ".gz", ".sqlite", ".sqlite3", ".db", ".log",
  ".tmp", ".bak", ".orig", ".swp", ".swo"
]);
const TEXT_EXTENSIONS = new Set([
  ".txt", ".md", ".json", ".yaml", ".yml", ".toml", ".ini", ".cfg",
  ".conf", ".env", ".js", ".mjs", ".cjs", ".ts", ".tsx", ".jsx",
  ".py", ".rb", ".go", ".rs", ".java", ".kt", ".cs", ".cpp", ".h",
  ".hpp", ".sh", ".ps1", ".bat", ".sql", ".xml", ".html", ".css"
]);

function parseArgs(argv) {
  const args = { root: process.cwd(), format: "text", config: null };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--root") args.root = path.resolve(argv[++i] ?? "");
    else if (arg === "--format") args.format = argv[++i] ?? "";
    else if (arg === "--config") args.config = argv[++i] ?? "";
    else if (arg === "--help" || arg === "-h") args.help = true;
    else throw new Error("Unknown argument: " + arg);
  }
  if (!["text", "json"].includes(args.format)) throw new Error("--format must be text or json");
  return args;
}

function loadConfig(root, configPath) {
  const file = configPath ? path.resolve(root, configPath) : path.join(root, ".devkit", "governance.json");
  if (!fs.existsSync(file)) {
    return { level: "L2", excludePaths: [], checks: { secretPatterns: true, generatedFiles: true, naming: true, continuityDocs: true, maxStateAgeDays: 90 } };
  }
  const parsed = JSON.parse(fs.readFileSync(file, "utf8"));
  if (parsed.schemaVersion !== VERSION) throw new Error("Unsupported governance config schemaVersion");
  if (!["L1", "L2", "L3", "L4"].includes(parsed.level)) throw new Error("Governance level must be L1, L2, L3, or L4");
  if (parsed.excludePaths !== undefined && (!Array.isArray(parsed.excludePaths) || parsed.excludePaths.some(x => typeof x !== "string"))) {
    throw new Error("excludePaths must be an array of repository-relative paths");
  }
  return {
    level: parsed.level,
    excludePaths: parsed.excludePaths ?? [],
    checks: {
      secretPatterns: parsed.checks?.secretPatterns !== false,
      generatedFiles: parsed.checks?.generatedFiles !== false,
      naming: parsed.checks?.naming !== false,
      continuityDocs: parsed.checks?.continuityDocs !== false,
      maxStateAgeDays: Number.isInteger(parsed.checks?.maxStateAgeDays) && parsed.checks.maxStateAgeDays >= 1 && parsed.checks.maxStateAgeDays <= 3650
        ? parsed.checks.maxStateAgeDays
        : 90
    }
  };
}

function add(findings, severity, rule, file, message, line = null) {
  findings.push({ severity, rule, path: file, ...(line ? { line } : {}), message });
}

function walk(root, config, findings) {
  const files = [];
  const ignored = new Set([...DEFAULT_IGNORES, ...config.excludePaths.map(x => x.replaceAll("\", "/").replace(/^\/+|\/+$/g, ""))]);
  function visit(dir, relative = "") {
    let entries;
    try { entries = fs.readdirSync(dir, { withFileTypes: true }); }
    catch { add(findings, "warning", "SCAN_UNREADABLE", relative || ".", "Directory could not be read."); return; }
    for (const entry of entries) {
      const rel = relative ? relative + "/" + entry.name : entry.name;
      if (ignored.has(rel) || DEFAULT_IGNORES.has(entry.name)) continue;
      if (entry.isSymbolicLink()) continue;
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (config.checks.naming && /^(misc|old|backup|temp\d*|tmp\d*|final[-_]?final)$/i.test(entry.name)) {
          add(findings, "warning", "VAGUE_DIRECTORY_NAME", rel, "Directory name is vague or suggests temporary storage. Confirm its purpose; do not rename automatically.");
        }
        visit(full, rel);
      } else if (entry.isFile()) {
        files.push({ full, rel, name: entry.name });
      }
    }
  }
  visit(root);
  return files;
}

function scan(root, config) {
  const findings = [];
  const files = walk(root, config, findings);
  const byPath = new Set(files.map(x => x.rel));
  if (!byPath.has("README.md") && !byPath.has("README")) {
    add(findings, "error", "README_MISSING", "README.md", "Add a README with purpose, setup, usage, validation, and known limitations.");
  }
  if (!byPath.has(".gitignore")) {
    add(findings, "warning", "GITIGNORE_MISSING", ".gitignore", "Add ignore rules for local secrets, dependencies, build output, and temporary files that apply to this stack.");
  }
  if (!byPath.has("AGENTS.md") && !byPath.has("CONTRIBUTING.md")) {
    add(findings, "info", "WORKING_RULES_NOT_FOUND", ".", "No root AGENTS.md or CONTRIBUTING.md was found. Add one only if the project needs shared working rules.");
  }

  if (config.checks.continuityDocs) {
    const required = ["docs/PROJECT-STATE.md", "docs/WORKLOG.md"];
    const severity = config.level === "L1" ? "warning" : "error";
    for (const requiredPath of required) {
      if (!byPath.has(requiredPath)) {
        add(findings, severity, "CONTINUITY_DOCUMENT_MISSING", requiredPath,
          "Add the project-state handoff or chronological work log. Use the Devkit templates and preserve project-specific content.");
      }
    }

    const statePath = "docs/PROJECT-STATE.md";
    if (byPath.has(statePath)) {
      const stateFile = files.find(x => x.rel === statePath);
      let state = "";
      try { state = fs.readFileSync(stateFile.full, "utf8"); } catch {}
      const requiredSections = [
        ["PROJECT_IDENTITY_SECTION_MISSING", /project identity/i],
        ["IMPLEMENTATION_STATUS_SECTION_MISSING", /current implementation|implementation status/i],
        ["ARCHITECTURE_SECTION_MISSING", /architecture map|architecture overview/i],
        ["ACTIVE_WORK_SECTION_MISSING", /active work|current work/i],
        ["VERIFICATION_SECTION_MISSING", /verification record|verification status/i],
        ["RISKS_SECTION_MISSING", /risks|known issues/i],
        ["NEXT_ACTIONS_SECTION_MISSING", /next actions|next steps/i],
        ["HANDOFF_METADATA_SECTION_MISSING", /handoff metadata|last reviewed/i]
      ];
      for (const [rule, pattern] of requiredSections) {
        const headings = state.split(/\r?\n/).filter(line => /^#{1,6}\s+/.test(line));
        if (!headings.some(line => pattern.test(line))) {
          add(findings, severity, rule, statePath, "Add the missing handoff section. Keep it concise and link to canonical project documentation.");
        }
      }
      const placeholders = [
        ["PROJECT_STATE_EMPTY_FIELD", /^\s*-\s*\*\*[^*]+:\*\*\s*$/m],
        ["PROJECT_STATE_DATE_PLACEHOLDER", /\bYYYY-MM-DD\b/],
        ["PROJECT_STATE_ACTION_PLACEHOLDER", /\[Action(?:,|\])/i],
        ["PROJECT_STATE_EMPTY_TABLE_ROW", /^\s*\|\s*\|\s*\|/m]
      ];
      for (const [rule, pattern] of placeholders) {
        if (pattern.test(state)) {
          add(findings, severity, rule, statePath, "Replace template placeholders with verified project information. Use explicit Unknown or Owner action labels when information is unavailable.");
        }
      }
      const reviewed = state.match(/last reviewed\s*[:：]\s*\*{0,2}\s*(\d{4}-\d{2}-\d{2})/i);
      if (!reviewed) {
        add(findings, "warning", "PROJECT_STATE_REVIEW_DATE_MISSING", statePath, "Record a valid Last reviewed date in YYYY-MM-DD format.");
      } else {
        const reviewedAt = new Date(reviewed[1] + "T00:00:00Z");
        if (Number.isNaN(reviewedAt.getTime()) || reviewedAt.toISOString().slice(0, 10) !== reviewed[1]) {
          add(findings, "warning", "PROJECT_STATE_REVIEW_DATE_INVALID", statePath, "Last reviewed must be a real date in YYYY-MM-DD format.");
        } else {
          const ageDays = Math.floor((Date.now() - reviewedAt.getTime()) / 86400000);
          if (ageDays > config.checks.maxStateAgeDays) {
            add(findings, "warning", "PROJECT_STATE_STALE", statePath,
              "Project state was last reviewed " + ageDays + " days ago. Verify status, tests, risks, and next actions.");
          }
        }
      }
    }

    const worklogPath = "docs/WORKLOG.md";
    if (byPath.has(worklogPath)) {
      const worklogFile = files.find(x => x.rel === worklogPath);
      let worklog = "";
      try { worklog = fs.readFileSync(worklogFile.full, "utf8"); } catch {}
      if (!/^#{1,6}\s+.*history/im.test(worklog)) {
        add(findings, severity, "WORKLOG_HISTORY_SECTION_MISSING", worklogPath, "Add a History section for meaningful completed or interrupted work sessions.");
      }
    }
  }

  for (const file of files) {
    const lower = file.name.toLowerCase();
    const ext = path.extname(lower);
    if (config.checks.generatedFiles && GENERATED_EXTENSIONS.has(ext)) {
      add(findings, "warning", "GENERATED_OR_BINARY_FILE", file.rel, "Review whether this generated, binary, database, backup, or temporary file belongs in source control.");
    }
    if (config.checks.naming && /(^|[._-])(final[-_]?final|newnew|temp\d*|tmp\d*|copy\d*)([._-]|$)/i.test(file.name)) {
      add(findings, "warning", "VAGUE_FILE_NAME", file.rel, "Name suggests a temporary or duplicate file. Confirm its purpose before changing it.");
    }
    if (!config.checks.secretPatterns || (!TEXT_EXTENSIONS.has(ext) && ![".env", ""].includes(ext))) continue;
    let stat;
    try { stat = fs.statSync(file.full); } catch { continue; }
    if (stat.size > 1_000_000) continue;
    let content;
    try { content = fs.readFileSync(file.full, "utf8"); } catch { continue; }
    if (content.includes("\u0000")) continue;
    const lines = content.split(/\r?\n/);
    for (let i = 0; i < lines.length; i += 1) {
      const line = lines[i];
      const patterns = [
        /-----BEGIN (?:RSA |EC |OPENSSH |DSA )?PRIVATE KEY-----/,
        /\bAKIA[0-9A-Z]{16}\b/,
        /\bgh[pousr]_[A-Za-z0-9]{30,}\b/,
        /\bxox[baprs]-[A-Za-z0-9-]{20,}\b/,
        /\b(password|passwd|api[_-]?key|access[_-]?token|client[_-]?secret)\s*[:=]\s*["']?[A-Za-z0-9_./+=-]{16,}/i
      ];
      if (patterns.some(pattern => pattern.test(line))) {
        add(findings, "error", "POSSIBLE_SECRET", file.rel, "Possible credential or private-key material detected. Value omitted. Verify and rotate if exposed.", i + 1);
      }
    }
  }

  const order = { error: 0, warning: 1, info: 2 };
  findings.sort((a, b) => order[a.severity] - order[b.severity] || a.path.localeCompare(b.path) || a.rule.localeCompare(b.rule));
  return {
    schemaVersion: VERSION,
    tool: "agent-universal-devkit-repository-hygiene",
    governanceLevel: config.level,
    root: path.resolve(root),
    summary: {
      filesScanned: files.length,
      errors: findings.filter(x => x.severity === "error").length,
      warnings: findings.filter(x => x.severity === "warning").length,
      info: findings.filter(x => x.severity === "info").length
    },
    findings
  };
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    process.stdout.write("Usage: node scripts/repository-hygiene/check.mjs [--root PATH] [--config PATH] [--format text|json]\n");
    return;
  }
  if (!fs.existsSync(args.root) || !fs.statSync(args.root).isDirectory()) throw new Error("Root must be an existing directory");
  const config = loadConfig(args.root, args.config);
  const report = scan(args.root, config);
  if (args.format === "json") {
    process.stdout.write(JSON.stringify(report, null, 2) + "\n");
  } else {
    process.stdout.write("Repository hygiene — " + report.governanceLevel + "\n");
    process.stdout.write(report.summary.filesScanned + " files scanned; " + report.summary.errors + " errors; " + report.summary.warnings + " warnings; " + report.summary.info + " notes.\n");
    for (const finding of report.findings) {
      const location = finding.path + (finding.line ? ":" + finding.line : "");
      process.stdout.write("[" + finding.severity.toUpperCase() + "] " + finding.rule + " " + location + " — " + finding.message + "\n");
    }
  }
  if (report.summary.errors > 0) process.exitCode = 1;
}

try { main(); }
catch (error) {
  process.stderr.write("Repository hygiene check failed: " + error.message + "\n");
  process.exitCode = 2;
}
