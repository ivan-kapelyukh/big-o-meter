import regression from "regression";
import { rmse, r2 } from "./maths/regression.js";

export function analyseFunction(fn, addToLog) {
  const inputRuntimes = varyRuntimes(fn, addToLog);
  const model = fitModel(inputRuntimes);
  addToLog(`Coeff: ${model.coeff}, power: ${model.power}`);
  return inputRuntimes;
}

export function varyRuntimes(fn, addToLog) {
  const MIN_TIME = 100;
  let inputSize = 0;
  let n = 54;

  let inputRuntimes = [];

  for (let i = 0; i < n; i++) {
    const input = generateInput(inputSize);
    const time = timedCall(fn, input);
    addToLog(
      `Function took ${Math.round(time)} ms for input of size ${inputSize}`
    );

    inputRuntimes.push([inputSize, time]);
    inputSize = Math.floor(1.1 * inputSize) + 1;
  }

  // Filter out very low runtimes: those are less robust.
  inputRuntimes = inputRuntimes.filter(([inputSize, time]) => time > MIN_TIME);
  return inputRuntimes;
}

export function timedCall(fn, input) {
  const start = performance.now();
  const result = fn.call(this, input);
  const end = performance.now();
  return end - start;
}

export function generateInput(size) {
  return size;
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
  model.predict = (x) => model.coeff * Math.pow(x, model.power);

  const observed = data.map(([_, y]) => y);
  const predicted = data.map(([x, _]) => model.predict(x));
  model.r2 = r2(observed, predicted);

  console.log(model);

  return model;
}

/* TODO:

New thread
Timeout
Can propagate actual function result around easily if need be
Go through planned input sizes many times and take medians at end

*/
