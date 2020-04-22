import regression from "regression";

export function fitModel(data) {
  const [training, testing] = splitData(data);

  console.log("Training:");
  console.log(training);
  console.log("Testing:");
  console.log(testing);

  const polyModel = trainPolyModel(training);
  const expModel = trainExpModel(training);

  polyModel.r2 = testModel(polyModel, testing);
  expModel.r2 = testModel(expModel, testing);

  console.log(`Poly r2: ${polyModel.r2}`);
  console.log(`Exp r2: ${expModel.r2}`);

  return [polyModel, expModel].reduce((m1, m2) => (m2.r2 > m1.r2 ? m2 : m1));
}

// Take last third for testing, rest for training.
// Larger runtimes more discriminatory.
export function splitData(data) {
  const n = data.length;
  const testing = data.slice(Math.floor((2 * n) / 3));
  const training = data.slice(0, Math.floor((2 * n) / 3));
  return [training, testing];
}

export function trainPolyModel(data) {
  const logData = data
    .filter(([x, y]) => x > 0 && y > 0)
    .map(([x, y]) => [Math.log2(x), Math.log2(y)]);
  const [gradient, intercept] = regression.linear(logData, {
    precision: 10,
  }).equation;

  // Power is integer, so need new optimal offset given rounded gradient.
  const power = Math.round(gradient);
  const offset =
    logData.map(([x, y]) => y - power * x).reduce((a, b) => a + b, 0.0) /
    logData.length;

  const coeff = Math.pow(2, offset);
  const model = { power, coeff };
  model.toString = () => `${coeff} * x ^ ${power}`;
  model.predict = (x) => coeff * Math.pow(x, power);

  console.log("Poly model:");
  console.log(model);

  return model;
}

export function trainExpModel(data) {
  const base = 2;

  const logData = data
    .filter(([_, y]) => y > 0)
    .map(([x, y]) => [x, Math.log(y) / Math.log(base)]);
  const [gradient, intercept] = regression.linear(logData, {
    precision: 10,
  }).equation;

  const coeff = Math.pow(base, intercept);
  const powerCoeff = gradient;

  const model = { base, coeff, powerCoeff };
  model.toString = () => `${coeff} * ${base} ^ (${powerCoeff} * x)`;
  model.predict = (x) => coeff * Math.pow(base, powerCoeff * x);

  console.log("Exp model:");
  console.log(model);

  return model;
}

export function testModel(model, data) {
  const observed = data.map(([_, y]) => y);
  const predicted = data.map(([x, _]) => model.predict(x));
  return r2(observed, predicted);
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

export function rmse(observed, predicted) {
  const n = observed.length;
  return Math.sqrt(
    observed
      .map((y, i) => Math.pow(y - predicted[i], 2))
      .reduce((a, b) => a + b) /
      (1.0 * n)
  );
}
