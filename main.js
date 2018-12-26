function acceptCode() {
  var input = document.getElementById("codeInput").value;

  // grabs prefix until first ( character, e.g. "function   myFunc   "
  // then grabs second word, i.e. the function name
  var funcName = input.substr(0, input.indexOf("(")).split(/\s+/)[1];

  // var startTime = performance.now();
  // var output = eval(input);
  // var endTime = performance.now();

  // document.getElementById("output").innerHTML = "Runtime: " + Math.round(endTime - startTime) + " ms";
  document.getElementById("output").innerHTML = funcName;
}