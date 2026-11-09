# Linear Algebra for Engineering and Machine Learning

- **ID:** `math.linear-algebra`
- **Type:** Mathematical method collection
- **Level:** Foundational to advanced
- **Prerequisites:** Algebra, functions, systems of equations
- **Status:** Draft; numerical examples and review required

## 1. Why it matters

Linear algebra represents and transforms structured numerical data. It is central to graphics, simulation, control, optimisation, statistics, and machine learning.

## 2. Vectors

A vector is an ordered collection of numbers. In machine learning, a vector may represent features, parameters, or an output.

For vectors (x,yinmathbb{R}^n), the dot product is:

[
x^	op y = sum_{i=1}^{n}x_i y_i
]

The Euclidean norm is:

[
|x|_2 = sqrt{sum_{i=1}^{n}x_i^2}
]

The dot product measures alignment as well as contributing to projections and linear models. A zero vector has no direction.

## 3. Matrices and dimensions

A matrix (Ainmathbb{R}^{m	imes n}) has (m) rows and (n) columns.

If (A) is (m	imes n) and (B) is (n	imes p), then (AB) is (m	imes p).

Matrix multiplication is generally not commutative: (AB
eq BA). Check dimensions before multiplying.

A linear system can be written as:

[
Ax=b
]

The system may have one solution, no solution, or infinitely many solutions. Rank and consistency determine which case applies.

## 4. Linear transformations

A matrix can represent a linear transformation:

[
T(x)=Ax
]

The columns of (A) describe where the standard basis vectors are mapped. This interpretation helps explain rotations, projections, scaling, and feature transformations.

## 5. Eigenvalues and eigenvectors

For a square matrix (A), a non-zero vector (v) is an eigenvector with eigenvalue (lambda) if:

[
Av=lambda v
]

Eigenvectors identify directions that a transformation scales without changing direction. Eigenvalues describe the scale and sign.

Applications include stability analysis, principal component analysis, and spectral graph methods. Real-world numerical methods must account for conditioning and floating-point error.

## 6. Least squares

When (Ax=b) has no exact solution, least squares finds (x) that minimises:

[
min_x |Ax-b|_2^2
]

For full-column-rank (A), the normal equations are:

[
A^	op A x=A^	op b
]

The normal equations can worsen conditioning. QR or singular value decomposition methods are often more numerically stable.

## 7. Singular value decomposition

A real matrix can be decomposed as:

[
A=USigma V^	op
]

Here (U) and (V) are orthogonal matrices, and (Sigma) contains non-negative singular values.

SVD supports low-rank approximation, dimensionality reduction, pseudoinverses, and analysis of numerical rank.

## 8. Machine-learning connections

- Linear regression uses matrix multiplication to map features to predictions.
- Neural-network layers apply affine transformations followed by nonlinear functions.
- PCA uses covariance structure and eigenvectors or SVD.
- Optimisers use gradients, which can be represented as vectors.
- Embeddings represent entities as vectors in a learned space.

## 9. Numerical cautions

- Floating-point arithmetic introduces rounding error.
- Ill-conditioned systems can amplify small input errors.
- Avoid explicitly computing a matrix inverse when solving a system.
- Check dimensions and data types.
- Use stable numerical routines for large or ill-conditioned problems.
- Normalise features when the method and model assumptions support it.

## 10. Worked shape example

If (X) has 100 rows and 4 feature columns, then (Xinmathbb{R}^{100	imes4}). If weights (winmathbb{R}^{4}), predictions (Xw) have 100 entries.

The dimensions explain why the operation is valid and what each output represents.

## Sources for verification

Use standard linear-algebra texts and numerical-library documentation to verify identities and implementation details. This is original explanatory material.
