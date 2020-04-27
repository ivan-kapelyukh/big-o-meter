import { rmse, r2 } from "./stats";

test("zero error when predicted matches expected", () => {
  expect(rmse([1, 2, 4], [1, 2, 4])).toBe(0);
});

test("calculates correct error on small example", () => {
  // sqrt(((1 - 1)^2 + (2 - 3)^2 + (4 - 2)^2) / 3) ~= 1.29
  expect(rmse([1, 2, 4], [1, 3, 2])).toBeCloseTo(1.29, 2);
});

test("calculates r2 on simple dataset", () => {
  const observed = [2, 4, 5, 4, 5];
  const predicted = [2.8, 3.4, 4.0, 4.6, 5.2];
  expect(r2(observed, predicted)).toBeCloseTo(0.6, 4);
});
