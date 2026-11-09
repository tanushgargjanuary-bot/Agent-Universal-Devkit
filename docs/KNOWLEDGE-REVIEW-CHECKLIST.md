# Knowledge review checklist

Use this checklist for a human technical review. A GitHub approval proves who approved a specific commit. It does not prove that the content is correct.

## Review all entries

- [ ] The entry solves a clearly stated engineering problem.
- [ ] The explanation is original and does not copy protected third-party notes.
- [ ] Every external source supports a specific claim.
- [ ] Assumptions and preconditions are explicit.
- [ ] Limitations and known failure cases are explicit.
- [ ] Terminology, symbols, units, and notation are consistent.
- [ ] Examples can be reproduced.
- [ ] The entry version changes when its technical content changes.
- [ ] Retrieval tags and phrases are specific. Domain alone must not trigger retrieval.
- [ ] Prerequisites and related-item IDs exist and are correct.

## Algorithms and data structures

- [ ] Inputs, outputs, and preconditions are defined.
- [ ] The algorithm steps are precise enough to implement.
- [ ] Correctness reasoning identifies the invariant or proof argument.
- [ ] Time and space complexity state the relevant input dimensions and assumptions.
- [ ] Empty, singleton, duplicate, disconnected, invalid, and boundary inputs are considered where relevant.
- [ ] Tests cover normal cases and important edge cases.
- [ ] Expected results come from an independent oracle, known result, or separately implemented method.
- [ ] The tested implementation is not used as its own only correctness oracle.

## Mathematics and formulas

- [ ] Every variable and parameter is defined.
- [ ] Units, domains, and sign conventions are stated.
- [ ] Assumptions are stated before applying the formula.
- [ ] The derivation is valid and each algebraic step follows.
- [ ] A worked example includes intermediate values.
- [ ] Boundary cases and undefined cases are identified.
- [ ] Numerical stability, conditioning, approximation error, and rounding are discussed where relevant.
- [ ] A numerical test compares against an independent known answer or higher-precision reference.

## Security and engineering procedures

- [ ] The threat model and trust boundaries are stated.
- [ ] Required permissions and sensitive inputs are listed.
- [ ] Unsafe defaults and failure modes are identified.
- [ ] Version, platform, and compatibility assumptions are explicit.
- [ ] The procedure has a safe rollback or recovery path where needed.

## Approval

- [ ] The reviewer is qualified to assess the subject matter.
- [ ] The reviewer is not the pull request author.
- [ ] The review is submitted against the final content commit.
- [ ] The content PR is merged without changing the reviewed content.
- [ ] The separate approval-metadata PR references the exact GitHub review ID, reviewer login, submission timestamp, and commit SHA.
- [ ] The content SHA-256 digest matches the exact UTF-8 file bytes.
- [ ] The approval-metadata PR has its own independent approval on its final head.
