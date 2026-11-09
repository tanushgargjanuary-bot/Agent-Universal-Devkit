# Shortest-Path Algorithm Selection

- **ID:** `algo.shortest-path-selection`
- **Type:** Algorithm selection guide
- **Level:** Intermediate to advanced
- **Prerequisites:** Graphs, BFS, priority queues, relaxation
- **Status:** Draft; implementation tests required

## 1. Define the problem

A shortest-path problem asks for a path with minimum total edge cost between vertices.

Before selecting an algorithm, establish:
- Are edges weighted?
- Can weights be negative?
- Can a reachable negative-weight cycle exist?
- Is the graph directed?
- Is the query single-source, single-pair, or all-pairs?
- Is the graph sparse or dense?
- Is the graph static or changing?

The correct algorithm depends on these facts.

## 2. Selection guide

| Situation | Candidate | Important limitation |
|---|---|---|
| Unweighted graph | BFS | Minimises number of edges |
| Non-negative edge weights, single source | Dijkstra | Does not support negative edges safely |
| Negative edges, no reachable negative cycle | Bellman-Ford | Usually slower than Dijkstra |
| All-pairs, moderate vertex count | Floyd-Warshall | (O(V^3)) time and (O(V^2)) space |
| Single target with useful heuristic | A* | Quality depends on heuristic properties |

This table is a starting point. Check graph size, data structures, and required guarantees.

## 3. Relaxation

For an edge (uightarrow v) with weight (w(u,v)), relaxation checks whether the known path to (u), followed by this edge, improves the known path to (v):

[
d[v] > d[u] + w(u,v)
]

If true, update (d[v]) and record (u) as its predecessor.

Use a sufficiently large infinity value and guard against arithmetic overflow in fixed-width integer implementations.

## 4. Dijkstra's algorithm

Dijkstra repeatedly selects the unsettled vertex with the smallest tentative distance and relaxes its outgoing edges.

Use it when all edge weights are non-negative.

With an adjacency list and binary heap, a common bound is (O((V+E)log V)). Exact bounds depend on the priority-queue implementation and whether duplicate heap entries are allowed.

Do not use ordinary Dijkstra when negative edges exist. A later negative edge can improve a vertex that the algorithm has already settled.

## 5. Bellman-Ford

Bellman-Ford relaxes every edge up to (V-1) times. A further successful relaxation indicates a negative-weight cycle reachable from the source.

Time complexity is (O(VE)). It supports negative edges, but shortest paths are not well-defined for vertices affected by reachable negative cycles.

Use early termination if an entire pass makes no update.

## 6. Floyd-Warshall

Floyd-Warshall computes all-pairs shortest paths using dynamic programming:

[
D_{ij}^{(k)} = min(D_{ij}^{(k-1)}, D_{ik}^{(k-1)} + D_{kj}^{(k-1)})
]

It considers whether a path from (i) to (j) improves by using (k) as an intermediate vertex.

Time is (O(V^3)); space is (O(V^2)). A negative diagonal entry after completion indicates a negative cycle.

## 7. A* search

A* prioritises a path using:

[
f(n)=g(n)+h(n)
]

- (g(n)): known path cost from the start.
- (h(n)): estimated remaining cost to the goal.

For optimality with common graph-search implementations, the heuristic must satisfy the relevant admissibility and consistency conditions. Check the implementation's reopening behaviour and graph assumptions.

A poor heuristic may provide little improvement over Dijkstra.

## 8. Decision checklist

1. Validate whether weights are equal, non-negative, or may be negative.
2. Determine the query type.
3. Check for negative cycles if negative edges are possible.
4. Estimate (V), (E), and memory limits.
5. Choose the simplest algorithm that meets the guarantees.
6. Test disconnected vertices, zero-weight edges, parallel edges, and large values.
7. Compare computed paths against a trusted small-graph reference.

## 9. Common mistakes

- Applying Dijkstra to negative edges.
- Forgetting that an unreachable negative cycle does not affect a source's reachable shortest paths.
- Confusing fewest edges with minimum total weight.
- Using Floyd-Warshall on a graph too large for (O(V^2)) memory.
- Using a non-admissible A* heuristic while claiming optimality.
- Failing to detect arithmetic overflow.

## Sources for verification

Validate algorithm guarantees against standard graph-algorithm texts and tested implementations. This entry is original selection guidance.
