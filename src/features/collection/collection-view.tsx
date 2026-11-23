"use client";

import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { ChestIcon } from "@/components/icons";
import { GameButton } from "@/components/ui/game-button";
import type { Card } from "@/features/catalog/types";
import { WEEKLY_GOALS, weeklyXp } from "@/features/gamification/rules";
import { useProgress } from "@/features/progression/progress-store";
import { useHydratedProgress } from "@/features/progression/use-hydrated-progress";
import { useSound } from "@/features/sound/sound-provider";
import { CardReveal, type RevealedCard } from "./card-reveal";
import { GameCard } from "./game-card";
import { BOOSTER_XP, boosterAvailable, collectionStats, guardianCardId, hitsToNextMastery, masteryLevel, pickBoosterCard, weekKey } from "./rules";

type Group = { slug: string; place: string; position: number; cards: Card[] };

export function CollectionView({ groups, allCards }: { groups: Group[]; allCards: Card[] }) {
  const t = useTranslations("collection");
  const ready = useHydratedProgress();
  const owned = useProgress((s) => s.cards);
  const shiny = useProgress((s) => s.shiny);
  const hits = useProgress((s) => s.skillHits);
  const [selected, setSelected] = useState<string | null>(null);

  if (!ready) return <div className="mt-6 h-96 animate-pulse rounded-[2rem] bg-surface-sunk" />;

  const stats = collectionStats(allCards, owned);
  const positionOf = (slug: string) => groups.find((g) => g.slug === slug)?.position ?? 1;
  const detail = selected ? allCards.find((c) => c.id === selected) : null;

  return (
    <div className="mt-5 space-y-8">
      <div className="paper flex items-center gap-4 rounded-[2rem] p-5">
        <div className="min-w-0 flex-1">
          <p className="font-display text-2xl font-bold">{t("progress", { owned: stats.owned, total: stats.total })}</p>
          <div className="mt-2 h-3.5 overflow-hidden rounded-full bg-[#dcefee]">
            <motion.div className="h-full rounded-full bg-rarity-epic" initial={{ width: 0 }} animate={{ width: `${(stats.owned / Math.max(1, stats.total)) * 100}%` }} transition={{ duration: 1 }} />
          </div>
        </div>
      </div>

      <WeeklyChest allCards={allCards} positionOf={positionOf} />

      {groups.map((g) => (
        <section key={g.slug} aria-labelledby={`g-${g.slug}`}>
          <h2 id={`g-${g.slug}`} className="px-2 font-display text-2xl font-bold">
            {g.place}
          </h2>
          <ul className="mt-3 grid grid-cols-3 gap-3 sm:grid-cols-4">
            {g.cards.map((c) => {
              const has = Boolean(owned[c.id]);
              return (
                <li key={c.id}>
                  <button
                    type="button"
                    onClick={() => has && setSelected(c.id)}
                    disabled={!has}
                    className="block w-full rounded-2xl text-left transition enabled:hover:-translate-y-1"
                    aria-label={has ? t("openCard", { title: c.title }) : t("lockedLabel")}
                  >
                    <GameCard
                      card={c}
                      owned={has}
                      size="sm"
                      position={g.position}
                      shiny={Boolean(shiny[c.id])}
                      mastery={masteryLevel(hits[c.id] ?? 0)}
                      lockedHint={c.id === guardianCardId(g.slug) ? t("hintGuardian") : t("hintCommand")}
                    />
                  </button>
                </li>
              );
            })}
          </ul>
        </section>
      ))}

      {detail && (
        <div className="fixed inset-0 z-[70] grid place-items-center bg-ink/70 p-6 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label={detail.title} onClick={() => setSelected(null)}>
          <motion.div initial={{ scale: 0.7, rotate: -4 }} animate={{ scale: 1, rotate: 0 }} className="w-64" onClick={(e) => e.stopPropagation()}>
            <GameCard card={detail} owned position={positionOf(detail.notion)} shiny={Boolean(shiny[detail.id])} mastery={masteryLevel(hits[detail.id] ?? 0)} />
            {detail.kind === "command" && (
              <p className="mt-4 text-center font-bold text-white">
                {hitsToNextMastery(hits[detail.id] ?? 0) === null
                  ? t("masteryMax")
                  : t("masteryNext", { count: hitsToNextMastery(hits[detail.id] ?? 0) ?? 0 })}
              </p>
            )}
            <GameButton variant="secondary" className="mt-4 w-full" onClick={() => setSelected(null)} autoFocus>
              {t("close")}
            </GameButton>
          </motion.div>
        </div>
      )}
    </div>
  );
}

/** Le coffre de la semaine : s'ouvre quand le cap hebdomadaire est atteint. */
function WeeklyChest({ allCards, positionOf }: { allCards: Card[]; positionOf: (slug: string) => number }) {
  const t = useTranslations("collection");
  const { play } = useSound();
  const events = useProgress((s) => s.xpEvents);
  const goal = useProgress((s) => s.weeklyGoal);
  const owned = useProgress((s) => s.cards);
  const opened = useProgress((s) => s.boosterWeeks);
  const [reveal, setReveal] = useState<RevealedCard[] | null>(null);
  const [bonus, setBonus] = useState(false);

  const now = new Date();
  const key = weekKey(now);
  const earned = weeklyXp(events, now);
  const target = WEEKLY_GOALS[goal];
  const available = boosterAvailable(earned, target, key, opened);
  const done = opened.includes(key);

  const open = () => {
    const state = useProgress.getState();
    const cardId = pickBoosterCard(Object.keys(state.cards), state.shiny);
    state.openBooster(key, cardId);
    play("unlock");
    if (cardId) {
      const card = allCards.find((c) => c.id === cardId);
      if (card) setReveal([{ card, position: positionOf(card.notion), shiny: true }]);
    } else {
      state.addXp({ amount: BOOSTER_XP, reason: "booster", ref: key });
      setBonus(true);
    }
  };

  return (
    <section className="flex items-center gap-4 rounded-[2rem] bg-sand p-5 shadow-[0_6px_0_#e2c27f]" aria-labelledby="chest-title">
      <motion.div animate={available ? { rotate: [0, -8, 8, -4, 0] } : {}} transition={{ duration: 0.8, repeat: Infinity, repeatDelay: 1.6 }}>
        <ChestIcon className="size-16" />
      </motion.div>
      <div className="min-w-0 flex-1">
        <h2 id="chest-title" className="font-display text-xl font-bold">
          {t("chestTitle")}
        </h2>
        <p className="text-sm font-semibold text-wood-deep">
          {bonus ? t("chestBonus", { xp: BOOSTER_XP }) : done ? t("chestDone") : available ? t("chestReady") : t("chestLocked", { left: Math.max(0, target - earned) })}
        </p>
        {available && (
          <GameButton variant="wood" className="mt-3" onClick={open} sfx="click">
            {t("chestOpen")}
          </GameButton>
        )}
        {!available && !done && Object.keys(owned).length === 0 && <p className="mt-1 text-sm text-wood-deep">{t("chestHint")}</p>}
      </div>
      {reveal && <CardReveal items={reveal} title={t("chestReveal")} onClose={() => setReveal(null)} />}
    </section>
  );
}
