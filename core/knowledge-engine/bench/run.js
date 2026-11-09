import { readFileSync } from "node:fs";
import registry from "../../../knowledge/registry.json" with { type: "json" };
import { selectKnowledge } from "../src/index.js";
const benchmark = JSON.parse(readFileSync(new URL("./cases.json", import.meta.url), "utf8"));
const results = benchmark.cases.map((entry) => {
  const output = selectKnowledge(registry, entry.task, { statuses:["draft"], limit:50 });
  const actual = new Set(output.matches.map((item) => item.id));
  const expected = new Set(entry.expected), forbidden = new Set(entry.forbidden);
  const tp = [...expected].filter((id)=>actual.has(id)).length;
  const fp = [...actual].filter((id)=>!expected.has(id)).length;
  const recall = expected.size ? tp/expected.size : (actual.size===0?1:0);
  const precision = actual.size ? tp/actual.size : (expected.size===0?1:0);
  return {id:entry.id,expected:[...expected],actual:[...actual],precision,recall,falsePositive:fp,forbiddenMatches:[...forbidden].filter((id)=>actual.has(id)).length,abstained:actual.size===0};
});
const mean = (key)=>results.reduce((s,x)=>s+x[key],0)/results.length;
const summary={cases:results.length,mean_precision:Number(mean("precision").toFixed(3)),mean_recall:Number(mean("recall").toFixed(3)),
 false_positive_count:results.reduce((s,x)=>s+x.falsePositive,0),forbidden_match_count:results.reduce((s,x)=>s+x.forbiddenMatches,0),
 correct_abstentions:results.filter(x=>x.expected.length===0&&x.abstained).length,required_abstentions:results.filter(x=>x.expected.length===0).length,results};
console.log(JSON.stringify(summary,null,2));
if(summary.mean_recall<0.8||summary.forbidden_match_count>0||summary.correct_abstentions!==summary.required_abstentions)process.exitCode=1;
