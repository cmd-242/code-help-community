"use client";

import { useTranslations } from "next-intl";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import type { PublicEncounter } from "@/games/public";
import { HOME, initShell, runLine, type ShellState } from "./shell";

type Props = {
  encounter: Extract<PublicEncounter, { type: "terminal" }>;
  disabled: boolean;
  onChange: (response: string[] | null) => void;
  onSubmit: () => void;
};

type Entry = { cwd: string; command: string; output: string };
const MAX_COMMANDS = 12;
const short = (cwd: string) => (cwd === HOME ? "~" : cwd.startsWith(HOME + "/") ? "~" + cwd.slice(HOME.length) : cwd);

/**
 * Terminal Linux simulé. Les commandes tapées sont la réponse : la correction
 * (côté serveur pour les challenges) les rejoue dans le même shell simulé.
 */
export function TerminalPlay({ encounter, disabled, onChange }: Props) {
  const t = useTranslations("game");
  const inputId = useId();
  const initial = useMemo(() => initShell(encounter.files, encounter.cwd), [encounter]);
  const [state, setState] = useState<ShellState>(initial);
  const [history, setHistory] = useState<Entry[]>([]);
  const [value, setValue] = useState("");
  const endRef = useRef<HTMLDivElement>(null);
  const full = history.length >= MAX_COMMANDS;

  useEffect(() => {
    endRef.current?.scrollIntoView?.({ block: "nearest" });
  }, [history]);

  const enter = () => {
    const command = value.trim();
    if (!command || disabled || full) return;
    const r = runLine(state, command);
    const next = [...history, { cwd: state.cwd, command, output: r.output }];
    setState(r.state);
    setHistory(next);
    setValue("");
    onChange(next.map((h) => h.command));
  };

  const reset = () => {
    setState(initial);
    setHistory([]);
    setValue("");
    onChange(null);
  };

  return (
    <div>
      <label htmlFor={inputId} className="mb-2 block text-sm font-bold text-info-deep">
        {t("terminalLabel")}
      </label>
      <div className="rounded-2xl bg-ink p-4 font-mono text-base text-surface" onClick={() => document.getElementById(inputId)?.focus()}>
        <div className="max-h-72 overflow-y-auto" aria-live="polite">
          {history.map((h, i) => (
            <div key={i}>
              <div>
                <span className="opacity-70">aya@donjon:{short(h.cwd)}$</span> {h.command}
              </div>
              {h.output && <pre className="whitespace-pre-wrap">{h.output}</pre>}
            </div>
          ))}
          <div ref={endRef} />
        </div>
        <div className="flex items-center gap-2">
          <span className="opacity-70">aya@donjon:{short(state.cwd)}$</span>
          <input
            id={inputId}
            value={value}
            disabled={disabled || full}
            autoComplete="off"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
            placeholder={t("terminalPlaceholder")}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                enter();
              }
            }}
            className="min-w-0 flex-1 bg-transparent py-1 outline-none placeholder:text-surface/40"
          />
        </div>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-muted">
        <span>{full ? t("terminalFull") : t("terminalCount", { count: history.length })}</span>
        <button type="button" onClick={reset} disabled={disabled} className="font-bold text-info-deep underline disabled:opacity-60">
          {t("terminalReset")}
        </button>
      </div>
      <p className="mt-2 text-sm text-muted">{t("terminalHint")}</p>
    </div>
  );
}
