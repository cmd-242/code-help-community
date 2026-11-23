import type { CodeEncounter } from "@/games/schemas";

export type Language = CodeEncounter["language"];
export type RunResult = { output: string; error: string | null; timedOut: boolean };

const WORKERS: Record<Language, string> = {
  javascript: "/workers/js-worker.js",
  python: "/workers/python-worker.js",
};
/** Délai d'exécution du programme (le chargement de Pyodide est décompté à part). */
const RUN_TIMEOUT_MS = 5000;
const LOAD_TIMEOUT_MS = 60000;

const pool = new Map<Language, Worker>();
let counter = 0;

function getWorker(language: Language): Worker {
  let w = pool.get(language);
  if (!w) {
    w = new Worker(WORKERS[language]);
    pool.set(language, w);
  }
  return w;
}

function dispose(language: Language) {
  pool.get(language)?.terminate();
  pool.delete(language);
}

/**
 * Exécute un programme dans un Web Worker, jamais dans le processus Node (règle n°4).
 * Une boucle infinie est coupée au bout de 5 s : le worker est détruit puis recréé.
 */
export function runCode(language: Language, code: string): Promise<RunResult> {
  return new Promise((resolve) => {
    const worker = getWorker(language);
    const id = ++counter;
    let timer = setTimeout(timeout, language === "python" ? LOAD_TIMEOUT_MS : RUN_TIMEOUT_MS);

    function timeout() {
      cleanup();
      dispose(language);
      resolve({ output: "", error: null, timedOut: true });
    }
    function cleanup() {
      clearTimeout(timer);
      worker.removeEventListener("message", onMessage);
      worker.removeEventListener("error", onError);
    }
    function onMessage(e: MessageEvent<{ id: number; started?: boolean; output?: string; error?: string | null }>) {
      if (e.data.id !== id) return;
      if (e.data.started) {
        // Pyodide est prêt : le compte à rebours du programme commence maintenant
        clearTimeout(timer);
        timer = setTimeout(timeout, RUN_TIMEOUT_MS);
        return;
      }
      cleanup();
      resolve({ output: e.data.output ?? "", error: e.data.error ?? null, timedOut: false });
    }
    function onError() {
      cleanup();
      dispose(language);
      resolve({ output: "", error: "worker", timedOut: false });
    }

    worker.addEventListener("message", onMessage);
    worker.addEventListener("error", onError);
    worker.postMessage({ id, code });
  });
}
