# Tests

Tests should validate:

- YAML and JSON syntax and schemas.
- Required resource and knowledge metadata.
- Knowledge registry IDs, paths, prerequisites, and referenced files.
- Bootstrap file presence and pointer correctness.
- Duplicate IDs and invalid paths.
- Activation rules and retrieval precision/recall on a labelled task set.
- Compatibility claims against tested harness versions.
- Orchestrator task ordering, risk gates, and execution contracts.

Do not report an integration as compatible merely because its files exist. Do not mark knowledge content approved merely because its registry record is valid. Schema validation checks structure; technical review checks correctness.
