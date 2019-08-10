/*

  * Regression.JS - Regression functions for javascript
  * http://tom-alexander.github.com/regression-js/
  *
  * copyright(c) 2013 Tom Alexander
  * Licensed under the MIT license.
  *
  * (with some modifications tailored to this project)

*/

function linearRegression(data, options) {
  var sum = [0, 0, 0, 0, 0];
  var len = 0;

  for (var n = 0; n < data.length; n++) {
    if (data[n][1] !== null) {
      len++;
      sum[0] += data[n][0];
      sum[1] += data[n][1];
      sum[2] += data[n][0] * data[n][0];
      sum[3] += data[n][0] * data[n][1];
      sum[4] += data[n][1] * data[n][1];
    }
  }

  var run = len * sum[2] - sum[0] * sum[0];
  var rise = len * sum[3] - sum[0] * sum[1];
  var gradient = run === 0 ? 0 : round(rise / run, options.precision);
  var intercept = round(sum[1] / len - gradient * sum[0] / len, options.precision);

  return {
    equation: [gradient, intercept],
  };
}

function fitPower(data, options) {
  const sum = [0, 0, 0, 0, 0];
  const len = data.length;

  for (let n = 0; n < len; n++) {
    if (data[n][1] !== null) {
      sum[0] += Math.log(data[n][0]);
      sum[1] += Math.log(data[n][1]) * Math.log(data[n][0]);
      sum[2] += Math.log(data[n][1]);
      sum[3] += (Math.log(data[n][0]) ** 2);
    }
  }

  const b = ((len * sum[1]) - (sum[0] * sum[2])) / ((len * sum[3]) - (sum[0] ** 2));
  const a = ((sum[2] - (b * sum[0])) / len);
  const coeffA = round(Math.exp(a), options.precision);
  const coeffB = round(b, options.precision);

  return {
    equation: [coeffA, coeffB]
  };
}

function round(x, decimalPlaces) {
  var factor = Math.pow(10, decimalPlaces);
  return Math.round(x * factor) / factor;
}
