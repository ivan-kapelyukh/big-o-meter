import React from "react";
import "./App.css";
import {
  parseFunction,
  parseName,
  parseArgument,
  parseBody,
} from "./parseFunction.js";

import { analyseFunction } from "./analyseFunction.js";

class App extends React.Component {
  static defaultCode = `function sumTo(n) {
    let sum = 0;
    for (let i = 1; i <= n; i++) {
      sum += i;
    }

    return sum;
}`;

  render() {
    return (
      <div className="App">
        <p>Hello there!</p>

        <br />

        <div className="row">
          <textarea id="editor" className="bubble">
            {App.defaultCode}
          </textarea>
          <p id="log" className="bubble"></p>
        </div>

        <br />

        <button onClick={this.analyseCode}>Analyse</button>
      </div>
    );
  }

  analyseCode = () => {
    const code = document.getElementById("editor").value;
    const fn = parseFunction(code);
    const result = analyseFunction(fn);
    this.logResult(result);
  };

  logResult = (result) => {
    document.getElementById("log").textContent +=
      "Function gave result: " + result;
  };
}

export default App;

/* TODO:

Optimisation: reduce DOM traversal by storing consts pointing to elems

*/
