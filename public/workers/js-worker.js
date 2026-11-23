/* Exécuteur JavaScript isolé : Web Worker sans DOM, réseau coupé avant d'exécuter le code de l'apprenant. */
"use strict";
const MAX_OUTPUT = 1800;
for (const name of ["fetch", "XMLHttpRequest", "WebSocket", "EventSource", "importScripts", "indexedDB", "caches", "BroadcastChannel", "Worker", "SharedWorker"]) {
  try {
    Object.defineProperty(self, name, { value: undefined, configurable: false, writable: false });
  } catch {
    /* propriété non redéfinissable : ignorée */
  }
}

const show = (v) => {
  if (typeof v === "string") return v;
  try {
    return typeof v === "object" && v !== null ? JSON.stringify(v) : String(v);
  } catch {
    return String(v);
  }
};

self.onmessage = (event) => {
  const { id, code } = event.data;
  const lines = [];
  const log = (...args) => lines.push(args.map(show).join(" "));
  const fakeConsole = { log, info: log, warn: log, error: log, debug: log };
  let error = null;
  try {
    new Function("console", `"use strict";\n${code}`)(fakeConsole);
  } catch (e) {
    error = e instanceof Error ? `${e.name}: ${e.message}` : String(e);
  }
  self.postMessage({ id, output: lines.join("\n").slice(0, MAX_OUTPUT), error });
};
