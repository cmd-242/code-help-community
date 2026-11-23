"use client";

import { AnimatePresence, motion, useAnimate } from "motion/react";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useRef, useState } from "react";
import { fireConfetti } from "@/components/fx/confetti";
import { CloseIcon, FlameIcon, LifebuoyIcon, StarIcon } from "@/components/icons";
import { GameButton, GameLink } from "@/components/ui/game-button";
import type { Card, Stage } from "@/features/catalog/types";
import { CardReveal, type RevealedCard } from "@/features/collection/card-reveal";
import { cardsEarnedFromSkills } from "@/features/collection/rules";
import { MAX_HEARTS, stageXp, starsFromHearts } from "@/features/gamification/rules";
import { useProgress } from "@/features/progression/progress-store";
import { useHydratedProgress } from "@/features/progression/use-hydrated-progress";
import { useSound } from "@/features/sound/sound-provider";
import { EncounterView } from "@/games/encounter-view";
import { check, toPublicEncounter, type CheckResult } from "@/games/public";
import { BoatArt } from "@/universes/archipel/boat-art";
import { SeaWaves } from "@/universes/archipel/sea-waves";

type Props = {
  notionSlug: string;
  place: string;
  stage: Stage;
  stageNumber: number;
  nextStageId: string | null;
  /** Cartes de la notion (pour révéler celles gagnées) */
  cards: Card[];
  position: number;
};

type Phase = "intro" | "play" | "victory" | "defeat";

export function StagePlayer({ notionSlug, place, stage, stageNumber, nextStageId, cards, position }: Props) {
  const t = useTranslations("stage");
  const { play } = useSound();
  useHydratedProgress();
  const [phase, setPhase] = useState<Phase>("intro");
  const [index, setIndex] = useState(0);
  const [lives, setLives] = useState(MAX_HEARTS);
  const [combo, setCombo] = useState(0);
  const [run, setRun] = useState(0);
  const [reward, setReward] = useState<{ stars: number; xp: number } | null>(null);
  const [scope, animate] = useAnimate();
  const publicEncounters = useMemo(() => stage.encounters.map(toPublicEncounter), [stage]);
  const total = publicEncounters.length;
  const succeeded = useRef<string[]>([]);
  const [reveal, setReveal] = useState<RevealedCard[] | null>(null);

  const restart = () => {
    setIndex(0);
    setLives(MAX_HEARTS);
    setCombo(0);
    setReward(null);
    succeeded.current = [];
    setRun((r) => r + 1);
    setPhase("play");
  };

  const onResolved = ({ correct, skill }: CheckResult) => {
    if (correct) {
      if (skill) {
        succeeded.current.push(skill);
        useProgress.getState().addSkillHit(skill);
      }
      play("correct");
      setCombo((c) => c + 1);
    } else {
      play("wrong");
      setCombo(0);
      setLives((h) => h - 1);
      if (scope.current) void animate(scope.current, { x: [0, -10, 9, -7, 5, 0] }, { duration: 0.4 });
    }
  };

  const onContinue = () => {
    if (lives <= 0) {
      play("defeat");
      setPhase("defeat");
      return;
    }
    if (index + 1 < total) {
      setIndex((i) => i + 1);
      return;
    }
    const stars = starsFromHearts(lives);
    const state = useProgress.getState();
    const previous = state.stageStars[stage.id] ?? 0;
    const xp = stageXp(stage.xp, previous, stars);
    state.recordStage(stage.id, stars);
    state.addXp({ amount: xp, reason: "stage", ref: stage.id });
    // Cartes gagnées : une par compétence réussie, si elle n'est pas déjà dans la collection
    const earned = cardsEarnedFromSkills(cards, succeeded.current, state.cards);
    if (earned.length) {
      state.unlockCards(earned);
      const items = earned.map((id) => ({ card: cards.find((c) => c.id === id)!, position }));
      window.setTimeout(() => setReveal(items), 2600);
    }
    setReward({ stars, xp });
    setPhase("victory");
    play("victory");
    fireConfetti(stars === 3 ? "gold" : "fresh");
  };

  return (
    <div className="mx-auto max-w-2xl px-3 pb-20 pt-4">
      <AnimatePresence mode="wait">
        {phase === "intro" && (
          <StageIntro key="intro" place={place} stageNumber={stageNumber} title={stage.title} description={stage.description} count={total} onDepart={() => setPhase("play")} />
        )}

        {phase === "play" && (
          <motion.section key={`play-${run}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="mb-3 flex items-center justify-between gap-3">
              <GameLink href={`/app/notion/${notionSlug}`} variant="secondary" className="size-12 !min-h-12 !rounded-full !p-0" aria-label={t("quit")}>
                <CloseIcon />
              </GameLink>
              <AnimatePresence>
                {combo >= 2 && (
                  <motion.span
                    key={combo}
                    initial={{ scale: 0.3, rotate: -12, opacity: 0 }}
                    animate={{ scale: 1, rotate: 0, opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-1 rounded-full bg-accent px-3 py-1 font-display text-lg font-bold"
                  >
                    <FlameIcon className="size-5 text-primary" />
                    {t("combo", { count: combo })}
                  </motion.span>
                )}
              </AnimatePresence>
              <div className="flex gap-1" aria-label={t("lives", { count: lives })}>
                {Array.from({ length: MAX_HEARTS }).map((_, i) => (
                  <motion.span key={i} animate={i < lives ? { scale: 1, rotate: 0 } : { scale: [1.4, 0.85], rotate: 40 }}>
                    <LifebuoyIcon filled={i < lives} className="size-8 text-ink" />
                  </motion.span>
                ))}
              </div>
            </div>

            {/* La traversée : le bateau avance d'une bouée à l'autre */}
            <div className="sea relative mb-4 h-16 overflow-hidden rounded-2xl" aria-label={t("progress", { current: index + 1, total })} role="img">
              <SeaWaves />
              <div className="absolute inset-x-6 top-[60%] border-t-[3px] border-dotted border-white/80" />
              {publicEncounters.map((e, i) => (
                <span
                  key={e.id}
                  className={`absolute top-[60%] size-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full ${i < index ? "bg-accent" : "bg-white"}`}
                  style={{ left: `calc(1.5rem + (100% - 3rem) * ${total > 1 ? i / (total - 1) : 0})` }}
                />
              ))}
              <motion.div
                className="absolute top-0.5 w-12 -translate-x-1/2"
                animate={{ left: `calc(1.5rem + (100% - 3rem) * ${total > 1 ? index / (total - 1) : 0})` }}
                transition={{ type: "spring", stiffness: 60, damping: 14 }}
              >
                <BoatArt className="w-12" />
              </motion.div>
            </div>

            <div ref={scope} className="paper rounded-[2rem] p-5 sm:p-7">
              <EncounterView
                key={`${run}-${index}`}
                encounter={publicEncounters[index]}
                check={(r) => check(stage.encounters[index], r)}
                onResolved={onResolved}
                onContinue={onContinue}
              />
            </div>
          </motion.section>
        )}

        {phase === "victory" && reward && (
          <Victory
            key="victory"
            stars={reward.stars}
            xp={reward.xp}
            notionSlug={notionSlug}
            nextHref={nextStageId ? `/app/notion/${notionSlug}/etape/${nextStageId}` : null}
            onReplay={restart}
          />
        )}

        {phase === "defeat" && (
          <motion.section key="defeat" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="paper rounded-[2rem] px-6 py-10 text-center">
            <motion.div initial={{ y: 0, rotate: 0 }} animate={{ y: 26, rotate: 18, opacity: 0.5 }} transition={{ duration: 2, ease: "easeIn" }} className="mx-auto w-24">
              <BoatArt bobbing={false} className="w-24" />
            </motion.div>
            <h1 className="mt-6 font-display text-4xl font-bold text-danger-text">{t("defeatTitle")}</h1>
            <p className="mx-auto mt-3 max-w-md text-lg text-muted">{t("defeatBody")}</p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <GameButton onClick={restart} sfx="whoosh">
                {t("retry")}
              </GameButton>
              <GameLink variant="secondary" href={`/app/notion/${notionSlug}#cours`} sfx="page">
                {t("readCourse")}
              </GameLink>
            </div>
          </motion.section>
        )}
      </AnimatePresence>
      {reveal && <CardReveal items={reveal} title={t("newCards", { count: reveal.length })} onClose={() => setReveal(null)} />}
    </div>
  );
}

function StageIntro(props: { place: string; stageNumber: number; title: string; description: string; count: number; onDepart: () => void }) {
  const t = useTranslations("stage");
  const { play } = useSound();
  const [leaving, setLeaving] = useState(false);
  const depart = () => {
    if (leaving) return;
    setLeaving(true);
    play("enter");
    window.setTimeout(props.onDepart, 1300);
  };
  return (
    <motion.section exit={{ opacity: 0, y: -10 }} className="paper overflow-hidden rounded-[2rem] text-center">
      <div className="sea relative h-44 overflow-hidden">
        <SeaWaves />
        {/* le ponton */}
        <div className="absolute bottom-6 left-0 h-3 w-28 rounded-r-md bg-wood shadow-[0_4px_0_var(--color-wood-deep)]" />
        <motion.div
          className="absolute bottom-5 left-16 w-24"
          animate={leaving ? { x: 420, y: -10, rotate: 4 } : { x: 0 }}
          transition={{ duration: 1.3, ease: [0.5, 0, 0.5, 1] }}
        >
          <BoatArt className="w-24" />
        </motion.div>
      </div>
      <div className="px-6 pb-8 pt-6">
        <p className="font-bold text-info-deep">{t("where", { place: props.place, stage: props.stageNumber })}</p>
        <h1 className="mt-1 font-display text-4xl font-bold leading-tight text-balance">{props.title}</h1>
        <p className="mx-auto mt-2 max-w-md text-lg text-muted">{props.description}</p>
        <p className="mt-1 text-muted">{t("encounters", { count: props.count })}</p>
        <GameButton className="mt-7 w-full sm:w-auto" disabled={leaving} onClick={depart} sfx="click">
          {t("depart")}
        </GameButton>
      </div>
    </motion.section>
  );
}

function Victory({ stars, xp, notionSlug, nextHref, onReplay }: { stars: number; xp: number; notionSlug: string; nextHref: string | null; onReplay: () => void }) {
  const t = useTranslations("stage");
  const { play } = useSound();
  const [shownXp, setShownXp] = useState(0);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const timers: number[] = [];
    timers.push(window.setTimeout(() => {
      setOpen(true);
      play("unlock");
    }, 500));
    const start = 1100 + stars * 300;
    const steps = Math.min(24, xp);
    for (let i = 1; i <= steps; i++) {
      timers.push(window.setTimeout(() => {
        setShownXp(Math.round((xp * i) / steps));
        play("xp");
      }, start + i * 45));
    }
    return () => timers.forEach((id) => window.clearTimeout(id));
  }, [stars, xp, play]);

  return (
    <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="paper rounded-[2rem] px-6 py-10 text-center">
      <h1 className="font-display text-4xl font-bold">{t("victoryTitle")}</h1>

      {/* le coffre s'ouvre */}
      <div className="relative mx-auto mt-6 h-32 w-40" aria-hidden>
        <motion.span
          className="absolute left-1/2 top-2 h-24 w-24 -translate-x-1/2 rounded-full bg-accent/60 blur-xl"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={open ? { opacity: 1, scale: 1.3 } : {}}
        />
        <div className="absolute bottom-0 left-2 right-2 h-16 rounded-b-xl rounded-t-sm bg-wood shadow-[0_6px_0_var(--color-wood-deep)]">
          <span className="absolute left-1/2 top-2 h-5 w-5 -translate-x-1/2 rounded bg-accent" />
        </div>
        <motion.div
          className="absolute bottom-14 left-2 right-2 h-10 origin-bottom-left rounded-t-[3rem] bg-[#c2834a]"
          animate={open ? { rotate: -28, y: -6 } : { rotate: 0 }}
          transition={{ type: "spring", stiffness: 160, damping: 10 }}
        />
      </div>

      <div className="mt-4 flex justify-center gap-3" aria-label={t("starsLabel", { count: stars })}>
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            initial={{ scale: 0, y: 30 }}
            animate={{ scale: i < stars ? [0, 1.35, 1] : 1, y: 0 }}
            transition={{ delay: 0.8 + i * 0.3, duration: 0.5 }}
            className={i < stars ? "text-accent-deep" : "text-line"}
          >
            <StarIcon className={i === 1 ? "size-16 -translate-y-2" : "size-13"} filled={i < stars} />
          </motion.span>
        ))}
      </div>
      <p className="mt-4 font-display text-5xl font-bold tabular-nums text-success-deep">+{shownXp} XP</p>
      <p className="mx-auto mt-2 max-w-sm text-muted">{t(`starsHint${stars}` as "starsHint1")}</p>
      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        {nextHref ? (
          <GameLink href={nextHref} sfx="enter">
            {t("nextStage")}
          </GameLink>
        ) : (
          <GameLink href={`/app/notion/${notionSlug}`} sfx="enter">
            {t("backToNotion")}
          </GameLink>
        )}
        <GameButton variant="secondary" onClick={onReplay}>
          {t("replay")}
        </GameButton>
      </div>
    </motion.section>
  );
}
