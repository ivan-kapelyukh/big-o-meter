// takes array of pair arrays, e.g. [[n1, t1], ..., [nm, tm]]
function getComplexity(data) {
  var complexity = {};

  var expCurve = getExpCurve(data);
  var polyCurve = getPolyCurve(data);

  var expRSqrd = getR2("exponential", expCurve, data);
  var polyRSqrd = getR2("polynomial", polyCurve, data);

  if (expRSqrd > polyRSqrd) {
    complexity.exponential = true;
  } else {
    complexity.exponential = false;
    complexity.degree = polyCurve.n;
  }

  return complexity;
}

// expCurve has form: y = k * e ^ (c * x), so has fields k, c
function getExpCurve(data) {
  var expCurve = {};
  var dataLogifiedT = data.map(([n, t]) => ([n, Math.log2(t)]));
  var bestFitLine = getBestFitLine(dataLogifiedT);
  expCurve.c = bestFitLine.m;
  expCurve.k = Math.pow(2, bestFitLine.c);

  return expCurve;
}

// TODO: what if actual best curve have x^3 + x^2, but x^3 has v. small coeff?
  // need to look at big n

// polyCurve has form: y = k * x ^ n, so has fields k, cn
function getPolyCurve(data) {
  var polyCurve = {};
  var dataLogified = data.map(([n, t]) => ([Math.log2(n), Math.log2(t)]));
  var bestFitLine = getBestFitLine(dataLogified);
  polyCurve.n = bestFitLine.m;
  polyCurve.k = Math.pow(2, bestFitLine.c);

  return polyCurve; 
}

// returns straight line y = m * x + c, so has fields m, c
// uses linear regression
function getBestFitLine(data) {
  var line = {};

  var result = linearRegression(data, {precision: 10});
  line.m = result.equation[0];
  line.c = result.equation[1];

  return line;
}

function getR2(curveType, curve, data) {
  return -1;
}