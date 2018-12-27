google.charts.load("current", {"packages": ["corechart"]});
google.charts.setOnLoadCallBack(function () {
  // document.getElementById("codeInput").scrollIntoView();
  // document.body.scrollTop = document.documentElement.scrollTop = 0;
});

// takes array of x, y pair arrays, with first pair as headings
function drawGraph(dataArrays) {
  console.log(dataArrays);
  var data = google.visualization.arrayToDataTable(dataArrays);

  var hLabel = dataArrays[0][0];
  var hMin = dataArrays[1][0];
  var hMax = dataArrays[dataArrays.length - 1][0];

  var vLabel = dataArrays[0][1];
  var vMin = dataArrays[1][1];
  var vMax = dataArrays[dataArrays.length - 1][1];

  var options = {
    title: "Runtime vs input size",
    hAxis: {title: hLabel, minValue: 0, maxValue: Math.ceil(hMax)},
    vAxis: {title: vLabel, minValue: 0, maxValue: Math.ceil(vMax)},
    legend: "none",
    trendlines: {
      0: {
        type: 'polynomial',
        degree: 2,
        visibleInLegend: false,
      }
    }
  };

  var graphElem = document.getElementById("chart-div");
  var chart = new google.visualization.ScatterChart(graphElem);
  chart.draw(data, options);
}