// takes array of pair arrays, e.g. [[n1, t1], ..., [nm, tm]]
// returns complexityData object:
// type: "exponential", "polynomial"
// degree: 0, 1, 2, ... (undefined if type is not polynomial)
// bestExpCurve: expCurve object with fields k, c
// bestPolyCurve: polyCurve object with fields k, n
function analyseComplexity(data) {
  var complexity = {};

  var n = data.length;
  var third = n / 3;

  if (n % 3 != 0) {
    console.log("Number of points should be multiple of 3");
  }

  var testing = [];
  var training = []
  for (var i = 0; i < third; i++) {
    training.push(data[i]);
  }
  for (var i = third; i < 2 * third; i++) {
    testing.push(data[i]);
  }
  for (var i = 2 * third; i < n; i++) {
    training.push(data[i]);
  }

  var expCurve = getExpCurve(training);
  var polyCurve = getPolyCurve(training);

  complexity.expCurve = expCurve;
  complexity.polyCurve = polyCurve;

  var expR2 = getR2("exponential", expCurve, testing);
  var polyR2 = getR2("polynomial", polyCurve, testing);
  console.log("expR2: " + expR2 + ", expCurve: ");
  console.log(expCurve);
  console.log("polyR2: " + polyR2 + ", polyCurve: ");
  console.log(polyCurve);

  if (expR2 > polyR2) {
    complexity.exponential = true;
  } else {
    complexity.exponential = false;
    // TODO: get order of overall polynom
    complexity.degree = Math.round(polyCurve.n);
  }

  return complexity;
}

// expCurve has form: y = k * 2 ^ (c * x), so has fields k, c
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

// polyCurve has form: y = k * x ^ n, so has fields k, n
// TODO: can try handling fractional powers at some point
function getPolyCurve(data) {
  var polyCurve = {};
  var powerResult = fitPower(data, { precision: 10 }).equation;
  polyCurve.k = powerResult[0];
  polyCurve.n = powerResult[1];
  // var dataLogified = data.map(([n, t]) => ([Math.log2(n), Math.log2(t)]));
  // var bestFitLine = getBestFitLine(dataLogified);
  // polyCurve.n = round(bestFitLine.m, 0);
  // polyCurve.k = Math.pow(2, bestFitLine.c);
  // console.log("Polynom from gradient: " + bestFitLine.m + ", with k: " + polyCurve.k);

  return polyCurve;
}

// returns straight line y = m * x + c, so has fields m, c
// uses linear regression
function getBestFitLine(data) {
  var line = {};

  var result = linearRegression(data, { precision: 10 });
  line.m = result.equation[0];
  line.c = result.equation[1];

  return line;
}

function getR2(curveType, curve, data) {
  var n = data.length;

  var yMean = 0;
  for (var i = 0; i < n; i++) {
    yMean += data[i][1];
  }
  yMean /= n;

  var ssTotal = 0;
  var ssResidual = 0;
  for (var i = 0; i < n; i++) {
    var x = data[i][0];
    var y = data[i][1];
    var predicted = getPredictionForX(curveType, curve, x);
    // if (curveType === "exponential")
    // console.log("For point " + x + ", actual: " + y + ", prediction: " + predicted);
    ssTotal += Math.pow(y - yMean, 2);
    ssResidual += Math.pow(y - predicted, 2);
  }

  // console.log("ssRes: " + ssResidual + ", ssTot: " + ssTotal);
  return 1 - (ssResidual / ssTotal);
}

function getPredictionForX(curveType, curve, x) {
  if (curveType === "polynomial") {
    return curve.k * Math.pow(x, curve.n);
  } else if (curveType == "exponential") {
    /* note the "prefer base 2 instead of e" convention */
    return curve.k * Math.pow(2, curve.c * x);
  } else {
    console.log("Unrecognised curve type in R2 determination");
  }
}

// takes array of run data rows, and complexityData object
// returns array of data rows, with first row as graph series headings (first heading horizontal axis, rest vertical)
function complexityDataToGraph(runData, complexityData) {
  var graphData = [];
  var hLabel = "Input size";
  var v1Label = "Actual";
  var v2Label = "Exponential predicted";
  var v3Label = "Polynomial predicted";
  graphData.push([hLabel, v1Label, v2Label, v3Label]);

  var n = runData.length;
  for (var i = 0; i < n; i++) {
    var inputSize = runData[i][0];
    var actualRuntime = runData[i][1];
    var expPrediction = getPredictionForX("exponential", complexityData.expCurve, inputSize);
    var polyPrediction = getPredictionForX("polynomial", complexityData.polyCurve, inputSize);
    graphData.push([inputSize, actualRuntime, expPrediction, polyPrediction]);
  }

  return graphData;
}

// TODO: formalise testing!
// console.log("R2 test: " + getR2("polynomial", ({k: 1.229, n: 1}), [[2, 2], [3, 4], [4, 6], [6, 7]]));
// expected answer: 0.895 (https://internal.ncl.ac[dot]uk/ask/numeracy-maths-statistics/statistics/regression-and-correlation/coefficient-of-determination-r-squared.html#Worked%20Example)
// (with the +0.143 in the prediction function return)
