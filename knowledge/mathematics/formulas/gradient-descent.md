# Gradient Descent Update

- **ID:** \`math.formula.gradient-descent\`
- **Type:** Formula card
- **Prerequisites:** Derivatives, vectors, objective functions
- **Status:** Draft; numerical examples require review

## Formula

For parameters \(\theta\) and differentiable objective \(J(\theta)\):

\[
\theta_{t+1}=\theta_t-\eta\nabla J(\theta_t)
\]

## Meaning of each term

- \(\theta_t\): current parameter vector at step \(t\).
- \(J(\theta)\): objective or loss to minimise.
- \(\nabla J(\theta_t)\): gradient at the current parameters.
- \(\eta\): positive step size, often called the learning rate.
- \(\theta_{t+1}\): updated parameter vector.

The negative gradient is a local direction of decrease when the gradient is non-zero.

## Worked scalar example

Let:

\[
J(\theta)=(\theta-3)^2
\]

Then:

\[
\frac{dJ}{d\theta}=2(\theta-3)
\]

Start at \(\theta_0=0\) with \(\eta=0.1\):

\[
\theta_1=0-0.1(2(0-3))=0.6
\]

The update moves the parameter toward the minimum at \(\theta=3\).

## When to use it

Use gradient descent when an objective is differentiable and gradients can be computed or estimated. It is common in linear models, neural networks, and numerical optimisation.

## Variants

- Batch gradient descent: uses the full dataset for each update.
- Stochastic gradient descent: uses one sample per update.
- Mini-batch gradient descent: uses a subset per update.
- Momentum and adaptive methods: modify the update using gradient history or coordinate-wise scaling.

## Assumptions and cautions

- A gradient must exist or a suitable subgradient method must be used.
- The learning rate strongly affects stability and speed.
- Non-convex objectives can have local minima and saddle points.
- A decreasing training loss does not prove good generalisation.
- Check gradients with finite differences on small test cases.
- Check convergence criteria and numerical stability.

## Related concepts

- Chain rule and backpropagation.
- Convexity.
- Stochastic optimisation.
- Momentum and Adam.
- Regularisation.
