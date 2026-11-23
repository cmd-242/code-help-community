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

/** Texte à trous : chaque planche de la réserve remplit le premier trou libre. */
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
      <pre className="whitespace-pre-wrap rounded-2xl bg-ink px-4 py-4 font-mono text-lg leading-[2.4] text-[#e9f7f5]">
        <span className="text-success">$ </span>
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
                        <span className="text-success">$ </span>
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
              className={`mx-0.5 inline-block min-w-14 rounded-lg px-2 py-0.5 align-middle leading-normal transition ${
                value === null ? "animate-pulse border-2 border-dashed border-accent text-transparent" : "bg-accent font-semibold text-ink"
              }`}
            >
              {value === null ? "___" : encounter.bank[value]}
            </button>
          );
        })}
      </pre>
      <p className="mb-2 mt-5 text-sm font-bold text-wood-deep">{t("fillBank")}</p>
      <ul className="flex flex-wrap gap-2">
        {encounter.bank.map((token, i) => {
          const used = slots.includes(i);
          return (
            <li key={i}>
              <button
                type="button"
                disabled={disabled || used}
                onClick={() => pick(i)}
                className="min-h-12 min-w-12 rounded-xl bg-wood px-3.5 py-2.5 font-mono text-lg font-semibold text-white shadow-[0_4px_0_var(--color-wood-deep)] transition hover:-translate-y-0.5 disabled:bg-line disabled:text-muted disabled:shadow-none"
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
