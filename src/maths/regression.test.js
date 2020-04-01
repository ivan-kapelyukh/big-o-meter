import rmse from "./regression";

test("zero error when predicted matches expected", () => {
  expect(rmse([1, 2, 4], [1, 2, 4])).toBe(0);
});

test("calculates correct error on small example", () => {
  // sqrt(((1 - 1)^2 + (2 - 3)^2 + (4 - 2)^2) / 3) ~= 1.29
  expect(rmse([1, 2, 4], [1, 3, 2])).toBeCloseTo(1.29, 2);
});
