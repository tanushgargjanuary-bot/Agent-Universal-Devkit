# Architecture

## Goal

Build a central engineering problem-solving ecosystem with two equal priorities:

- **Resource Intelligence:** discover, evaluate, compare, relate, and maintain useful resources.
- **Agent Orchestration:** understand goals, plan, route, coordinate, execute, and verify engineering work.

The native Engineering Knowledge & Methods Library supports both systems.

## Current implementation

| Capability | Current state | Boundary |
|---|---|---|
| Resource catalog | Implemented | Entries are candidates unless separately approved. |
| Resource comparison | Implemented | Hard constraints precede weighted ranking; evidence quality still limits conclusions. |
| Resource registry | Implemented | SQLite identity, metadata, GitHub sync, and human-reviewed deduplication. |
| Knowledge Engine | Implemented | Deterministic metadata matching; approved-only by default. |
| Technology Decision Engine | Implemented | Opt-in comparison of caller-supplied, evidence-backed candidates. |
| Orchestrator | Implemented foundation | Planning, dependency ordering, knowledge retrieval, technology assessment, and policy evaluation. |
| Policy Engine | Implemented decision core | Deny-by-default action catalogue and scoped approval verification callback. |
| Executor adapters | Not implemented as an execution system | No runtime action enforcement or agent process control. |
| Pack runtime | Not implemented | Manifest and governance contract only. |
| GitHub App | Source code exists | Not registered or deployed. |

## Problem-solving lifecycle

1. Understand the request and derive constraints and acceptance criteria.
2. Retrieve relevant resources and native knowledge.
3. Gather evidence and apply hard requirements.
4. Compare individual resources and complete approaches.
5. Design a solution and explain trade-offs.
6. Plan tasks and match them to tested agent capabilities.
7. Evaluate each action against the versioned Policy Engine.
8. Obtain scoped human approval where policy requires it.
9. Execute through compatible adapters.
10. Verify outputs independently.
11. Record outcomes and diagnosed failure causes.

Steps 6–10 describe the intended lifecycle. The current orchestrator does not yet complete the full execution path.

## Resource Intelligence

The resource lifecycle is discovery → inspection → evidence → evaluation → comparison → review → approval → monitoring.

The catalog stores metadata and evidence, not copies of every upstream repository. Automated discovery creates candidates only. Popularity, stars, and recency are discovery signals, not quality guarantees.

Apply mandatory constraints before weighted scoring. Keep unknown values unknown. Outcomes may be a single resource, a justified hybrid, a custom approach, neither, or insufficient evidence.

## Native Knowledge Library

The repository contains original study material. It is not merely a directory of external links.

Knowledge items cover algorithms, data structures, mathematical methods, formulas, patterns, protocols, and engineering procedures. Each item has a stable ID, type, path, prerequisites, activation signals, assumptions, limitations, status, and source references.

The current engine performs local deterministic retrieval using task metadata. It returns ranked results with reasons. It does not execute algorithms, understand arbitrary paraphrases, or prove suitability. Draft and review entries are excluded by default.

Do not copy third-party notes, textbooks, or proprietary course material. Write original explanations and cite sources used for verification.

## Agent Orchestration

The target orchestration flow is:

1. Inspect project and task context.
2. Establish requirements and acceptance criteria.
3. Decompose work into dependent tasks.
4. Discover agents and capabilities.
5. Retrieve suitable resources and knowledge.
6. Select compatible agents and tools.
7. Evaluate action policy and approval requirements.
8. Execute through tested adapters.
9. Verify results independently.
10. Report evidence, limitations, and failures.

The current planner supports task planning, dependency ordering, approved-knowledge retrieval, opt-in technology assessment, and policy decisions. It does not launch or control agent harnesses.

## Policy and trust boundaries

The Policy Engine uses a versioned action catalogue. Unknown actions are denied. Approval-controlled actions require a record bound to the exact action, target, policy version, plan ID, and plan digest. A trusted `verifyApproval` callback must validate that record.

The core does not authenticate humans, store approval records, prevent replay, execute actions, or enforce OS-level permissions. Executor adapters must re-check policy immediately before action and apply least-privilege controls. Until those adapters exist, policy results are decisions for integration code, not an execution security boundary.

## Interoperability

Use open interfaces where they fit, including MCP for tool/data connections and A2A for agent-to-agent communication. Keep task and resource contracts independent of these protocols. Provide API, CLI, and file-based access where useful.

## Architecture boundaries

Capabilities do not automatically require separate services or packages. Split them only when independent testing, reuse, deployment, or ownership justifies it.

Use versioned structured records before adopting a graph database. Model relationships explicitly and attach evidence, provenance, confidence, and verification time. Do not treat inferred relationships as verified facts.

## Bootstrap and distribution

A new project receives a small bootstrap payload. It points to this repository and explains how compatible agents find relevant resources and instructions.

A pointer is not automatic integration. The agent must support the local instruction file, have repository or network access, and follow instructions. The GitHub App source code is not deployed and cannot force an arbitrary agent to read remote content.

## Security and verification

Treat catalog metadata, source repositories, remote instructions, and retrieved external content as untrusted. Never execute tools during discovery. Pin versions, use least privilege, isolate execution, and require approval for high-risk actions.

An agent's completion statement is not proof. Use tests, diffs, logs, and task-specific verification evidence.
