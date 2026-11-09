import registry from "../../../knowledge/registry.json" with { type: "json" };
import { validateApprovalAttestation } from "../src/approval.js";

const token = process.env.GITHUB_TOKEN;
const repository = process.env.GITHUB_REPOSITORY;
if (!token || !repository) throw new Error("GITHUB_TOKEN and GITHUB_REPOSITORY are required");

async function github(path) {
  const response = await fetch("https://api.github.com/repos/" + repository + path, {
    headers: { Authorization: "Bearer " + token, Accept: "application/vnd.github+json", "X-GitHub-Api-Version": "2022-11-28" }
  });
  if (!response.ok) throw new Error("GitHub API request failed (" + response.status + ") for " + path + ": " + (await response.text()).slice(0, 500));
  return response.json();
}
async function listChangedFiles(prNumber) {
  const files = [];
  for (let page = 1; page <= 10; page += 1) {
    const batch = await github("/pulls/" + prNumber + "/files?per_page=100&page=" + page);
    files.push(...batch.map((file) => file.filename));
    if (batch.length < 100) return files;
  }
  throw new Error("Approval PR changes more than 1,000 files; refusing incomplete verification");
}
const approved = registry.items.filter((item) => item.status === "approved");
if (approved.length === 0) {
  console.log("No approved knowledge entries. No GitHub approval attestations to verify.");
  process.exit(0);
}
const cache = new Map();
async function getApproval(prNumber, reviewId) {
  const key = prNumber + ":" + reviewId;
  if (!cache.has(key)) cache.set(key, (async () => {
    const [pullRequest, review, changedFiles] = await Promise.all([
      github("/pulls/" + prNumber), github("/pulls/" + prNumber + "/reviews/" + reviewId), listChangedFiles(prNumber)
    ]);
    return { pullRequest, review, changedFiles };
  })());
  return cache.get(key);
}
const failures = [];
for (const item of approved) {
  const record = item.review ?? {};
  try {
    const evidence = await getApproval(record.approval_pr, record.approval_review_id);
    const result = validateApprovalAttestation(item, { ...evidence, repository });
    if (!result.valid) failures.push(item.id + ": " + result.errors.join("; "));
    else console.log("Verified GitHub approval for " + item.id + " by @" + record.approved_by);
  } catch (error) {
    failures.push(item.id + ": " + error.message);
  }
}
if (failures.length) {
  console.error("Knowledge approval verification failed:");
  for (const failure of failures) console.error("- " + failure);
  process.exit(1);
}
console.log("Verified " + approved.length + " GitHub-backed knowledge approval(s).");
