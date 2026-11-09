# Architecture

## Goal

Build a central engineering ecosystem with two equal priorities:
- **Resource Intelligence:** discover, evaluate, compare, and maintain useful open-source resources.
- **Agent Orchestration:** plan, route, coordinate, execute, and verify work across compatible agents and tools.

Neither system is required for the other to remain useful.

## Resource Intelligence

The resource lifecycle is discovery → inspection → comparison → review → approval → monitoring.

The catalog stores links and evidence, not copies of every upstream repository. Each resource records its purpose, category, license, capabilities, alternatives, compatibility, maintenance signals, security notes, and evidence.

Automated discovery finds candidates. It does not approve them. Popularity, stars, and recency are signals, not quality guarantees.

When similar resources exist, agents compare them against project requirements. They may choose one, choose another, propose a compatible hybrid, or reject all options. Hybrid recommendations must account for overlap, compatibility, security, license, integration effort, and ongoing maintenance.

## Agent Orchestration

The general orchestration layer plans and coordinates work:
1. Inspect project and task context.
2. Break the goal into tasks.
3. Discover available agents and capabilities.
4. Select relevant catalog resources and tools.
5. Route tasks through supported interfaces.
6. Apply permission and approval rules.
7. Execute through compatible adapters.
8. Verify results with independent evidence.
9. Report results and record failures.

The core must not depend on one model vendor or coding harness. Adapters are optional integrations. Agents must not be advertised as supported until tested.

## Interoperability

Use open interfaces where they fit, including MCP for tool/data connections and A2A for agent-to-agent communication. Keep the core task and resource contracts independent of these protocols. Provide API, CLI, and file-based access so agents without a specific protocol can still use the Devkit.

## Bootstrap and distribution

A new project receives a small bootstrap payload. It points to this repository and explains how compatible agents find relevant resources and instructions.

A pointer is not magic: the agent must support the local instruction file, have repository or network access, and follow instructions. The GitHub App can install files but cannot force an arbitrary agent to read remote content.

## Updates

Scheduled discovery searches GitHub for recent and growing projects. It creates a candidate review proposal. Approved entries are monitored for releases, maintenance changes, security advisories, license changes, and compatibility. Automated updates must pass checks and use pull requests. No automatic installation or unreviewed adoption.

## Security

Treat catalog metadata, source repositories, and remote instructions as untrusted until reviewed. Never execute tools during discovery. Pin versions. Use least privilege. Do not send secrets to external services. Require approval for dependency, permission, and destructive changes.
