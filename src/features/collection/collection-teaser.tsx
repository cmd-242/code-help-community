"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import type { Card } from "@/features/catalog/types";
import { useProgress } from "@/features/progression/progress-store";
import { useHydratedProgress } from "@/features/progression/use-hydrated-progress";
import { useSound } from "@/features/sound/sound-provider";
import { GameCard } from "./game-card";
import { collectionStats, masteryLevel } from "./rules";

/** Raccourci vers la collection, avec les trois dernières cartes gagnées en éventail. */
export function CollectionTeaser({ cards, positions }: { cards: Card[]; positions: Record<string, number> }) {
  const t = useTranslations("collection");
  const ready = useHydratedProgress();
  const owned = useProgress((s) => s.cards);
  const hits = useProgress((s) => s.skillHits);
  const shiny = useProgress((s) => s.shiny);
  const { play } = useSound();
  if (!ready) return null;

  const stats = collectionStats(cards, owned);
  const latest = cards
    .filter((c) => owned[c.id])
    .sort((a, b) => owned[b.id].at.localeCompare(owned[a.id].at))
    .slice(0, 3);

  return (
    <Link
      href="/app/collection"
      onPointerEnter={() => play("hover")}
      onClick={() => play("page")}
      className="paper mt-4 flex items-center gap-4 rounded-[2rem] p-5 transition hover:-translate-y-0.5"
    >
      <div className="relative h-24 w-28 shrink-0" aria-hidden>
        {latest.length === 0 ? (
          <div className="absolute inset-x-6 inset-y-0 rounded-xl border-[3px] border-dashed border-line" />
        ) : (
          latest.map((c, i) => (
            <div key={c.id} className="absolute top-0 w-16" style={{ left: `${i * 22}px`, transform: `rotate(${(i - 1) * 9}deg)` }}>
              <GameCard card={c} owned size="sm" position={positions[c.notion] ?? 1} shiny={Boolean(shiny[c.id])} mastery={masteryLevel(hits[c.id] ?? 0)} />
            </div>
          ))
        )}
      </div>
      <div className="min-w-0">
        <p className="font-display text-2xl font-bold">{t("teaserTitle")}</p>
        <p className="font-bold text-muted">{t("progress", { owned: stats.owned, total: stats.total })}</p>
        <p className="text-sm text-muted">{stats.owned === 0 ? t("teaserEmpty") : t("teaserBody")}</p>
      </div>
    </Link>
  );
}
