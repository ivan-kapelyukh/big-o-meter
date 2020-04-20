export function rmse(observed, predicted) {
  const n = observed.length;
  return Math.sqrt(
    observed
      .map((y, i) => Math.pow(y - predicted[i], 2))
      .reduce((a, b) => a + b) /
      (1.0 * n)
  );
}

export function r2(observed, predicted) {
  const mean = observed.reduce((a, b) => a + b, 0.0) / observed.length;
  const ssTotal = observed
    .map((y) => Math.pow(y - mean, 2))
    .reduce((a, b) => a + b, 0.0);
  const ssResidual = observed
    .map((y, i) => Math.pow(y - predicted[i], 2))
    .reduce((a, b) => a + b, 0.0);

  return 1 - ssResidual / ssTotal;
}
