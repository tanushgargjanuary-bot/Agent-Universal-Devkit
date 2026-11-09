const SHA = /^[a-f0-9]{40}$/i;

export function validateApprovalAttestation(item, { pullRequest, review, changedFiles, repository }) {
  const errors = [];
  const record = item?.review;
  if (!record || !Number.isSafeInteger(record.approval_pr) || record.approval_pr < 1) errors.push("approval_pr must be a positive integer");
  if (!record || !Number.isSafeInteger(record.approval_review_id) || record.approval_review_id < 1) errors.push("approval_review_id must be a positive integer");
  if (!record || typeof record.approval_commit !== "string" || !SHA.test(record.approval_commit)) errors.push("approval_commit must be a full Git commit SHA");
  if (errors.length) return { valid: false, errors };

  if (!pullRequest || pullRequest.number !== record.approval_pr) errors.push("Approval pull request number does not match");
  if (pullRequest?.state !== "closed" || pullRequest?.merged !== true) errors.push("Approval pull request must be merged");
  if (pullRequest?.base?.ref !== "main") errors.push("Approval pull request must target main");
  if (pullRequest?.head?.sha?.toLowerCase() !== record.approval_commit.toLowerCase()) errors.push("Approval commit is not the final pull request head");
  if (repository && pullRequest?.head?.repo?.full_name !== repository) errors.push("Approval pull request head repository does not match");
  const author = pullRequest?.user?.login?.toLowerCase();
  const reviewer = record.approved_by?.toLowerCase();
  if (!author || !reviewer || author === reviewer) errors.push("The pull request author cannot approve their own knowledge change");
  if (review?.id !== record.approval_review_id) errors.push("GitHub review ID does not match the recorded approval");
  if (review?.state !== "APPROVED") errors.push("Recorded GitHub review is not currently approved");
  if (review?.user?.login?.toLowerCase() !== reviewer) errors.push("GitHub reviewer identity does not match approved_by");
  if (review?.commit_id?.toLowerCase() !== record.approval_commit.toLowerCase()) errors.push("GitHub review is not anchored to the approved commit");
  if (!["OWNER", "MEMBER", "COLLABORATOR"].includes(review?.author_association)) errors.push("Reviewer is not a repository owner, member, or collaborator");
  if (Date.parse(record.approved_at) !== Date.parse(review?.submitted_at ?? "")) errors.push("approved_at must match the GitHub review submission timestamp");
  if (!review?.submitted_at || !pullRequest?.merged_at || Date.parse(review.submitted_at) > Date.parse(pullRequest.merged_at)) {
    errors.push("Approval must be submitted before the pull request is merged");
  }
  const files = new Set(changedFiles ?? []);
  if (!files.has("knowledge/registry.json")) errors.push("Approval pull request did not change the knowledge registry");
  if (!files.has(item.path)) errors.push("Approval pull request did not change the approved knowledge content");
  return { valid: errors.length === 0, errors };
}
