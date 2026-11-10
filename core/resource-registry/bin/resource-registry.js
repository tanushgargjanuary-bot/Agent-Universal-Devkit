#!/usr/bin/env node
import { ResourceRegistry } from "./src/index.js";

function help() {
  console.log(`Resource Registry

Commands:
  init [--db PATH]
  add --url URL --name NAME --description TEXT --category TAG [--capability TAG]
  list [--status candidate|approved|deprecated|rejected]
  search QUERY
  dedupe
  reviews
  stats

Options:
  --db PATH       SQLite database path (default: data/resource-registry.sqlite)

Notes:
  The tool never deletes records automatically. Deduplication writes review proposals.
  Only an explicit duplicate_keep_left/right decision marks a record deprecated.
`);
}
function argsOf(argv) {
  const positional=[], options={};
  for(let i=0;i<argv.length;i++){
    const value=argv[i];
    if(value.startsWith("--")){
      const key=value.slice(2);
      if(i+1>=argv.length || argv[i+1].startsWith("--")) throw new Error(`Missing value for --${key}`);
      options[key]=argv[++i];
    } else positional.push(value);
  }
  return {positional,options};
}
async function main() {
  const {positional,options}=argsOf(process.argv.slice(2));
  const command=positional[0]??"help";
  if(command==="help"||command==="--help"||command==="-h"){help();return;}
  const registry=await new ResourceRegistry({dbPath:options.db??"data/resource-registry.sqlite"}).open();
  try {
    let output;
    if(command==="init") output={database:options.db??"data/resource-registry.sqlite",...registry.stats()};
    else if(command==="add"){
      if(!options.url||!options.name) throw new Error("add requires --url and --name");
      output=registry.upsert({url:options.url,name:options.name,description:options.description??"",categories:options.category?[options.category]:[],capabilities:options.capability?[options.capability]:[]});
    } else if(command==="list") output=registry.list({status:options.status});
    else if(command==="search") output=registry.search(positional.slice(1).join(" "));
    else if(command==="dedupe") output=registry.findDuplicates();
    else if(command==="reviews") output=registry.pendingReviews();
    else if(command==="review"){
      if(!options.left||!options.right||!options.decision) throw new Error("review requires --left, --right, and --decision");
      output=registry.reviewPair(options.left,options.right,{decision:options.decision,reason:options.reason??"",reviewedBy:"cli-human"});
    }
    else if(command==="stats") output=registry.stats();
    else throw new Error(`Unknown command: ${command}`);
    console.log(JSON.stringify(output,null,2));
  } finally { registry.close(); }
}
main().catch(error=>{console.error(error.message);process.exitCode=1;});
