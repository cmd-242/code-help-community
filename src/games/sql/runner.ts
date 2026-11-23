export type SqlRun = {
  fields: string[];
  rows: string[][];
  total: number;
  hasResult: boolean;
  error: string | null;
  timedOut: boolean;
};

const LOAD_TIMEOUT_MS = 60000;
const RUN_TIMEOUT_MS = 5000;
let worker: Worker | null = null;
let counter = 0;

function getWorker(): Worker {
  return (worker ??= new Worker(new URL("./sql-worker.ts", import.meta.url), { type: "module" }));
}
function dispose() {
  worker?.terminate();
  worker = null;
}

/** Lance une requête dans le worker ; une requête trop longue détruit le worker (il est recréé au prochain essai). */
export function runSql(setup: string, sql: string, verify?: string): Promise<SqlRun> {
  return new Promise((resolve) => {
    const w = getWorker();
    const id = ++counter;
    const empty: SqlRun = { fields: [], rows: [], total: 0, hasResult: false, error: null, timedOut: false };
    let timer = setTimeout(onTimeout, LOAD_TIMEOUT_MS);
    function cleanup() {
      clearTimeout(timer);
      w.removeEventListener("message", onMessage);
      w.removeEventListener("error", onError);
    }
    function onTimeout() {
      cleanup();
      dispose();
      resolve({ ...empty, timedOut: true });
    }
    function onError() {
      cleanup();
      dispose();
      resolve({ ...empty, error: "worker" });
    }
    function onMessage(e: MessageEvent<Partial<SqlRun> & { id: number; started?: boolean }>) {
      if (e.data.id !== id) return;
      if (e.data.started) {
        clearTimeout(timer);
        timer = setTimeout(onTimeout, RUN_TIMEOUT_MS);
        return;
      }
      cleanup();
      resolve({ ...empty, ...e.data, error: e.data.error ?? null });
    }
    w.addEventListener("message", onMessage);
    w.addEventListener("error", onError);
    w.postMessage({ id, setup, sql, verify });
  });
}
