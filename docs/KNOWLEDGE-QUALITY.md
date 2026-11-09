# Knowledge quality gates

## Schema validation
CI validates registry entries against the schema keywords used by this repository: types, required properties, properties, enums, constants, patterns, lengths, uniqueness, items, additional-property rejection, conditional schemas, and URI/date-time formats. This is a scoped validator for this schema. It is not a general Draft 2020-12 implementation.

## Content-bound approval
Every approved item must include a reviewer, approval timestamp, reviewed version, verification sources, and a SHA-256 digest of the exact UTF-8 Markdown bytes. CI recomputes the digest. A content edit invalidates approval until a reviewer checks the new content and updates the digest. A digest proves byte identity. It does not prove correctness or reviewer identity.

## Retrieval benchmark
The labelled benchmark includes positive, negative, and abstention cases. Run it with npm run benchmark. It uses explicit draft preview because the initial library contains draft entries only. Production retrieval remains approved-only.

The benchmark reports precision, recall, false positives, forbidden matches, and correct abstentions. It is a regression set, not an expert-quality evaluation. Add independently labelled cases before considering semantic retrieval.

## Review workflow
Move an item to review when it is ready for technical review. A reviewer must inspect the content, verify sources and examples, run relevant tests, then set approved and add exact version and digest metadata. The current gate enforces metadata and byte binding. It does not authenticate reviewers or replace branch protection and human code review.
