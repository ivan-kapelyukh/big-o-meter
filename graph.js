google.charts.load("current", { "packages": ["corechart"] });
google.charts.setOnLoadCallback(function () {
  document.body.scrollTop = document.documentElement.scrollTop = 0;
  // document.getElementById("codeInput").scrollIntoView();
});

// takes array of n-tuple arrays, with first tuple as headings
function drawGraph(dataArrays) {
  var data = new google.visualization.arrayToDataTable(dataArrays);

  var n = dataArrays.length;
  var maxInputSize = dataArrays[n - 1][0];

  // stop at actual value, plus some margin
  var maxTime = Math.ceil(dataArrays[n - 1][1] * 1.2);

  var options = {
    title: "Runtime vs input size",
    hAxis: { title: "Input size", minValue: 0, maxValue: maxInputSize },
    vAxis: { title: "Runtime (ms)", minValue: 0, viewWindow: ({ max: maxTime }) }
  };

  var graphElem = document.getElementById("chart-div");
  var chart = new google.visualization.ScatterChart(graphElem);
  chart.draw(data, options);
}
