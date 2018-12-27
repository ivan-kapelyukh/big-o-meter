function acceptCode() {

  var input = document.getElementById("codeInput").value;

  // grabs prefix until first ( character, e.g. "function   myFunc   "
  // then grabs second word, i.e. the function name
  var funcName = input.substring(0, input.indexOf("(")).split(/\s+/)[1];

  var args = input.substring(input.indexOf("(") + 1, input.indexOf(")")).split(/[, ]+/);
  var numArgs = args.length;

  // for now - one integer argument
  var output = "Varying argument " + args[0] + ":\n";

  var start = 400;
  var interval = 200;
  var numPoints = 5;
  var funcDef = input;
  var [valsUsed, runtimes] = varyRuntimesOneIntArg(start, interval, numPoints, funcDef, funcName);

  for (i = 0; i < numPoints; i++) {
    output += "For " + args[0] + " = " + valsUsed[i] + ", runtime = " + runtimes[i] + " ms\n";
  }
  document.getElementById("output").innerHTML = "<pre>" + output + "</pre>";

  var xLabel = "Value of " + args[0];
  var yLabel = "Runtime (ms)";
  var pairedData = parallelArraysToDataPairs(xLabel, yLabel, valsUsed, runtimes);
  drawGraph(pairedData);

  // shed the axis labels
  pairedData.shift();

  // complexity is an object taking the form:
  // exponential: true, false
  // degree: 0, 1, 2... (undefined if exponential is true)
  var complexity = getComplexity(pairedData);
  var complexityMsg;
  if (complexity.exponential) {
    complexityMsg = "exponential";
  } else if (complexity.degree == 0) {
    complexityMsg = "constant";
  } else if (complexity.degree == 1) {
    complexityMsg = "linear";
  } else if (complexity.degree == 2) {
    complexityMsg = "quadratic";
  } else if (complexity.degree == 3) {
    complexityMsg = "cubic";
  } else {
    complexityMsg = "polynomial of order " + complexity.degree;
  }

  document.getElementById("complexity").innerHTML = "Algorithm runtime complexity determined to be " + "<b>" + complexityMsg + "</b>";
}

// returns 2-element array of parallel arrays: array of n values used and array of runtimes in milliseconds
// TODO: do many runs, calculate error, etc
function varyRuntimesOneIntArg(start, interval, numPoints, funcDef, funcName) {
  var valsUsed = [];
  var runtimes = [];

  // register the function in our scope
  // TODO: fix weird scoping issue with this being done by caller
  eval(funcDef);

  for (run = 0; run < numPoints; run++) {
    var arg = start + run * interval;
    valsUsed.push(arg);
    var call = buildCallOneArg(funcName, arg);
    var program = call;

    var startTime = performance.now();
    var output = eval(program);
    var endTime = performance.now();


    var runtime = Math.round(endTime - startTime);
    runtimes.push(runtime);
  }

  return [valsUsed, runtimes];
}

// returns e.g. myFunc(1024);
function buildCallOneArg(funcName, arg) {
  return funcName + "(" + arg + ");";
}

// returns [[xLabel, yLabel], [x1, y1], ..., [xn, yn]]
function parallelArraysToDataPairs(xLabel, yLabel, xs, ys) {
  var pairs = [[xLabel, yLabel]];
  for (var i = 0; i < xs.length; i++) {
    pairs.push([xs[i], ys[i]]);
  }

  return pairs;
}