import { fitModel } from "./stats";

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

/* TODO:

New thread
Timeout
Can propagate actual function result around easily if need be
Go through planned input sizes many times and take medians at end

*/
