# Architecture

## Goal

Build a central engineering problem-solving ecosystem with two equal priorities:
- **Resource Intelligence:** discover, evaluate, compare, relate, and maintain useful resources.
- **Agent Orchestration:** plan, route, coordinate, execute, and verify engineering work.

A native Engineering Knowledge & Methods Library supplies algorithms, mathematics, formulas, patterns, protocols, and procedures to both systems.

## Problem-solving lifecycle

1. Understand the request and derive constraints and acceptance criteria.
2. Retrieve relevant resources and native knowledge.
3. Gather evidence and apply hard requirements.
4. Compare individual resources and complete approaches.
5. Design a solution and explain trade-offs.
6. Plan tasks and match them to tested agent capabilities.
7. Apply permissions and risk-based approvals.
8. Execute through compatible adapters.
9. Verify outputs independently.
10. Record outcomes and diagnosed failure causes.

## Resource Intelligence

The resource lifecycle is discovery → inspection → evidence → evaluation → comparison → review → approval → monitoring.

The catalog stores metadata and evidence, not copies of every upstream repository. Automated discovery creates candidates only. Popularity, stars, and recency are discovery signals, not quality guarantees.

Compare alternatives against project requirements. Outcomes may be a single resource, a justified hybrid, a custom approach, neither, or insufficient evidence. A hybrid can be discovered even when upstream projects do not declare each other complementary, but it must be validated.

## Native Knowledge Library

The repository contains original study material. It is not merely a directory of external links.

Knowledge items include algorithms, data structures, mathematical methods, formulas, patterns, protocols, and engineering procedures. Each item has a stable ID, type, path, prerequisites, activation signals, assumptions, limitations, status, and source references.

The initial Knowledge Engine performs local, deterministic retrieval using task tags, phrases, capabilities, and domains. It returns ranked results with reasons. It does not execute algorithms or prove suitability. The calling agent must inspect the task, assumptions, and limitations.

Do not copy complete third-party notes, textbooks, or proprietary course material. Write original explanations and cite sources used for verification.

## Agent Orchestration

The orchestration layer should:
1. Inspect project and task context.
2. Establish requirements and acceptance criteria.
3. Decompose work into dependent tasks.
4. Discover agents and capabilities.
5. Retrieve suitable resources and knowledge.
6. Select compatible agents and tools.
7. Apply permissions and approval rules.
8. Execute through tested adapters.
9. Verify results independently.
10. Report evidence, limitations, and failures.

The orchestrator now retrieves approved native knowledge during plan creation and attaches ranked matches, reasons, limitations, and prerequisite status to each task. Draft and review entries remain excluded by default. The orchestrator is still a planning and safety core, not a multi-agent execution service.

## Interoperability

Use open interfaces where they fit, including MCP for tool/data connections and A2A for agent-to-agent communication. Keep task and resource contracts independent of these protocols. Provide API, CLI, and file-based access where useful.

## Architecture boundaries

Capabilities do not automatically require separate services or packages. Split them only when independent testing, reuse, deployment, or ownership justifies it.

Use versioned structured records before adopting a graph database. Model relationships explicitly and attach evidence, provenance, confidence, and verification time. Do not treat inferred relationships as verified facts.

## Bootstrap and distribution

A new project receives a small bootstrap payload. It points to this repository and explains how compatible agents find relevant resources and instructions.

A pointer is not magic: the agent must support the local instruction file, have repository or network access, and follow instructions. The GitHub App can install files but cannot force an arbitrary agent to read remote content.

## Security and trust

Treat catalog metadata, source repositories, remote instructions, and retrieved external content as untrusted until reviewed. Never execute tools during discovery or execute code merely because a knowledge item was retrieved. Pin versions, use least privilege, isolate execution, and require approval for high-risk actions.

An agent's completion statement is not proof. Use tests, diffs, logs, and task-specific verification evidence.
