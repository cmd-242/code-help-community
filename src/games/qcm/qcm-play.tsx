"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useSound } from "@/features/sound/sound-provider";
import type { PublicEncounter } from "@/games/public";

type Props = {
  encounter: Extract<PublicEncounter, { type: "qcm" }>;
  disabled: boolean;
  verdict: boolean | null;
  onChange: (response: number[] | null) => void;
};

const LETTERS = ["A", "B", "C", "D", "E", "F"];

export function QcmPlay({ encounter, disabled, verdict, onChange }: Props) {
  const t = useTranslations("game");
  const { play } = useSound();
  const [selected, setSelected] = useState<number[]>([]);

  const toggle = (i: number) => {
    if (disabled) return;
    play("pick");
    const next = encounter.multiple ? (selected.includes(i) ? selected.filter((x) => x !== i) : [...selected, i]) : [i];
    setSelected(next);
    onChange(next.length ? next : null);
  };

  return (
    <div>
      {encounter.multiple && <p className="mb-3 font-bold text-info-deep">{t("multiple")}</p>}
      <ul className="grid gap-3 sm:grid-cols-2" role={encounter.multiple ? "group" : "radiogroup"}>
        {encounter.choices.map((choice, i) => {
          const on = selected.includes(i);
          const tone =
            on && verdict === true
              ? "bg-success/25 shadow-[0_0_0_3px_var(--color-success-deep),0_5px_0_var(--color-success-deep)]"
              : on && verdict === false
                ? "bg-primary/15 shadow-[0_0_0_3px_var(--color-primary),0_5px_0_var(--color-primary-deep)]"
                : on
                  ? "bg-info/15 shadow-[0_0_0_3px_var(--color-info-deep),0_5px_0_var(--color-info-deep)]"
                  : `bg-surface shadow-[0_0_0_2px_var(--color-line),0_5px_0_var(--color-line)] ${disabled ? "" : "hover:-translate-y-0.5"}`;
          return (
            <li key={i}>
              <button
                type="button"
                role={encounter.multiple ? "checkbox" : "radio"}
                aria-checked={on}
                disabled={disabled}
                onClick={() => toggle(i)}
                className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3.5 text-left transition-all duration-150 ${tone}`}
              >
                <span
                  className={`grid size-9 shrink-0 place-items-center rounded-xl font-display text-lg font-bold ${
                    on ? (verdict === false ? "bg-primary text-white" : verdict === true ? "bg-success-deep text-white" : "bg-info-deep text-white") : "bg-surface-sunk text-ink"
                  }`}
                >
                  {LETTERS[i]}
                </span>
                <span className="font-mono text-[1.02rem]">{choice}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
