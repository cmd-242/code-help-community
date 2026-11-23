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
    const next = encounter.multiple
      ? selected.includes(i)
        ? selected.filter((x) => x !== i)
        : [...selected, i]
      : [i];
    setSelected(next);
    onChange(next.length ? next : null);
  };

  return (
    <div>
      {encounter.multiple && <p className="mb-3 text-base italic text-torch">{t("multiple")}</p>}
      <ul className="grid gap-3 sm:grid-cols-2" role={encounter.multiple ? "group" : "radiogroup"}>
        {encounter.choices.map((choice, i) => {
          const on = selected.includes(i);
          return (
            <li key={i}>
              <button
                type="button"
                role={encounter.multiple ? "checkbox" : "radio"}
                aria-checked={on}
                disabled={disabled}
                onClick={() => toggle(i)}
                className={`group flex w-full items-center gap-3 rounded-xl border-2 px-4 py-3.5 text-left transition-all duration-150 ${
                  on && verdict === true
                    ? "border-moss bg-moss/15 shadow-[0_0_24px_-6px_rgba(127,224,194,0.8)]"
                    : on && verdict === false
                      ? "border-ember bg-ember/15"
                      : on
                        ? "border-torch bg-torch/15 shadow-[0_0_24px_-6px_rgba(242,165,65,0.8)]"
                        : `stone border-stone-edge/60 ${disabled ? "" : "hover:-translate-y-0.5 hover:border-torch/60"}`
                }`}
              >
                <span
                  className={`grid size-9 shrink-0 place-items-center rounded-lg font-display text-xl ${
                    on ? (verdict === true ? "bg-moss text-ink" : verdict === false ? "bg-ember text-white" : "bg-torch text-ink") : "bg-abyss-deep text-torch"
                  }`}
                >
                  {LETTERS[i]}
                </span>
                <span className="font-mono text-[1.02rem] text-parchment">{choice}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
