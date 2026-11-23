"use client";

import { useTranslations } from "next-intl";
import { Fragment, useState } from "react";
import { useSound } from "@/features/sound/sound-provider";
import type { PublicEncounter } from "@/games/public";
import { countBlanks } from "@/games/grading";

type Props = {
  encounter: Extract<PublicEncounter, { type: "fill" }>;
  disabled: boolean;
  onChange: (response: string[] | null) => void;
};

/** Texte à trous : chaque jeton de la banque remplit le premier trou libre. */
export function FillPlay({ encounter, disabled, onChange }: Props) {
  const t = useTranslations("game");
  const { play } = useSound();
  const blanks = countBlanks(encounter.template);
  const [slots, setSlots] = useState<(number | null)[]>(() => Array(blanks).fill(null));

  const update = (next: (number | null)[]) => {
    setSlots(next);
    onChange(next.every((s) => s !== null) ? next.map((s) => encounter.bank[s as number]) : null);
  };
  const pick = (bankIndex: number) => {
    if (disabled) return;
    const free = slots.indexOf(null);
    if (free < 0) return;
    play("pick");
    const next = [...slots];
    next[free] = bankIndex;
    update(next);
  };
  const clear = (slot: number) => {
    if (disabled || slots[slot] === null) return;
    play("drop");
    const next = [...slots];
    next[slot] = null;
    update(next);
  };

  const parts = encounter.template.split(/(\{\{\d+\}\})/g);

  return (
    <div>
      <pre className="whitespace-pre-wrap rounded-lg border border-stone-edge/50 bg-abyss-deep/90 px-4 py-4 font-mono text-lg leading-[2.4] text-parchment">
        <span className="text-moss-dim">$ </span>
        {parts.map((part, k) => {
          const m = part.match(/^\{\{(\d+)\}\}$/);
          if (!m) {
            return (
              <Fragment key={k}>
                {part.split("\n").map((seg, j) => (
                  <Fragment key={j}>
                    {j > 0 && (
                      <>
                        {"\n"}
                        <span className="text-moss-dim">$ </span>
                      </>
                    )}
                    {seg}
                  </Fragment>
                ))}
              </Fragment>
            );
          }
          const slot = Number(m[1]);
          const value = slots[slot];
          return (
            <button
              key={k}
              type="button"
              onClick={() => clear(slot)}
              disabled={disabled}
              aria-label={value === null ? t("blankEmpty", { n: slot + 1 }) : t("blankFilled", { value: encounter.bank[value] })}
              className={`mx-0.5 inline-block min-w-14 rounded-md border-b-2 px-2 py-0.5 align-middle leading-normal transition ${
                value === null ? "animate-pulse border-torch bg-torch/10 text-transparent" : "border-torch bg-torch/20 text-torch-bright"
              }`}
            >
              {value === null ? "___" : encounter.bank[value]}
            </button>
          );
        })}
      </pre>
      <p className="mb-2 mt-5 text-sm text-parchment-dim">{t("fillBank")}</p>
      <ul className="flex flex-wrap gap-2">
        {encounter.bank.map((token, i) => {
          const used = slots.includes(i);
          return (
            <li key={i}>
              <button
                type="button"
                disabled={disabled || used}
                onClick={() => pick(i)}
                className="stone min-w-12 rounded-lg border border-stone-edge/70 px-3.5 py-2.5 font-mono text-lg text-parchment transition hover:-translate-y-0.5 hover:border-torch disabled:opacity-25"
              >
                {token}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
