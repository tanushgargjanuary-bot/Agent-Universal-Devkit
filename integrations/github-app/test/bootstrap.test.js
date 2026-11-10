import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { BOOTSTRAP_FILES, installBootstrap } from "../src/index.js";

const DEVKIT_OWNER = process.env.DEVKIT_OWNER || "tanushgargjanuary-bot";
const DEVKIT_REPO = process.env.DEVKIT_REPO || "Agent-Universal-Devkit";
const DEVKIT_REF = process.env.DEVKIT_REF || "main";

function makeContext({ existing = {}, source = Object.fromEntries(BOOTSTRAP_FILES.map((p) => [p, "template:" + p])), repository = {} } = {}) {
  const writes = [];
  const logs = [];
  const target = {
    owner: repository.owner?.login ?? "example-org",
    repo: repository.name ?? "example-project"
  };
  const repo = {
    owner: { login: target.owner },
    name: target.repo,
    default_branch: "main",
    archived: false,
    disabled: false,
    ...repository
  };
  const context = {
    payload: { repository: repo },
    octokit: {
      repos: {
        async getContent(args) {
          if (args.owner === DEVKIT_OWNER && args.repo === DEVKIT_REPO) {
            assert.equal(args.ref, DEVKIT_REF);
            if (!(args.path in source)) throw Object.assign(new Error("Not found"), { status: 404 });
            return { data: { sha: "source-sha", content: Buffer.from(source[args.path]).toString("base64") } };
          }
          if (args.path in existing) {
            return { data: { sha: "target-sha", content: Buffer.from(existing[args.path]).toString("base64") } };
          }
          throw Object.assign(new Error("Not found"), { status: 404 });
        },
        async createOrUpdateFileContents(args) {
          writes.push(args);
          return { data: { commit: { sha: "commit-sha" } } };
        }
      }
    },
    log: {
      info(...args) { logs.push(args); },
      error(...args) { logs.push(args); }
    }
  };
  return { context, writes, logs };
}

test("bootstrap allow-list includes all continuity and local checker files", () => {
  assert.equal(new Set(BOOTSTRAP_FILES).size, BOOTSTRAP_FILES.length);
  assert.ok(BOOTSTRAP_FILES.includes("bootstrap/template/AGENTS.md"));
  assert.ok(BOOTSTRAP_FILES.includes("bootstrap/template/CLAUDE.md"));
  assert.ok(BOOTSTRAP_FILES.includes("bootstrap/template/GEMINI.md"));
  assert.ok(BOOTSTRAP_FILES.includes("bootstrap/template/.github/copilot-instructions.md"));
  assert.ok(BOOTSTRAP_FILES.includes("bootstrap/template/docs/README-DEMO-STANDARD.md"));
  assert.ok(BOOTSTRAP_FILES.includes("bootstrap/template/docs/PROJECT-STATE.md"));
  assert.ok(BOOTSTRAP_FILES.includes("bootstrap/template/docs/WORKLOG.md"));
  assert.ok(BOOTSTRAP_FILES.includes("bootstrap/template/.devkit/scripts/repository-hygiene/check.mjs"));
  assert.ok(BOOTSTRAP_FILES.includes("bootstrap/template/.devkit/governance.json"));
});

test("installs every allow-listed file into a new repository", async () => {
  const { context, writes } = makeContext();
  await installBootstrap(context);
  assert.equal(writes.length, BOOTSTRAP_FILES.length);
  assert.deepEqual(writes.map((item) => item.path), BOOTSTRAP_FILES.map((p) => p.replace("bootstrap/template/", "")));
  assert.ok(writes.every((item) => item.branch === "main"));
});

test("preserves existing project-owned files and adds only missing files", async () => {
  const existing = { "AGENTS.md": "# Project-owned instructions" };
  const { context, writes } = makeContext({ existing });
  await installBootstrap(context);
  assert.equal(writes.length, BOOTSTRAP_FILES.length - 1);
  assert.equal(writes.some((item) => item.path === "AGENTS.md"), false);
});

test("respects repository opt-out", async () => {
  const { context, writes } = makeContext({ existing: { ".agent-universal-devkit/opt-out": "yes" } });
  await installBootstrap(context);
  assert.equal(writes.length, 0);
});

test("skips archived repositories", async () => {
  const { context, writes } = makeContext({ repository: { archived: true } });
  await installBootstrap(context);
  assert.equal(writes.length, 0);
});

test("fails closed when a required upstream template is missing", async () => {
  const source = Object.fromEntries(BOOTSTRAP_FILES.map((p) => [p, "template:" + p]));
  delete source["bootstrap/template/docs/PROJECT-STATE.md"];
  const { context, writes } = makeContext({ source });
  await assert.rejects(() => installBootstrap(context), /template file not found/);
  assert.equal(writes.length, BOOTSTRAP_FILES.indexOf("bootstrap/template/docs/PROJECT-STATE.md"));
});


test("new repositories receive the strict README demonstration standard", async () => {
  const root = new URL("../../../", import.meta.url);
  const [rootInstructions, templateInstructions, copilotInstructions, localStandard] = await Promise.all([
    readFile(new URL("AGENTS.md", root), "utf8"),
    readFile(new URL("bootstrap/template/AGENTS.md", root), "utf8"),
    readFile(new URL("bootstrap/template/.github/copilot-instructions.md", root), "utf8"),
    readFile(new URL("bootstrap/template/docs/README-DEMO-STANDARD.md", root), "utf8")
  ]);

  for (const content of [rootInstructions, templateInstructions, copilotInstructions, localStandard]) {
    assert.match(content, /highest-quality suitable animated GIF/i);
    assert.match(content, /runnable alternative/i);
  }
  for (const content of [rootInstructions, templateInstructions, copilotInstructions]) {
    assert.match(content, /real, running project/i);
  }
  assert.match(localStandard, /actual working project/i);
  assert.equal(localStandard.includes("example.com"), false);
  assert.match(templateInstructions, /Do not leave placeholder assets or links/i);
});
