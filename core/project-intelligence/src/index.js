import { createHash, randomUUID } from "node:crypto";
import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import { createRecord, validateRecord } from "../../problem-engine/src/index.js";

const SKIP_DIRECTORIES = new Set([
  ".git", ".hg", ".svn", "node_modules", "vendor", "dist", "build", "coverage",
  ".next", ".turbo", ".cache", ".venv", "venv", "__pycache__", ".pytest_cache", "target", "out"
]);
const LANGUAGE_BY_EXTENSION = {
  ".js": "JavaScript", ".jsx": "JavaScript", ".mjs": "JavaScript", ".cjs": "JavaScript",
  ".ts": "TypeScript", ".tsx": "TypeScript", ".py": "Python", ".rs": "Rust", ".go": "Go",
  ".java": "Java", ".kt": "Kotlin", ".kts": "Kotlin", ".cs": "C#", ".php": "PHP", ".rb": "Ruby",
  ".c": "C", ".cc": "C++", ".cpp": "C++", ".cxx": "C++", ".h": "C/C++", ".hpp": "C++",
  ".html": "HTML", ".htm": "HTML", ".css": "CSS", ".scss": "CSS", ".sass": "CSS"
};
const MANIFEST_NAMES = new Set([
  "package.json", "pyproject.toml", "requirements.txt", "cargo.toml", "go.mod", "pom.xml",
  "build.gradle", "build.gradle.kts", "composer.json", "gemfile", "pipfile"
]);
const LOCKFILE_NAMES = new Set([
  "package-lock.json", "pnpm-lock.yaml", "yarn.lock", "bun.lock", "bun.lockb", "cargo.lock",
  "go.sum", "poetry.lock", "uv.lock", "pipfile.lock", "composer.lock", "gemfile.lock", "gradle.lockfile"
]);
const CI_PATHS = [
  /^\.github\/workflows\/.+/i, /^\.gitlab-ci\.yml$/i, /^jenkinsfile$/i,
  /^\.circleci\/config\.yml$/i, /^azure-pipelines\.yml$/i, /^\.travis\.yml$/i,
  /^\.buildkite\/pipeline\.yml$/i
];

function validateOptions(options) {
  if (options === null || typeof options !== "object" || Array.isArray(options)) throw new TypeError("options must be an object");
  const limits = {
    max_files: options.max_files ?? 20000,
    max_depth: options.max_depth ?? 20,
    max_manifest_bytes: options.max_manifest_bytes ?? 1000000
  };
  if (!Number.isInteger(limits.max_files) || limits.max_files < 1 || limits.max_files > 100000) throw new RangeError("max_files must be an integer from 1 to 100000");
  if (!Number.isInteger(limits.max_depth) || limits.max_depth < 1 || limits.max_depth > 100) throw new RangeError("max_depth must be an integer from 1 to 100");
  if (!Number.isInteger(limits.max_manifest_bytes) || limits.max_manifest_bytes < 1 || limits.max_manifest_bytes > 5000000) throw new RangeError("max_manifest_bytes must be an integer from 1 to 5000000");
  return limits;
}

function relativePath(root, absolutePath) {
  return path.relative(root, absolutePath).split(path.sep).join("/");
}

function isRootFile(paths, pattern) {
  return paths.some((entry) => !entry.includes("/") && pattern.test(entry));
}

function detectEcosystems(manifests) {
  const names = new Set(manifests.map((entry) => path.posix.basename(entry).toLowerCase()));
  const ecosystems = [];
  if (names.has("package.json")) ecosystems.push("node");
  if (names.has("pyproject.toml") || names.has("requirements.txt") || names.has("pipfile")) ecosystems.push("python");
  if (names.has("cargo.toml")) ecosystems.push("rust");
  if (names.has("go.mod")) ecosystems.push("go");
  if (names.has("pom.xml") || names.has("build.gradle") || names.has("build.gradle.kts")) ecosystems.push("jvm");
  if (names.has("composer.json")) ecosystems.push("php");
  if (names.has("gemfile")) ecosystems.push("ruby");
  if (manifests.some((entry) => entry.toLowerCase().endsWith(".csproj"))) ecosystems.push("dotnet");
  return ecosystems.sort();
}

function detectFrameworks(packageManifest, manifestTexts) {
  const frameworks = new Set();
  const dependencies = {
    ...(packageManifest?.dependencies ?? {}),
    ...(packageManifest?.devDependencies ?? {}),
    ...(packageManifest?.peerDependencies ?? {})
  };
  const packageFrameworks = {
    next: "Next.js", react: "React", vue: "Vue", nuxt: "Nuxt", "@angular/core": "Angular",
    svelte: "Svelte", express: "Express", fastify: "Fastify", "@nestjs/core": "NestJS",
    vite: "Vite", astro: "Astro", "@remix-run/react": "Remix"
  };
  for (const [dependency, label] of Object.entries(packageFrameworks)) {
    if (Object.hasOwn(dependencies, dependency)) frameworks.add(label);
  }
  const pythonText = manifestTexts.filter((entry) => /pyproject\.toml|requirements\.txt|pipfile/i.test(entry.path))
    .map((entry) => entry.content.toLowerCase()).join("\n");
  for (const [pattern, label] of [
    [/\bfastapi\b/, "FastAPI"], [/\bdjango\b/, "Django"], [/\bflask\b/, "Flask"],
    [/\bpandas\b/, "Pandas"], [/\bnumpy\b/, "NumPy"], [/\btorch\b/, "PyTorch"],
    [/\btensorflow\b/, "TensorFlow"]
  ]) if (pattern.test(pythonText)) frameworks.add(label);
  return [...frameworks].sort();
}

/**
 * Discover repository metadata without running project code or following symlinks.
 * Only selected manifest files are read. All other files are inventoried by path.
 */
export async function discoverRepository(root, options = {}) {
  if (typeof root !== "string" || !root.trim()) throw new TypeError("root must be a non-empty path");
  const limits = validateOptions(options);
  const absoluteRoot = path.resolve(root);
  const rootInfo = await stat(absoluteRoot);
  if (!rootInfo.isDirectory()) throw new TypeError("root must point to a directory");

  const files = [];
  const directories = [];
  const symlinkPaths = [];
  const truncatedPaths = [];
  const readErrors = [];
  let skippedDirectoryCount = 0;
  let truncated = false;

  async function walk(directory, depth) {
    let entries;
    try {
      entries = await readdir(directory, { withFileTypes: true });
    } catch (error) {
      readErrors.push({ path: relativePath(absoluteRoot, directory) || ".", code: error.code ?? "READ_FAILED" });
      return;
    }
    entries.sort((left, right) => left.name.localeCompare(right.name));
    for (const entry of entries) {
      const absolutePath = path.join(directory, entry.name);
      const relative = relativePath(absoluteRoot, absolutePath);
      if (entry.isSymbolicLink()) {
        symlinkPaths.push(relative);
        continue;
      }
      if (entry.isDirectory()) {
        if (SKIP_DIRECTORIES.has(entry.name.toLowerCase())) {
          skippedDirectoryCount += 1;
          continue;
        }
        directories.push(relative);
        if (depth >= limits.max_depth) {
          truncated = true;
          truncatedPaths.push(relative);
          continue;
        }
        await walk(absolutePath, depth + 1);
        if (truncated && files.length >= limits.max_files) break;
        continue;
      }
      if (!entry.isFile()) continue;
      if (files.length >= limits.max_files) {
        truncated = true;
        truncatedPaths.push(relative);
        break;
      }
      files.push(relative);
    }
  }

  await walk(absoluteRoot, 0);
  files.sort();
  directories.sort();
  symlinkPaths.sort();

  const manifestPaths = files.filter((entry) => {
    const name = path.posix.basename(entry).toLowerCase();
    return MANIFEST_NAMES.has(name) || name.endsWith(".csproj");
  });
  const lockfilePaths = files.filter((entry) => LOCKFILE_NAMES.has(path.posix.basename(entry).toLowerCase()));
  const ciPaths = files.filter((entry) => CI_PATHS.some((pattern) => pattern.test(entry)));
  const testSignalPaths = files.filter((entry) =>
    /(^|\/)(__tests__|tests?|specs?)(\/|$)|\.(test|spec)\.[^/]+$/i.test(entry)
  );
  const languageCounts = {};
  for (const entry of files) {
    const language = LANGUAGE_BY_EXTENSION[path.posix.extname(entry).toLowerCase()];
    if (language) languageCounts[language] = (languageCounts[language] ?? 0) + 1;
  }

  const manifestErrors = [];
  const manifestTexts = [];
  let packageManifest = null;
  for (const entry of manifestPaths) {
    const absolutePath = path.join(absoluteRoot, ...entry.split("/"));
    try {
      const metadata = await stat(absolutePath);
      if (metadata.size > limits.max_manifest_bytes) {
        manifestErrors.push({ path: entry, code: "MANIFEST_TOO_LARGE" });
        continue;
      }
      const content = await readFile(absolutePath, "utf8");
      manifestTexts.push({ path: entry, content });
      if (path.posix.basename(entry).toLowerCase() === "package.json") {
        try {
          packageManifest = JSON.parse(content);
          if (packageManifest === null || typeof packageManifest !== "object" || Array.isArray(packageManifest)) {
            throw new TypeError("package.json root must be an object");
          }
        } catch {
          manifestErrors.push({ path: entry, code: "INVALID_JSON" });
        }
      }
    } catch (error) {
      manifestErrors.push({ path: entry, code: error.code ?? "MANIFEST_READ_FAILED" });
    }
  }

  const dependencies = {
    ...(packageManifest?.dependencies ?? {}),
    ...(packageManifest?.devDependencies ?? {})
  };
  const packageScriptsTest = typeof packageManifest?.scripts?.test === "string" && packageManifest.scripts.test.trim().length > 0;
  const hasReadme = isRootFile([...files, ...symlinkPaths], /^readme(?:\..+)?$/i);
  const hasLicense = isRootFile([...files, ...symlinkPaths], /^license(?:\..+)?$/i);
  const hasSecurityPolicy = isRootFile([...files, ...symlinkPaths], /^security\.md$/i);
  const hasDocsDirectory = directories.includes("docs");
  const hasTests = testSignalPaths.length > 0 || packageScriptsTest;
  const hasCi = ciPaths.length > 0;
  const hasPackageDependencies = Object.keys(dependencies).length > 0;

  return {
    root_name: path.basename(absoluteRoot),
    captured_at: new Date().toISOString(),
    file_count: files.length,
    directory_count: directories.length,
    skipped_directory_count: skippedDirectoryCount,
    symlink_count: symlinkPaths.length,
    symlink_paths: symlinkPaths.slice(0, 100),
    truncated,
    truncated_paths: truncatedPaths.slice(0, 100),
    incomplete: truncated || readErrors.length > 0,
    limits,
    read_errors: readErrors,
    languages: Object.fromEntries(Object.entries(languageCounts).sort(([a], [b]) => a.localeCompare(b))),
    ecosystems: detectEcosystems(manifestPaths),
    frameworks: detectFrameworks(packageManifest, manifestTexts),
    manifest_paths: manifestPaths,
    manifest_errors: manifestErrors,
    lockfile_paths: lockfilePaths,
    ci_paths: ciPaths.slice(0, 100),
    test_signal_paths: testSignalPaths.slice(0, 100),
    has_readme: hasReadme,
    has_license: hasLicense,
    has_security_policy: hasSecurityPolicy,
    has_docs_directory: hasDocsDirectory,
    has_ci: hasCi,
    has_tests: hasTests,
    has_package_dependencies: hasPackageDependencies
  };
}

function stableId(prefix, value) {
  return prefix + "-" + createHash("sha256").update(value).digest("hex").slice(0, 20);
}

/** Run the initial deterministic repo-scan checks. No repository code is executed. */
export async function scanRepository(root, problem, options = {}) {
  const validation = validateRecord("problem", problem);
  if (!validation.valid) throw new TypeError("Invalid problem record: " + validation.errors.join("; "));
  const profile = await discoverRepository(root, options);
  const evidence = [];
  const findings = [];
  const limitation = "This scan inspects repository inventory and selected manifests only. It does not execute code or prove runtime behaviour.";
  const observedAt = profile.captured_at;

  function addFinding({ ruleId, title, description, severity, confidence, status, claim, sourcePath, recommendation }) {
    const identity = problem.id + ":" + ruleId + ":" + (sourcePath ?? "repository-inventory");
    const evidenceId = stableId("evidence", identity);
    const findingId = stableId("finding", identity);
    evidence.push(createRecord("evidence", {
      id: evidenceId,
      observed_at: observedAt,
      evidence_type: "observation",
      claim,
      confidence,
      source: { kind: sourcePath ? "local_file" : "other", reference: sourcePath ?? "bounded repository inventory", tool: "DEVKIT Project Intelligence", tool_version: "0.1.0" },
      limitations: [limitation]
    }));
    findings.push(createRecord("finding", {
      id: findingId,
      rule_id: ruleId,
      title,
      description,
      severity,
      confidence,
      status,
      evidence_ids: [evidenceId],
      affected_paths: sourcePath ? [sourcePath] : [],
      domain: "software",
      recommendations: [recommendation]
    }));
  }

  for (const error of profile.manifest_errors) {
    if (error.code === "INVALID_JSON" && path.posix.basename(error.path).toLowerCase() === "package.json") {
      addFinding({
        ruleId: "repo.manifest.invalid-json",
        title: "Invalid package manifest",
        description: "The package.json file is present but is not valid JSON.",
        severity: "high", confidence: 1, status: "verified",
        claim: "package.json could not be parsed as a JSON object.",
        sourcePath: error.path,
        recommendation: "Correct the JSON syntax and validate the manifest before using package tooling."
      });
    }
  }

  if (!profile.incomplete) {
    if (!profile.has_readme) addFinding({
      ruleId: "repo.documentation.readme-missing",
      title: "Root README not detected",
      description: "The repository inventory contains no root README file.",
      severity: "low", confidence: 1, status: "verified",
      claim: "No root README file was found in the complete bounded inventory.",
      recommendation: "Add a README that explains the project's purpose, setup, usage, and support boundaries."
    });
    if (!profile.has_ci) addFinding({
      ruleId: "repo.ci.not-detected",
      title: "CI workflow not detected",
      description: "No supported CI configuration file was found.",
      severity: "medium", confidence: 0.8, status: "suspected",
      claim: "No supported CI configuration path was found in the repository inventory.",
      recommendation: "Add an automated workflow for relevant tests and quality checks, or document the external CI system."
    });
    if (!profile.has_tests) addFinding({
      ruleId: "repo.tests.not-detected",
      title: "Test signals not detected",
      description: "No common test path or package test script was detected.",
      severity: "medium", confidence: 0.75, status: "suspected",
      claim: "No common test directory, test/spec file, or package.json test script was found.",
      recommendation: "Add or document repeatable tests for critical behaviour. Confirm manually if tests use a non-standard layout."
    });
    if (!profile.has_license) addFinding({
      ruleId: "repo.license.not-detected",
      title: "License file not detected",
      description: "No root LICENSE file was found.",
      severity: "low", confidence: 0.9, status: "suspected",
      claim: "No root LICENSE file was found in the complete bounded inventory.",
      recommendation: "Choose and document the applicable license. Do not assume that missing license text grants reuse rights."
    });
    if (profile.has_package_dependencies && !profile.lockfile_paths.some((entry) =>
      ["package-lock.json", "pnpm-lock.yaml", "yarn.lock", "bun.lock", "bun.lockb"].includes(path.posix.basename(entry).toLowerCase())
    )) addFinding({
      ruleId: "repo.dependencies.lockfile-missing",
      title: "Node dependency lockfile not detected",
      description: "package.json declares dependencies, but no common Node package lockfile was found.",
      severity: "medium", confidence: 0.85, status: "suspected",
      claim: "package.json declares dependencies and no npm, pnpm, Yarn, or Bun lockfile was found.",
      recommendation: "Use the project's package manager to create and commit its lockfile. Do not install or update dependencies during this scan."
    });
  }

  const bySeverity = Object.fromEntries(["critical", "high", "medium", "low", "info"].map((level) => [
    level, findings.filter((finding) => finding.severity === level).length
  ]));
  return {
    scan_id: randomUUID(),
    schema_version: "1.0.0",
    problem,
    profile,
    evidence,
    findings,
    summary: { finding_count: findings.length, by_severity: bySeverity },
    coverage: ["bounded repository inventory", "known manifest discovery", "language and selected framework signals", "README/license/CI/test/lockfile presence checks"],
    limitations: [
      limitation,
      "No scripts, build hooks, package managers, tests, or repository commands were executed.",
      "No network access or external vulnerability/advisory lookup was performed.",
      "Source-code semantics, runtime behaviour, dependency health, license compliance, and security posture were not assessed.",
      "Absence-based findings are suppressed when the repository inventory is incomplete."
    ],
    incomplete: profile.incomplete
  };
}
