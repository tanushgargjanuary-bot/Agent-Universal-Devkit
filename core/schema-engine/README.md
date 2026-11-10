# Schema Engine

A small, dependency-free validator for the JSON Schema subset used by DEVKIT's local contracts.

## Supported keywords

- Types: object, array, string, integer, number, boolean, null.
- Values: const, enum.
- Numbers: minimum, maximum.
- Strings: minLength, maxLength, pattern, date-time, URI.
- Arrays: minItems, maxItems, uniqueItems, items.
- Objects: required, properties, additionalProperties.
- Composition: allOf and if/then.

This is **not** a complete JSON Schema implementation. Do not add unsupported schema keywords and assume they are enforced. Extend the validator and its tests before using a new keyword in a contract.

The validator is local and deterministic. It performs no file, network, or process operations.

## Usage

```js
import { validateJsonSchema } from "./src/index.js";

const errors = validateJsonSchema(value, schema);
if (errors.length) throw new Error(errors.join("; "));
```

Run tests with `npm test`.
