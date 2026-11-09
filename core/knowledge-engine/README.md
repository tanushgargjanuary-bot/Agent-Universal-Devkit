# Knowledge Engine

A small, local-first retrieval engine for the Devkit's native Engineering Knowledge Library.

## Current scope

- Reads a supplied registry object; file loading is left to the caller.
- Matches explicit task tags, phrases, domains, and required capabilities.
- Supports required-tag combinations and exclusion phrases.
- Returns ranked items with matched signals and reasons.
- Defaults to approved material only. Draft and review entries require an explicit status override.
- Uses no network, embeddings, paid API, or third-party dependency.

## Usage

```js
import { selectKnowledge } from "./src/index.js";
import registry from "../../knowledge/registry.json" with { type: "json" };

const result = selectKnowledge(registry, {
  description: "Find the shortest path in a weighted graph with non-negative edges",
  tags: ["graph", "shortest-path", "weighted-graph"],
  domain: "algorithms",
  required_capabilities: ["pathfinding"]
});

console.log(result.matches);
```

The exact JSON import syntax depends on the Node.js version and runtime. A caller may also load and pass parsed JSON.

For editorial preview only, a caller can explicitly request `statuses: ["draft", "review"]`. Do not treat draft or review content as validated engineering guidance.

## Important limits

This is a deterministic metadata matcher, not semantic understanding. It can miss paraphrases and can return false matches. The calling agent must inspect the task and selected material. A result is guidance, not permission to execute code or a claim that the method is suitable.

Add semantic retrieval only after creating an evaluation set and measuring precision and recall.
