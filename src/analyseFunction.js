import { fitModel } from "./stats";

export function analyseFunction(fn, addToLog) {
  const inputRuntimes = varyRuntimes(fn, addToLog);
  const model = fitModel(inputRuntimes);
  addToLog(`Coeff: ${model.coeff}, power: ${model.power}`);
  return inputRuntimes;
}

export function varyRuntimes(fn, addToLog) {
  // Filter out very low runtimes: those are less robust.
  const MIN_TIME = 100;
  const TIME_LIMIT = 8000;

  let inputSize = 0;
  let totalTime = 0;
  let inputRuntimes = [];

  while (totalTime < TIME_LIMIT) {
    const input = generateInput(inputSize);
    const time = timedCall(fn, input);

    if (time >= MIN_TIME) {
      addToLog(
        `Function took ${Math.round(time)} ms for input of size ${inputSize}`
      );
      inputRuntimes.push([inputSize, time]);
      totalTime += time;
    }

    inputSize = Math.floor(1.05 * inputSize) + 1;
  }

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
