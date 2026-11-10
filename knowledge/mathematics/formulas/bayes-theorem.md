# Bayes' Theorem

- **ID:** \`math.formula.bayes-theorem\`
- **Type:** Formula card
- **Prerequisites:** Conditional probability, event partitions
- **Status:** Draft; worked examples require review

## Formula

For events \(H\) and \(E\), where \(P(E)>0\):

\[
P(H\mid E)=\frac{P(E\mid H)P(H)}{P(E)}
\]

If \(H\) and its alternatives form a partition:

\[
P(E)=\sum_i P(E\mid H_i)P(H_i)
\]

## Meaning of each term

- \(P(H)\): prior probability of the hypothesis.
- \(P(E\mid H)\): likelihood of observing the evidence if the hypothesis is true.
- \(P(E)\): total probability of the evidence across all hypotheses.
- \(P(H\mid E)\): posterior probability after observing the evidence.

## When to use it

Use Bayes' theorem when evidence changes the probability assigned to a hypothesis. Common examples include diagnostic tests, spam filtering, fault diagnosis, Bayesian classification, and reliability analysis.

## Worked example

A condition affects 1% of a population. A test has 99% sensitivity and 95% specificity.

Let \(H\) mean the person has the condition and \(E\) mean the test is positive.

\[
P(H)=0.01,\quad P(E\mid H)=0.99
\]

\[
P(E\mid H^c)=1-0.95=0.05
\]

Then:

\[
P(E)=0.99(0.01)+0.05(0.99)=0.0594
\]

\[
P(H\mid E)=\frac{0.99(0.01)}{0.0594}\approx0.1667
\]

The chance is about 16.7%, not 99%. The base rate matters.

## Assumptions and cautions

- Define the hypothesis and evidence precisely.
- Use probabilities from a relevant population and test setting.
- Do not confuse sensitivity with positive predictive value.
- Do not assume conditional probabilities remain stable across populations.
- Check whether the hypothesis alternatives form a complete partition.
- Avoid double-counting dependent evidence.

## Related concepts

- Conditional probability.
- Law of total probability.
- Likelihood ratios.
- Naive Bayes.
- Bayesian networks.
