import test from "node:test";
import assert from "node:assert/strict";
import { assertValidRecord, createRecord, getRecordSchema, listRecordTypes, validateRecord } from "../src/index.js";

const timestamp = "2026-11-10T12:00:00Z";
const raw = (type, fields) => ({ ...fields, record_type: type, schema_version: "1.0.0" });
const records = {
  problem: { id: "problem-001", goal: "Find intermittent service errors", created_at: timestamp, priority: "high", constraints: ["Read-only inspection"], domain_hints: ["software", "reliability"] },
  evidence: { id: "evidence-001", observed_at: timestamp, evidence_type: "test_result", claim: "Integration test timed out", confidence: 1, source: { kind: "test", reference: "tests/service.test.js", tool: "node:test", tool_version: "22" } },
  finding: { id: "finding-001", title: "Integration test timeout", description: "A reproducible timeout occurs.", severity: "medium", confidence: 0.95, status: "verified", evidence_ids: ["evidence-001"], affected_paths: ["tests/service.test.js"] },
  capability: { id: "capability.repo-scan", name: "Repository Scan", version: "0.1.0", description: "Inspect repository metadata and report findings.", domains: ["software"], problem_types: ["repository_assessment"], input_types: ["repository_ref"], output_types: ["finding"], permissions: ["repository.read"], execution_modes: ["read_only"], verification_methods: ["fixture_tests"], status: "experimental" },
  plan: { id: "plan-001", problem_id: "problem-001", created_at: timestamp, status: "proposed", steps: [
    { id: "inspect", title: "Inspect evidence", description: "Review the test output.", capability_ids: ["capability.repo-scan"], depends_on: [], risk: "low", acceptance_criteria: ["Failure is reproduced or ruled out."] },
    { id: "diagnose", title: "Identify cause", description: "Trace the failure.", capability_ids: [], depends_on: ["inspect"], risk: "low", acceptance_criteria: ["Cause is supported by evidence."] }
  ]},
  verification: { id: "verification-001", plan_id: "plan-001", performed_at: timestamp, outcome: "passed", checks: [
    { criterion: "Test passes after fix.", result: "passed", evidence_ids: ["evidence-002"] }
  ], verifier: { kind: "ci", name: "GitHub Actions" }, limitations: [] }
};

test("lists versioned record types", () => {
  assert.deepEqual(listRecordTypes(), ["capability", "evidence", "finding", "plan", "problem", "verification"]);
  for (const type of listRecordTypes()) assert.equal(getRecordSchema(type).properties.schema_version.const, "1.0.0");
  assert.throws(() => getRecordSchema("unknown"), /Unknown record type/);
});

test("creates and validates each record type", () => {
  for (const [type, fields] of Object.entries(records)) {
    const record = createRecord(type, fields);
    assert.equal(record.record_type, type);
    assert.equal(record.schema_version, "1.0.0");
    assert.deepEqual(validateRecord(type, record), { valid: true, record_type: type, schema_version: "1.0.0", errors: [] });
    assert.equal(assertValidRecord(type, record), record);
  }
});

test("rejects unknown types, missing fields, wrong versions, and extra fields", () => {
  assert.equal(validateRecord("unknown", {}).valid, false);
  assert.ok(validateRecord("problem", {}).errors.some(error => error.includes("missing required property goal")));
  assert.ok(validateRecord("problem", { ...createRecord("problem", records.problem), extra: true }).errors.some(error => error.includes("additional property extra")));
  assert.throws(() => createRecord("problem", { ...records.problem, schema_version: "9.0.0" }), /cannot be overridden/);
  assert.throws(() => createRecord("problem", { ...records.problem, record_type: "finding" }), /cannot be overridden/);
});

test("rejects invalid confidence, dates, IDs, and empty evidence links", () => {
  assert.ok(validateRecord("evidence", raw("evidence", { ...records.evidence, confidence: 1.1 })).errors.some(error => error.includes("maximum")));
  assert.ok(validateRecord("problem", raw("problem", { ...records.problem, created_at: "not-a-date" })).errors.some(error => error.includes("date-time")));
  assert.ok(validateRecord("finding", raw("finding", { ...records.finding, evidence_ids: [] })).errors.some(error => error.includes("minItems")));
  assert.throws(() => createRecord("problem", { ...records.problem, id: "x" }), /Invalid problem record/);
});

test("rejects duplicate steps, unknown/self dependencies, and cycles", () => {
  let plan = structuredClone(records.plan);
  plan.steps[1].id = "inspect";
  assert.ok(validateRecord("plan", raw("plan", plan)).errors.some(error => error.includes("duplicate step id")));
  plan = structuredClone(records.plan);
  plan.steps[1].depends_on = ["missing"];
  assert.ok(validateRecord("plan", raw("plan", plan)).errors.some(error => error.includes("unknown dependency")));
  plan = structuredClone(records.plan);
  plan.steps[0].depends_on = ["inspect"];
  assert.ok(validateRecord("plan", raw("plan", plan)).errors.some(error => error.includes("cannot depend on itself")));
  plan = structuredClone(records.plan);
  plan.steps[0].depends_on = ["diagnose"];
  assert.ok(validateRecord("plan", raw("plan", plan)).errors.some(error => error.includes("dependency cycle")));
});

test("verification outcomes must match check results and evidence", () => {
  let verification = structuredClone(records.verification);
  verification.outcome = "failed";
  assert.ok(validateRecord("verification", raw("verification", verification)).errors.some(error => error.includes("failed requires")));
  verification = structuredClone(records.verification);
  verification.checks[0].result = "not_run";
  assert.ok(validateRecord("verification", raw("verification", verification)).errors.some(error => error.includes("passed requires")));
  verification = structuredClone(records.verification);
  verification.checks[0].evidence_ids = [];
  assert.ok(validateRecord("verification", raw("verification", verification)).errors.some(error => error.includes("completed checks require evidence")));
  verification = structuredClone(records.verification);
  verification.outcome = "partial";
  verification.checks.push({ criterion: "Integration check", result: "not_run", evidence_ids: [] });
  assert.deepEqual(validateRecord("verification", createRecord("verification", verification)).errors, []);
  verification = structuredClone(records.verification);
  verification.outcome = "partial";
  verification.checks.push({ criterion: "Second check", result: "passed", evidence_ids: ["evidence-003"] });
  assert.ok(validateRecord("verification", raw("verification", verification)).errors.some(error => error.includes("partial requires")));
});

test("rejects undeclared execution modes", () => {
  const capability = structuredClone(records.capability);
  capability.execution_modes = ["root_shell", "unrestricted"];
  assert.ok(validateRecord("capability", raw("capability", capability)).errors.length > 0);
});
