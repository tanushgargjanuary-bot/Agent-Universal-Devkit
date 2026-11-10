# GitHub integration

Planned GitHub App and workflow integration.

Expected behavior:
1. Receive repository-created events for installations with access.
2. Confirm repository scope and state.
3. Check whether bootstrap files already exist.
4. Add missing files without overwriting user changes.
5. Record Devkit version and installation status.
6. Support opt-out and safe repair.

Security:
- Request only permissions needed for metadata and bootstrap writes.
- Verify webhook signatures.
- Make event handling idempotent.
- Never store long-lived user tokens in repository files.
- Do not overwrite existing instruction files silently.
