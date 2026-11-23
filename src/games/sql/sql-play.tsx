"use client";

import { useTranslations } from "next-intl";
import { useId, useState } from "react";
import type { PublicEncounter } from "@/games/public";
import { CodeBlock } from "@/games/shared/code-block";
import { runSql, type SqlRun } from "./runner";

type Props = {
  encounter: Extract<PublicEncounter, { type: "sql" }>;
  disabled: boolean;
  onChange: (response: string | null) => void;
  onSubmit: () => void;
};

/**
 * SQL : l'apprenant écrit une requête, l'exécute sur une vraie base PostgreSQL
 * (dans le navigateur), puis valide. Comme pour le code, modifier la requête
 * invalide le dernier résultat.
 */
export function SqlPlay({ encounter, disabled, onChange }: Props) {
  const t = useTranslations("game");
  const id = useId();
  const [sql, setSql] = useState(encounter.starter);
  const [running, setRunning] = useState(false);
  const [run, setRun] = useState<SqlRun | null>(null);

  const execute = async () => {
    if (running || disabled || !sql.trim()) return;
    setRunning(true);
    onChange(null);
    const r = await runSql(encounter.setup, sql, encounter.verify);
    setRun(r);
    setRunning(false);
    const valid = !r.error && !r.timedOut && r.hasResult;
    onChange(valid ? r.rows.map((row) => row.join("|")).join("\n") : null);
  };

  return (
    <div>
      <details className="mb-4 rounded-2xl bg-surface-sunk p-4">
        <summary className="cursor-pointer font-bold text-info-deep">{t("sqlSchema")}</summary>
        <CodeBlock code={encounter.setup} className="mt-3" />
      </details>
      <label htmlFor={id} className="mb-2 block text-sm font-bold text-info-deep">
        {t("sqlLabel")}
      </label>
      <textarea
        id={id}
        value={sql}
        disabled={disabled}
        spellCheck={false}
        autoCapitalize="off"
        autoCorrect="off"
        rows={Math.min(10, Math.max(4, sql.split("\n").length + 1))}
        onChange={(e) => {
          setSql(e.target.value);
          setRun(null);
          onChange(null);
        }}
        onKeyDown={(e) => {
          if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
            e.preventDefault();
            void execute();
          }
        }}
        className="w-full resize-y rounded-2xl bg-surface p-4 font-mono text-base leading-relaxed shadow-[0_0_0_2px_var(--color-line)] outline-none focus:shadow-[0_0_0_3px_var(--color-info-deep)]"
      />
      {encounter.verify && (
        <div className="mt-3">
          <p className="mb-1 text-sm font-bold text-muted">{t("sqlVerify")}</p>
          <CodeBlock code={encounter.verify} />
        </div>
      )}
      <div className="mt-4">
        <button type="button" onClick={execute} disabled={disabled || running || !sql.trim()} className="rounded-2xl bg-info-deep px-5 py-2.5 font-bold text-surface disabled:opacity-60">
          {running ? t("sqlRunning") : t("sqlRun")}
        </button>
      </div>
      <div className="mt-4" aria-live="polite">
        {running && <p className="text-sm text-muted">{t("sqlLoading")}</p>}
        {run && !running && (
          <div className="overflow-x-auto rounded-2xl bg-surface-sunk p-4">
            <p className="text-sm font-bold text-muted">{t("sqlResult")}</p>
            {run.timedOut ? (
              <p className="mt-1 font-semibold text-danger-text">{t("sqlTimeout")}</p>
            ) : run.error ? (
              <p className="mt-1 font-mono font-semibold text-danger-text">{run.error === "worker" ? t("sqlUnavailable") : run.error}</p>
            ) : !run.hasResult ? (
              <p className="mt-1">{t("sqlNoResult")}</p>
            ) : (
              <>
                <table className="mt-2 w-full border-collapse font-mono text-sm">
                  <thead>
                    <tr>
                      {run.fields.map((f, i) => (
                        <th key={i} className="border-b border-line px-3 py-1 text-left">
                          {f}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {run.rows.map((row, i) => (
                      <tr key={i}>
                        {row.map((c, j) => (
                          <td key={j} className="px-3 py-1">
                            {c}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p className="mt-2 text-sm text-muted">{t("sqlRows", { count: run.total })}</p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
