"use client";

import { useTranslations } from "next-intl";
import type { Card, Rarity } from "@/features/catalog/types";
import { CreatureArt } from "@/universes/archipel/creature-art";

const RARITY_BG: Record<Rarity, string> = {
  common: "bg-rarity-common",
  rare: "bg-rarity-rare",
  epic: "bg-rarity-epic",
  legendary: "bg-rarity-legendary",
};
const RARITY_RING: Record<Rarity, string> = {
  common: "shadow-[0_0_0_3px_var(--color-rarity-common),0_6px_0_3px_rgba(19,50,75,0.15)]",
  rare: "shadow-[0_0_0_3px_var(--color-rarity-rare),0_6px_0_3px_rgba(19,50,75,0.15)]",
  epic: "shadow-[0_0_0_3px_var(--color-rarity-epic),0_0_22px_rgba(124,77,196,0.45),0_6px_0_3px_rgba(19,50,75,0.15)]",
  legendary: "shadow-[0_0_0_3px_var(--color-accent),0_0_0_6px_var(--color-rarity-legendary),0_0_30px_rgba(255,207,107,0.7)]",
};

type Props = {
  card: Card;
  owned: boolean;
  mastery?: 1 | 2 | 3;
  shiny?: boolean;
  /** position de la notion : sert au portrait du gardien */
  position?: number;
  size?: "sm" | "md";
  lockedHint?: string;
  className?: string;
};

/** Une carte de la collection : commande maîtrisée ou gardien vaincu. */
export function GameCard({ card, owned, mastery = 1, shiny = false, position = 1, size = "md", lockedHint, className = "" }: Props) {
  const t = useTranslations("collection");
  const small = size === "sm";

  if (!owned) {
    return (
      <div
        className={`flex aspect-[5/7] flex-col items-center justify-center rounded-2xl border-[3px] border-dashed border-line bg-surface-sunk p-2 text-center ${className}`}
        aria-label={t("lockedLabel")}
      >
        <span className={`font-display font-bold text-line ${small ? "text-3xl" : "text-5xl"}`} aria-hidden>
          ?
        </span>
        {lockedHint && <span className={`mt-1 font-bold text-muted ${small ? "text-[0.7rem] leading-tight" : "text-sm"}`}>{lockedHint}</span>}
      </div>
    );
  }

  return (
    <article
      className={`relative flex aspect-[5/7] flex-col overflow-hidden rounded-2xl bg-surface ${RARITY_RING[card.rarity]} ${className}`}
      aria-label={t("cardLabel", { title: card.title, rarity: t(`rarity.${card.rarity}`) })}
    >
      <header className={`flex items-center justify-between gap-1 px-2 py-1.5 text-white ${RARITY_BG[card.rarity]}`}>
        <h3 className={`truncate ${card.kind === "command" ? "font-mono font-semibold" : "font-display font-bold"} ${small ? "text-[0.8rem]" : "text-base"}`}>
          {card.title}
        </h3>
        {shiny && (
          <span className={`shrink-0 rounded-full bg-white/25 px-1.5 font-bold ${small ? "text-[0.6rem]" : "text-xs"}`}>{t("shiny")}</span>
        )}
      </header>

      <div className="sea relative flex flex-1 items-center justify-center overflow-hidden">
        {card.kind === "guardian" ? (
          <CreatureArt position={position} className={small ? "w-14" : "w-24"} />
        ) : (
          <span className={`rounded-xl bg-ink px-2 py-1 font-mono font-semibold text-[#e9f7f5] ${small ? "text-sm" : "text-2xl"}`}>{card.title}</span>
        )}
      </div>

      {!small && <p className="px-2.5 pt-2 text-[0.82rem] leading-snug text-ink">{card.text}</p>}

      <footer className={`mt-auto flex items-center justify-between px-2 ${small ? "py-1" : "py-2"}`}>
        <span className={`font-bold text-muted ${small ? "text-[0.62rem]" : "text-xs"}`}>{t(`rarity.${card.rarity}`)}</span>
        {card.kind === "command" && (
          <span className="flex gap-0.5" aria-label={t("masteryLabel", { level: mastery })}>
            {[1, 2, 3].map((l) => (
              <span key={l} className={`rounded-full ${small ? "size-1.5" : "size-2.5"} ${l <= mastery ? "bg-accent-deep" : "bg-line"}`} />
            ))}
          </span>
        )}
      </footer>

      {shiny && (
        <span aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          <span className="absolute -top-1/2 left-0 h-[200%] w-1/3 animate-sheen bg-gradient-to-r from-transparent via-white/60 to-transparent" />
        </span>
      )}
    </article>
  );
}
