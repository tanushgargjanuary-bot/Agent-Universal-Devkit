import test from "node:test";
import assert from "node:assert/strict";
import { dijkstra, bellmanFord } from "../../../knowledge/implementations/shortest-paths.js";
import { bayesPosterior } from "../../../knowledge/implementations/probability.js";

test("Dijkstra agrees with independent Bellman-Ford on non-negative graphs",()=>{
  const graph={A:{B:4,C:2},B:{C:1,D:5},C:{B:1,D:8,E:10},D:{E:2},E:{}};
  const fast=dijkstra(graph,"A"), reference=bellmanFord(graph,"A");
  assert.deepEqual(fast.distance,reference.distance);
  assert.deepEqual(fast.distance,{A:0,B:3,C:2,D:8,E:10});
});
test("shortest path methods handle unreachable vertices",()=>{
  const graph={A:{B:2},B:{},C:{}};
  assert.equal(dijkstra(graph,"A").distance.C,Infinity);
  assert.equal(bellmanFord(graph,"A").distance.C,Infinity);
});
test("Dijkstra rejects negative edges while Bellman-Ford supports them",()=>{
  const graph={A:{B:4,C:5},B:{C:-2},C:{}};
  assert.throws(()=>dijkstra(graph,"A"),/non-negative/);
  assert.equal(bellmanFord(graph,"A").distance.C,2);
});
test("Bellman-Ford detects reachable negative cycles",()=>{
  const graph={A:{B:1},B:{C:-2},C:{A:0}};
  assert.throws(()=>bellmanFord(graph,"A"),/negative-weight cycle/);
});
test("Bayes formula matches a known base-rate example",()=>{
  const posterior=bayesPosterior(0.01,0.99,0.05);
  assert.ok(Math.abs(posterior-1/6)<1e-12);
});
test("Bayes implementation rejects invalid probabilities and impossible evidence",()=>{
  assert.throws(()=>bayesPosterior(1.2,0.9,0.1),/between 0 and 1/);
  assert.throws(()=>bayesPosterior(0,0,0),/zero probability/);
});
