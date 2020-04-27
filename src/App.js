import React from "react";
import { Chart } from "react-google-charts";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import "./App.css";

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      analysisProgress: 0.0,
      analysing: false,
      resultsShown: false,
      graphData: [[]],
    };

    this.analysisWorker = new Worker("./analysisWorker.js", { type: "module" });
    this.analysisWorker.onmessage = (e) => {
      const { analysisProgress, results } = JSON.parse(e.data);

      this.setState({ analysisProgress });

      if (analysisProgress === 1.0) {
        const [inputRuntimes, model] = results;

        const headings = ["Input size", "Runtime"];
        const graphData = [headings, ...inputRuntimes];
        this.setState({
          analysing: false,
          resultsShown: true,
          graphData: graphData,
          model: model,
        });
      }
    };
  }

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
        <h1 id="title">Big-O-Meter</h1>

        <br />

        <div className="row">
          <textarea
            id="editor"
            className="bubble"
            spellCheck="false"
            defaultValue={App.defaultCode}
          ></textarea>
          {this.renderResults()}
        </div>

        <br />

        {this.state.analysing ? (
          <CircularProgressbar
            value={this.state.analysisProgress}
            maxValue={1.0}
            text={`${Math.round(this.state.analysisProgress * 100)}%`}
          />
        ) : (
          <button onClick={this.analyseCode} className="primary">
            Analyse
          </button>
        )}
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
          height="40vh"
          id="graph"
          options={{
            hAxis: {
              title: "Input size",
              minVale: 0,
              baselineColor: "white",
              gridlineColor: "transparent",
              titleTextStyle: {
                fontSize: 15,
              },
            },
            vAxis: {
              title: "Runtime ms",
              minValue: 0,
              baselineColor: "white",
              gridlineColor: "transparent",
              titleTextStyle: {
                fontSize: 15,
              },
            },
            legend: "none",
            colors: ["white"],
            backgroundColor: "transparent",
          }}
        />
        <div className="conclusion">
          <p>Runtime complexity determined to be</p>
          <p id="runtimeClass">
            {this.state.model.class.charAt(0).toUpperCase() +
              this.state.model.class.slice(1)}
          </p>
          <p>
            Model explains {+(this.state.model.r2 * 100).toPrecision(4)}% of
            runtime variance
          </p>
        </div>
      </div>
    ) : null;
  };

  analyseCode = () => {
    const code = document.getElementById("editor").value;
    this.analysisWorker.postMessage(code);
    this.setState({ analysisProgress: 0.0, analysing: true });
  };
}

export default App;

/* TODO:

Dynamic sizing of Google Charts text (can't use viewport units in their API - will need to use JS)
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
