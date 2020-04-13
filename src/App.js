import React from "react";
import "./App.css";
import {
  parseFunction,
  parseName,
  parseArgument,
  parseBody,
} from "./parseFunction.js";

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <p>Hello there!</p>
        <textarea id="editor" rows="20" cols="80"></textarea>

        <br />

        <button onClick={this.codeSubmitted}>Analyse</button>
      </div>
    );
  }

  codeSubmitted() {
    const code = document.getElementById("editor").value;
    const fn = parseFunction(code);
  }
}

export default App;
