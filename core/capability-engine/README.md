# Capability Engine

A deterministic, in-memory capability filter and ranker for DEVKIT.

## Behaviour

- Validates the problem and every capability against the shared Problem Engine contracts.
- Filters by declared domain and optional problem type.
- Checks required input availability and requested output compatibility.
- Requires every declared permission to be explicitly granted.
- Defaults to read-only and recommendation modes.
- Requires explicit opt-in for non-default execution modes.
- Uses enabled capabilities by default. Experimental capabilities require explicit opt-in.
- Rejects duplicate IDs and capabilities without verification methods.
- Ranks eligible capabilities by explicit preference, domain match, declared cost, then stable ID.

## Usage

```js
import { createRecord } from "../problem-engine/src/index.js";
import { rankCapabilities } from "./src/index.js";

const result = rankCapabilities(problem, capabilityRecords, {
  problem_type: "debugging",
  granted_permissions: ["repository.read"],
  allowed_execution_modes: ["read_only"]
});
```

## Limits and trust boundary

The selector reads metadata and returns candidates. It does not store registry entries, install or invoke capabilities, prove runtime compatibility, compose multi-step workflows, or enforce permissions at an execution boundary. Capability declarations are untrusted claims until separately reviewed and tested.

The ranking is deterministic, not a learned quality score. A recommendation is not proof that a capability is best or safe. Run tests with `npm test`.
