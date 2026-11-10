# GitHub Bootstrap App

This Probot app listens for newly created repositories and copies the small, local bootstrap payload from this Devkit into the new repository.

## Current behavior

- Handles the `repository.created` webhook event.
- Skips archived repositories or repositories without a default branch.
- Supports opt-out with `.agent-universal-devkit/opt-out`.
- Installs shared agent entry points, project rubrics, repository organisation guidance, project-state and work-log templates, and the local read-only hygiene checker.
- Never overwrites an existing target file. It logs which files it added or skipped.
- Uses a small, explicit allow-list. It does not copy the full Devkit repository.

The bootstrap records a starting point. It cannot force an agent to read files, keep project facts correct, or update external state. Connected agents must follow the local instructions and maintain the continuity records.

## Required GitHub App setup

Create a GitHub App and install it on the account that owns the repositories to bootstrap.

Subscribe to the **Repository** event and enable the `created` action.

Required repository permissions:
- **Metadata: Read-only**
- **Contents: Read and write**

The installation must have access to each target repository that should receive bootstrap files. The Devkit source repository is public, so its templates can be read without granting the App installation access to the source repository.

For automatic coverage, install the App for **all repositories**. If it is installed only on selected repositories, it cannot bootstrap repositories outside that selection.

## Run locally

Requires Node.js 20 or newer.

```bash
npm install
npm test
npm start
```

Configure Probot's required App ID, private key, and webhook secret. Set optional `DEVKIT_OWNER`, `DEVKIT_REPO`, and `DEVKIT_REF` values if they differ from the defaults.

Do not commit App credentials or private keys.

## Important limitations

- This code is not deployed. It will not receive webhooks until the GitHub App is created, installed, and connected to a running host.
- It only handles newly created repositories. It does not update existing repositories or refresh older bootstrap files.
- Existing target files are never overwritten. This protects project-specific instructions but means future template updates need a separate, reviewed update workflow.
- The App does not force an AI agent to read the Devkit. It installs entry-point files that supported agents can discover.
- GitHub App permissions and installation scope must be configured by the repository owner.
