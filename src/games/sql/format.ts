/** Formatage du résultat d'une requête : partagé par le navigateur et les tests. */
export const MAX_ROWS = 40;

export function cell(v: unknown): string {
  if (v === null || v === undefined) return "NULL";
  if (v instanceof Date) return v.toISOString();
  if (typeof v === "bigint" || typeof v === "number" || typeof v === "boolean") return String(v);
  if (typeof v === "object") return JSON.stringify(v);
  return String(v);
}

/** Une ligne de texte par ligne de résultat, cellules séparées par « | ». */
export function formatRows(rows: unknown[][]): string {
  return rows
    .slice(0, MAX_ROWS)
    .map((r) => r.map(cell).join("|"))
    .join("\n");
}
