google.charts.load("current", {"packages": ["corechart"]});
google.charts.setOnLoadCallback(function () {
  document.body.scrollTop = document.documentElement.scrollTop = 0;
  // document.getElementById("codeInput").scrollIntoView();
});

// takes array of n-tuple arrays, with first tuple as headings
function drawGraph(dataArrays) {
  var data = new google.visualization.DataTable();

  var headings = dataArrays.shift();
  for (heading in headings) {
    data.addColumn("number", heading);
  }

  data.addRows(dataArrays);

  var n = dataArrays.length;
  var maxInputSize = dataArrays[n - 1][0];

  // stop at actual value, plus some margin
  var maxTime = Math.ceil(dataArrays[n - 1][1] * 1.2);
  // if we want to see all the data:
  // var numCols = dataArrays[0].length;
  // for (var i = 1; i < numCols; i++) { // start at 1 to skip hVal
  //   maxTime = Math.max(maxTime, dataArrays[n - 1][i]);
  // }

  var options = {
    title: "Runtime vs input size",
    hAxis: {title: "Input size", minValue: 0, maxValue: maxInputSize},
    vAxis: {title: "Runtime (ms)", minValue: 0, viewWindow: ({max: maxTime})}
  };

  var graphElem = document.getElementById("chart-div");
  var chart = new google.visualization.ScatterChart(graphElem);
  chart.draw(data, options);
}