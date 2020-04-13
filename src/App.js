import React from "react";
import "./App.css";
import { analyseCode } from "./functionAnalysis.js";

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <p>Hello there!</p>
        <textarea id="editor" rows="20" cols="80"></textarea>

        <br />

        <button onclick="codeSubmitted()">Analyse</button>
      </div>
    );
  }

  static codeSubmitted() {
    const code = document.getElementById("editor").getValue();
    const funcName = App.extractFuncName(code);
  }

  static extractFuncName(code) {
    // Get last word before opening bracket.
    return code.substring(0, code.indexOf("(")).trim().split(" ").pop();
  }

  static extractFuncBody(code) {
    return code.substring(code.indexOf("{") + 1, code.lastIndexOf("}"));
  }
}

export default App;

/* TODO:

Robustness testing on user input: e.g. comment after function contatining '}' character

*/
