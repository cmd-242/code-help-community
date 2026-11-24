import { PGlite } from "@electric-sql/pglite";
import { allTracks } from "@content";
import { describe, expect, it } from "vitest";
import { grade } from "@/games/grading";
import { formatRows } from "@/games/sql/format";
import type { Encounter, SqlEncounter } from "@/games/schemas";

/** Toutes les rencontres SQL du contenu, exécutées sur une vraie base PostgreSQL (PGlite). */
function sqlEncounters(): SqlEncounter[] {
  const out: SqlEncounter[] = [];
  for (const t of allTracks) {
    for (const n of t.notions) {
      const list = [...n.stages.flatMap((s) => s.encounters), ...(n.challenge?.bank ?? [])] as Encounter[];
      for (const e of list) if (e.type === "sql") out.push(e);
    }
  }
  return out;
}

async function result(db: PGlite, e: SqlEncounter, sql: string): Promise<string | null> {
  await db.exec("DROP SCHEMA IF EXISTS public CASCADE; CREATE SCHEMA public;");
  await db.exec(e.setup);
  try {
    if (e.verify) {
      await db.exec(sql);
      return formatRows((await db.query(e.verify, [], { rowMode: "array" })).rows as unknown[][]);
    }
    const res = await db.exec(sql, { rowMode: "array" });
    const last = [...res].reverse().find((r) => r.fields.length > 0);
    return last ? formatRows(last.rows as unknown[][]) : null;
  } catch {
    return null;
  }
}

describe("défis SQL du contenu", () => {
  const all = sqlEncounters();
  it("il y en a", () => expect(all.length).toBeGreaterThan(0));
  it("la solution de référence réussit, le code de départ seul échoue", async () => {
    const db = await PGlite.create();
    for (const e of all) {
      const good = await result(db, e, e.solution);
      expect(good, `${e.id} : la solution ne s'exécute pas`).not.toBeNull();
      expect(grade(e, good as string), `${e.id} : la solution est refusée (obtenu « ${good} »)`).toBe(true);
      const start = await result(db, e, e.starter);
      expect(start === null || !grade(e, start), `${e.id} : le départ réussit déjà`).toBe(true);
    }
    await db.close();
  }, 60000);
});
