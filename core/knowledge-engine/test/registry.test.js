import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { validateKnowledgeRegistry } from "../src/index.js";
import registry from "../../../knowledge/registry.json" with { type: "json" };

const schema = JSON.parse(readFileSync(
  new URL("../../../schemas/knowledge-item.schema.json", import.meta.url),
  "utf8"
));

test("knowledge schema and registry are valid JSON documents", () => {
  assert.equal(schema.title, "Devkit Knowledge Item");
  assert.ok(Array.isArray(registry.items));
  assert.ok(registry.items.length > 0);
  assert.deepEqual(validateKnowledgeRegistry(registry), {
    valid: true, item_count: registry.items.length
  });
});

test("registry IDs are unique and every item points to a native file", () => {
  for (const item of registry.items) {
    const content = readFileSync(new URL("../../../" + item.path, import.meta.url), "utf8");
    assert.ok(content.includes(item.id), "item ID missing from content: " + item.id);
    assert.ok(item.activation && Array.isArray(item.activation.any_tags));
    assert.ok(Array.isArray(item.activation.any_phrases));
  }
});

test("mathematics entries retain valid display-math delimiters", () => {
  const mathItems = registry.items.filter((item) => item.kind === "mathematical_method");
  assert.ok(mathItems.length > 0);
  for (const item of mathItems) {
    const content = readFileSync(new URL("../../../" + item.path, import.meta.url), "utf8");
    assert.match(content, /\\\[/, item.id + " is missing an opening display-math delimiter");
    assert.match(content, /\\\]/, item.id + " is missing a closing display-math delimiter");
    assert.doesNotMatch(content, /[\u0000-\u0008\u000B\u000C\u000E-\u001F]/);
  }
});
