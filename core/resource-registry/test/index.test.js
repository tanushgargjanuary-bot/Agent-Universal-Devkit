import test from "node:test";
import assert from "node:assert/strict";
import { ResourceRegistry, normalizeRepositoryUrl } from "../src/index.js";

test("normalizes GitHub URLs and rejects non-GitHub hosts",()=>{
  assert.deepEqual(normalizeRepositoryUrl("https://github.com/Owner/Repo.git/tree/main"),{
    url:"https://github.com/Owner/Repo",fullName:"owner/repo"
  });
  assert.throws(()=>normalizeRepositoryUrl("https://example.com/owner/repo"),/Only public HTTPS GitHub/);
});

test("upserts by canonical repository identity",async()=>{
  const registry=await new ResourceRegistry({dbPath:":memory:"}).open();
  const a=registry.upsert({name:"Alpha",url:"https://github.com/owner/repo",categories:["agents"],capabilities:["planning"]});
  const b=registry.upsert({name:"Alpha Updated",url:"https://github.com/OWNER/REPO.git",categories:["agents"],capabilities:["planning"]});
  assert.equal(a.id,b.id);
  assert.equal(registry.stats().total,1);
  registry.close();
});

test("duplicate scan makes proposals and does not delete records",async()=>{
  const registry=await new ResourceRegistry({dbPath:":memory:"}).open();
  registry.upsert({id:"a",name:"Agent workflow planner",url:"https://github.com/example/a",description:"Agent workflow planning specification execution",categories:["agent-workflow","planning"],capabilities:["planning","specification","verification"]});
  registry.upsert({id:"b",name:"Agent workflow planning toolkit",url:"https://github.com/example/b",description:"Agent workflow planning specification execution toolkit",categories:["agent-workflow","planning"],capabilities:["planning","specification","verification"]});
  const findings=registry.findDuplicates();
  assert.equal(findings.length,1);
  assert.equal(findings[0].recommendation,"human_review");
  assert.equal(registry.stats().total,2);
  assert.equal(registry.pendingReviews().length,1);
  registry.close();
});

test("manual duplicate decision deprecates only the selected loser",async()=>{
  const registry=await new ResourceRegistry({dbPath:":memory:"}).open();
  registry.upsert({id:"a",name:"A",url:"https://github.com/example/a"});
  registry.upsert({id:"b",name:"B",url:"https://github.com/example/b"});
  registry.findDuplicates();
  registry.reviewPair("a","b",{decision:"duplicate_keep_left",reason:"Human verified exact replacement."});
  assert.equal(registry.get("b").status,"deprecated");
  assert.equal(registry.get("a").status,"candidate");
  registry.close();
});
