# Project Intelligence — Initial Repo Scan

This package provides bounded, read-only repository discovery and the first deterministic `repo-scan` workflow.

## What it inspects

- File and directory inventory.
- Common generated/dependency directory exclusions.
- Language signals from file extensions.
- Known package/build manifests.
- Selected framework signals from package and Python manifests.
- Root README, LICENSE, SECURITY.md, and docs directory presence.
- README demonstration signals: descriptive screenshot/GIF paths, embedded video, and explicit demo/playground links. Badge-only images do not count.
- Common CI configuration paths.
- Common test path and package test-script signals.
- Common dependency lockfiles.
- Malformed `package.json` files.
- Likely entry-point candidates from common path conventions and root `package.json` `main`, `module`, `browser`, and `bin` fields.
- Root package launch-script names, top-level components, and workspace-layout signals.

It emits shared Evidence and Finding records from the Problem Engine.

## Safety

- Does not execute project scripts, build hooks, package managers, or tests.
- Does not install dependencies or access the network.
- Does not follow symlinks.
- Applies configurable file-count, depth, manifest-size, and README-size limits.
- Reads only the root README selected by a deterministic filename preference.
- Skips common dependency and generated directories.
- Suppresses absence-based findings when the inventory is incomplete.

## CLI usage

Run the scanner from the Devkit repository:

```bash
node core/project-intelligence/bin/repo-scan.js . --format markdown
node core/project-intelligence/bin/repo-scan.js /path/to/project --format json
```

The CLI writes to stdout. It does not create report files or modify the scanned repository. JSON is the default format. Markdown reports include top-level components, workspace candidates, launch scripts, and entry-point candidates.

## Library usage

```js
import { createRecord } from "../problem-engine/src/index.js";
import { scanRepository } from "./src/index.js";

const problem = createRecord("problem", {
  id: "repo-review-001",
  goal: "Assess repository health",
  created_at: new Date().toISOString(),
  priority: "normal",
  constraints: ["Read-only"],
  domain_hints: ["software"]
});

const report = await scanRepository("./my-project", problem);
console.log(report.findings);
```

## Limitations

Entry-point candidates are signals, not proof that a file is the actual runtime entry point. Workspace directories suggest a multi-package layout but do not prove that the repository is a monorepo.

This is an initial metadata scan, not a full code audit. It does not inspect source-code semantics, execute tests, measure performance, check live dependency advisories, verify licenses, or prove security. Missing test/CI/license/lockfile signals are suggestions, not verified defects. README demo detection is a heuristic: it does not render media, judge quality, verify links, or prove a demo works. Oversized or unreadable READMEs are not assessed for demo signals. The scanner reports its coverage and limitations in every report.

For the authoring standard, see `docs/README-DEMO-STANDARD.md` in the Devkit repository.

Run tests with `npm test`.
