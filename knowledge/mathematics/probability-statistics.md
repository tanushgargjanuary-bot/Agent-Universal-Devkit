# Probability and Statistics for Engineering

- **ID:** `math.probability-statistics`
- **Type:** Mathematical method collection
- **Level:** Foundational to advanced
- **Prerequisites:** Algebra, sets, basic functions
- **Status:** Draft; worked numerical tests required

## 1. Why it matters

Probability models uncertainty. Statistics uses observed data to estimate, compare, and test claims about a wider process.

These methods support reliability, experimentation, machine learning, anomaly detection, forecasting, and risk analysis.

## 2. Basic probability

For an event \(A\), probability satisfies:

\[
0\le P(A)\le1
\]

For a complement:

\[
P(A^c)=1-P(A)
\]

For events \(A\) and \(B\):

\[
P(A\cup B)=P(A)+P(B)-P(A\cap B)
\]

If \(A\) and \(B\) are independent, then:

\[
P(A\cap B)=P(A)P(B)
\]

Independence is an assumption. It must not be confused with events being mutually exclusive.

## 3. Conditional probability and Bayes' rule

When \(P(B)>0\):

\[
P(A\mid B)=\frac{P(A\cap B)}{P(B)}
\]

Bayes' rule reverses the conditioning:

\[
P(A\mid B)=\frac{P(B\mid A)P(A)}{P(B)}
\]

Here:
- \(P(A)\) is the prior.
- \(P(B\mid A)\) is the likelihood.
- \(P(B)\) is the evidence probability.
- \(P(A\mid B)\) is the posterior.

For a partition \(A_1,\ldots,A_k\):

\[
P(B)=\sum_i P(B\mid A_i)P(A_i)
\]

## 4. Why base rates matter

A test can be accurate and still produce many false positives when the target condition is rare.

Example:
- Condition prevalence: 1%.
- Sensitivity: 99%.
- Specificity: 95%.

For 10,000 people, about 100 have the condition. About 99 test positive. Of the 9,900 without it, about 495 test positive falsely.

So the positive predictive value is approximately:

\[
\frac{99}{99+495}\approx 16.7\%
\]

This is why a positive result is not the same as a 99% chance of having the condition.

## 5. Random variables and expectation

A random variable maps outcomes to numerical values.

For a discrete random variable \(X\):

\[
E[X]=\sum_x xP(X=x)
\]

Variance measures spread:

\[
\operatorname{Var}(X)=E[(X-E[X])^2]
\]

Standard deviation is the square root of variance.

For independent random variables, variances add. For dependent variables, covariance terms matter.

## 6. Common distributions

- Bernoulli: one binary trial.
- Binomial: number of successes in a fixed number of independent trials with constant success probability.
- Geometric: number of trials until the first success under independent, identical trials.
- Poisson: event counts under a constant-rate model with suitable independence assumptions.
- Normal: continuous bell-shaped model, often useful for measurement errors and approximations.

A distribution is a model. Check whether its assumptions fit the data.

## 7. Estimation and sampling

A sample statistic estimates a population quantity. Sampling bias, dependence, missing data, and measurement errors can make estimates misleading.

A confidence interval describes a procedure's long-run coverage under its assumptions. It is not generally a probability statement about a fixed parameter after the interval has been observed.

## 8. Hypothesis testing

A test begins with a null hypothesis \(H_0\) and an alternative \(H_1\).

- Significance level \(\alpha\): tolerated long-run false-positive rate under the null for the chosen procedure.
- p-value: probability, assuming the null and model assumptions, of a result at least as extreme as the observed result.
- Type I error: rejecting a true null.
- Type II error: failing to reject a false null.
- Power: probability of rejecting the null under a specified alternative.

A p-value is not the probability that the null hypothesis is true. Statistical significance is not the same as practical importance.

## 9. Correlation and regression

Correlation measures association, not causation. Confounding, reverse causality, selection effects, and non-linear relationships can mislead.

Regression models a conditional relationship. Validate residuals, assumptions, data leakage, and performance on held-out data.

## 10. Common mistakes

- Ignoring base rates.
- Treating independence as mutual exclusivity.
- Interpreting correlation as causation.
- Treating p-values as posterior probabilities.
- Ignoring multiple comparisons.
- Using a distribution without checking assumptions.
- Reporting a confidence interval without describing the sampling procedure.

## Sources for verification

Use standard probability and statistics texts and primary statistical-software documentation. This entry is original explanatory material.
