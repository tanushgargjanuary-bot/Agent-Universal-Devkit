# Orchestration Layer

The orchestration layer coordinates work. It does not replace the AI coding harness.

## What it should do

1. Receive a goal and repository context.
2. Inspect the project and identify its language, framework, tests, and constraints.
3. Derive requirements and acceptance criteria.
4. Break the goal into small tasks.
5. Match each task to a suitable agent capability and approved tool.
6. Retrieve relevant approved knowledge and resources.
7. Check permissions, risk, and required approvals.
8. Run tasks through a supported harness adapter.
9. Verify results with tests and independent checks.
10. Return a clear report and record diagnosed failures.

## Main parts

- **Planner:** turns a goal into ordered tasks.
- **Router:** chooses a compatible agent or harness for each task.
- **Tool selector:** recommends tools from the Devkit catalog.
- **Knowledge selector:** retrieves relevant algorithms, mathematics, and methods.
- **Policy gate:** blocks actions that need approval.
- **Executor adapters:** connect to supported coding harnesses.
- **Verifier:** checks tests, diffs, and task completion.
- **State store:** tracks task status and evidence.

## Current implementation boundary

The current orchestrator implements task planning, dependency ordering, metadata validation, and safety gates. It does not yet launch or control OpenCode, Codex, Claude Code, or Antigravity.

The Knowledge Engine exists as a separate local component. It is not yet called by the orchestrator. Knowledge-aware planning is a roadmap item, not a completed integration.

Each harness needs a tested executor adapter before the orchestrator can run it.

## Execution model

`understand → retrieve → plan → approve → execute → verify → report`

Never allow an agent to approve its own high-risk action. Never treat an agent's statement that a task is complete as proof. Use test results, diffs, and other evidence.
