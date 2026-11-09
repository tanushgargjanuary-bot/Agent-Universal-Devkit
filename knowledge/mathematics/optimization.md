# Optimisation and Gradient-Based Methods

- **ID:** `math.optimisation`
- **Type:** Mathematical method collection
- **Level:** Intermediate to advanced
- **Prerequisites:** Functions, derivatives, vectors, matrices
- **Status:** Draft; numerical examples and implementation tests required

## 1. Problem formulation

Optimisation chooses decision variables to minimise or maximise an objective while satisfying constraints.

A general minimisation problem is:

\[
\min_x f(x)\quad\text{subject to}\quad g_i(x)\le0,\; h_j(x)=0
\]

Define the variables, objective, constraints, units, and feasible region before selecting a solver.

## 2. Derivatives and gradients

For a differentiable scalar function \(f(x)\), the derivative describes local rate of change.

For a multivariable function, the gradient is:

\[
\nabla f(x)=
\begin{bmatrix}
\partial f/\partial x_1\\
\vdots\\
\partial f/\partial x_n
\end{bmatrix}
\]

The gradient points in the direction of steepest local increase under the Euclidean norm. The negative gradient is a local descent direction when the gradient is non-zero.

## 3. Gradient descent

The basic update is:

\[
x_{t+1}=x_t-\eta\nabla f(x_t)
\]

Here \(\eta>0\) is the learning rate or step size.

A step that is too large can diverge or oscillate. A step that is too small can make progress very slow.

Gradient descent is a method, not a guarantee of finding a global optimum for arbitrary functions.

## 4. Convexity

A function is convex when its value along a line segment does not exceed the corresponding linear interpolation of endpoint values.

For differentiable convex objectives, every local minimum is a global minimum. Strict convexity gives at most one minimiser.

For non-convex objectives, local minima, saddle points, and flat regions may occur.

## 5. Second-order information

The Hessian is the matrix of second partial derivatives:

\[
H(x)=\nabla^2 f(x)
\]

Near a point, curvature information can improve optimisation steps. Newton's method uses:

\[
x_{t+1}=x_t-H(x_t)^{-1}\nabla f(x_t)
\]

In implementations, solve the associated linear system rather than explicitly forming the inverse. Newton steps can fail when the Hessian is singular or not positive definite, and they can be expensive in high dimensions.

## 6. Constrained optimisation

For constraints, methods may include:
- Projected gradient methods.
- Penalty and barrier methods.
- Lagrange multipliers.
- Karush-Kuhn-Tucker conditions.
- Linear or quadratic programming solvers.

The appropriate method depends on convexity, smoothness, constraint type, scale, and required guarantees.

## 7. Lagrange multipliers

For equality constraints \(h(x)=0\), define:

\[
\mathcal{L}(x,\lambda)=f(x)+\lambda h(x)
\]

At a regular constrained optimum, stationarity conditions include:

\[
\nabla_x\mathcal{L}(x,\lambda)=0,\qquad h(x)=0
\]

These are necessary conditions under suitable assumptions. They are not automatically sufficient for a global optimum.

## 8. Machine-learning connections

- Linear regression can be formulated as least squares.
- Logistic regression minimises a convex loss under standard formulation.
- Neural-network training commonly uses stochastic gradient methods on non-convex objectives.
- Regularisation adds terms that penalise model complexity.
- Learning-rate schedules change step size during training.

## 9. Practical validation

1. Check the objective and constraints match the real problem.
2. Scale variables when units or magnitudes differ greatly.
3. Check gradients numerically on small examples.
4. Track objective values and constraint violations.
5. Use multiple initial points for non-convex problems when appropriate.
6. Check stopping criteria and convergence status.
7. Compare against a baseline or trusted solver.
8. Test sensitivity to data, initialisation, and hyperparameters.

## 10. Common mistakes

- Assuming gradient descent always finds a global minimum.
- Ignoring scale and conditioning.
- Using an excessive learning rate.
- Treating KKT conditions as sufficient without checking assumptions.
- Comparing objective values from differently scaled formulations.
- Reporting convergence without checking constraints and residuals.

## Sources for verification

Use standard optimisation texts and numerical solver documentation. This entry is original explanatory material.
