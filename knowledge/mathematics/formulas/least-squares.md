# Least-Squares Objective and Normal Equations

- **ID:** \`math.formula.least-squares\`
- **Type:** Formula card
- **Prerequisites:** Vectors, matrices, derivatives
- **Status:** Draft; numerical examples require review

## Objective

Given a design matrix \(X\) and target vector \(y\), least squares chooses parameters \(\beta\) to minimise the sum of squared residuals:

\[
\hat{\beta}=\arg\min_\beta\|X\beta-y\|_2^2
\]

The residual vector is \(r=X\beta-y\).

## Normal equations

Differentiate the objective:

\[
\nabla_\beta\|X\beta-y\|_2^2=2X^\top(X\beta-y)
\]

Set the gradient to zero:

\[
X^\top X\hat{\beta}=X^\top y
\]

If \(X\) has full column rank, the solution is unique:

\[
\hat{\beta}=(X^\top X)^{-1}X^\top y
\]

This last expression is a mathematical identity under the stated rank condition. In numerical code, do not explicitly compute the inverse.

## When to use it

Use least squares for linear regression, curve fitting, parameter estimation, and overdetermined linear systems.

## Assumptions and cautions

- The objective minimises squared Euclidean residuals.
- Statistical interpretation requires additional assumptions about the data and noise.
- Rank deficiency can make the solution non-unique.
- Poor conditioning can make the normal equations numerically unstable.
- QR or singular value decomposition is often safer than forming \(X^\top X\).
- Check residuals, outliers, feature scaling, and data leakage.

## Related concepts

- Linear algebra.
- Linear regression.
- QR decomposition.
- Singular value decomposition.
- Ridge regression.
