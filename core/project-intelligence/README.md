# Project Intelligence — Initial Repo Scan

This package provides bounded, read-only repository discovery and the first deterministic `repo-scan` workflow.

## What it inspects

- File and directory inventory.
- Common generated/dependency directory exclusions.
- Language signals from file extensions.
- Known package/build manifests.
- Selected framework signals from package and Python manifests.
- Root README, LICENSE, SECURITY.md, and docs directory presence.
- Common CI configuration paths.
- Common test path and package test-script signals.
- Common dependency lockfiles.
- Malformed `package.json` files.

It emits shared Evidence and Finding records from the Problem Engine.

## Safety

- Does not execute project scripts, build hooks, package managers, or tests.
- Does not install dependencies or access the network.
- Does not follow symlinks.
- Applies configurable file-count, depth, and manifest-size limits.
- Skips common dependency and generated directories.
- Suppresses absence-based findings when the inventory is incomplete.

## Usage

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

This is an initial metadata scan, not a full code audit. It does not inspect source-code semantics, execute tests, measure performance, check live dependency advisories, verify licenses, or prove security. Missing test/CI/license/lockfile signals are suggestions, not verified defects. The scanner reports its coverage and limitations in every report.

Run tests with `npm test`.
