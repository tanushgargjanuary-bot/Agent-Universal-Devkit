import test from "node:test";
import assert from "node:assert/strict";
import { validateJsonSchema } from "../src/index.js";

test("validates primitive types and rejects non-finite numbers", () => {
  assert.deepEqual(validateJsonSchema(4, { type: "integer", minimum: 1 }), []);
  assert.ok(validateJsonSchema(Number.NaN, { type: "number" }).length > 0);
  assert.ok(validateJsonSchema("4", { type: "number" }).length > 0);
});

test("validates nested required properties and rejects additional properties", () => {
  const schema = {
    type: "object",
    required: ["source"],
    additionalProperties: false,
    properties: {
      source: {
        type: "object",
        required: ["kind"],
        additionalProperties: false,
        properties: { kind: { type: "string", minLength: 1 } }
      }
    }
  };
  assert.deepEqual(validateJsonSchema({ source: { kind: "test" } }, schema), []);
  assert.ok(validateJsonSchema({ source: { kind: "test", token: "secret" } }, schema).some((error) => error.includes("additional property token")));
  assert.ok(validateJsonSchema({}, schema).some((error) => error.includes("missing required property source")));
});

test("validates date-time and URI formats", () => {
  assert.deepEqual(validateJsonSchema("2026-11-10T10:00:00Z", { type: "string", format: "date-time" }), []);
  assert.ok(validateJsonSchema("tomorrow", { type: "string", format: "date-time" }).length > 0);
  assert.deepEqual(validateJsonSchema("https://example.com/path", { type: "string", format: "uri" }), []);
  assert.ok(validateJsonSchema("not a uri", { type: "string", format: "uri" }).length > 0);
});

test("validates arrays, uniqueness, and enum values", () => {
  const schema = { type: "array", minItems: 1, uniqueItems: true, items: { type: "string", enum: ["a", "b"] } };
  assert.deepEqual(validateJsonSchema(["a", "b"], schema), []);
  assert.ok(validateJsonSchema(["a", "a"], schema).some((error) => error.includes("not unique")));
  assert.ok(validateJsonSchema(["c"], schema).some((error) => error.includes("enum")));
});

test("supports allOf and conditional if/then constraints", () => {
  const schema = {
    allOf: [{ type: "object" }],
    if: { type: "object", properties: { mode: { const: "strict" } }, required: ["mode"] },
    then: { type: "object", required: ["approval"] }
  };
  assert.deepEqual(validateJsonSchema({ mode: "normal" }, schema), []);
  assert.ok(validateJsonSchema({ mode: "strict" }, schema).some((error) => error.includes("approval")));
});

test("rejects non-plain objects as contract objects", () => {
  const value = new Date();
  assert.ok(validateJsonSchema(value, { type: "object" }).length > 0);
});
