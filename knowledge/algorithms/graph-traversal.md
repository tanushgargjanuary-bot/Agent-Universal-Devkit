# Graph Traversal: BFS and DFS

- **ID:** `algo.graph-traversal`
- **Type:** Algorithm family
- **Level:** Foundational to advanced
- **Prerequisites:** Graph representation, queues, stacks, recursion
- **Status:** Draft; implementation examples and tests required

## 1. Graph model

A graph is \(G=(V,E)\), where \(V\) is a set of vertices and \(E\) is a set of edges.

Graphs may be directed or undirected, weighted or unweighted. A traversal visits vertices while following edges.

Common representations:
- Adjacency list: stores neighbours for each vertex. Space is \(O(V+E)\).
- Adjacency matrix: stores edge presence or weight for each vertex pair. Space is \(O(V^2)\).

Use an adjacency list for sparse graphs. A matrix can be useful for dense graphs or constant-time edge checks.

## 2. Breadth-first search (BFS)

BFS explores vertices in layers of increasing edge distance from a start vertex.

Use BFS when:
- Finding shortest paths by number of edges in an unweighted graph.
- Finding connected components in an undirected graph.
- Exploring states by increasing number of transitions.
- Checking reachability.

Core idea:
1. Mark the start vertex as discovered.
2. Add it to a FIFO queue.
3. Remove the next vertex from the queue.
4. Visit each undiscovered neighbour, mark it immediately, and enqueue it.
5. Continue until the queue is empty.

Pseudocode:

```text
BFS(graph, start):
    discovered = {start}
    distance[start] = 0
    queue = [start]

    while queue is not empty:
        u = queue.pop_front()
        for v in graph.neighbours(u):
            if v not in discovered:
                discovered.add(v)
                distance[v] = distance[u] + 1
                parent[v] = u
                queue.push_back(v)

    return discovered, distance, parent
```

With an adjacency list, time is \(O(V+E)\). Auxiliary memory is \(O(V)\), excluding the graph.

Mark vertices when enqueuing, not when dequeuing. This prevents duplicate queue entries.

## 3. Depth-first search (DFS)

DFS follows one path as far as possible before backtracking.

Use DFS when:
- Exploring reachability.
- Detecting cycles.
- Finding connected components.
- Producing topological order in a directed acyclic graph.
- Building strongly connected component algorithms.
- Exploring backtracking state spaces.

Pseudocode:

```text
DFS(graph, start):
    visited = empty set

    visit(u):
        visited.add(u)
        for v in graph.neighbours(u):
            if v not in visited:
                parent[v] = u
                visit(v)

    visit(start)
    return visited, parent
```

With an adjacency list, time is \(O(V+E)\). The stack can use \(O(V)\) space. Use an explicit stack when recursion depth may exceed the language runtime limit.

## 4. BFS versus DFS

| Need | Suitable method |
|---|---|
| Fewest edges in an unweighted graph | BFS |
| Explore reachability | BFS or DFS |
| Cycle detection | DFS or specialised variants |
| Topological sorting | DFS or Kahn's algorithm |
| Deep exploration with limited frontier memory | Often DFS |
| Layer-by-layer state search | BFS |

Neither method solves weighted shortest paths in general.

## 5. Correctness intuition

BFS processes vertices in non-decreasing distance from the source. When a vertex is first discovered, the path used to reach it has the minimum number of edges.

DFS guarantees systematic exploration of reachable vertices when the visited set is maintained. Its discovery order does not generally provide shortest paths.

## 6. Important edge cases

- Empty graph or missing start vertex.
- Disconnected graph.
- Self-loops.
- Parallel edges.
- Directed versus undirected traversal.
- Very deep graphs and recursion limits.
- Invalid vertex identifiers.

To traverse every component, start a traversal from each vertex that remains unvisited.

## 7. Common mistakes

- Forgetting a visited/discovered set.
- Marking BFS vertices only after dequeue.
- Using BFS for weighted edges without proving weights are equal.
- Assuming DFS discovery paths are shortest.
- Ignoring graph representation costs.

## 8. Further connections

- Dijkstra's algorithm.
- A* search.
- Topological sorting.
- Connected components.
- Strongly connected components.
- Minimum spanning trees.
- Model checking and state-space search.

## Sources for verification

Check standard graph-algorithm references and implementation documentation. This explanation is original repository material.
