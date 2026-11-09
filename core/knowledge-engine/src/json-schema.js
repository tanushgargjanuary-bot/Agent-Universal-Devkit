const TYPES = {
  object: (v) => v !== null && typeof v === "object" && !Array.isArray(v),
  array: Array.isArray, string: (v) => typeof v === "string",
  integer: Number.isInteger, number: (v) => typeof v === "number" && Number.isFinite(v),
  boolean: (v) => typeof v === "boolean", null: (v) => v === null
};
export function validateSchema(value, schema, path = "$") {
  const errors = [], add = (message) => errors.push(path + ": " + message);
  if (schema.allOf) for (const part of schema.allOf) errors.push(...validateSchema(value, part, path));
  if (schema.if && validateSchema(value, schema.if, path).length === 0 && schema.then) errors.push(...validateSchema(value, schema.then, path));
  if (schema.type) {
    const allowed = Array.isArray(schema.type) ? schema.type : [schema.type];
    if (!allowed.some((type) => TYPES[type]?.(value))) { add("type must be " + allowed.join(" or ")); return errors; }
  }
  if (schema.const !== undefined && value !== schema.const) add("value must equal const");
  if (typeof value === "number" && schema.minimum !== undefined && value < schema.minimum) add("number is below minimum");
  if (typeof value === "number" && schema.maximum !== undefined && value > schema.maximum) add("number is above maximum");
  if (schema.enum && !schema.enum.some((candidate) => candidate === value)) add("value is not in enum");
  if (typeof value === "string") {
    if (schema.minLength !== undefined && [...value].length < schema.minLength) add("string is shorter than minLength");
    if (schema.pattern && !new RegExp(schema.pattern).test(value)) add("string does not match pattern");
    if (schema.format === "date-time" && (!Number.isFinite(Date.parse(value)) || !/^\d{4}-\d{2}-\d{2}T/.test(value))) add("invalid date-time");
    if (schema.format === "uri") { try { const u = new URL(value); if (!u.protocol || !u.host) add("invalid URI"); } catch { add("invalid URI"); } }
  }
  if (Array.isArray(value)) {
    if (schema.minItems !== undefined && value.length < schema.minItems) add("array has fewer than minItems");
    if (schema.uniqueItems && new Set(value.map((v) => JSON.stringify(v))).size !== value.length) add("array items are not unique");
    if (schema.items) value.forEach((entry, i) => errors.push(...validateSchema(entry, schema.items, path + "[" + i + "]")));
  }
  if (TYPES.object(value)) {
    for (const key of schema.required ?? []) if (!(key in value)) errors.push(path + ": missing required property " + key);
    for (const [key, child] of Object.entries(schema.properties ?? {})) if (key in value) errors.push(...validateSchema(value[key], child, path + "." + key));
    if (schema.additionalProperties === false) for (const key of Object.keys(value)) if (!(key in (schema.properties ?? {}))) errors.push(path + ": additional property " + key + " is not allowed");
  }
  return errors;
}
