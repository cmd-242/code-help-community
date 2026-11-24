/* Exécuteur Python isolé (Pyodide) : Web Worker sans DOM, réseau coupé une fois Pyodide chargé. */
"use strict";
const PYODIDE_URL = "https://cdn.jsdelivr.net/pyodide/v0.27.7/full/";
const MAX_OUTPUT = 1800;

let ready = null;
const load = () => {
  if (!ready) {
    ready = (async () => {
      importScripts(PYODIDE_URL + "pyodide.js");
      const py = await self.loadPyodide({ indexURL: PYODIDE_URL });
      for (const name of ["fetch", "XMLHttpRequest", "WebSocket", "EventSource", "importScripts", "indexedDB", "caches", "BroadcastChannel", "Worker", "SharedWorker"]) {
        try {
          Object.defineProperty(self, name, { value: undefined, configurable: false, writable: false });
        } catch {
          /* ignorée */
        }
      }
      return py;
    })();
  }
  return ready;
};

self.onmessage = async (event) => {
  const { id, code } = event.data;
  const lines = [];
  let error = null;
  try {
    const py = await load();
    self.postMessage({ id, started: true });
    py.setStdout({ batched: (s) => lines.push(s) });
    py.setStderr({ batched: (s) => lines.push(s) });
    const globals = py.globals.get("dict")();
    try {
      await py.runPythonAsync(code, { globals });
    } finally {
      globals.destroy();
    }
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    error = message.trim().split("\n").slice(-1)[0];
  }
  self.postMessage({ id, output: lines.join("\n").slice(0, MAX_OUTPUT), error });
};
