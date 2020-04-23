import React from "react";
import "./App.css";
import {
  parseFunction,
  parseName,
  parseArgument,
  parseBody,
} from "./parseFunction.js";
import { Chart } from "react-google-charts";

import { analyseFunction } from "./analyseFunction.js";

class App extends React.Component {
  state = {
    resultsShown: false,
    graphData: [[]],
  };

  static defaultCode = `function arithSeriesQuadratic(n) {
    let sum = 0;
    for (let i = 1; i <= n; i++) {
      for (let j = 1; j <= i; j++) {
        sum++;
      }
    }
    return sum;
  }`;

  render() {
    return (
      <div className="App">
        <p>Hello there!</p>

        <br />

        <div className="row">
          <textarea
            id="editor"
            className="bubble"
            defaultValue={App.defaultCode}
          ></textarea>
          {this.renderResults()}
        </div>

        <br />

        <button onClick={this.analyseCode}>Analyse</button>
      </div>
    );
  }

  renderResults = () => {
    return this.state.resultsShown ? (
      <div className="bubble">
        <Chart
          chartType="ScatterChart"
          data={this.state.graphData}
          width="100%"
          height="50vh"
        />
        <div className="conclusion">
          <p>Runtime complexity determined to be</p>
          <p>{this.state.model.class}</p>
          <p>
            Model explains {+this.state.model.r2.toPrecision(4) * 100}% of
            runtime variance
          </p>
        </div>
      </div>
    ) : null;
  };

  analyseCode = () => {
    const code = document.getElementById("editor").value;
    const fn = parseFunction(code);
    const [inputRuntimes, model] = analyseFunction(fn);

    const headings = ["Input size", "Runtime"];
    const graphData = [headings, ...inputRuntimes];
    this.setState({ resultsShown: true, graphData: graphData, model: model });
  };
}

export default App;

/* TODO:

Optimisation: reduce DOM traversal by storing consts pointing to elems

*/

/* Some fun functions:

function sumTo(n) {
  let sum = 0;
  for (let i = 1; i <= n; i++) {
    sum += i;
  }

  return sum;
}

function square(n) {
  let sum = 0;
  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= n; j++) {
      sum++;
    }
  }

  return sum;
}

function cube(n) {
  let sum = 0;
  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= n; j++) {
      for (let k = 1; k <= n; k++) {
        sum++;
      }
    }
  }

  return sum;
}

function fib(n) {
  if (n <= 1) {
    return n;
  }

  return fib(n - 1) + fib(n - 2);
}

function monsterFib(n) {
  if (n < 0) {
    return 0;
  }

  if (n <= 1) {
    return n;
  }

  return monsterFib(n - 1) + monsterFib(n - 2) + monsterFib(n - 3) + monsterFib(n - 4);
}

function arithSeriesQuadratic(n) {
  let sum = 0;
  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= i; j++) {
      sum++;
    }
  }
  return sum;
}

*/
