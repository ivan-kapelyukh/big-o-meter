export function analyseFunction(fn, addToLog) {
  const input = 100000000;
  const time = timedCall(fn, input);
  addToLog(`Function took ${Math.round(time)} ms`);
}

export function timedCall(fn, input) {
  const start = performance.now();
  const result = fn.call(this, input);
  const end = performance.now();
  return end - start;
}

/* TODO:

Can propagate actual function result around easily if need be
Go through planned input sizes many times and take medians at end

*/
