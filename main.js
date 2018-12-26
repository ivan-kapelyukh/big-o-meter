function acceptCode() {
  var input = document.getElementById("codeInput").value;

  var startTime = performance.now();
  var output = eval(input);
  var endTime = performance.now();

  document.getElementById("output").innerHTML = "Runtime: " + Math.round(endTime - startTime) + " ms";
}