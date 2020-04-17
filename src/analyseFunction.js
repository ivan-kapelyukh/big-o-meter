export function analyseFunction(fn, addToLog) {
  const [inputSizes, times] = varyRuntimes(fn, addToLog);
  return [inputSizes, times];
}

export function varyRuntimes(fn, addToLog) {
  let inputSize = 0;
  let n = 32;

  let inputSizes = [];
  let times = [];

  for (let i = 0; i < n; i++) {
    const input = generateInput(inputSize);
    const time = timedCall(fn, input);
    addToLog(
      `Function took ${Math.round(time)} ms for input of size ${inputSize}`
    );

    inputSizes.push(inputSize);
    times.push(time);
    inputSize = Math.floor(1.2 * inputSize) + 1;
  }

  return [inputSizes, times];
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
