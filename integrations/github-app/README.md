# GitHub Bootstrap App

This Probot app listens for newly created repositories and copies the small bootstrap payload from this Devkit into the new repository.

## Current behavior

- Handles the `repository.created` webhook event.
- Skips archived repositories or repositories without a default branch.
- Supports opt-out with `.agent-universal-devkit/opt-out`.
- Copies only files in `BOOTSTRAP_FILES`.
- Never overwrites an existing target file.
- Logs which files were added or skipped.

## Required GitHub App setup

Create a GitHub App and install it on the account that owns the Devkit and the repositories to bootstrap.

Subscribe to the **Repository** event and enable the `created` action.

Required repository permissions:
- **Metadata: Read-only**
- **Contents: Read and write**

The installation must have access to both:
1. `Agent-Universal-Devkit` (to read the bootstrap templates; the repository is public, but the App installation still needs the target-repository write permission).
2. New repositories that should receive the bootstrap (to write files).

For automatic coverage, install the App for **all repositories**. If it is installed only on selected repositories, it cannot bootstrap repositories outside that selection.

## Run locally

Requires Node.js 20 or newer.

1. Install dependencies with `npm install`.
2. Configure Probot's required App ID, private key, and webhook secret.
3. Set optional `DEVKIT_OWNER`, `DEVKIT_REPO`, and `DEVKIT_REF` values if they differ from the defaults.
4. Run `npm start`.

Do not commit App credentials or private keys.

## Important limitations

- This code is not deployed. It will not receive webhooks until the GitHub App is created, installed, and connected to a running host.
- The App does not force an AI agent to read the Devkit. It installs entry-point files that supported agents can discover.
- Existing instruction files are never overwritten. A later conflict workflow should open an issue or provide a safe merge suggestion.
- The source Devkit is public. Agents can read its public files without private-repository access. The bootstrap keeps basic instructions locally so work can continue if remote access is unavailable.
- GitHub App permissions and installation scope must be configured by the repository owner.
