import { fitModel } from "./stats";

export function analyseFunction(fn, updateProgress) {
  const inputRuntimes = varyRuntimes(fn, updateProgress);
  const model = fitModel(inputRuntimes);
  return [inputRuntimes, model];
}

export function varyRuntimes(fn, updateProgress) {
  const TIME_LIMIT = 10000;

  let inputSize = 0;
  let totalTime = 0;
  let inputRuntimes = [];
  let sizeGrowth = 1.1;

  while (totalTime < TIME_LIMIT) {
    const input = generateInput(inputSize);
    const time = timedCall(fn, input);

    inputRuntimes.push([inputSize, time]);
    totalTime += time;

    // Once we get to TIME_LIMIT, almost done analysing!
    updateProgress(Math.min(0.95, totalTime / TIME_LIMIT));

    // Grow or cut growthFactor to keep reasonable runtime growth rate.
    const FAST_SIZE_GROWTH = 1.1;
    const SLOW_SIZE_GROWTH = 1.01;
    const TIME_GROWTH_THRESHOLD = 1.4;

    if (inputRuntimes.length >= 2) {
      const timeGrowth =
        inputRuntimes[inputRuntimes.length - 1][1] /
        inputRuntimes[inputRuntimes.length - 2][1];
      if (timeGrowth < TIME_GROWTH_THRESHOLD) {
        sizeGrowth = FAST_SIZE_GROWTH;
      } else {
        sizeGrowth = SLOW_SIZE_GROWTH;
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
