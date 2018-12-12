function acceptCode() {
  var input = document.getElementById("codeInput").value;
  var output = eval(input);
  document.getElementById("output").innerHTML = output;
}