import { fitModel } from "./stats";

export function analyseFunction(fn, addToLog) {
  const inputRuntimes = varyRuntimes(fn, addToLog);
  const model = fitModel(inputRuntimes);
  addToLog(`Selected model: ${model}`);
  addToLog(`r2: ${model.r2}`);
  return inputRuntimes;
}

export function varyRuntimes(fn, addToLog) {
  const TIME_LIMIT = 8000;

  let inputSize = 0;
  let totalTime = 0;
  let inputRuntimes = [];
  let sizeGrowth = 1.1;

  while (totalTime < TIME_LIMIT) {
    const input = generateInput(inputSize);
    const time = timedCall(fn, input);

    addToLog(
      `Function took ${Math.round(time)} ms for input of size ${inputSize}`
    );
    inputRuntimes.push([inputSize, time]);
    totalTime += time;

    // Grow or cut growthFactor to keep reasonable runtime growth rate.
    if (inputRuntimes.length >= 2) {
      const timeGrowth =
        inputRuntimes[inputRuntimes.length - 1][1] /
        inputRuntimes[inputRuntimes.length - 2][1];
      if (timeGrowth <= 1.4) {
        sizeGrowth = 1.1;
      } else {
        sizeGrowth = 1.01;
      }
    }

    inputSize = Math.floor(sizeGrowth * inputSize) + 1;
  }

  // Filter out very low runtimes: those are less robust.
  const MIN_TIME = 100;
  inputRuntimes = inputRuntimes.filter(([inputSize, time]) => time >= MIN_TIME);

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
Figure out: is it statistically wrong to choose new input vals based on output of old ones?
Figure out: (0, 0) - is it implicitly included, and should it be?

*/
