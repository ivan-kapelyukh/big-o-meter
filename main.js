function acceptCode() {

  var input = document.getElementById("codeInput").value;

  // grabs prefix until first ( character, e.g. "function   myFunc   "
  // then grabs second word, i.e. the function name
  var funcName = input.substring(0, input.indexOf("(")).split(/\s+/)[1];

  var args = input.substring(input.indexOf("(") + 1, input.indexOf(")")).split(/[, ]+/);
  var numArgs = args.length;

  // for now - one integer argument
  var output = "Varying argument " + args[0] + ":\n";

  var start = 200;
  var interval = 150;
  var numPoints = 10;
  var funcDef = input;
  var [valsUsed, runtimes] = varyRuntimesOneIntArg(start, interval, numPoints, funcDef, funcName);

  for (i = 0; i < numPoints; i++) {
    output += "For " + args[0] + " = " + valsUsed[i] + ", runtime = " + runtimes[i] + " ms\n";
  }
  document.getElementById("output").innerHTML = "<pre>" + output + "</pre>";

  var pairedData = parallelArraysToDataPairs(valsUsed, runtimes);
  var complexityData = analyseComplexity(pairedData);
  var graphableData = complexityDataToGraph(pairedData, complexityData);
  drawGraph(graphableData);

  var complexityMsg;
  if (complexityData.exponential) {
    complexityMsg = "exponential";
  } else if (complexityData.degree == 0) {
    complexityMsg = "constant";
  } else if (complexityData.degree == 1) {
    complexityMsg = "linear";
  } else if (complexityData.degree == 2) {
    complexityMsg = "quadratic";
  } else if (complexityData.degree == 3) {
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

// returns [[x1, y1], ..., [xn, yn]]
function parallelArraysToDataPairs(xs, ys) {
  var pairs = [];
  for (var i = 0; i < xs.length; i++) {
    pairs.push([xs[i], ys[i]]);
  }

  return pairs;
}