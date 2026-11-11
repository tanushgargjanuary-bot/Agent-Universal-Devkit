# Host Trust Integration Contract

## Purpose

This document defines the provider-neutral boundary between DEVKIT's policy and approval core and the host that authenticates people, protects signing keys, stores audit evidence, and isolates execution.

It is a contract and implementation plan. It is **not** a claim that these controls are implemented. The in-process Execution Gate remains non-production and must not be used as a security sandbox.

## Design rules

1. The universal core defines interfaces and validates records. The host supplies deployment-specific providers.
2. Unknown, malformed, expired, revoked, or unverifiable state fails closed.
3. The core never accepts a caller-provided identity object as proof of identity.
4. Private keys do not enter SQLite, logs, source control, workflow artifacts, or adapter environment variables.
5. An audit event must be durably acknowledged before a side effect starts.
6. Adapter code runs outside the orchestrator process with explicit least privilege.
7. Every external claim has provenance, a timestamp, and a defined trust level.
8. No production adapter is enabled until isolation and bypass resistance receive independent review.

## Contract A: Approver identity

A host identity provider must resolve an authenticated credential into a stable decision:

- `issuer`: the trusted identity provider.
- `subject`: stable user or service identity.
- `audience`: the DEVKIT deployment for which the credential was issued.
- `roles`: explicit role identifiers.
- `authenticated_at`: UTC timestamp.
- `expires_at`: UTC timestamp.
- `authn_context`: authentication strength or method.
- `decision_id`: unique correlation ID.

The provider must validate signature, issuer, audience, expiry, not-before, revocation, and required authentication strength. Role checks must be explicit. A valid identity does not automatically have approval permission.

The core must reject missing values, expired credentials, wrong audience, unknown issuer, missing approval role, and duplicate/replayed decisions. Do not store bearer credentials in approval records or audit events.

## Contract B: Signing-key provider

The host key provider must expose operations, not private key bytes:

- `sign(payload, purpose) -> { key_id, algorithm, signature }`
- `verify(payload, signature, key_id, algorithm, purpose) -> boolean`
- `getKeyStatus(key_id) -> active | retiring | revoked | unknown`

Required behaviour:

- Use an explicit algorithm allowlist. The current local implementation uses Ed25519.
- Bind signatures to a domain-separation purpose and schema version.
- Reject unknown, retired, or revoked key IDs according to a documented verification window.
- Support rotation with an overlap period, revocation, backup/restore, and compromise response.
- Never silently generate a replacement key when the configured provider is missing.
- Keep private key material in a KMS/HSM or equivalent protected host service.
- Record key ID, algorithm, and signature metadata; never record private key material.

The host must test restart, restore, rotation, concurrent signing, provider outage, and revoked-key cases.

## Contract C: Durable audit sink

Audit events must be versioned and schema-validated. Minimum fields:

- `event_id`, `schema_version`, `event_type`.
- `occurred_at`, `recorded_at`, `execution_id`.
- `plan_id`, `plan_digest`, `policy_version`.
- `actor_issuer`, `actor_subject`, and `decision_id` when relevant.
- `action`, `target`, `adapter_id`, `adapter_version`.
- `outcome`, `error_code`, and `previous_event_hash` where applicable.

The sink must provide an append operation that returns a durable acknowledgement and a stable event ID. The host must document retention, access control, encryption, integrity protection, export, backup, restore, and deletion rules.

Execution ordering:

1. Append and acknowledge `action_started`.
2. Invoke the isolated adapter.
3. Append and acknowledge `action_completed` or `action_failed`.
4. If the completion event cannot be recorded, return an explicit uncertain/partial state. Never silently retry the side effect.

A callback that returns successfully is not proof of durability. The host implementation must define what acknowledgement means and test it against process crash and storage failure.

## Contract D: Isolated executor

Adapters must not run in the orchestrator process for production use. A host executor must create an isolated process or stronger boundary with:

- A dedicated unprivileged identity.
- Read-only input mounts and an explicit writable output area.
- Filesystem allowlists and path traversal protection.
- Network disabled by default; explicit destination allowlists when required.
- Environment-variable allowlists. Never forward the host environment wholesale.
- Short-lived, scoped secret injection only when policy explicitly allows it.
- CPU, memory, process, disk, output, and wall-clock limits.
- Cancellation, timeout, termination, and cleanup semantics.
- Captured stdout/stderr with size limits and secret redaction.
- A structured result with exit status, bounded output references, and execution evidence.

The host must prevent direct adapter invocation by untrusted callers. The in-process `ExecutionGate.registerAdapter()` API is not a privilege boundary.

## Failure and recovery model

- Identity provider unavailable: no approval.
- Key provider unavailable or key revoked: no approval.
- Audit append fails before execution: do not execute.
- Executor cannot be created: do not execute.
- Executor crashes after a side effect may have started: mark outcome `unknown`; do not retry automatically.
- Completion audit fails after execution: mark outcome `executed_unconfirmed`; require reconciliation before retry.
- Approval revoked before consumption: deny.
- Approval consumed by another concurrent execution: deny.
- Cancellation before adapter start: mark cancelled.
- Cancellation during adapter execution: terminate within the configured grace period; report whether side effects may have occurred.

## Required adversarial tests

- Expired, malformed, replayed, wrong-audience, wrong-issuer, and insufficient-role credentials.
- Key rotation, key revocation, unknown key ID, signature tampering, and provider outage.
- Concurrent approval revocation, concurrent approval consumption, and duplicate execution attempts.
- Audit outage before start, process crash after start, and audit outage after adapter completion.
- Adapter attempts to read undeclared files, inspect host environment, access network, spawn excess processes, exceed quotas, or escape its working directory.
- Cancellation, timeout, process kill, output truncation, redaction, and partial execution.
- Recovery from host restart and audit/approval database restore.

## Acceptance gate

A production adapter may be enabled only when:

1. Identity, key, audit, and executor contracts have versioned schemas.
2. The deployment supplies real providers and documents their trust assumptions.
3. All required adversarial tests pass in the deployment environment.
4. No test can invoke an adapter without the policy/approval gate.
5. Audit acknowledgement and uncertain-outcome recovery are demonstrated.
6. An independent security review approves the deployment boundary.
7. Project state, work log, README, architecture, and roadmap reflect the exact tested scope.

## Out of scope

This contract does not choose an identity provider, KMS, database, container runtime, or cloud. It does not supply those services. It does not enable unrestricted autonomous execution.