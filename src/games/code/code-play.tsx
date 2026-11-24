"use client";

import { useTranslations } from "next-intl";
import { useId, useState } from "react";
import type { PublicEncounter } from "@/games/public";
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
  const id = useId();
  const [code, setCode] = useState(encounter.starter);
  const [running, setRunning] = useState(false);
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
      <label htmlFor={id} className="mb-2 block text-sm font-bold text-info-deep">
        {t("codeLabel", { language: encounter.language === "python" ? "Python" : "JavaScript" })}
      </label>
      <textarea
        id={id}
        value={code}
        disabled={disabled}
        spellCheck={false}
        autoCapitalize="off"
        autoCorrect="off"
        rows={Math.min(14, Math.max(6, code.split("\n").length + 1))}
        onChange={(e) => {
          setCode(e.target.value);
          setResult(null);
          onChange(null);
        }}
        onKeyDown={(e) => {
          if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
            e.preventDefault();
            void run();
          } else if (e.key === "Tab" && !e.shiftKey) {
            // Tab insère deux espaces ; Échap puis Tab quitte le champ (accessibilité clavier)
            e.preventDefault();
            const el = e.currentTarget;
            const { selectionStart: a, selectionEnd: b } = el;
            const next = `${code.slice(0, a)}  ${code.slice(b)}`;
            setCode(next);
            setResult(null);
            onChange(null);
            requestAnimationFrame(() => el.setSelectionRange(a + 2, a + 2));
          }
        }}
        className="w-full resize-y rounded-2xl bg-surface p-4 font-mono text-base leading-relaxed shadow-[0_0_0_2px_var(--color-line)] outline-none focus:shadow-[0_0_0_3px_var(--color-info-deep)]"
      />
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
