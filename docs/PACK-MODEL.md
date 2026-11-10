# Domain and Integration Pack Model

## Purpose

Packs extend the Devkit without expanding its universal core. A pack is a versioned, optional unit of capability with explicit compatibility, permissions, dependencies, evidence, and removal behaviour.

**Current status:** the repository defines a manifest schema and governance model. It does not yet provide a package installer, runtime loader, dependency resolver, or activation manager.

## Pack types

### Domain pack

Adds specialist capability for a problem area. It may contain knowledge, methods, skills, task workflows, tool recommendations, schemas, templates, reference implementations, evaluation profiles, verification tests, and benchmark cases.

Examples: software engineering, cybersecurity, AI/ML, robotics, and game development.

### Integration pack

Connects an external system through a tested adapter. It may contain provider or harness adapters, authentication and permission declarations, input/output mapping, compatibility tests, health checks, and setup/update/removal instructions.

Examples: model providers, agent harnesses, MCP servers, source control, and CI.

### Interface pack

Adds a user-facing interaction surface while using the same core contracts. Interface packs must not fork the task lifecycle or policy model.

## Manifest

A pack manifest uses the pack schema. It declares a stable ID, version, type, owner, purpose, capabilities, entry points, dependencies, compatibility, permissions, data access, network requirements, lifecycle operations, evidence, tests, support status, and known limitations.

Use semantic versioning or document the version policy. Breaking contract changes require a major version or an explicit migration path.

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

Declare dependencies, reject cycles, resolve version constraints before activation, detect conflicting capabilities and permissions, and require explicit precedence when multiple packs provide the same capability.

Keep the core usable when optional packs are absent or fail.

## Intended user flow

1. The user states a goal.
2. The Devkit identifies required capabilities.
3. It recommends the smallest suitable set of packs.
4. It explains permissions, cost, and trade-offs.
5. It requests approval when policy requires it.
6. A future pack runtime checks compatibility and activates selected packs.
7. The system verifies the task and records outcomes.

## Completion criteria for a pack runtime

Do not mark the runtime complete until installation, dependency resolution, compatibility checks, permission review, activation, disable, update, rollback, and safe removal have automated tests and documented recovery behaviour.
