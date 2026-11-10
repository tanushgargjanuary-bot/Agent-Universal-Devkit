import { createHash } from "node:crypto";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";

const SCHEMA_VERSION = 1;
const DEFAULT_DB = "data/resource-registry.sqlite";
const VALID_STATUS = new Set(["candidate", "approved", "deprecated", "rejected"]);
const VALID_KIND = new Set(["repository", "tool", "library", "framework", "dataset", "template", "service", "skill"]);

function now() { return new Date().toISOString(); }
function stableJson(value) { return JSON.stringify(value, Object.keys(value ?? {}).sort()); }
function hash(value) { return createHash("sha256").update(value).digest("hex"); }

export function normalizeRepositoryUrl(input) {
  if (typeof input !== "string" || !input.trim()) throw new Error("A repository URL is required");
  const raw = input.trim().replace(/\.git$/i, "");
  const url = new URL(raw.startsWith("github.com/") ? `https://${raw}` : raw);
  if (url.protocol !== "https:" || !["github.com", "www.github.com"].includes(url.hostname.toLowerCase())) {
    throw new Error("Only public HTTPS GitHub repository URLs are supported");
  }
  const parts = url.pathname.split("/").filter(Boolean);
  if (parts.length < 2) throw new Error("URL must identify owner and repository");
  const owner = parts[0];
  const repository = parts[1];
  if (!/^[A-Za-z0-9_.-]+$/.test(owner) || !/^[A-Za-z0-9_.-]+$/.test(repository)) {
    throw new Error("Invalid GitHub owner or repository path");
  }
  return {
    url: `https://github.com/${owner}/${repository}`,
    fullName: `${owner.toLowerCase()}/${repository.toLowerCase()}`
  };
}

function tokenSet(value) {
  return new Set(String(value ?? "").toLowerCase()
    .replace(/[^a-z0-9+#.\s-]/g, " ")
    .split(/\s+/).filter(token => token.length > 2));
}
function jaccard(a, b) {
  const A = tokenSet(a), B = tokenSet(b);
  if (!A.size || !B.size) return 0;
  let intersection = 0;
  for (const token of A) if (B.has(token)) intersection++;
  return intersection / (A.size + B.size - intersection);
}
function overlapRatio(a = [], b = []) {
  const A = new Set(a.map(x => String(x).toLowerCase()));
  const B = new Set(b.map(x => String(x).toLowerCase()));
  if (!A.size || !B.size) return { similarity: 0, containment: 0 };
  const common = [...A].filter(x => B.has(x)).length;
  return {
    similarity: common / (A.size + B.size - common),
    containment: common / Math.min(A.size, B.size)
  };
}

function validateResource(record) {
  if (!record || typeof record !== "object") throw new Error("Resource must be an object");
  if (!record.name || typeof record.name !== "string") throw new Error("Resource name is required");
  const repo = normalizeRepositoryUrl(record.url);
  if (!VALID_KIND.has(record.kind ?? "repository")) throw new Error("Unsupported resource kind");
  if (!VALID_STATUS.has(record.status ?? "candidate")) throw new Error("Invalid resource status");
  const capabilities = record.capabilities ?? [];
  const categories = record.categories ?? [];
  for (const [field, value] of [["categories", categories], ["capabilities", capabilities]]) {
    if (!Array.isArray(value) || value.some(v => typeof v !== "string" || !v.trim())) {
      throw new Error(`${field} must be an array of non-empty strings`);
    }
  }
  return {
    ...record, id: record.id ?? repo.fullName.replaceAll("/", "--"),
    name: record.name.trim(), url: repo.url, full_name: repo.fullName,
    kind: record.kind ?? "repository", status: record.status ?? "candidate",
    categories, capabilities, updated_at: now()
  };
}

const DDL = `
CREATE TABLE IF NOT EXISTS metadata (key TEXT PRIMARY KEY, value TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS resources (
  id TEXT PRIMARY KEY,
  full_name TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  kind TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  categories_json TEXT NOT NULL,
  capabilities_json TEXT NOT NULL,
  status TEXT NOT NULL,
  license_json TEXT NOT NULL,
  metadata_json TEXT NOT NULL,
  content_hash TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_resources_status ON resources(status);
CREATE INDEX IF NOT EXISTS idx_resources_name ON resources(name);
CREATE TABLE IF NOT EXISTS resource_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  resource_id TEXT NOT NULL,
  event_type TEXT NOT NULL,
  detail_json TEXT NOT NULL,
  created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS duplicate_reviews (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  left_id TEXT NOT NULL,
  right_id TEXT NOT NULL,
  relation TEXT NOT NULL,
  confidence REAL NOT NULL,
  reasons_json TEXT NOT NULL,
  decision TEXT NOT NULL DEFAULT 'pending',
  reviewed_by TEXT,
  reviewed_at TEXT,
  created_at TEXT NOT NULL,
  UNIQUE(left_id, right_id)
);
CREATE INDEX IF NOT EXISTS idx_duplicate_reviews_decision ON duplicate_reviews(decision);
`;

export class ResourceRegistry {
  constructor({ dbPath = DEFAULT_DB } = {}) {
    this.dbPath = dbPath;
    this.db = null;
  }

  async open() {
    if (this.db) return this;
    if (this.dbPath !== ":memory:") await mkdir(path.dirname(path.resolve(this.dbPath)), { recursive: true });
    this.db = new DatabaseSync(this.dbPath);
    this.db.exec("PRAGMA foreign_keys = ON; PRAGMA journal_mode = WAL;");
    this.db.exec(DDL);
    this.db.prepare("INSERT OR IGNORE INTO metadata(key,value) VALUES('schema_version',?)").run(String(SCHEMA_VERSION));
    return this;
  }
  close() { this.db?.close(); this.db = null; }

  upsert(input, { source = "manual" } = {}) {
    this.#assertOpen();
    const record = validateResource(input);
    const stamp = now();
    const canonical = {
      ...record,
      license: record.license ?? { spdx_id: "NOASSERTION", review_status: "unknown" }
    };
    const contentHash = hash(JSON.stringify(canonical));
    const existing = this.db.prepare("SELECT id FROM resources WHERE full_name=?").get(record.full_name);
    const id = existing?.id ?? record.id;
    const values = [
      id, record.full_name, record.name, record.url, record.kind,
      record.description ?? "", JSON.stringify(record.categories),
      JSON.stringify(record.capabilities), record.status,
      JSON.stringify(canonical.license),
      JSON.stringify({ ...record, source }), contentHash,
      stamp, stamp
    ];
    this.db.prepare(`INSERT INTO resources(
      id,full_name,name,url,kind,description,categories_json,capabilities_json,
      status,license_json,metadata_json,content_hash,created_at,updated_at
    ) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?)
    ON CONFLICT(full_name) DO UPDATE SET
      name=excluded.name,url=excluded.url,kind=excluded.kind,
      description=excluded.description,categories_json=excluded.categories_json,
      capabilities_json=excluded.capabilities_json,status=excluded.status,
      license_json=excluded.license_json,metadata_json=excluded.metadata_json,
      content_hash=excluded.content_hash,updated_at=excluded.updated_at`).run(...values);
    this.db.prepare("INSERT INTO resource_events(resource_id,event_type,detail_json,created_at) VALUES(?,?,?,?)")
      .run(id, existing ? "updated" : "created", JSON.stringify({ source, content_hash: contentHash }), stamp);
    return this.get(id);
  }

  get(idOrFullName) {
    this.#assertOpen();
    const row = this.db.prepare("SELECT * FROM resources WHERE id=? OR full_name=?").get(idOrFullName, idOrFullName);
    return row ? this.#decode(row) : null;
  }

  list({ status, category, limit = 100, offset = 0 } = {}) {
    this.#assertOpen();
    if (!Number.isInteger(limit) || limit < 1 || limit > 1000) throw new Error("limit must be between 1 and 1000");
    if (!Number.isInteger(offset) || offset < 0) throw new Error("offset must be non-negative");
    const rows = this.db.prepare("SELECT * FROM resources ORDER BY name COLLATE NOCASE LIMIT ? OFFSET ?").all(limit, offset);
    return rows.map(row => this.#decode(row)).filter(record =>
      (!status || record.status === status) && (!category || record.categories.includes(category)));
  }

  search(query, { limit = 50 } = {}) {
    this.#assertOpen();
    const needle = `%${String(query).trim()}%`;
    return this.db.prepare(`SELECT * FROM resources
      WHERE name LIKE ? OR full_name LIKE ? OR description LIKE ? OR categories_json LIKE ? OR capabilities_json LIKE ?
      ORDER BY name COLLATE NOCASE LIMIT ?`).all(needle, needle, needle, needle, needle, limit).map(row => this.#decode(row));
  }

  findDuplicates({ descriptionThreshold = 0.72, capabilityThreshold = 0.8 } = {}) {
    this.#assertOpen();
    const records = this.list({ limit: 1000 });
    const findings = [];
    for (let i = 0; i < records.length; i++) {
      for (let j = i + 1; j < records.length; j++) {
        const a = records[i], b = records[j];
        if (a.full_name === b.full_name) {
          findings.push({ left: a.id, right: b.id, relation: "exact_duplicate", confidence: 1, reasons: ["Canonical GitHub repository identity matches."], recommendation: "retain_single_record" });
          continue;
        }
        const cap = overlapRatio(a.capabilities, b.capabilities);
        const cat = overlapRatio(a.categories, b.categories);
        const text = jaccard(`${a.name} ${a.description} ${a.categories.join(" ")}`, `${b.name} ${b.description} ${b.categories.join(" ")}`);
        if (cap.containment >= capabilityThreshold && cat.similarity >= 0.5 && text >= descriptionThreshold) {
          findings.push({ left: a.id, right: b.id, relation: "high_overlap", confidence: Number(Math.min(0.99, (cap.containment + cat.similarity + text) / 3).toFixed(3)), reasons: ["High semantic text similarity.", "Capability containment is high.", "Category overlap supports a functional collision."], recommendation: "human_review" });
        } else if (cap.similarity >= 0.25 && cat.similarity >= 0.25) {
          findings.push({ left: a.id, right: b.id, relation: "partial_overlap", confidence: Number(Math.min(0.95, (cap.similarity + cat.similarity + text) / 3).toFixed(3)), reasons: ["Some declared capabilities and categories overlap."], recommendation: "classify_alternative_or_complement" });
        }
      }
    }
    const insert = this.db.prepare(`INSERT INTO duplicate_reviews(left_id,right_id,relation,confidence,reasons_json,created_at)
      VALUES(?,?,?,?,?,?) ON CONFLICT(left_id,right_id) DO UPDATE SET relation=excluded.relation,
      confidence=excluded.confidence,reasons_json=excluded.reasons_json,created_at=excluded.created_at
      WHERE duplicate_reviews.decision='pending'`);
    for (const f of findings) {
      const [left, right] = [f.left, f.right].sort();
      insert.run(left, right, f.relation, f.confidence, JSON.stringify(f.reasons), now());
    }
    return findings;
  }

  reviewPair(leftId, rightId, { decision, reviewedBy = "human", reason = "" } = {}) {
    this.#assertOpen();
    const allowed = new Set(["duplicate_keep_left", "duplicate_keep_right", "alternative", "complement", "distinct", "reject_both"]);
    if (!allowed.has(decision)) throw new Error("Unsupported deduplication decision");
    const [left, right] = [leftId, rightId].sort();
    const result = this.db.prepare(`UPDATE duplicate_reviews SET decision=?,reviewed_by=?,reviewed_at=?,reasons_json=?
      WHERE left_id=? AND right_id=?`).run(decision, reviewedBy, now(), JSON.stringify([reason]), left, right);
    if (Number(result.changes) === 0) throw new Error("Duplicate review pair does not exist");
    if (decision === "duplicate_keep_left" || decision === "duplicate_keep_right") {
      const remove = decision === "duplicate_keep_left" ? right : left;
      const keep = decision === "duplicate_keep_left" ? left : right;
      this.db.prepare("UPDATE resources SET status='deprecated',updated_at=? WHERE id=?").run(now(), remove);
      this.db.prepare("INSERT INTO resource_events(resource_id,event_type,detail_json,created_at) VALUES(?,?,?,?)")
        .run(remove, "deprecated_as_duplicate", JSON.stringify({ kept: keep, reason }), now());
    }
    return this.db.prepare("SELECT * FROM duplicate_reviews WHERE left_id=? AND right_id=?").get(left, right);
  }

  pendingReviews({ limit = 100 } = {}) {
    this.#assertOpen();
    return this.db.prepare("SELECT * FROM duplicate_reviews WHERE decision='pending' ORDER BY confidence DESC LIMIT ?").all(limit)
      .map(row => ({ ...row, reasons: JSON.parse(row.reasons_json) }));
  }

  stats() {
    this.#assertOpen();
    const byStatus = this.db.prepare("SELECT status,count(*) AS count FROM resources GROUP BY status").all();
    const duplicateQueue = this.db.prepare("SELECT decision,count(*) AS count FROM duplicate_reviews GROUP BY decision").all();
    return { total: byStatus.reduce((sum, row) => sum + row.count, 0), by_status: byStatus, duplicate_reviews: duplicateQueue };
  }

  #decode(row) {
    return {
      id: row.id, full_name: row.full_name, name: row.name, url: row.url, kind: row.kind,
      description: row.description, categories: JSON.parse(row.categories_json),
      capabilities: JSON.parse(row.capabilities_json), status: row.status,
      license: JSON.parse(row.license_json), metadata: JSON.parse(row.metadata_json),
      content_hash: row.content_hash, created_at: row.created_at, updated_at: row.updated_at
    };
  }
  #assertOpen() { if (!this.db) throw new Error("Open the registry before using it"); }
}
