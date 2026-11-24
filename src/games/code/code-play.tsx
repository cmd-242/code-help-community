"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import type { PublicEncounter } from "@/games/public";
import { CodeEditor } from "@/games/shared/code-editor-lazy";
import { CodeBlock } from "@/games/shared/code-block";
import { runCode, type RunResult } from "./runner";

type Props = {
  encounter: Extract<PublicEncounter, { type: "code" }>;
  disabled: boolean;
  onChange: (response: string | null) => void;
  onSubmit: () => void;
};

/**
 * Écrire du code : l'apprenant édite, exécute dans le navigateur, puis valide.
 * La réponse envoyée à la correction est la sortie du DERNIER essai ; modifier
 * le code l'invalide, pour qu'on ne valide jamais une sortie périmée.
 */
export function CodePlay({ encounter, disabled, onChange }: Props) {
  const t = useTranslations("game");
  const [code, setCode] = useState(encounter.starter);
  const [running, setRunning] = useState(false);
  const label = t("codeLabel", { language: encounter.language === "python" ? "Python" : "JavaScript" });
  const [result, setResult] = useState<RunResult | null>(null);

  const run = async () => {
    if (running || disabled) return;
    setRunning(true);
    onChange(null);
    const r = await runCode(encounter.language, `${code}\n${encounter.harness ?? ""}`);
    setResult(r);
    setRunning(false);
    // Une exécution en erreur ne peut pas être validée : l'apprenant corrige d'abord
    onChange(r.error || r.timedOut ? null : r.output);
  };

  return (
    <div>
      <p className="mb-2 text-sm font-bold text-info-deep">{label}</p>
      <CodeEditor value={code} language={encounter.language} disabled={disabled} ariaLabel={label} onRun={() => void run()} onChange={(v) => {
        setCode(v);
        setResult(null);
        onChange(null);
      }} />
      {encounter.harness && (
        <div className="mt-3">
          <p className="mb-1 text-sm font-bold text-muted">{t("codeHarness")}</p>
          <CodeBlock code={encounter.harness} />
        </div>
      )}
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={run}
          disabled={disabled || running}
          className="rounded-2xl bg-info-deep px-5 py-2.5 font-bold text-surface disabled:opacity-60"
        >
          {running ? t("codeRunning") : t("codeRun")}
        </button>
        <span className="text-sm text-muted">{t("codeShortcut")}</span>
      </div>
      <div className="mt-4" aria-live="polite">
        {result && (
          <div className="rounded-2xl bg-surface-sunk p-4">
            <p className="text-sm font-bold text-muted">{t("codeOutput")}</p>
            {result.timedOut ? (
              <p className="mt-1 font-semibold text-danger-text">{t("codeTimeout")}</p>
            ) : (
              <>
                <pre className="mt-1 whitespace-pre-wrap font-mono">{result.output || t("codeNoOutput")}</pre>
                {result.error && <p className="mt-2 font-mono font-semibold text-danger-text">{result.error}</p>}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
