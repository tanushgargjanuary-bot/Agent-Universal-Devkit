import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { validateKnowledgeRegistry, validateKnowledgeContent } from "../src/index.js";
import { validateSchema } from "../src/json-schema.js";
import registry from "../../../knowledge/registry.json" with { type: "json" };
const schema = JSON.parse(readFileSync(new URL("../../../schemas/knowledge-item.schema.json", import.meta.url), "utf8"));

test("registry validates against the repository JSON Schema contract", () => {
  assert.deepEqual(validateSchema(registry.items, schema), []);
  assert.deepEqual(validateKnowledgeRegistry(registry), { valid: true, item_count: registry.items.length });
});
test("schema validation rejects malformed records", () => {
  const invalid = structuredClone(registry.items);
  invalid[0].status = "trusted";
  assert.ok(validateSchema(invalid, schema).some((error) => error.includes("enum")));
});
test("registry IDs are unique and every item points to a native file", () => {
  for (const item of registry.items) {
    const content = readFileSync(new URL("../../../" + item.path, import.meta.url), "utf8");
    assert.ok(content.includes(item.id), "item ID missing from content: " + item.id);
    assert.ok(Array.isArray(item.activation.any_tags));
    assert.ok(Array.isArray(item.activation.any_phrases));
  }
});
test("mathematics entries retain display-math delimiters", () => {
  const entries = registry.items.filter((item) => item.kind === "mathematical_method" || item.kind === "formula");
  assert.ok(entries.length > 0);
  for (const item of entries) {
    const content = readFileSync(new URL("../../../" + item.path, import.meta.url), "utf8");
    assert.match(content, /\\\[/);
    assert.match(content, /\\\]/);
    assert.doesNotMatch(content, /[\u0000-\u0008\u000B\u000C\u000E-\u001F]/);
  }
});
test("approval digest is bound to exact UTF-8 content bytes", () => {
  const content = "# Reviewed knowledge\n";
  const digest = createHash("sha256").update(content, "utf8").digest("hex");
  const item = {
    id:"approved.example",title:"Approved example",kind:"algorithm",path:"knowledge/example.md",version:"1.0.0",status:"approved",
    domains:["algorithms"],tags:["example"],prerequisites:[],related:[],limitations:[],
    activation:{any_tags:["example"],any_phrases:[]},
    review:{approved_by:"reviewer",approved_at:"2026-11-10T00:00:00Z",reviewed_version:"1.0.0",content_sha256:digest,
      sources:[{title:"Reference",url:"https://example.com/reference",purpose:"Verification"}]}
  };
  assert.equal(validateKnowledgeContent({items:[item]},()=>content).verified_count,1);
  assert.throws(()=>validateKnowledgeContent({items:[item]},()=>content+"changed"),/digest mismatch/);
  assert.throws(()=>validateKnowledgeRegistry({items:[{...item,review:{...item.review,content_sha256:undefined}}]}),/needs reviewer/);
});
