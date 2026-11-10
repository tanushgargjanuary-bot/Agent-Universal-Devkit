import { createHash, createPrivateKey, createPublicKey, sign, verify } from "node:crypto";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";
import { createApprovalRequest, POLICY_VERSION } from "./policy-engine.js";

const MAX_TTL_MS = 24 * 60 * 60 * 1000;
const MIN_TTL_MS = 60 * 1000;
const DDL = [
 "CREATE TABLE IF NOT EXISTS approval_requests(request_id TEXT PRIMARY KEY,policy_version TEXT NOT NULL,plan_id TEXT NOT NULL,plan_digest TEXT NOT NULL,action TEXT NOT NULL,target TEXT NOT NULL,status TEXT NOT NULL CHECK(status IN ('pending','approved','rejected','revoked','expired')),requested_at TEXT NOT NULL,expires_at TEXT NOT NULL,approved_by TEXT,approved_at TEXT,signature TEXT,key_id TEXT,reviewed_by TEXT,reviewed_at TEXT,reason TEXT NOT NULL DEFAULT '',created_at TEXT NOT NULL,updated_at TEXT NOT NULL)",
 "CREATE INDEX IF NOT EXISTS idx_approval_requests_status_expiry ON approval_requests(status,expires_at)",
 "CREATE TABLE IF NOT EXISTS approval_events(id INTEGER PRIMARY KEY AUTOINCREMENT,request_id TEXT NOT NULL REFERENCES approval_requests(request_id),event_type TEXT NOT NULL,actor TEXT,detail_json TEXT NOT NULL,created_at TEXT NOT NULL)",
 "CREATE INDEX IF NOT EXISTS idx_approval_events_request ON approval_events(request_id,created_at)"
].join(";\n") + ";";

function stableValue(value) {
  if (Array.isArray(value)) return value.map(stableValue);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.keys(value).sort().filter(key => value[key] !== undefined)
      .map(key => [key, stableValue(value[key])]));
  }
  return value;
}
function stableJson(value) { return JSON.stringify(stableValue(value)); }
function timestamp(clock) {
  const value = clock();
  const date = value instanceof Date ? value : new Date(value);
  if (!Number.isFinite(date.getTime())) throw new Error("Approval clock returned an invalid time");
  return date;
}
function keyObject(value, type) {
  if (!value) return null;
  if (value.type === type) return value;
  return type === "private" ? createPrivateKey(value) : createPublicKey(value);
}

export class ApprovalStore {
  constructor({
    dbPath = "data/approvals.sqlite",
    privateKey = null,
    publicKey = null,
    authenticateApprover = null,
    ttlMs = 15 * 60 * 1000,
    clock = () => new Date()
  } = {}) {
    if (!Number.isSafeInteger(ttlMs) || ttlMs < MIN_TTL_MS || ttlMs > MAX_TTL_MS) {
      throw new Error("ttlMs must be between 60000 and 86400000");
    }
    if (typeof clock !== "function") throw new Error("clock must be a function");
    if (authenticateApprover !== null && typeof authenticateApprover !== "function") {
      throw new Error("authenticateApprover must be a trusted function");
    }
    this.dbPath = dbPath;
    this.privateKey = keyObject(privateKey, "private");
    this.publicKey = keyObject(publicKey, "public") ?? (this.privateKey ? createPublicKey(this.privateKey) : null);
    this.authenticateApprover = authenticateApprover;
    this.ttlMs = ttlMs;
    this.clock = clock;
    this.keyId = this.publicKey
      ? createHash("sha256").update(this.publicKey.export({ type: "spki", format: "der" })).digest("hex").slice(0, 24)
      : null;
    this.db = null;
  }

  async open() {
    if (this.db) return this;
    if (this.dbPath !== ":memory:") await mkdir(path.dirname(path.resolve(this.dbPath)), { recursive: true });
    this.db = new DatabaseSync(this.dbPath);
    try {
      this.db.exec("PRAGMA foreign_keys=ON; PRAGMA journal_mode=WAL; PRAGMA busy_timeout=5000;");
      this.db.exec(DDL);
      return this;
    } catch (error) {
      this.db.close();
      this.db = null;
      throw error;
    }
  }

  close() {
    this.db?.close();
    this.db = null;
  }

  requestApproval(request) {
    this.#assertOpen();
    if (!request || typeof request !== "object" || Array.isArray(request)) throw new Error("A policy approval request is required");
    const expected = createApprovalRequest({
      planId: request.plan_id, planDigest: request.plan_digest, action: request.action, target: request.target
    });
    if (request.request_id !== expected.request_id || request.policy_version !== POLICY_VERSION) {
      throw new Error("Approval request scope or policy version is invalid");
    }
    const now = timestamp(this.clock);
    const requestedAt = now.toISOString();
    const expiresAt = new Date(now.getTime() + this.ttlMs).toISOString();
    const existing = this.db.prepare("SELECT * FROM approval_requests WHERE request_id=?").get(request.request_id);
    if (existing) {
      if (existing.plan_id !== request.plan_id || existing.plan_digest !== request.plan_digest ||
          existing.action !== request.action || existing.target !== request.target ||
          existing.policy_version !== request.policy_version) {
        throw new Error("Approval request ID is already bound to a different scope");
      }
      if (existing.status === "pending" && Date.parse(existing.expires_at) <= now.getTime()) {
        this.#transaction(() => {
          this.db.prepare("UPDATE approval_requests SET status='expired',updated_at=? WHERE request_id=? AND status='pending'")
            .run(requestedAt, request.request_id);
          this.#event(request.request_id, "expired", null, { reason: "Approval request expired before review." }, requestedAt);
        });
        return this.getApproval(request.request_id);
      }
      if (existing.status === "expired") {
        this.#transaction(() => {
          this.db.prepare("UPDATE approval_requests SET status='pending',requested_at=?,expires_at=?,approved_by=NULL,approved_at=NULL,signature=NULL,key_id=NULL,reviewed_by=NULL,reviewed_at=NULL,reason='',updated_at=? WHERE request_id=? AND status='expired'")
            .run(requestedAt, expiresAt, requestedAt, request.request_id);
          this.#event(request.request_id, "renewed", null, { expires_at: expiresAt }, requestedAt);
        });
        return this.getApproval(request.request_id);
      }
      return this.#decode(existing);
    }
    this.#transaction(() => {
      this.db.prepare("INSERT INTO approval_requests(request_id,policy_version,plan_id,plan_digest,action,target,status,requested_at,expires_at,created_at,updated_at) VALUES(?,?,?,?,?,?,'pending',?,?,?,?)")
        .run(request.request_id, request.policy_version, request.plan_id, request.plan_digest, request.action, request.target, requestedAt, expiresAt, requestedAt, requestedAt);
      this.#event(request.request_id, "requested", null, {}, requestedAt);
    });
    return this.getApproval(request.request_id);
  }

  async approve(requestId, credential) {
    this.#assertOpen();
    if (!this.privateKey || !this.keyId) throw new Error("Approval signing key is not configured");
    const actor = await this.#authenticate(credential);
    const row = this.#requirePending(requestId);
    const approvedAt = timestamp(this.clock).toISOString();
    const payload = this.#signaturePayload({
      ...row, status: "approved", approved_by: actor.subject, approved_at: approvedAt, key_id: this.keyId
    });
    const signature = sign(null, Buffer.from(stableJson(payload)), this.privateKey).toString("base64");
    this.#transaction(() => {
      const result = this.db.prepare("UPDATE approval_requests SET status='approved',approved_by=?,approved_at=?,signature=?,key_id=?,reviewed_by=?,reviewed_at=?,updated_at=? WHERE request_id=? AND status='pending' AND expires_at>?")
        .run(actor.subject, approvedAt, signature, this.keyId, actor.subject, approvedAt, approvedAt, requestId, approvedAt);
      if (result.changes !== 1) throw new Error("Approval request changed or expired before approval could be recorded");
      this.#event(requestId, "approved", actor.subject, { key_id: this.keyId }, approvedAt);
    });
    return this.getApproval(requestId);
  }

  async reject(requestId, credential, reason = "") {
    this.#assertOpen();
    if (typeof reason !== "string" || reason.length > 5000) throw new Error("reason must be a string up to 5000 characters");
    const actor = await this.#authenticate(credential);
    this.#requirePending(requestId);
    const reviewedAt = timestamp(this.clock).toISOString();
    this.#transaction(() => {
      const result = this.db.prepare("UPDATE approval_requests SET status='rejected',reviewed_by=?,reviewed_at=?,reason=?,updated_at=? WHERE request_id=? AND status='pending' AND expires_at>?")
        .run(actor.subject, reviewedAt, reason, reviewedAt, requestId, reviewedAt);
      if (result.changes !== 1) throw new Error("Approval request changed or expired before rejection could be recorded");
      this.#event(requestId, "rejected", actor.subject, { reason }, reviewedAt);
    });
    return this.getApproval(requestId);
  }

  async revoke(requestId, credential, reason = "") {
    this.#assertOpen();
    if (typeof reason !== "string" || reason.length > 5000) throw new Error("reason must be a string up to 5000 characters");
    const actor = await this.#authenticate(credential);
    const row = this.db.prepare("SELECT * FROM approval_requests WHERE request_id=?").get(requestId);
    if (!row || row.status !== "approved") throw new Error("Only an approved request can be revoked");
    const reviewedAt = timestamp(this.clock).toISOString();
    this.#transaction(() => {
      const result = this.db.prepare("UPDATE approval_requests SET status='revoked',reviewed_by=?,reviewed_at=?,reason=?,updated_at=? WHERE request_id=? AND status='approved'")
        .run(actor.subject, reviewedAt, reason, reviewedAt, requestId);
      if (result.changes !== 1) throw new Error("Approval request changed before revocation could be recorded");
      this.#event(requestId, "revoked", actor.subject, { reason }, reviewedAt);
    });
    return this.getApproval(requestId);
  }

  getApproval(requestId) {
    this.#assertOpen();
    if (typeof requestId !== "string" || !requestId.trim()) throw new Error("requestId is required");
    const row = this.db.prepare("SELECT * FROM approval_requests WHERE request_id=?").get(requestId);
    return row ? this.#decode(row) : null;
  }

  listPending({ limit = 100 } = {}) {
    this.#assertOpen();
    if (!Number.isSafeInteger(limit) || limit < 1 || limit > 1000) throw new Error("limit must be between 1 and 1000");
    const now = timestamp(this.clock).toISOString();
    this.#transaction(() => {
      const expired = this.db.prepare("SELECT request_id FROM approval_requests WHERE status='pending' AND expires_at<=?").all(now);
      this.db.prepare("UPDATE approval_requests SET status='expired',updated_at=? WHERE status='pending' AND expires_at<=?").run(now, now);
      for (const row of expired) this.#event(row.request_id, "expired", null, { reason: "Approval request expired." }, now);
    });
    return this.db.prepare("SELECT * FROM approval_requests WHERE status='pending' AND expires_at>? ORDER BY requested_at,request_id LIMIT ?")
      .all(now, limit).map(row => this.#decode(row));
  }

  verifyApproval(record, request) {
    this.#assertOpen();
    if (!record || !request || record.status !== "approved" || !record.signature || !this.publicKey ||
        record.key_id !== this.keyId || record.request_id !== request.request_id ||
        record.policy_version !== POLICY_VERSION || record.plan_id !== request.plan_id ||
        record.plan_digest !== request.plan_digest || record.action !== request.action ||
        record.target !== request.target || typeof record.approved_by !== "string" ||
        !record.approved_by.trim() || !Number.isFinite(Date.parse(record.approved_at)) ||
        !Number.isFinite(Date.parse(record.expires_at)) || Date.parse(record.expires_at) <= timestamp(this.clock).getTime()) {
      return false;
    }
    const current = this.getApproval(record.request_id);
    if (!current || current.status !== "approved" || current.signature !== record.signature) return false;
    try {
      return verify(null, Buffer.from(stableJson(this.#signaturePayload(record))), this.publicKey, Buffer.from(record.signature, "base64"));
    } catch {
      return false;
    }
  }

  #signaturePayload(record) {
    return {
      request_id: record.request_id, policy_version: record.policy_version, plan_id: record.plan_id,
      plan_digest: record.plan_digest, action: record.action, target: record.target, status: record.status,
      approved_by: record.approved_by, approved_at: record.approved_at, expires_at: record.expires_at,
      key_id: record.key_id
    };
  }

  async #authenticate(credential) {
    if (!this.authenticateApprover) throw new Error("Trusted approver authentication is not configured");
    let actor;
    try { actor = await this.authenticateApprover(credential); } catch { throw new Error("Approver authentication failed"); }
    if (!actor || typeof actor.subject !== "string" || !actor.subject.trim()) throw new Error("Approver authentication failed");
    return { subject: actor.subject.trim() };
  }

  #requirePending(requestId) {
    if (typeof requestId !== "string" || !requestId.trim()) throw new Error("requestId is required");
    const row = this.db.prepare("SELECT * FROM approval_requests WHERE request_id=?").get(requestId);
    if (!row) throw new Error("Approval request does not exist");
    if (row.status !== "pending") throw new Error("Approval request is not pending");
    if (Date.parse(row.expires_at) <= timestamp(this.clock).getTime()) {
      this.#transaction(() => {
        const now = timestamp(this.clock).toISOString();
        this.db.prepare("UPDATE approval_requests SET status='expired',updated_at=? WHERE request_id=? AND status='pending'").run(now, requestId);
        this.#event(requestId, "expired", null, { reason: "Approval request expired." }, now);
      });
      throw new Error("Approval request has expired");
    }
    return row;
  }

  #event(requestId, eventType, actor, detail, createdAt) {
    this.db.prepare("INSERT INTO approval_events(request_id,event_type,actor,detail_json,created_at) VALUES(?,?,?,?,?)")
      .run(requestId, eventType, actor, JSON.stringify(detail), createdAt);
  }

  #decode(row) {
    return {
      request_id: row.request_id, policy_version: row.policy_version, plan_id: row.plan_id,
      plan_digest: row.plan_digest, action: row.action, target: row.target, status: row.status,
      requested_at: row.requested_at, expires_at: row.expires_at, approved_by: row.approved_by,
      approved_at: row.approved_at, signature: row.signature, key_id: row.key_id,
      reviewed_by: row.reviewed_by, reviewed_at: row.reviewed_at, reason: row.reason
    };
  }

  #transaction(work) {
    this.db.exec("BEGIN IMMEDIATE");
    try { const result = work(); this.db.exec("COMMIT"); return result; }
    catch (error) { this.db.exec("ROLLBACK"); throw error; }
  }

  #assertOpen() {
    if (!this.db) throw new Error("Open the approval store before using it");
  }
}
