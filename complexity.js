// takes array of pair arrays, e.g. [[n1, t1], ..., [nm, tm]]
function getComplexity(data) {
  var complexity;

  var expCurve = getExpCurve(data);
  var polyCurve = getPolyCurve(data);

  var expRSqrd = getRSqrd(expCurve, data);
  var polyRSqrd = getRSqrd(polyCurve, data);

  if (expRSqrd > polyRSqrd) {
    complexity.exponential = true;
  } else {
    complexity.exponential = false;
    complexity.degree = getPolyDegree(polyCurve);
  }

  return complexity;
}

// expCurve has form: y = k * e ^ (c * x), so has fields k, c
function getExpCurve(data) {
  var expCurve;
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
  var polyCurve;
  var dataLogified = data.map(([n, t]) => ([Math.log2(n), Math.log2(t)]));
  var bestFitLine = getBestFitLine(dataLogified);
  polyCurve.n = bestFitLine.m;
  polyCurve.k = Math.pow(2, bestFitLine.c);

  return polyCurve; 
}

// returns straight line y = m * x + c, so has fields m, c
// uses linear regression
function getBestFitLine(data) {

}