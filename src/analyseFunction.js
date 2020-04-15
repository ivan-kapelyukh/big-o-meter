export function analyseFunction(fn) {
  const result = fn.call(this, 1000);
  return result;
}
