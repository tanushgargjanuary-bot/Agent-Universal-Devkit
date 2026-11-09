# Knowledge quality gates

## Schema and content validation

CI validates each registry entry against the schema keywords used by this repository. It also validates registry relationships and recomputes the SHA-256 digest of every approved Markdown file.

## Authenticated approval

An approved entry must record:
- approved_by: the GitHub login of the human reviewer.
- approved_at: the exact review submission timestamp.
- reviewed_version: the exact knowledge item version.
- content_sha256: SHA-256 of the exact UTF-8 Markdown bytes.
- approval_pr: the merged pull request number that received the content review.
- approval_review_id: the GitHub pull request review ID.
- approval_commit: the full commit SHA reviewed by that person.

The approval verifier uses the GitHub API. It requires the referenced pull request to be merged into main, checks the exact review ID and current review state, checks the reviewer's GitHub identity and repository association, rejects self-approval, requires the review to target the final PR head, and confirms that the PR changed both the registry and the approved content file. The recorded approval time must match GitHub's review submission time.

The digest binds approval to exact content bytes. The GitHub review attestation binds the reviewer and commit. Neither proves that the technical judgement was correct. A qualified human must inspect the method, sources, assumptions, derivation, tests, and limitations.

## Two-pull-request approval procedure

The review ID does not exist until GitHub records the review. Therefore, use two pull requests. Do not try to put the review ID into the same commit that the reviewer must approve.

1. **Content PR:** Change the knowledge Markdown and registry entry. Set status to review. Do not add approval attestation fields. The reviewer checks the final content and submits an Approve review on the final commit. Merge this PR.
2. **Approval PR:** Change the registry entry to approved. Add the reviewer's exact GitHub login, review submission timestamp, original content PR number, review ID, reviewed commit SHA, item version, sources, and content digest. Do not change the reviewed Markdown content.
3. A reviewer approves the Approval PR under normal repository review rules. Merge only after the Knowledge quality check passes.
4. CI verifies the original content PR, the exact review ID, reviewer identity, reviewer association, review state, final reviewed commit, merged state, and changed file list. It also verifies the content digest against the current Markdown bytes.

If the Markdown content changes after the content review, the digest fails. If the content PR head changes after the review, the commit check fails. The item must return to review and receive a fresh content PR review.

## Required repository protection

The workflow is a required status check only if repository rules require it. Configure branch protection or a ruleset for main with:
1. Require a pull request before merging.
2. Require at least one approving review.
3. Require approval of the latest push, or dismiss stale approvals.
4. Require conversation resolution.
5. Require the Knowledge quality / validate status check.
6. Restrict direct pushes and force pushes to main.

The connected GitHub integration could not read branch protection settings and does not expose a branch-protection write action. Therefore, these settings are documented but not claimed to be enabled. An owner must configure them in GitHub repository Settings.

## Retrieval benchmark

The labelled benchmark includes positive, negative, and abstention cases. It uses explicit draft preview because the initial library contains draft entries only. Production retrieval remains approved-only. The benchmark is a regression set, not an expert-quality evaluation.

## Scope and limitations

This process authenticates GitHub's recorded reviewer identity and review event. It does not establish the reviewer's subject-matter expertise. It also cannot enforce branch protection until repository rules are configured. Do not treat an approved status field by itself as sufficient trust.
