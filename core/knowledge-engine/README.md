# Knowledge Engine

A small, local-first retrieval engine for the Devkit's native Engineering Knowledge Library.

## Current behaviour

- Accepts a registry object supplied by the caller.
- Matches task tags, phrases, domains, and required capabilities.
- Supports required-tag combinations and exclusion phrases.
- Returns ranked items with matched signals and reasons.
- Defaults to approved material only.
- Requires an explicit status override for draft or review preview.
- Uses no network, embeddings, paid API, or third-party runtime dependency.

## Usage

```js
import { selectKnowledge } from "./src/index.js";
import registry from "../../knowledge/registry.json" with { type: "json" };

const result = selectKnowledge(registry, {
  description: "Find a shortest path in a weighted graph with non-negative edges",
  tags: ["graph", "shortest-path", "weighted-graph"],
  domain: "algorithms",
  required_capabilities: ["pathfinding"]
});

console.log(result.matches);
```

JSON import syntax depends on the Node.js runtime. A caller may load and pass parsed JSON instead.

For editorial preview only, a caller can explicitly request `statuses: ["draft", "review"]`. Do not use preview content as validated engineering guidance.

## Trust boundary

The engine validates registry metadata and performs deterministic matching. It does not authenticate the author, prove technical correctness, understand arbitrary paraphrases, or prove that a result applies to a task. The caller must inspect the full item, its prerequisites, assumptions, sources, and limitations.

Retrieval is not permission to execute code.

## Validation

Run the package tests from this directory:

```bash
npm test
```

Use the package scripts as the source of truth. Report the actual runtime and test result.

## Future work

Add semantic retrieval only after a labelled benchmark shows a measurable improvement in precision, recall, and abstention quality.
