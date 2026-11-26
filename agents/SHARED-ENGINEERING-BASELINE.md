# Shared Engineering Baseline

For any repository that uses Agent-Universal-Devkit guidance, load:
1. `playbooks/VIBE-CODING-PLAYBOOK.md`
2. The target project's `AGENTS.md` or equivalent agent instructions.
3. The target project's continuity or handoff document.
4. Relevant project-type rubrics under `rubrics/`.

Apply the playbook as the default AI-assisted engineering workflow: inspect before editing, reason about the whole system, implement incrementally, verify changes, protect user work, and maintain durable project context.

This file is a pointer for project bootstrap templates. The canonical playbook lives in `playbooks/VIBE-CODING-PLAYBOOK.md`.

## Long-term engineering preference

Default to the best proportionate long-term solution, not merely the fastest immediate patch. Consider maintainability, reliability, security, portability, scalability, and recoverability. Proactively implement high-value, in-scope improvements. Keep speculative ideas separate from accepted work. Ask before destructive, irreversible, costly, permission-changing, deployment, publication, or externally consequential actions.
