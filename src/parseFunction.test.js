import {
  parseFunction,
  parseName,
  parseArgument,
  parseBody,
} from "./parseFunction.js";

test("extracts normal function name", () => {
  const code = "function makesFour() { return 2 + 2; }";
  const funcName = parseName(code);
  expect(funcName).toBe("makesFour");
});

test("extracts name with weird spacing", () => {
  const code = " function  makesSix  () { return 6 + 1; }";
  const funcName = parseName(code);
  expect(funcName).toBe("makesSix");
});

test("extracts argument name", () => {
  const code = `function sayHelloTo(name) {
    console.log("Hello " + name);
  }`;
  const argument = parseArgument(code);
  expect(argument).toBe("name");
});

test("extracts simple function body", () => {
  const code = `function makesFour() {
    const one = 1;
    const three = 3;
    return one + three;
  }`;
  const expectedBody = `
    const one = 1;
    const three = 3;
    return one + three;
  `;
  const body = parseBody(code);
  expect(body).toBe(expectedBody);
});

test("parses simple function", () => {
  const code = `function addsFour(number) {
    const four = 4;
    return number + 4;
  }`;
  const fn = parseFunction(code);
  const result = fn.call(this, 6);
  expect(result).toBe(10);
});

/* TODO:

Robustness testing on user input: e.g. comment after function contatining '}' character
Handle multiple arguments

*/
