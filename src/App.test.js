import React from "react";
import { render } from "@testing-library/react";
import App from "./App";

test("extracts normal function name", () => {
  const code = "function makesFour() { return 2 + 2; }";
  const funcName = App.extractFuncName(code);
  expect(funcName).toBe("makesFour");
});

test("extracts name with weird spacing", () => {
  const code = " function  makesSix  () { return 6 + 1; }";
  const funcName = App.extractFuncName(code);
  expect(funcName).toBe("makesSix");
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
  const body = App.extractFuncBody(code);
  expect(body).toBe(expectedBody);
});
