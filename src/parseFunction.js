export function parseFunction(code) {
  // Need to use this indirection to support recursion.
  return Function("return " + code)();
}

export function parseName(code) {
  // Get last word before opening bracket.
  return code.substring(0, code.indexOf("(")).trim().split(" ").pop();
}

export function parseArgument(code) {
  // Get what's in between the first pair of brackets.
  return code.substring(code.indexOf("(") + 1, code.indexOf(")")).trim();
}

export function parseBody(code) {
  // Get what's in between the first opening bracket and last closing bracket.
  return code.substring(code.indexOf("{") + 1, code.lastIndexOf("}"));
}

// TODO: don't export all functions - use e.g. rewire for testing
