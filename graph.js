google.charts.load("current", {"packages": ["corechart"]});
google.charts.setOnLoadCallback(function () {
  document.body.scrollTop = document.documentElement.scrollTop = 0;
  // document.getElementById("codeInput").scrollIntoView();
});

// takes array of 4-tuple arrays, with first tuple as headings
function drawGraph(dataArrays) {
  var data = google.visualization.arrayToDataTable(dataArrays);
  var n = dataArrays.length;

  var hLabel = dataArrays[0][0];
  var hMax = dataArrays[n - 1][0];

  var vLabel = dataArrays[0][1];
  var vMax = Math.max(dataArrays[n - 1][1], dataArrays[n - 1][2], dataArrays[n - 1][3]);

  var options = {
    title: "Runtime vs input size",
    hAxis: {title: hLabel, minValue: 0, maxValue: Math.ceil(hMax)},
    vAxis: {title: vLabel, minValue: 0, maxValue: Math.ceil(vMax)},
    legend: "none"
  };

  var graphElem = document.getElementById("chart-div");
  var chart = new google.visualization.ScatterChart(graphElem);
  chart.draw(data, options);
}