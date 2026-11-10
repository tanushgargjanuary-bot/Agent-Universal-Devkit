# Domain and Integration Pack Model

## Purpose

Packs extend the Devkit without expanding its universal core. A pack is a
versioned, optional unit of capability with explicit compatibility,
permissions, dependencies, evidence, and removal behavior.

The first implementation is a manifest contract and governance model. It is
not yet a package installer or runtime loader.

## Pack types

### Domain pack

Adds specialist capability for a problem area. It may contain knowledge and
methods, skills and task workflows, tool/resource recommendations, schemas,
templates, reference implementations, evaluation profiles, verification
tests, and benchmark cases.

Examples include software engineering, cybersecurity, AI/ML, robotics, and game
development.

### Integration pack

Connects an external system through a tested adapter. It may contain a provider
or harness adapter, authentication and permission declarations, input/output
mapping, compatibility tests, operational health checks, and setup/update/
removal instructions.

Examples include model providers, agent harnesses, MCP servers, source control,
and CI.

### Interface pack

Adds a user-facing interaction surface while using the same core contracts.
Examples may include a desktop client or specialised web console. Interface
packs must not fork the task lifecycle or policy model.

## Manifest

A pack manifest uses the pack schema. It declares a stable ID, version, type,
owner, purpose, supported capabilities, entry points, dependencies,
compatibility constraints, permissions, data access, network requirements,
lifecycle operations, evidence, tests, support status, and known limitations.

A pack must use semantic versioning or document its version policy. Breaking
contract changes require a major version or an explicit migration path.

## Safety and trust

- Discovery does not install a pack.
- A manifest is data, not executable authority.
- Review source code and transitive dependencies before installation.
- Require least privilege and explicit network/data access.
- Run untrusted code in an isolated environment.
- Do not allow a pack to widen global permissions silently.
- Disable or remove a pack without damaging the core or unrelated packs.
- Pin versions for reproducible use.
- Record source, version, digest, reviewer, and approval evidence.

## Dependency and compatibility rules

- Declare dependencies explicitly.
- Reject dependency cycles.
- Resolve version constraints before activation.
- Detect conflicting capabilities and permissions.
- Permit alternatives to coexist; do not force one global winner.
- Require explicit precedence when two packs provide the same capability.
- Keep the core usable when optional packs are absent or fail.

## User experience

1. The user states a goal.
2. The Devkit identifies required capabilities.
3. It recommends the smallest suitable set of packs.
4. It explains permissions, cost, and trade-offs.
5. It asks for approval only when required.
6. It checks compatibility and activates selected packs.
7. It verifies the task and records outcomes.

Advanced users can select versions and configure dependencies directly.
The default user should not need to understand the full architecture.

## Current status

The manifest schema and governance rules define the target contract. Runtime
discovery, installation, dependency resolution, activation, rollback, and safe
removal are future work. Do not describe packs as installable until those
operations are implemented and tested.
