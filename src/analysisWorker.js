import { analyseFunction } from "./analyseFunction.js";
import { parseFunction } from "./parseFunction.js";

onmessage = (e) => {
  const updateProgress = (analysisProgress) => {
    postMessage(JSON.stringify({ analysisProgress }));
  };

  const fn = parseFunction(e.data);
  const results = analyseFunction(fn, updateProgress);

  // Serialise since result contains function object
  // which cannot be cloned automatically.
  postMessage(JSON.stringify({ analysisProgress: 1.0, results: results }));
};
