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
    const funcName = App.extractName(code);
  }

  static extractName(code) {
    // Get last word before opening bracket.
    return code.substring(0, code.indexOf("(")).trim().split(" ").pop();
  }

  static extractBody(code) {
    return code.substring(code.indexOf("{") + 1, code.lastIndexOf("}"));
  }

  static extractArgument(code) {
    return code.substring(code.indexOf("(") + 1, code.indexOf(")")).trim();
  }
}

export default App;

/* TODO:

Robustness testing on user input: e.g. comment after function contatining '}' character
Handle multiple arguments

*/
