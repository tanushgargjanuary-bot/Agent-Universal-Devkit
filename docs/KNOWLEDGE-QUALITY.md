# Knowledge quality gates

## Schema and content validation

CI validates each registry entry against the schema keywords used by this repository. It also validates registry relationships and recomputes the SHA-256 digest of every approved Markdown file.

## Authenticated approval

An approved entry must record:
- approved_by: the GitHub login of the human reviewer.
- approved_at: the exact review submission timestamp.
- reviewed_version: the exact knowledge item version.
- content_sha256: SHA-256 of the exact UTF-8 Markdown bytes.
- approval_pr: the merged pull request number.
- approval_review_id: the GitHub pull request review ID.
- approval_commit: the full commit SHA reviewed by that person.

The approval verifier uses the GitHub API. It requires the referenced pull request to be merged into main, checks the exact review ID and current review state, checks the reviewer's GitHub identity and repository association, rejects self-approval, requires the review to target the final PR head, and confirms that the PR changed both the registry and the approved content file. The recorded approval time must match GitHub's review submission time.

The digest binds approval to exact content bytes. The GitHub review attestation binds the reviewer and commit. Neither proves that the technical judgement was correct. A qualified human must inspect the method, sources, assumptions, derivation, tests, and limitations.

## Required repository protection

The workflow is a required status check only if repository rules require it. Configure branch protection or a ruleset for main with:
1. Require a pull request before merging.
2. Require at least one approving review.
3. Require approval of the latest push, or dismiss stale approvals.
4. Require conversation resolution.
5. Require the Knowledge quality / validate status check.
6. Restrict direct pushes and force pushes to main.

The connected GitHub integration could not read branch protection settings and does not expose a branch-protection write action. Therefore, these settings are documented but not claimed to be enabled. An owner must configure them in GitHub repository Settings.

## Review procedure

1. Open a pull request that changes the knowledge Markdown file and knowledge/registry.json.
2. Set the item status to review while preparing it. Do not add approval metadata yet.
3. A qualified reviewer checks sources, assumptions, derivations, examples, tests, edge cases, and limitations.
4. The reviewer submits an Approve review after the final commit is ready.
5. Record the reviewer's GitHub login, exact submission timestamp, PR number, review ID, reviewed commit SHA, item version, and content digest.
6. Set the item status to approved.
7. CI verifies the GitHub API attestation and content digest.

If any content changes after review, the digest fails. If the PR head changes after review, the commit check fails. The entry must return to review and receive a fresh approval.

## Retrieval benchmark

The labelled benchmark includes positive, negative, and abstention cases. It uses explicit draft preview because the initial library contains draft entries only. Production retrieval remains approved-only. The benchmark is a regression set, not an expert-quality evaluation.

## Scope and limitations

This process authenticates GitHub's recorded reviewer identity and review event. It does not establish the reviewer's subject-matter expertise. It also cannot enforce branch protection until repository rules are configured. Do not treat an approved status field by itself as sufficient trust.
