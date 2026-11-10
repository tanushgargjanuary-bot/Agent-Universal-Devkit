# Repository Hygiene Checker

The Devkit includes a small, read-only checker for common repository hygiene risks. The canonical implementation lives in the bootstrap payload so connected repositories can run the same code without a package install.

## Run

In the Devkit repository:

```bash
node scripts/repository-hygiene/check.mjs
node scripts/repository-hygiene/check.mjs --format json
```

In a repository that received the Devkit bootstrap files:

```bash
node .devkit/scripts/repository-hygiene/check.mjs
node .devkit/scripts/repository-hygiene/check.mjs --format json
```

To scan another directory, use `--root PATH`. The checker reads `.devkit/governance.json` from the scan root. Use `--config PATH` to select another config file.

Requirements: Node.js 22 or later. The checker uses only Node.js built-in modules. It does not install dependencies, run project code, access the network, or modify files.

## Configuration

The bootstrap includes `.devkit/governance.json`. Set its governance level to match the actual project risk.

- `L1`: personal or prototype.
- `L2`: maintained application.
- `L3`: production or sensitive system.
- `L4`: high-assurance or safety-critical system.

The current checker records the selected level in its report. It does not claim that a level is certified or that all controls for that level are implemented. Governance-level policy enforcement is future work.

Use `excludePaths` for known vendor or generated trees. Paths are repository-relative. Keep exclusions narrow. Excluded paths are not scanned.

## Checks

| Rule | Severity | Meaning |
|---|---|---|
| `README_MISSING` | Error | No root README was found. |
| `GITIGNORE_MISSING` | Warning | No root `.gitignore` was found. |
| `WORKING_RULES_NOT_FOUND` | Info | No root `AGENTS.md` or `CONTRIBUTING.md` was found. |
| `POSSIBLE_SECRET` | Error | A high-signal credential or private-key pattern was found. Values are never printed. |
| `GENERATED_OR_BINARY_FILE` | Warning | A generated, binary, database, backup, or temporary extension was found. |
| `VAGUE_DIRECTORY_NAME` | Warning | A directory name suggests unclear or temporary purpose. |
| `VAGUE_FILE_NAME` | Warning | A file name suggests a temporary or duplicate copy. |

The secret scan uses patterns. It can miss credentials and can flag examples or test fixtures. Review every finding. If a real credential was committed, remove it from active use and rotate it. Deleting it from the latest commit does not remove it from Git history.

## Exit codes

- `0`: scan completed with no error-severity findings. Warnings may exist.
- `1`: scan completed and found one or more error-severity findings.
- `2`: invalid arguments, invalid configuration, or scan setup failure.

JSON output uses schema version 1. It includes the selected governance level, file count, severity counts, and findings. Consumers should check `schemaVersion` before parsing.

## Safety and limitations

- The checker is read-only. It never deletes, renames, moves, or edits files.
- It skips common dependency/build directories, configured exclusions, and symbolic links.
- It skips files larger than 1 MB during secret scanning.
- It does not inspect Git history, actual tracked/untracked status, dependency vulnerabilities, license compliance, file ownership, branch protection, or runtime behaviour.
- It does not prove that a repository is secure, organised, production-ready, or compliant.
- Warnings need human review. A binary or directory name can be valid for a project.
- Do not treat the governance level as a substitute for threat modelling, domain standards, formal review, or certification.

Use this checker as one low-cost signal. Keep the project-specific rubric and repository governance guide as the authoritative review process.
