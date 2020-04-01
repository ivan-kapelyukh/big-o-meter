function rmse(expected, predicted) {
  const n = expected.length;
  return Math.sqrt(
    expected
      .map((y, i) => Math.pow(y - predicted[i], 2))
      .reduce((a, b) => a + b) /
      (1.0 * n)
  );
}

module.exports = rmse;
