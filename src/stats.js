import regression from "regression";

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

export function fitModel(data) {
  const polyModel = fitPolyModel(data);
  return polyModel;
}

export function fitPolyModel(data) {
  const logData = data
    .filter(([x, y]) => x > 0 && y > 0)
    .map(([x, y]) => [Math.log(x), Math.log(y)]);
  const [gradient, intercept] = regression.linear(logData, {
    precision: 10,
  }).equation;

  console.log(`Gradient: ${gradient}`);
  console.log(`Old offset: ${intercept}`);

  // Power is integer, so need new optimal offset given rounded gradient.
  const power = Math.round(gradient);
  const offset =
    logData.map(([x, y]) => y - power * x).reduce((a, b) => a + b, 0.0) /
    logData.length;

  console.log(`New offset: ${offset}`);

  const coeff = Math.exp(offset);
  const model = { power, coeff };
  model.predict = (x) => coeff * Math.pow(x, power);

  const observed = data.map(([_, y]) => y);
  const predicted = data.map(([x, _]) => model.predict(x));
  model.r2 = r2(observed, predicted);

  console.log(model);

  return model;
}
