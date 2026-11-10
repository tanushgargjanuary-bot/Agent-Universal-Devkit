const DEVKIT_OWNER = process.env.DEVKIT_OWNER || "tanushgargjanuary-bot";
const DEVKIT_REPO = process.env.DEVKIT_REPO || "Agent-Universal-Devkit";
const DEVKIT_REF = process.env.DEVKIT_REF || "main";

export const BOOTSTRAP_FILES = [
  "bootstrap/template/AGENTS.md",
  "bootstrap/template/.agent-universal-devkit/config.yaml",
  "bootstrap/template/CLAUDE.md",
  "bootstrap/template/GEMINI.md",
  "bootstrap/template/.github/copilot-instructions.md",
  "bootstrap/template/PROJECT-RUBRICS.md",
  "bootstrap/template/REPOSITORY-ORGANISATION.md",
  "bootstrap/template/docs/README-DEMO-STANDARD.md",
  "bootstrap/template/docs/PROJECT-STATE.md",
  "bootstrap/template/docs/WORKLOG.md",
  "bootstrap/template/.devkit/governance.json",
  "bootstrap/template/.devkit/scripts/repository-hygiene/check.mjs"
];

async function getFile(octokit, owner, repo, path, ref) {
  try {
    const response = await octokit.repos.getContent({
      owner,
      repo,
      path,
      ...(ref ? { ref } : {})
    });

    if (Array.isArray(response.data) || !response.data.content) {
      throw new Error(`Expected a text file at ${owner}/${repo}/${path}`);
    }

    return {
      sha: response.data.sha,
      content: Buffer.from(response.data.content, "base64").toString("utf8")
    };
  } catch (error) {
    if (error.status === 404) return null;
    throw error;
  }
}

export async function installBootstrap(context) {
  const repository = context.payload.repository;
  const owner = repository.owner.login;
  const repo = repository.name;
  const branch = repository.default_branch;

  if (!branch || repository.archived || repository.disabled) {
    context.log.info({ repo: repository.full_name }, "Skipping repository without an active default branch");
    return;
  }

  const optOut = await getFile(context.octokit, owner, repo, ".agent-universal-devkit/opt-out");
  if (optOut) {
    context.log.info({ repo: repository.full_name }, "Devkit bootstrap opted out");
    return;
  }

  let created = 0;
  let skipped = 0;

  for (const sourcePath of BOOTSTRAP_FILES) {
    const targetPath = sourcePath.replace("bootstrap/template/", "");
    const existing = await getFile(context.octokit, owner, repo, targetPath, branch);

    // Never overwrite project-owned instructions or configuration.
    if (existing) {
      skipped += 1;
      context.log.info({ repo: repository.full_name, targetPath }, "Keeping existing file");
      continue;
    }

    // The GitHub App installation must have access to this private source repository.
    const source = await getFile(
      context.octokit,
      DEVKIT_OWNER,
      DEVKIT_REPO,
      sourcePath,
      DEVKIT_REF
    );

    if (!source) {
      throw new Error(`Devkit template file not found: ${sourcePath}`);
    }

    await context.octokit.repos.createOrUpdateFileContents({
      owner,
      repo,
      path: targetPath,
      message: "chore(devkit): add Agent-Universal-Devkit bootstrap",
      content: Buffer.from(source.content, "utf8").toString("base64"),
      branch
    });

    created += 1;
  }

  context.log.info(
    { repo: repository.full_name, created, skipped },
    "Agent-Universal-Devkit bootstrap finished"
  );
}

export default (app) => {
  app.on("repository.created", async (context) => {
    try {
      await installBootstrap(context);
    } catch (error) {
      context.log.error(
        { error, repo: context.payload.repository?.full_name },
        "Agent-Universal-Devkit bootstrap failed"
      );
      throw error;
    }
  });
};
