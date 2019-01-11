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

  var funcDef = input;
  var inputSizes = getInputSizes(funcDef, funcName, inputArgType);
  var inputs = generateInputs(inputArgType, inputSizes);
  var runtimes = varyRuntimes(funcDef, funcName, inputs);

  var numInputs = inputSizes.length;
  // TODO: maybe output actual args used as well
  for (i = 0; i < numInputs; i++) {
    output += "For n = " + inputSizes[i] + ", runtime = " + runtimes[i] + " ms\n";
  }
  document.getElementById("output").innerHTML = "<pre>" + output + "</pre>";

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
function varyRuntimes(funcDef, funcName, inputs) {
  var runtimes = [];

  // register the function in our scope
  // TODO: fix weird scoping issue with this being done by caller
  eval(funcDef);

  for (var run = 0; run < inputs.length; run++) {
    var call = buildCallOneArg(funcName, inputs[run]);
    var program = call;
    console.log("Generated call: " + call);

    var startTime = performance.now();
    var output = eval(program);
    var endTime = performance.now();

    var runtime = Math.round(endTime - startTime);
    runtimes.push(runtime);
  }

  return runtimes;
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
function generateArgStr(inputSize, inputType) {
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
    return "\"" + charArr.join("") + "\"";
  } else if (inputType === "integer-array") {
    var valueUBound = 100;
    var intArr = [];
    for (var i = 0; i < inputSize; i++) {
      intArr.push(Math.floor(Math.random() * valueUBound));
    }
    return "{" + intArr.join(", ") + "}";
  }
}

function generateInputs(inputType, inputSizes) {
  var inputs = [];
  for (var i = 0; i < inputSizes.length; i++) {
    inputs.push(generateArgStr(inputSizes[i], inputType));
  }

  return inputs;
}

function getInputSizes(funcDef, funcName, inputType) {
  var inputSizes = [];
  var start = 300;
  var interval = 150;
  var numSizes = 12;
  for (var i = 0; i < numSizes; i++) {
    inputSizes.push(start + i * interval);
  }
  
  return inputSizes;
}
