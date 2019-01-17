function acceptCode() {

  var input = document.getElementById("codeInput").value;
  var inputArgType = document.getElementById("input-type-selector").value;

  // grabs prefix until first ( character, e.g. "function   myFunc   "
  // then grabs second word, i.e. the function name
  var funcName = input.substring(0, input.indexOf("(")).split(/\s+/)[1];

  var args = input.substring(input.indexOf("(") + 1, input.indexOf(")")).split(/[, ]+/);
  var numArgs = args.length;

  // for now - one argument
  var output = "Varying argument " + args[0] + ":\n";

  eval("var func = " + input);

  var inputSizes = getInputSizes(func, inputArgType);
  var inputs = generateInputs(inputArgType, inputSizes);
  var runtimes = varyRuntimes(func, inputs);

  var numInputs = inputSizes.length;
  // TODO: maybe output actual args used as well
  for (i = 0; i < numInputs; i++) {
    output += "For n = " + inputSizes[i] + ", runtime = " + runtimes[i] + " ms\n";
  }
  outputLine(output);

  var pairedData = parallelArraysToDataPairs(inputSizes, runtimes);
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
function varyRuntimes(func, inputs) {
  var runtimes = [];

  for (var run = 0; run < inputs.length; run++) {
    // console.log("Generated call: " + program);
    var [runtime, output] = timedRun(func, inputs[run]);
    runtimes.push(runtime);
  }

  return runtimes;
}

// returns [runtime, eval result]
function timedRun(program, input) {
  var startTime = performance.now();
  var output = program(input);
  var endTime = performance.now();

  var runtime = Math.round(endTime - startTime);
  return [runtime, output];
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

// TODO: handle input contents contraints, e.g. negative nums in int array? etc
function generateArg(inputSize, inputType) {
  if (inputType === "integer") {
    return inputSize;
  } else if (inputType === "string") {
    var charArr = [];
    var base = 'a'.charCodeAt(0)
    var range = 'z'.charCodeAt(0) - base;
    for (var i = 0; i < inputSize; i++) {
      var charNum = Math.floor(Math.random() * (range + 1)) + base;
      charArr.push(String.fromCharCode(charNum));
    }
    return charArr.join("");
  } else if (inputType === "integer-array") {
    var valueUBound = 100;
    var intArr = [];
    for (var i = 0; i < inputSize; i++) {
      intArr.push(Math.floor(Math.random() * valueUBound));
    }
    return intArr;
  }
}

function generateInputs(inputType, inputSizes) {
  var inputs = [];
  for (var i = 0; i < inputSizes.length; i++) {
    inputs.push(generateArg(inputSizes[i], inputType));
  }

  return inputs;
}

function getInputSizes(func, inputType) {
  var inputSizes = [];
  var TIME_LBOUND = 80;
  var TIME_UBOUND = 3500;
  var TIMEOUT = 5000;
  var NUM_SIZES = 12;
  var startSize = 1 / 2;
  var endSize;
  var runtime = 0;

  // finding min
  do {
    startSize = Math.ceil(startSize * 1.5);
    var input = generateArg(startSize, inputType);
    runtime = timedRun(func, input)[0];
  } while (runtime < TIME_LBOUND);
  console.log("Start size: " + startSize);

  // finding max
  endSize = startSize;
  do {
    endSize = Math.ceil(endSize * 1.2);
    console.log("New end size candidate: " + endSize);
    var input = generateArg(endSize, inputType);
    runtime = timedRun(func, input)[0];
  } while (runtime < TIME_UBOUND);
  console.log("End size: " + endSize);

  var interval = (endSize - startSize) / NUM_SIZES;
  for (var i = 0; i < NUM_SIZES; i++) {
    inputSizes.push(startSize + i * interval);
  }
  
  return inputSizes;
}

function outputLine(text) {
  var elem = document.getElementById("output");
  elem.innerHTML = elem.innerHTML + "<pre>" + text + "</pre>";
}
