/// <reference lib="webworker" />
import { PGlite } from "@electric-sql/pglite";
import { cell, MAX_ROWS } from "./format";

/**
 * Base PostgreSQL (PGlite, WebAssembly) dans un Web Worker : le SQL de l'apprenant
 * ne touche jamais le serveur (règle n°4). Le schéma est remis à zéro à chaque essai.
 */
let dbPromise: Promise<PGlite> | null = null;
const getDb = () => (dbPromise ??= PGlite.create());

type Req = { id: number; setup: string; sql: string; verify?: string };

self.onmessage = async (event: MessageEvent<Req>) => {
  const { id, setup, sql, verify } = event.data;
  try {
    const db = await getDb();
    await db.exec("DROP SCHEMA IF EXISTS public CASCADE; CREATE SCHEMA public;");
    await db.exec(setup);
    self.postMessage({ id, started: true });
    let fields: string[] = [];
    let rows: unknown[][] = [];
    if (verify) {
      await db.exec(sql);
      const r = await db.query(verify, [], { rowMode: "array" });
      fields = r.fields.map((f) => f.name);
      rows = r.rows as unknown[][];
    } else {
      const results = await db.exec(sql, { rowMode: "array" });
      const last = [...results].reverse().find((r) => r.fields.length > 0);
      if (last) {
        fields = last.fields.map((f) => f.name);
        rows = last.rows as unknown[][];
      }
    }
    self.postMessage({
      id,
      fields,
      rows: rows.slice(0, MAX_ROWS).map((r) => r.map(cell)),
      total: rows.length,
      hasResult: fields.length > 0,
    });
  } catch (e) {
    self.postMessage({ id, error: e instanceof Error ? e.message : String(e) });
  }
};
