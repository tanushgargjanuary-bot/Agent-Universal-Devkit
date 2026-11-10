# Problem Engine — Shared Contracts

The Problem Engine defines the first shared data contracts for DEVKIT's unified problem-solving workflows.

## Contract types

| Record | Purpose |
|---|---|
| `problem` | User goal, constraints, domain hints, and requested outcome |
| `evidence` | A sourced observation, measurement, test result, or report |
| `finding` | An actionable observation with severity, confidence, status, and evidence links |
| `capability` | A declared unit of work with supported domains, inputs, outputs, permissions, and verification methods |
| `plan` | Ordered work with dependencies, risk, and acceptance criteria |
| `verification` | Independent results for plan acceptance criteria |

Each record has a stable ID, `record_type`, and explicit `schema_version`. Schemas are stored in `schemas/`.

## Usage

```js
import { createRecord, validateRecord } from "./src/index.js";

const problem = createRecord("problem", {
  id: "problem-001",
  goal: "Explain why the service returns intermittent errors",
  created_at: new Date().toISOString(),
  priority: "normal",
  constraints: ["Do not modify files"],
  domain_hints: ["software", "reliability"]
});

const result = validateRecord("problem", problem);
if (!result.valid) throw new Error(result.errors.join("; "));
```

`createRecord` adds the record type and current schema version. It does not invent IDs, timestamps, evidence, or approvals. Supply those values explicitly.

## Validation

- JSON Schema contracts reject unknown properties.
- The schema engine enforces its documented JSON Schema subset.
- Plan validation checks unique step IDs, dependency references, self-dependencies, and cycles.
- Verification validation checks that the summary outcome matches the individual check results.
- Unknown record types and schema versions are rejected.

The schemas do not yet provide persistent storage, cross-record referential integrity, capability discovery, execution, approval authentication, or policy enforcement.

## Safety boundary

These records describe work. They do not authorise or execute it. A capability declaration is not proof that the capability is safe or supported. The future registry must validate installed capability identity, version, provenance, permissions, and compatibility before use.

No repository code is executed by this package. It has no runtime dependencies and performs no network or filesystem writes.

## Versioning

The initial record contracts use version `1.0.0`. Breaking field or meaning changes require a new schema version and compatibility tests. Do not silently reinterpret existing records.

Run tests with `npm test`.
