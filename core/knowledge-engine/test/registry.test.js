import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { validateKnowledgeRegistry, validateKnowledgeContent } from "../src/index.js";
import { validateApprovalAttestation, validatePullRequestApproval } from "../src/approval.js";
import { validateSchema } from "../src/json-schema.js";
import registry from "../../../knowledge/registry.json" with { type: "json" };
const schema = JSON.parse(readFileSync(new URL("../../../schemas/knowledge-item.schema.json", import.meta.url), "utf8"));

test("registry validates against the repository JSON Schema contract", () => {
  assert.deepEqual(registry.items.flatMap((item, index) => validateSchema(item, schema, `items[${index}]`)), []);
  assert.deepEqual(validateKnowledgeRegistry(registry), { valid: true, item_count: registry.items.length });
});
test("schema validation enforces positive approval IDs", () => {
  const invalid = {
    id:"approved.example",title:"Approved example",kind:"algorithm",path:"knowledge/example.md",version:"1.0.0",status:"approved",
    domains:["algorithms"],tags:["example"],prerequisites:[],related:[],limitations:[],activation:{any_tags:["example"],any_phrases:[]},
    review:{approved_by:"reviewer",approved_at:"2026-11-10T00:00:00Z",reviewed_version:"1.0.0",content_sha256:"a".repeat(64),approval_pr:0,approval_review_id:2,approval_commit:"b".repeat(40),sources:[{title:"Ref",url:"https://example.com",purpose:"test"}]}
  };
  assert.ok(validateSchema(invalid, schema).some((error) => error.includes("below minimum")));
});
test("schema validation rejects malformed records", () => {
  const invalid = structuredClone(registry.items);
  invalid[0].status = "trusted";
  assert.ok(validateSchema(invalid[0], schema).some((error) => error.includes("enum")));
});
test("registry IDs are unique and every item points to a native file", () => {
  for (const item of registry.items) {
    const content = readFileSync(new URL("../../../" + item.path, import.meta.url), "utf8");
    assert.ok(content.includes(item.id), "item ID missing from content: " + item.id);
    assert.ok(Array.isArray(item.activation.any_tags));
    assert.ok(Array.isArray(item.activation.any_phrases));
  }
});
test("mathematics entries retain display-math delimiters", () => {
  const entries = registry.items.filter((item) => item.kind === "mathematical_method" || item.kind === "formula");
  assert.ok(entries.length > 0);
  for (const item of entries) {
    const content = readFileSync(new URL("../../../" + item.path, import.meta.url), "utf8");
    assert.match(content, /\\\[/);
    assert.match(content, /\\\]/);
    assert.doesNotMatch(content, /[\u0000-\u0008\u000B\u000C\u000E-\u001F]/);
  }
});
test("approval digest is bound to exact UTF-8 content bytes", () => {
  const content = "# Reviewed knowledge\n";
  const digest = createHash("sha256").update(content, "utf8").digest("hex");
  const item = {
    id:"approved.example",title:"Approved example",kind:"algorithm",path:"knowledge/example.md",version:"1.0.0",status:"approved",
    domains:["algorithms"],tags:["example"],prerequisites:[],related:[],limitations:[],
    activation:{any_tags:["example"],any_phrases:[]},
    review:{approved_by:"reviewer",approved_at:"2026-11-10T00:00:00Z",reviewed_version:"1.0.0",content_sha256:digest,approval_pr:1,approval_review_id:2,approval_commit:"a".repeat(40),
      sources:[{title:"Reference",url:"https://example.com/reference",purpose:"Verification"}]}
  };
  assert.equal(validateKnowledgeContent({items:[item]},()=>content).verified_count,1);
  assert.throws(()=>validateKnowledgeContent({items:[item]},()=>content+"changed"),/digest mismatch/);
  assert.throws(()=>validateKnowledgeRegistry({items:[{...item,review:{...item.review,content_sha256:undefined}}]}),/needs reviewer/);
});

test("approval attestation requires a merged PR, trusted reviewer, exact commit, and both changed files", () => {
  const item = { path: "knowledge/example.md", review: {
    approved_by: "trusted-reviewer", approved_at: "2026-11-10T00:04:00Z", approval_pr: 42, approval_review_id: 9001, approval_commit: "a".repeat(40)
  }};
  const pullRequest = {
    number: 42, state: "closed", merged: true, merged_at: "2026-11-10T00:05:00Z",
    base: { ref: "main" }, head: { sha: "a".repeat(40), repo: { full_name: "owner/repo" } },
    user: { login: "contributor" }
  };
  const review = {
    id: 9001, state: "APPROVED", commit_id: "a".repeat(40), submitted_at: "2026-11-10T00:04:00Z",
    author_association: "COLLABORATOR", user: { login: "trusted-reviewer" }
  };
  const valid = validateApprovalAttestation(item, {
    pullRequest, review, changedFiles: ["knowledge/registry.json", item.path], repository: "owner/repo"
  });
  assert.deepEqual(valid, { valid: true, errors: [] });
  assert.ok(validateApprovalAttestation(item, {
    pullRequest: { ...pullRequest, head: { ...pullRequest.head, sha: "b".repeat(40) } },
    review, changedFiles: ["knowledge/registry.json", item.path], repository: "owner/repo"
  }).errors.some((error) => error.includes("final pull request head")));
  assert.ok(validateApprovalAttestation(item, {
    pullRequest: { ...pullRequest, user: { login: "trusted-reviewer" } },
    review, changedFiles: ["knowledge/registry.json", item.path], repository: "owner/repo"
  }).errors.some((error) => error.includes("cannot approve their own")));
  assert.ok(validateApprovalAttestation(item, {
    pullRequest, review: { ...review, state: "DISMISSED" },
    changedFiles: ["knowledge/registry.json", item.path], repository: "owner/repo"
  }).errors.some((error) => error.includes("not currently approved")));
  assert.ok(validateApprovalAttestation(item, {
    pullRequest, review, changedFiles: [item.path], repository: "owner/repo"
  }).errors.some((error) => error.includes("did not change the knowledge registry")));
  assert.ok(validateApprovalAttestation({ ...item, review: { ...item.review, approved_at: "2026-11-10T00:03:00Z" } }, {
    pullRequest, review, changedFiles: ["knowledge/registry.json", item.path], repository: "owner/repo"
  }).errors.some((error) => error.includes("approved_at must match")));
});

test("approval metadata PR itself needs an independent review on its final head", () => {
  const pullRequest = {
    number: 43, state: "open", merged: false, base: { ref: "main" },
    head: { sha: "c".repeat(40), repo: { full_name: "owner/repo" } },
    user: { login: "contributor" }
  };
  const review = {
    id: 9002, state: "APPROVED", commit_id: "c".repeat(40),
    submitted_at: "2026-11-10T00:04:00Z", author_association: "OWNER",
    user: { login: "maintainer" }
  };
  assert.equal(validatePullRequestApproval(pullRequest, [review], "owner/repo").valid, true);
  assert.equal(validatePullRequestApproval(pullRequest, [{ ...review, commit_id: "d".repeat(40) }], "owner/repo").valid, false);
  assert.equal(validatePullRequestApproval(pullRequest, [{ ...review, user: { login: "contributor" } }], "owner/repo").valid, false);
  assert.equal(validatePullRequestApproval(pullRequest, [review, { ...review, id: 9003, state: "CHANGES_REQUESTED" }], "owner/repo").valid, false);
  assert.equal(validatePullRequestApproval({ ...pullRequest, head: { ...pullRequest.head, sha: undefined } }, [review], "owner/repo").valid, false);
});
