function acceptCode() {
  var input = document.getElementById("codeInput").value;

  // grabs prefix until first ( character, e.g. "function   myFunc   "
  // then grabs second word, i.e. the function name
  var funcName = input.substring(0, input.indexOf("(")).split(/\s+/)[1];
  var args = input.substring(input.indexOf("(") + 1, input.indexOf(")")).split(/[, ]+/);

  // var startTime = performance.now();
  // var output = eval(input);
  // var endTime = performance.now();

  // document.getElementById("output").innerHTML = "Runtime: " + Math.round(endTime - startTime) + " ms";
  document.getElementById("output").innerHTML = args;
}