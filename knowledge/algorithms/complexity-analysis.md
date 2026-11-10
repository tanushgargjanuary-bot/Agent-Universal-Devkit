# Complexity Analysis

- **ID:** `algo.complexity-analysis`
- **Type:** Algorithm analysis method
- **Level:** Foundational to advanced
- **Prerequisites:** Basic programming, loops, recursion, logarithms
- **Status:** Draft; technical review required before production reliance

## 1. Problem it solves

Complexity analysis estimates how an algorithm's resource use grows as input size grows. It helps compare approaches before running large workloads.

It does not predict exact wall-clock time. Hardware, runtime, memory layout, input distribution, and implementation details also matter.

## 2. Input size

Let \(n\) represent the size of the input. Define it carefully.

Examples:
- Array processing: number of elements.
- Graph processing: vertices \(V\) and edges \(E\).
- Matrix multiplication: dimensions \(m\), \(n\), and \(p\).
- String matching: text length \(n\) and pattern length \(m\).

A single variable may hide important structure. For graph algorithms, use both \(V\) and \(E\).

## 3. Asymptotic notation

- \(O(g(n))\): asymptotic upper bound.
- \(\Omega(g(n))\): asymptotic lower bound.
- \(\Theta(g(n))\): asymptotically tight bound.

For non-negative functions, \(f(n)=O(g(n))\) means there are constants \(c>0\) and \(n_0\) such that \(f(n)\le c g(n)\) for all \(n\ge n_0\).

Big-O does not mean worst case by itself. Worst-case, average-case, and best-case are input-analysis choices. Big-O describes the bound being stated.

## 4. Common growth rates

From slower to faster growth, for large \(n\):

- \(O(1)\): constant.
- \(O(\log n)\): logarithmic.
- \(O(n)\): linear.
- \(O(n\log n)\): linearithmic.
- \(O(n^2)\): quadratic.
- \(O(n^3)\): cubic.
- \(O(2^n)\): exponential.
- \(O(n!)\): factorial.

The ordering is asymptotic. Constants and lower-order terms can dominate for small inputs.

## 5. Useful analysis rules

- Sequential sections: add their costs, then keep the dominant growth term.
- Nested loops: multiply iteration counts when the bounds are independent.
- Halving or doubling a search range: often gives logarithmic iteration count.
- Recursion: write a recurrence and solve or bound it.
- Data-structure operations: state the assumptions, such as expected hash-table lookup versus worst-case lookup.

Examples:
- One pass through an array: \(\Theta(n)\).
- Two independent passes: \(\Theta(n+n)=\Theta(n)\).
- A loop inside a loop, each over \(n\): \(\Theta(n^2)\).
- Repeatedly halve a range: \(\Theta(\log n)\).

## 6. Recurrences

A divide-and-conquer algorithm often has a recurrence:

\[
T(n)=aT(n/b)+f(n)
\]

Here:
- \(a\) is the number of subproblems.
- \(n/b\) is each subproblem's size.
- \(f(n)\) is work outside recursive calls.

For example, merge sort satisfies \(T(n)=2T(n/2)+\Theta(n)\), giving \(\Theta(n\log n)\).

Do not apply a recurrence shortcut without checking that the subproblem sizes and non-recursive work match its assumptions.

## 7. Space complexity

Distinguish:
- **Input space:** memory occupied by the input.
- **Auxiliary space:** extra memory used by the algorithm.
- **Total space:** input plus extra memory, when that is the chosen convention.

For recursive algorithms, include the call stack. An in-place algorithm may still use \(O(\log n)\) stack space.

## 8. Practical decision checklist

1. Identify all meaningful input dimensions.
2. State whether the analysis is best, average, expected, or worst case.
3. Count dominant operations.
4. Include memory and recursion.
5. State assumptions about data structures and input distribution.
6. Compare asymptotic growth.
7. Benchmark representative inputs before making performance claims.

## 9. Common errors

- Calling Big-O synonymous with worst-case.
- Dropping a variable that changes independently.
- Ignoring recursion stack or temporary buffers.
- Treating expected hash lookup as a guaranteed constant-time worst case.
- Assuming asymptotically faster always means faster for small inputs.
- Reporting exact runtime from asymptotic notation.

## 10. Worked comparison

Suppose one approach scans an array once and another sorts it before scanning.

- Scan: \(\Theta(n)\) time and usually \(O(1)\) auxiliary space.
- Sort then scan: typically \(\Theta(n\log n)\) time, with algorithm-dependent extra space.

If only one query is needed, sorting may be wasteful. If many later queries benefit from sorted order, the initial sorting cost may be justified.

## 11. Further connections

- Recurrence relations.
- Amortised analysis.
- Randomised algorithms.
- Cache complexity and memory hierarchy.
- Time-space trade-offs.
- Empirical profiling and benchmarking.

## Sources for verification

Use standard algorithm-analysis texts and primary documentation for implementation-specific behaviour. This entry is an original explanation, not copied course material.
