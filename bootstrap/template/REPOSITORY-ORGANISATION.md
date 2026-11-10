# Repository Organisation and Safety — Agent Entry Point

This repository uses Agent-Universal-Devkit.

Before major work, read the canonical guide:
https://github.com/tanushgargjanuary-bot/Agent-Universal-Devkit/blob/main/docs/REPOSITORY-GOVERNANCE.md

Apply the lowest governance level that controls the actual risk:
- L1: personal/prototype
- L2: maintained application
- L3: production/sensitive
- L4: high-assurance/safety-critical

At project intake:
1. Inspect the repository, branch, working tree, instructions, files, tests, dependencies, and CI.
2. Preserve existing conventions and uncommitted user work.
3. Select the governance level and relevant project rubrics.
4. Record important gaps. Do not perform broad cleanup without evidence.
5. If the repository has adopted the Devkit checker, run it and review the report. Do not treat warnings as automatic instructions to rename or delete files.

During work:
- Keep files in predictable locations.
- Keep changes small and scoped.
- Track meaningful work with acceptance criteria.
- Record consequential decisions in ADRs.
- Use tests and automated checks.
- Keep secrets and generated output out of source control.
- Use least privilege and isolate untrusted code.
- Ask before destructive, privileged, production, or irreversible actions.

Before finishing:
- Review the full diff and working tree.
- Check for unrelated edits, accidental deletions, secrets, and temporary files.
- Run relevant checks. Report checks not run.
- Update affected documentation.
- Report changed files, evidence, risks, and follow-up work.

Do not reorganise files only to satisfy a preferred folder layout. Follow project conventions. Do not claim security certification or compliance without independent evidence.

The checker is read-only. It reports likely issues. It does not prove security or clean files automatically. See the canonical checker guide:
https://github.com/tanushgargjanuary-bot/Agent-Universal-Devkit/blob/main/docs/REPOSITORY-HYGIENE-CHECKER.md

This file is a pointer, not a replacement for the full guide. Keep this bootstrap file small.