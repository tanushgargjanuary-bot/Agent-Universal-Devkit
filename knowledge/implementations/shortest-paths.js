export function dijkstra(graph, source) {
  if (!graph || typeof graph !== "object" || !Object.hasOwn(graph, source)) throw new Error("Source vertex is missing");
  const vertices = Object.keys(graph), distance = Object.fromEntries(vertices.map((v)=>[v,Infinity]));
  const previous = Object.fromEntries(vertices.map((v)=>[v,null]));
  const unvisited = new Set(vertices); distance[source]=0;
  for (const edges of Object.values(graph)) for (const [to,weight] of Object.entries(edges)) {
    if (!Object.hasOwn(graph,to)) throw new Error("Unknown vertex: "+to);
    if (!Number.isFinite(weight) || weight < 0) throw new Error("Dijkstra requires finite non-negative edge weights");
  }
  while(unvisited.size){
    let current=null;
    for(const vertex of unvisited) if(current===null||distance[vertex]<distance[current]) current=vertex;
    if(current===null||distance[current]===Infinity) break;
    unvisited.delete(current);
    for(const [next,weight] of Object.entries(graph[current])){
      const candidate=distance[current]+weight;
      if(candidate<distance[next]){distance[next]=candidate;previous[next]=current;}
    }
  }
  return {distance,previous};
}

export function bellmanFord(graph, source) {
  if (!graph || typeof graph !== "object" || !Object.hasOwn(graph, source)) throw new Error("Source vertex is missing");
  const vertices=Object.keys(graph), edges=[];
  for(const [from,adjacency] of Object.entries(graph)) for(const [to,weight] of Object.entries(adjacency)){
    if(!Object.hasOwn(graph,to)) throw new Error("Unknown vertex: "+to);
    if(!Number.isFinite(weight)) throw new Error("Edge weights must be finite");
    edges.push([from,to,weight]);
  }
  const distance=Object.fromEntries(vertices.map(v=>[v,Infinity]));
  const previous=Object.fromEntries(vertices.map(v=>[v,null])); distance[source]=0;
  for(let i=1;i<vertices.length;i++){
    let changed=false;
    for(const [from,to,weight] of edges){
      if(distance[from]!==Infinity&&distance[from]+weight<distance[to]){
        distance[to]=distance[from]+weight;previous[to]=from;changed=true;
      }
    }
    if(!changed) break;
  }
  for(const [from,to,weight] of edges) if(distance[from]!==Infinity&&distance[from]+weight<distance[to]) throw new Error("Reachable negative-weight cycle");
  return {distance,previous};
}
