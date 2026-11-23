"use client";

import { AnimatePresence, motion } from "motion/react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { GameButton } from "@/components/ui/game-button";
import type { AnyResponse } from "./grading";
import type { CheckResult, PublicEncounter } from "./public";
import { engines } from "./registry";
import { CodeBlock } from "./shared/code-block";

type Props = {
  encounter: PublicEncounter;
  check: (response: AnyResponse) => Promise<CheckResult> | CheckResult;
  onResolved: (result: CheckResult) => void;
  onContinue: () => void;
  submitLabel?: string;
};

/**
 * Une rencontre : énoncé, moteur de jeu, bouton de validation, puis verdict.
 * Utilisée à l'identique dans les épreuves et dans le combat contre le gardien.
 */
export function EncounterView({ encounter, check, onResolved, onContinue, submitLabel }: Props) {
  const t = useTranslations("game");
  const [response, setResponse] = useState<AnyResponse | null>(null);
  const [result, setResult] = useState<CheckResult | null>(null);
  const [pending, setPending] = useState(false);
  const Engine = engines[encounter.type];

  const submit = async () => {
    if (response === null || result || pending) return;
    setPending(true);
    try {
      const r = await check(response);
      setResult(r);
      onResolved(r);
    } finally {
      setPending(false);
    }
  };

  return (
    <div>
      <h2 className="font-display text-[1.45rem] font-semibold leading-snug text-balance">{encounter.prompt}</h2>
      {encounter.type === "qcm" && encounter.code && <CodeBlock code={encounter.code} className="mt-4" />}
      <div className="mt-5">
        <Engine encounter={encounter} disabled={Boolean(result) || pending} verdict={result ? result.correct : null} onChange={setResponse} onSubmit={submit} />
      </div>

      <div className="mt-7 min-h-16">
        <AnimatePresence mode="wait" initial={false}>
          {!result ? (
            <motion.div key="submit" exit={{ opacity: 0, y: 8 }}>
              <GameButton className="w-full sm:w-auto" disabled={response === null || pending} onClick={submit}>
                {pending ? t("checking") : (submitLabel ?? t("submit"))}
              </GameButton>
            </motion.div>
          ) : (
            <motion.div
              key="verdict"
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={`rounded-3xl p-4 ${result.correct ? "bg-success/20" : "bg-primary/10"}`}
              role="status"
            >
              <p className={`font-display text-2xl font-bold ${result.correct ? "text-success-deep" : "text-danger-text"}`}>
                {result.correct ? t("correct") : t("wrong")}
              </p>
              {!result.correct && (
                <div className="mt-2">
                  <p className="text-sm font-bold text-muted">{t("solution")}</p>
                  <pre className="mt-1 whitespace-pre-wrap font-mono font-semibold text-ink">{result.solution}</pre>
                </div>
              )}
              <p className="mt-2">{result.explanation}</p>
              <GameButton className="mt-4 w-full sm:w-auto" variant={result.correct ? "success" : "secondary"} onClick={onContinue} autoFocus>
                {t("continue")}
              </GameButton>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
