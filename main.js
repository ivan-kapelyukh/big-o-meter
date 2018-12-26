function acceptCode() {

  var input = document.getElementById("codeInput").value;

  // grabs prefix until first ( character, e.g. "function   myFunc   "
  // then grabs second word, i.e. the function name
  var funcName = input.substring(0, input.indexOf("(")).split(/\s+/)[1];

  var args = input.substring(input.indexOf("(") + 1, input.indexOf(")")).split(/[, ]+/);
  var numArgs = args.length;

  // for now - one integer argument
  var output = "Varying argument " + args[0] + ":\n";

  var start = 500;
  var interval = 500;
  var numPoints = 4;
  var funcDef = input;
  var [valsUsed, runtimes] = varyRuntimesOneIntArg(start, interval, numPoints, funcDef, funcName);

  for (i = 0; i < numPoints; i++) {
    output += "For " + args[0] + " = " + valsUsed[i] + ", runtime = " + runtimes[i] + " ms\n";
  }
  document.getElementById("output").innerHTML = "<pre>" + output + "</pre>";
}

// returns 2-element array of parallel arrays: array of n values used and array of runtimes in milliseconds
// TODO: do many runs, calculate error, etc
function varyRuntimesOneIntArg(start, interval, numPoints, funcDef, funcName) {
  var valsUsed = [];
  var runtimes = [];

  // register the function in our scope
  // TODO: fix weird scoping issue with this being done by caller
  eval(funcDef);

  console.log("Num points: " + numPoints);
  for (run = 0; run < numPoints; run++) {
    var arg = start + run * interval;
    valsUsed.push(arg);
    var call = buildCallOneArg(funcName, arg);
    var program = call;

    var startTime = performance.now();
    var output = eval(program);
    var endTime = performance.now();

    console.log("Program result: " + output);

    var runtime = Math.round(endTime - startTime);
    runtimes.push(runtime);
  }

  return [valsUsed, runtimes];
}

// returns e.g. myFunc(1024);
function buildCallOneArg(funcName, arg) {
  return funcName + "(" + arg + ");";
}