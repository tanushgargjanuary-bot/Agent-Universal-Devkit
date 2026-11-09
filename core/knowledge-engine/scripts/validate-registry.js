import { readFileSync } from "node:fs";
import registry from "../../../knowledge/registry.json" with { type: "json" };
import schema from "../../../schemas/knowledge-item.schema.json" with { type: "json" };
import { validateSchema } from "../src/json-schema.js";
import { validateKnowledgeRegistry, validateKnowledgeContent } from "../src/index.js";
const errors=registry.items.flatMap((item,index)=>validateSchema(item,schema,`items[${index}]`));
if(errors.length){console.error(errors.join("\n"));process.exit(1);}
validateKnowledgeRegistry(registry);
const result=validateKnowledgeContent(registry,(path)=>readFileSync(new URL("../../../"+path,import.meta.url),"utf8"));
console.log(JSON.stringify({schema_valid:true,registry_items:registry.items.length,approved_content_verified:result.verified_count},null,2));
