import { analyseFunction } from "./analyseFunction.js";
import { parseFunction } from "./parseFunction.js";

onmessage = (e) => {
  console.log("Worker got message:");
  console.log(e.data);
  const fn = parseFunction(e.data);
  const result = analyseFunction(fn);

  // Serialise since result contains function object
  // which cannot be cloned automatically.
  postMessage(JSON.stringify(result));
};
