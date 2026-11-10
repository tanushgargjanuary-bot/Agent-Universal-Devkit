const TYPE_CHECKS = {
  object: (value) => value !== null && typeof value === "object" && !Array.isArray(value),
  array: Array.isArray,
  string: (value) => typeof value === "string",
  integer: Number.isInteger,
  number: (value) => typeof value === "number" && Number.isFinite(value),
  boolean: (value) => typeof value === "boolean",
  null: (value) => value === null
};

function isPlainObject(value) {
  if (!TYPE_CHECKS.object(value)) return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function stableValue(value) {
  if (Array.isArray(value)) return value.map(stableValue);
  if (isPlainObject(value)) {
    return Object.fromEntries(Object.keys(value).sort().map((key) => [key, stableValue(value[key])]));
  }
  return value;
}

function equalJson(left, right) {
  return JSON.stringify(stableValue(left)) === JSON.stringify(stableValue(right));
}

function validateFormat(value, format) {
  if (format === "date-time") {
    const hasTimezone = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/.test(value);
    return hasTimezone && Number.isFinite(Date.parse(value));
  }
  if (format === "uri") {
    try {
      const parsed = new URL(value);
      return Boolean(parsed.protocol && parsed.host);
    } catch {
      return false;
    }
  }
  return true;
}

/**
 * Validate the JSON Schema subset used by DEVKIT's local contracts.
 * Supported keywords: type, const, enum, minimum, maximum, minLength,
 * maxLength, pattern, format (date-time/uri), minItems, maxItems,
 * uniqueItems, items, required, properties, additionalProperties,
 * allOf, and if/then.
 *
 * This is deliberately not a complete JSON Schema implementation. Contract
 * schemas must stay within this documented subset unless the engine is extended.
 */
export function validateJsonSchema(value, schema, path = "$") {
  if (!isPlainObject(schema)) throw new TypeError("Schema must be a plain object");

  const errors = [];
  const add = (message) => errors.push(path + ": " + message);

  if (Array.isArray(schema.allOf)) {
    for (const part of schema.allOf) errors.push(...validateJsonSchema(value, part, path));
  }

  if (schema.if && validateJsonSchema(value, schema.if, path).length === 0 && schema.then) {
    errors.push(...validateJsonSchema(value, schema.then, path));
  }

  if (schema.type !== undefined) {
    const allowed = Array.isArray(schema.type) ? schema.type : [schema.type];
    if (!allowed.some((type) => TYPE_CHECKS[type]?.(value))) {
      add("type must be " + allowed.join(" or "));
      return errors;
    }
  }

  if (schema.const !== undefined && !equalJson(value, schema.const)) add("value must equal const");
  if (Array.isArray(schema.enum) && !schema.enum.some((candidate) => equalJson(candidate, value))) {
    add("value is not in enum");
  }

  if (typeof value === "number" && Number.isFinite(value)) {
    if (schema.minimum !== undefined && value < schema.minimum) add("number is below minimum");
    if (schema.maximum !== undefined && value > schema.maximum) add("number is above maximum");
  }

  if (typeof value === "string") {
    if (schema.minLength !== undefined && [...value].length < schema.minLength) add("string is shorter than minLength");
    if (schema.maxLength !== undefined && [...value].length > schema.maxLength) add("string is longer than maxLength");
    if (schema.pattern !== undefined && !new RegExp(schema.pattern, "u").test(value)) add("string does not match pattern");
    if (schema.format && !validateFormat(value, schema.format)) add("string is not a valid " + schema.format);
  }

  if (Array.isArray(value)) {
    if (schema.minItems !== undefined && value.length < schema.minItems) add("array has fewer than minItems");
    if (schema.maxItems !== undefined && value.length > schema.maxItems) add("array has more than maxItems");
    if (schema.uniqueItems && new Set(value.map((entry) => JSON.stringify(stableValue(entry)))).size !== value.length) {
      add("array items are not unique");
    }
    if (schema.items) {
      value.forEach((entry, index) => {
        errors.push(...validateJsonSchema(entry, schema.items, path + "[" + index + "]"));
      });
    }
  }

  if (isPlainObject(value)) {
    for (const key of schema.required ?? []) {
      if (!Object.hasOwn(value, key)) errors.push(path + ": missing required property " + key);
    }
    for (const [key, childSchema] of Object.entries(schema.properties ?? {})) {
      if (Object.hasOwn(value, key)) errors.push(...validateJsonSchema(value[key], childSchema, path + "." + key));
    }
    if (schema.additionalProperties === false) {
      for (const key of Object.keys(value)) {
        if (!Object.hasOwn(schema.properties ?? {}, key)) {
          errors.push(path + ": additional property " + key + " is not allowed");
        }
      }
    }
  }

  return errors;
}

export const validateSchema = validateJsonSchema;
