"use client";

import { LayoutGroup, motion } from "motion/react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useSound } from "@/features/sound/sound-provider";
import type { PublicEncounter } from "@/games/public";

type Props = {
  encounter: Extract<PublicEncounter, { type: "parsons" }>;
  disabled: boolean;
  onChange: (response: string[] | null) => void;
};

const wood =
  "rounded-xl bg-wood px-3 py-2.5 text-left font-mono font-semibold text-white shadow-[0_4px_0_var(--color-wood-deep)] transition";

/**
 * Puzzle de lignes : on touche une planche pour la poser dans l'ordre,
 * on la touche à nouveau pour la retirer, les flèches réordonnent.
 * Pas de glisser-déposer : plus fiable au doigt et au clavier.
 */
export function ParsonsPlay({ encounter, disabled, onChange }: Props) {
  const t = useTranslations("game");
  const { play } = useSound();
  const [placed, setPlaced] = useState<number[]>([]);
  const pool = encounter.pieces.map((_, i) => i).filter((i) => !placed.includes(i));

  const update = (next: number[]) => {
    setPlaced(next);
    onChange(next.length === encounter.slots ? next.map((i) => encounter.pieces[i]) : null);
  };
  const add = (i: number) => {
    if (disabled || placed.length >= encounter.slots) return;
    play("pick");
    update([...placed, i]);
  };
  const remove = (i: number) => {
    if (disabled) return;
    play("drop");
    update(placed.filter((x) => x !== i));
  };
  const move = (pos: number, dir: -1 | 1) => {
    const to = pos + dir;
    if (disabled || to < 0 || to >= placed.length) return;
    play("drop");
    const next = [...placed];
    [next[pos], next[to]] = [next[to], next[pos]];
    update(next);
  };

  return (
    <LayoutGroup>
      <div className="rounded-2xl border-2 border-dashed border-info bg-info/8 p-3">
        <p className="mb-2 text-sm font-bold text-info-deep">{t("parsonsTarget", { count: encounter.slots })}</p>
        <ol className="space-y-2">
          {placed.map((i, pos) => (
            <motion.li key={encounter.pieces[i] + i} layoutId={`piece-${i}`} className="flex items-center gap-2">
              <span className="w-6 text-right font-display text-lg font-bold text-info-deep">{pos + 1}</span>
              <button type="button" disabled={disabled} onClick={() => remove(i)} className={`flex-1 ${wood}`} aria-label={t("removeLine", { line: encounter.pieces[i] })}>
                {encounter.pieces[i]}
              </button>
              <span className="flex flex-col">
                <button type="button" disabled={disabled || pos === 0} onClick={() => move(pos, -1)} className="min-h-6 px-2 text-info-deep disabled:opacity-25" aria-label={t("moveUp")}>
                  ▲
                </button>
                <button
                  type="button"
                  disabled={disabled || pos === placed.length - 1}
                  onClick={() => move(pos, 1)}
                  className="min-h-6 px-2 text-info-deep disabled:opacity-25"
                  aria-label={t("moveDown")}
                >
                  ▼
                </button>
              </span>
            </motion.li>
          ))}
          {Array.from({ length: encounter.slots - placed.length }).map((_, k) => (
            <li key={`empty-${k}`} className="ml-8 h-11 rounded-xl bg-white/70" aria-hidden />
          ))}
        </ol>
      </div>

      <p className="mb-2 mt-5 text-sm font-bold text-wood-deep">{t("parsonsPool")}</p>
      <ul className="flex flex-wrap gap-2">
        {pool.map((i) => (
          <motion.li key={encounter.pieces[i] + i} layoutId={`piece-${i}`}>
            <button type="button" disabled={disabled} onClick={() => add(i)} className={`${wood} hover:-translate-y-0.5`}>
              {encounter.pieces[i]}
            </button>
          </motion.li>
        ))}
      </ul>
    </LayoutGroup>
  );
}
