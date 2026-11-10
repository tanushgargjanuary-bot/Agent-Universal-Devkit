import test from "node:test";
import assert from "node:assert/strict";
import { ResourceRegistry, normalizeRepositoryUrl } from "../src/index.js";

test("normalizes GitHub URLs and rejects non-GitHub hosts",()=>{
 assert.deepEqual(normalizeRepositoryUrl("https://github.com/Owner/Repo.git/tree/main"),{url:"https://github.com/Owner/Repo",fullName:"owner/repo"});
 assert.throws(()=>normalizeRepositoryUrl("https://example.com/owner/repo"),/Only public HTTPS GitHub/);
});
test("upserts using canonical repository identity",async()=>{
 const db=await new ResourceRegistry({dbPath:":memory:"}).open();
 const a=db.upsert({name:"Alpha",url:"https://github.com/owner/repo",categories:["agents"],capabilities:["planning"]});
 const b=db.upsert({name:"Alpha Updated",url:"https://github.com/OWNER/REPO.git",categories:["agents"],capabilities:["planning"]});
 assert.equal(a.id,b.id);assert.equal(db.stats().total,1);db.close();
});
test("rejects ID collisions between distinct repository identities",async()=>{
 const db=await new ResourceRegistry({dbPath:":memory:"}).open();
 db.upsert({id:"shared",name:"Alpha",url:"https://github.com/one/alpha"});
 assert.throws(()=>db.upsert({id:"shared",name:"Beta",url:"https://github.com/two/beta"}),/already belongs/);
 db.close();
});
test("high overlap creates a proposal and does not deprecate either record",async()=>{
 const db=await new ResourceRegistry({dbPath:":memory:"}).open();
 db.upsert({id:"a",name:"Agent Workflow Planner",url:"https://github.com/example/a",description:"Agent workflow planning specification execution",categories:["agent-workflow","planning"],capabilities:["planning","specification","verification"]});
 db.upsert({id:"b",name:"Agent Workflow Planning Toolkit",url:"https://github.com/example/b",description:"Agent workflow planning specification execution toolkit",categories:["agent-workflow","planning"],capabilities:["planning","specification","verification"]});
 const findings=db.findDuplicates();assert.equal(findings.length,1);assert.equal(findings[0].relation,"high_overlap");
 assert.equal(db.pendingReviews().length,1);assert.equal(db.get("a").status,"candidate");assert.equal(db.get("b").status,"candidate");db.close();
});
test("manual duplicate decision deprecates only the selected record",async()=>{
 const db=await new ResourceRegistry({dbPath:":memory:"}).open();
 db.upsert({id:"a",name:"A",url:"https://github.com/example/a"});
 db.upsert({id:"b",name:"B",url:"https://github.com/example/b"});
 db.findDuplicates();
 assert.throws(()=>db.reviewPair("a","b",{decision:"delete"}),/Unsupported/);
 db.reviewPair("a","b",{decision:"duplicate_keep_left",reason:"Human verified duplicate."});
 assert.equal(db.get("b").status,"deprecated");assert.equal(db.get("a").status,"candidate");db.close();
});
test("dedupe scans beyond the default page of 100 records",async()=>{
 const db=await new ResourceRegistry({dbPath:":memory:"}).open();
 for(let i=0;i<110;i++) db.upsert({id:`x${i}`,name:`Resource ${i}`,url:`https://github.com/example/r${i}`});
 db.upsert({id:"dup-a",name:"Planning Agent",url:"https://github.com/example/plan-a",description:"Agent workflow planning specification execution",categories:["agent-workflow","planning"],capabilities:["planning","specification","verification"]});
 db.upsert({id:"dup-b",name:"Planning Agent Toolkit",url:"https://github.com/example/plan-b",description:"Agent workflow planning specification execution toolkit",categories:["agent-workflow","planning"],capabilities:["planning","specification","verification"]});
 assert.equal(db.list({limit:1000}).length,112);
 assert.ok(db.findDuplicates().some(x=>x.left==="dup-a"&&x.right==="dup-b"));
 db.close();
});
