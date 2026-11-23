"use client";

import { AnimatePresence, motion } from "motion/react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { fireConfetti } from "@/components/fx/confetti";
import { GameButton } from "@/components/ui/game-button";
import type { Card } from "@/features/catalog/types";
import { useSound } from "@/features/sound/sound-provider";
import { GameCard } from "./game-card";

export type RevealedCard = { card: Card; position: number; shiny?: boolean };

/**
 * Révélation de cartes gagnées : chaque carte se retourne, l'une après l'autre.
 * Affichée par-dessus l'écran de victoire, d'un gardien ou du coffre de la semaine.
 */
export function CardReveal({ items, title, onClose }: { items: RevealedCard[]; title: string; onClose: () => void }) {
  const t = useTranslations("collection");
  const { play } = useSound();
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const item = items[index];

  useEffect(() => {
    if (!item) return;
    const id = window.setTimeout(() => {
      setFlipped(true);
      play("unlock");
      if (item.card.rarity === "legendary" || item.card.rarity === "epic" || item.shiny) fireConfetti("gold");
    }, 650);
    return () => window.clearTimeout(id);
  }, [item, play]);

  if (!item) return null;
  const last = index === items.length - 1;

  return (
    <motion.div
      className="fixed inset-0 z-[70] grid place-items-center bg-ink/70 p-6 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="reveal-title"
    >
      <div className="flex w-full max-w-xs flex-col items-center text-center">
        <h2 id="reveal-title" className="font-display text-3xl font-bold text-white">
          {title}
        </h2>
        {items.length > 1 && <p className="mt-1 font-bold text-accent">{t("revealCount", { current: index + 1, total: items.length })}</p>}

        <div className="relative mt-6 w-56 [perspective:1000px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={item.card.id}
              className="relative [transform-style:preserve-3d]"
              initial={{ rotateY: 180, scale: 0.6, y: 40 }}
              animate={{ rotateY: flipped ? 0 : 180, scale: flipped ? 1 : 0.85, y: 0 }}
              exit={{ x: -260, opacity: 0, rotate: -12 }}
              transition={{ type: "spring", stiffness: 120, damping: 14 }}
            >
              <div className="[backface-visibility:hidden]">
                <GameCard card={item.card} owned position={item.position} shiny={item.shiny} />
              </div>
              {/* dos de la carte */}
              <div className="sea absolute inset-0 grid place-items-center rounded-2xl shadow-[0_0_0_4px_var(--color-surface)] [backface-visibility:hidden] [transform:rotateY(180deg)]">
                <span className="grid size-16 place-items-center rounded-full bg-surface font-display text-3xl font-bold text-info-deep">?</span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <p className="mt-5 min-h-6 font-bold text-white">{flipped ? t(`rarity.${item.card.rarity}`) : " "}</p>
        <GameButton
          className="mt-4 w-full"
          disabled={!flipped}
          onClick={() => {
            if (last) onClose();
            else {
              setFlipped(false);
              setIndex((i) => i + 1);
            }
          }}
          autoFocus
        >
          {last ? t("revealDone") : t("revealNext")}
        </GameButton>
      </div>
    </motion.div>
  );
}
