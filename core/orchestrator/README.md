# Orchestration Layer

The orchestration layer coordinates work. It does not replace the AI coding harness.

## What it should do

1. Receive a goal and repository context.
2. Inspect the project and identify its language, framework, tests, and constraints.
3. Break the goal into small tasks.
4. Match each task to a suitable agent capability and approved tool.
5. Check permissions, risk, and required approvals.
6. Run tasks through a supported harness adapter.
7. Verify results with tests and independent checks.
8. Return a clear report and record failures.

## Main parts

- **Planner:** turns a goal into ordered tasks.
- **Router:** chooses a compatible agent or harness for each task.
- **Tool selector:** recommends tools from the Devkit catalog.
- **Policy gate:** blocks actions that need approval.
- **Executor adapters:** connect to supported coding harnesses.
- **Verifier:** checks tests, diffs, and task completion.
- **State store:** tracks task status and evidence.

## Important boundary

The first release defines the orchestration contract and safety rules. It does not yet launch or control OpenCode, Codex, Claude Code, or Antigravity. Each harness needs a tested executor adapter before the orchestrator can run it.

## Execution model

`plan → approve → execute → verify → report`

Never allow an agent to approve its own high-risk action. Never treat an agent's statement that a task is complete as proof. Use test results, diffs, and other evidence.
