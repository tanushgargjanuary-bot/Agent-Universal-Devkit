# Knowledge Quality Gates

## Schema and content validation

CI validates registry entries against the supported schema rules. It validates registry relationships and recomputes the SHA-256 digest of every approved Markdown file.

Use [the technical review checklist](KNOWLEDGE-REVIEW-CHECKLIST.md) during every content review.

## Approval evidence

An approved entry must record:
- GitHub login of the human reviewer.
- Exact review submission timestamp.
- Exact knowledge item version.
- SHA-256 digest of the reviewed UTF-8 Markdown bytes.
- Merged content pull request number.
- GitHub pull request review ID.
- Full commit SHA reviewed.

The approval verifier uses the GitHub API to check the merged content PR, review ID and state, reviewer identity and repository association, self-approval restrictions, final reviewed commit, changed files, and recorded review time.

A digest binds approval to exact bytes. A GitHub review attestation binds the reviewer and commit. Neither proves technical correctness. A qualified reviewer must inspect sources, assumptions, derivation, tests, and limitations.

## Two-pull-request procedure

The review ID does not exist until GitHub records the review. Use two pull requests.

1. **Content PR:** change the knowledge Markdown and registry entry. Set status to `review`. Do not add approval attestation fields. The reviewer approves the final content commit. Merge the PR.
2. **Approval PR:** change the registry entry to `approved`. Add the exact reviewer login, review timestamp, original content PR number, review ID, reviewed commit SHA, item version, sources, and content digest. Do not change the reviewed Markdown.
3. A reviewer independently approves the Approval PR. Merge only after the quality check passes.
4. CI verifies the content PR, review event, identity, association, final commit, merged state, changed file list, and current content digest.

If the Markdown changes after review, the digest fails. Return the item to review and obtain a fresh content review.

## Repository protection

A workflow is required only when GitHub branch rules require it. Configure `main` to require pull requests, independent approval, latest-push approval or stale-review dismissal, conversation resolution, and the relevant quality checks. Restrict direct pushes and force pushes.

The previous security audit recorded that branch protection was disabled. This setting must be checked in GitHub. Documentation does not enable it.

## Retrieval benchmark

The labelled benchmark includes positive, negative, and abstention cases. The initial benchmark uses explicit draft preview because the library started with draft entries. Production retrieval remains approved-only.

The benchmark is a regression set, not an expert-quality evaluation.

## Scope and limitations

This process checks GitHub's recorded reviewer identity and review event. It does not establish subject-matter expertise. It cannot enforce branch protection until repository rules are configured. A registry status field alone is not sufficient trust.
