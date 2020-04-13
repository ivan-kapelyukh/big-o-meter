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
