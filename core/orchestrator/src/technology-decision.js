const SOURCE_EXTENSIONS = {
  ".py": "Python",
  ".pyi": "Python",
  ".js": "JavaScript",
  ".mjs": "JavaScript",
  ".cjs": "JavaScript",
  ".jsx": "JavaScript",
  ".ts": "TypeScript",
  ".tsx": "TypeScript",
  ".rs": "Rust",
  ".go": "Go",
  ".java": "Java",
  ".kt": "Kotlin",
  ".kts": "Kotlin",
  ".cs": "C#",
  ".cpp": "C++",
  ".cc": "C++",
  ".c": "C",
  ".h": "C/C++",
  ".swift": "Swift",
  ".dart": "Dart",
  ".rb": "Ruby",
  ".php": "PHP",
  ".scala": "Scala",
  ".sql": "SQL",
  ".r": "R",
  ".jl": "Julia"
};

const LOCKFILES = {
  "package-lock.json": "npm",
  "pnpm-lock.yaml": "pnpm",
  "yarn.lock": "Yarn",
  "bun.lockb": "Bun",
  "bun.lock": "Bun",
  "Cargo.lock": "Cargo",
  "go.sum": "Go modules",
  "poetry.lock": "Poetry",
  "uv.lock": "uv",
  "Pipfile.lock": "Pipenv",
  "requirements.txt": "pip",
  "pom.xml": "Maven",
  "build.gradle": "Gradle",
  "build.gradle.kts": "Gradle",
  "packages.lock.json": "NuGet",
  "composer.lock": "Composer",
  "Gemfile.lock": "Bundler"
};

const FRAMEWORK_HINTS = [
  { name: "React", match: (text) => /\breact\b/.test(text) },
  { name: "Next.js", match: (text) => /\bnext\b/.test(text) },
  { name: "Vue", match: (text) => /\bvue\b/.test(text) },
  { name: "Angular", match: (text) => /\b@angular\//.test(text) },
  { name: "Svelte", match: (text) => /\bsvelte\b/.test(text) },
  { name: "Express", match: (text) => /\bexpress\b/.test(text) },
  { name: "FastAPI", match: (text) => /\bfastapi\b/.test(text) },
  { name: "Django", match: (text) => /\bdjango\b/.test(text) },
  { name: "Flask", match: (text) => /\bflask\b/.test(text) },
  { name: "Spring", match: (text) => /spring-boot|org\.springframework/.test(text) },
  { name: ".NET", match: (text) => /microsoft\.aspnetcore|<TargetFramework>/.test(text) },
  { name: "Actix", match: (text) => /\bactix-web\b/.test(text) },
  { name: "Axum", match: (text) => /\baxum\b/.test(text) },
  { name: "Gin", match: (text) => /\bgithub\.com\/gin-gonic\/gin\b/.test(text) }
];

const COST_FIELDS = ["integration_complexity", "operational_complexity", "migration_cost"];

function normaliseFiles(files) {
  if (!Array.isArray(files)) throw new Error("files must be an array of repository paths or file records");
  return files.map((file) => typeof file === "string" ? { path: file, content: "" } : file);
}

function languageForPath(path) {
  const lower = path.toLowerCase();
  const name = lower.split("/").at(-1);
  if (name === "dockerfile" || name.startsWith("dockerfile.")) return "Dockerfile";
  if (name === "makefile") return "Make";
  const extension = Object.keys(SOURCE_EXTENSIONS).find((item) => lower.endsWith(item));
  return extension ? SOURCE_EXTENSIONS[extension] : null;
}

/**
 * Inspect a repository snapshot. This is static metadata analysis only:
 * it does not execute build scripts, install dependencies, or inspect Git history.
 */
export function inspectRepository(files) {
  const records = normaliseFiles(files);
  const languageCounts = new Map();
  const packageManagers = new Set();
  const frameworks = new Set();
  const evidence = [];

  for (const file of records) {
    if (!file || typeof file.path !== "string") throw new Error("Each file record must include a path");
    const language = languageForPath(file.path);
    if (language) {
      languageCounts.set(language, (languageCounts.get(language) ?? 0) + 1);
      evidence.push({ kind: "source_file", path: file.path, language });
    }

    const base = file.path.split("/").at(-1);
    if (LOCKFILES[base]) {
      packageManagers.add(LOCKFILES[base]);
      evidence.push({ kind: "package_manager_file", path: file.path, value: LOCKFILES[base] });
    }

    if (typeof file.content === "string" && file.content.length > 0) {
      for (const hint of FRAMEWORK_HINTS) {
        if (hint.match(file.content.toLowerCase())) frameworks.add(hint.name);
      }
    }
  }

  const languages = [...languageCounts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([name, source_file_count]) => ({ name, source_file_count }));

  return {
    files_inspected: records.length,
    languages,
    package_managers: [...packageManagers].sort(),
    frameworks: [...frameworks].sort(),
    evidence,
    limitations: [
      "Detection uses file names and supplied file contents only.",
      "File counts do not measure runtime importance or architectural ownership.",
      "Generated files, vendored code, and examples can distort language signals.",
      "Build scripts and repository code were not executed."
    ]
  };
}

function validateCandidate(candidate) {
  if (!candidate || typeof candidate.id !== "string" || !candidate.id.trim()) {
    throw new Error("Each candidate architecture needs a non-empty id");
  }
  if (!Array.isArray(candidate.languages) || candidate.languages.length === 0) {
    throw new Error(`Candidate '${candidate.id}' must list at least one language`);
  }
  for (const field of ["capabilities", "platforms", "security_controls", "evidence"]) {
    if (candidate[field] !== undefined && !Array.isArray(candidate[field])) {
      throw new Error(`Candidate '${candidate.id}' field '${field}' must be an array`);
    }
  }
  for (const field of COST_FIELDS) {
    const value = candidate[field] ?? 0;
    if (!Number.isFinite(value) || value < 0 || value > 5) {
      throw new Error(`Candidate '${candidate.id}' field '${field}' must be between 0 and 5`);
    }
  }
}

function missingValues(required, provided) {
  const set = new Set(provided ?? []);
  return (required ?? []).filter((value) => !set.has(value));
}

/**
 * Compare caller-supplied, evidence-backed architecture candidates.
 * The engine does not invent candidates or treat language popularity as evidence.
 */
export function evaluateTechnologyArchitecture({
  repository,
  files = [],
  workload,
  candidates,
  weights = {}
}) {
  if (!repository?.full_name) throw new Error("repository.full_name is required");
  if (!workload || !Array.isArray(workload.required_capabilities) || workload.required_capabilities.length === 0) {
    throw new Error("workload.required_capabilities must contain at least one explicit requirement");
  }
  if (!Array.isArray(candidates) || candidates.length < 2) {
    throw new Error("At least two candidate architectures are required for comparison");
  }

  const inspection = inspectRepository(files);
  const existingLanguages = inspection.languages.map((entry) => entry.name);
  const requiredCapabilities = workload.required_capabilities;
  const requiredPlatforms = workload.required_platforms ?? [];
  const requiredSecurity = workload.required_security_controls ?? [];
  const capabilityWeight = weights.capability ?? 1;
  const integrationWeight = weights.integration ?? 2;
  const operationsWeight = weights.operations ?? 1;
  const migrationWeight = weights.migration ?? 2;

  for (const [name, value] of Object.entries({
    capability: capabilityWeight,
    integration: integrationWeight,
    operations: operationsWeight,
    migration: migrationWeight
  })) {
    if (!Number.isFinite(value) || value < 0) throw new Error(`Weight '${name}' must be a non-negative number`);
  }

  const ranked = candidates.map((candidate) => {
    validateCandidate(candidate);
    const missingCapabilities = missingValues(requiredCapabilities, candidate.capabilities);
    const missingPlatforms = missingValues(requiredPlatforms, candidate.platforms);
    const missingSecurity = missingValues(requiredSecurity, candidate.security_controls);
    const hardConstraintFailures = [
      ...missingPlatforms.map((value) => `Missing required platform: ${value}`),
      ...missingSecurity.map((value) => `Missing required security control: ${value}`)
    ];

    const capabilityCoverage = (requiredCapabilities.length - missingCapabilities.length) / requiredCapabilities.length;
    const introducedLanguages = candidate.languages.filter((language) => !existingLanguages.includes(language));
    const integrationCost = candidate.integration_complexity ?? 0;
    const operationsCost = candidate.operational_complexity ?? 0;
    const migrationCost = candidate.migration_cost ?? 0;
    const score = Number((
      capabilityCoverage * 100 * capabilityWeight
      - integrationCost * integrationWeight
      - operationsCost * operationsWeight
      - migrationCost * migrationWeight
    ).toFixed(2));

    return {
      id: candidate.id,
      name: candidate.name ?? candidate.id,
      languages: [...candidate.languages],
      capabilities_covered: requiredCapabilities.filter((value) => candidate.capabilities.includes(value)),
      missing_capabilities: missingCapabilities,
      hard_constraint_failures: hardConstraintFailures,
      introduced_languages: introducedLanguages,
      score,
      costs: {
        integration_complexity: integrationCost,
        operational_complexity: operationsCost,
        migration_cost: migrationCost
      },
      evidence: candidate.evidence ?? [],
      feasible: hardConstraintFailures.length === 0 && missingCapabilities.length === 0
    };
  }).sort((a, b) => b.score - a.score || a.id.localeCompare(b.id));

  const feasible = ranked.filter((candidate) => candidate.feasible);
  const best = feasible[0] ?? null;
  const runnerUp = feasible[1] ?? null;
  const margin = best && runnerUp ? Number((best.score - runnerUp.score).toFixed(2)) : null;
  const evidenceCount = best?.evidence.length ?? 0;
  const enoughEvidence = evidenceCount > 0 && (runnerUp === null || runnerUp.evidence.length > 0);
  const recommendationConfidence = !best || !enoughEvidence
    ? "low"
    : best.score >= 60 && (margin === null || margin >= 10) ? "high"
      : best.score >= 30 && (margin === null || margin >= 5) ? "medium" : "low";

  const decision = !best || recommendationConfidence === "low"
    ? "insufficient_evidence"
    : best.languages.length > 1 ? "polyglot_hybrid" : "single_stack";

  const addsLanguages = Boolean(best && best.introduced_languages.length > 0);
  const requiresApproval = Boolean(best && (addsLanguages || best.languages.length > 1 || existingLanguages.length > 0 && !existingLanguages.every((language) => best.languages.includes(language))));

  return {
    schema_version: 1,
    repository: repository.full_name,
    inspection,
    workload: {
      required_capabilities: requiredCapabilities,
      required_platforms: requiredPlatforms,
      required_security_controls: requiredSecurity
    },
    decision,
    recommendation: best ? {
      candidate_id: best.id,
      name: best.name,
      languages: best.languages,
      rationale: [
        `Covers all ${requiredCapabilities.length} required capabilities.`,
        ...best.capabilities_covered.map((value) => `Supports required capability: ${value}.`),
        ...best.introduced_languages.map((value) => `Introduces ${value}; justify its runtime and maintenance cost before adoption.`)
      ],
      score: best.score,
      score_margin_over_next_feasible: margin,
      confidence: recommendationConfidence,
      evidence: best.evidence
    } : null,
    ranked_candidates: ranked,
    approval: {
      required: requiresApproval,
      approved: false,
      reason: requiresApproval
        ? "A proposed language addition, hybrid architecture, or stack migration requires explicit human approval."
        : "No stack change has been proposed."
    },
    status: decision === "insufficient_evidence" ? "provisional" : "proposal_only",
    warnings: [
      "This is a decision aid, not proof that a language or architecture is objectively best.",
      "Scores are only comparable when candidate evidence and cost estimates use the same method.",
      "No source code, build scripts, or dependencies were executed."
    ]
  };
}

/**
 * Enforce approval before a proposed architecture change can proceed.
 */
export function evaluateTechnologyChangeGate({ decision, humanApproved = false }) {
  if (!decision || !decision.recommendation) {
    return { allowed: false, approval_required: true, reasons: ["No validated architecture recommendation is available"] };
  }
  if (decision.status === "provisional" || decision.decision === "insufficient_evidence") {
    return { allowed: false, approval_required: true, reasons: ["Architecture decision is provisional; gather evidence before implementation"] };
  }
  if (decision.approval?.required && !humanApproved) {
    return { allowed: false, approval_required: true, reasons: [decision.approval.reason] };
  }
  return {
    allowed: true,
    approval_required: Boolean(decision.approval?.required),
    reasons: decision.approval?.required ? ["Human approval supplied"] : ["No material stack change detected"]
  };
}
