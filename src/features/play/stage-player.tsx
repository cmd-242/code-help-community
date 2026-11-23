"use client";

import { AnimatePresence, motion, useAnimate } from "motion/react";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";
import { FlameIcon, HeartIcon, StarIcon, TorchIcon } from "@/components/icons";
import { fireConfetti } from "@/components/fx/confetti";
import { RuneButton, RuneLink } from "@/components/ui/rune-button";
import type { Stage } from "@/features/catalog/types";
import { MAX_HEARTS, stageXp, starsFromHearts } from "@/features/gamification/rules";
import { useProgress } from "@/features/progression/progress-store";
import { useHydratedProgress } from "@/features/progression/use-hydrated-progress";
import { useSound } from "@/features/sound/sound-provider";
import { EncounterView } from "@/games/encounter-view";
import { check, toPublicEncounter } from "@/games/public";

type Props = {
  floorSlug: string;
  floorNumber: number;
  stage: Stage;
  stageNumber: number;
  nextStageId: string | null;
};

type Phase = "intro" | "play" | "victory" | "defeat";

export function StagePlayer({ floorSlug, floorNumber, stage, stageNumber, nextStageId }: Props) {
  const t = useTranslations("stage");
  const { play } = useSound();
  useHydratedProgress();
  const [phase, setPhase] = useState<Phase>("intro");
  const [index, setIndex] = useState(0);
  const [hearts, setHearts] = useState(MAX_HEARTS);
  const [combo, setCombo] = useState(0);
  const [run, setRun] = useState(0);
  const [reward, setReward] = useState<{ stars: number; xp: number } | null>(null);
  const [scope, animate] = useAnimate();
  const publicEncounters = useMemo(() => stage.encounters.map(toPublicEncounter), [stage]);

  const restart = () => {
    setIndex(0);
    setHearts(MAX_HEARTS);
    setCombo(0);
    setReward(null);
    setRun((r) => r + 1);
    setPhase("play");
  };

  const onResolved = (correct: boolean) => {
    if (correct) {
      play("correct");
      setCombo((c) => c + 1);
    } else {
      play("wrong");
      setCombo(0);
      setHearts((h) => h - 1);
      if (scope.current) void animate(scope.current, { x: [0, -10, 9, -7, 5, 0] }, { duration: 0.4 });
    }
  };

  const onContinue = () => {
    if (hearts <= 0) {
      play("defeat");
      setPhase("defeat");
      return;
    }
    if (index + 1 < publicEncounters.length) {
      setIndex((i) => i + 1);
      return;
    }
    // Victoire
    const stars = starsFromHearts(hearts);
    const state = useProgress.getState();
    const previous = state.stageStars[stage.id] ?? 0;
    const xp = stageXp(stage.xp, previous, stars);
    state.recordStage(stage.id, stars);
    state.addXp({ amount: xp, reason: "stage", ref: stage.id });
    setReward({ stars, xp });
    setPhase("victory");
    play("victory");
    fireConfetti(stars === 3 ? "gold" : "moss");
  };

  return (
    <div className="mx-auto max-w-2xl px-4 pb-20 pt-6">
      <AnimatePresence mode="wait">
        {phase === "intro" && (
          <StageIntro
            key="intro"
            floorNumber={floorNumber}
            stageNumber={stageNumber}
            title={stage.title}
            description={stage.description}
            count={publicEncounters.length}
            onEnter={() => setPhase("play")}
          />
        )}

        {phase === "play" && (
          <motion.section key={`play-${run}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="mb-6 flex items-center justify-between gap-4">
              <div className="flex gap-1" aria-label={t("hearts", { count: hearts })}>
                {Array.from({ length: MAX_HEARTS }).map((_, i) => (
                  <motion.span
                    key={i}
                    animate={i < hearts ? { scale: 1, opacity: 1 } : { scale: [1.5, 0.8], opacity: 0.35 }}
                    className={i < hearts ? "text-ember drop-shadow-[0_0_8px_rgba(228,87,46,0.8)]" : "text-stone-edge"}
                  >
                    <HeartIcon className="size-7" filled={i < hearts} />
                  </motion.span>
                ))}
              </div>
              <ol className="flex flex-1 items-center justify-center gap-1.5" aria-label={t("progress", { current: index + 1, total: publicEncounters.length })}>
                {publicEncounters.map((e, i) => (
                  <li key={e.id} className={i <= index ? "text-torch" : "text-stone-edge"}>
                    <TorchIcon className={`size-5 ${i === index ? "animate-flicker drop-shadow-[0_0_6px_rgba(242,165,65,0.9)]" : ""} ${i > index ? "opacity-40 grayscale" : ""}`} />
                  </li>
                ))}
              </ol>
              <AnimatePresence>
                {combo >= 2 && (
                  <motion.span
                    key={combo}
                    initial={{ scale: 0.3, rotate: -15, opacity: 0 }}
                    animate={{ scale: 1, rotate: 0, opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-1 font-display text-xl text-torch-bright torchlight"
                  >
                    <FlameIcon className="size-5 text-ember" />
                    {t("combo", { count: combo })}
                  </motion.span>
                )}
              </AnimatePresence>
            </div>

            <div ref={scope} className="stone rounded-2xl border border-stone-edge/60 p-5 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.8)] sm:p-7">
              <EncounterView
                key={`${run}-${index}`}
                encounter={publicEncounters[index]}
                check={(r) => check(stage.encounters[index], r)}
                onResolved={(r) => onResolved(r.correct)}
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
            floorSlug={floorSlug}
            nextHref={nextStageId ? `/app/etage/${floorSlug}/etape/${nextStageId}` : null}
            onReplay={restart}
          />
        )}

        {phase === "defeat" && (
          <motion.section key="defeat" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="py-10 text-center">
            <p className="carved text-6xl text-ember">{t("defeatTitle")}</p>
            <p className="mx-auto mt-4 max-w-md text-lg text-parchment-dim">{t("defeatBody")}</p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <RuneButton onClick={restart} sfx="torch">
                {t("retry")}
              </RuneButton>
              <RuneLink variant="stone" href={`/app/etage/${floorSlug}#grimoire`} sfx="page">
                {t("readGrimoire")}
              </RuneLink>
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
}

function StageIntro(props: {
  floorNumber: number;
  stageNumber: number;
  title: string;
  description: string;
  count: number;
  onEnter: () => void;
}) {
  const t = useTranslations("stage");
  const { play } = useSound();
  const [opening, setOpening] = useState(false);
  const push = () => {
    if (opening) return;
    setOpening(true);
    play("door");
    window.setTimeout(props.onEnter, 1250);
  };
  return (
    <motion.section exit={{ opacity: 0, scale: 1.08 }} transition={{ duration: 0.4 }} className="text-center">
      <p className="text-torch">{t("where", { floor: props.floorNumber, stage: props.stageNumber })}</p>
      <h1 className="carved torchlight mt-2 text-5xl text-torch-bright text-balance sm:text-6xl">{props.title}</h1>
      <p className="mx-auto mt-3 max-w-md text-lg text-parchment">{props.description}</p>
      <p className="mt-1 text-parchment-dim">{t("encounters", { count: props.count })}</p>

      {/* Porte de pierre : elle s'ouvre quand l'étudiant la pousse */}
      <button
        type="button"
        onClick={push}
        disabled={opening}
        aria-label={t("enter")}
        className="arch group relative mx-auto mt-8 block h-64 w-52 overflow-hidden border-4 border-stone-edge bg-abyss-deep shadow-[0_0_0_6px_#1f3138,0_30px_60px_-20px_rgba(0,0,0,0.9)]"
      >
        <span className="absolute inset-0 bg-[radial-gradient(circle_at_50%_70%,rgba(255,210,122,0.9),rgba(242,165,65,0.35)_35%,transparent_70%)] animate-flicker" />
        {(["left", "right"] as const).map((side) => (
          <motion.span
            key={side}
            aria-hidden
            className={`stone absolute inset-y-0 w-1/2 ${side === "left" ? "left-0 border-r-2" : "right-0 border-l-2"} border-abyss-deep`}
            animate={opening ? { x: side === "left" ? "-100%" : "100%" } : { x: 0 }}
            transition={{ duration: 1.1, ease: [0.65, 0, 0.35, 1] }}
          >
            <span className={`absolute top-[55%] size-3.5 rounded-full bg-torch shadow-[0_0_10px_#f2a541] ${side === "left" ? "right-3" : "left-3"}`} />
            <span className="absolute inset-x-3 top-8 h-px bg-abyss-deep/60" />
            <span className="absolute inset-x-3 bottom-10 h-px bg-abyss-deep/60" />
          </motion.span>
        ))}
      </button>
      <RuneButton className="mt-8" disabled={opening} onClick={push} sfx="torch">
        {t("enter")}
      </RuneButton>
    </motion.section>
  );
}

function Victory({ stars, xp, floorSlug, nextHref, onReplay }: { stars: number; xp: number; floorSlug: string; nextHref: string | null; onReplay: () => void }) {
  const t = useTranslations("stage");
  const { play } = useSound();
  const [shownXp, setShownXp] = useState(0);

  useEffect(() => {
    const timers: number[] = [];
    for (let i = 0; i < stars; i++) timers.push(window.setTimeout(() => play("unlock"), 500 + i * 420));
    const start = 600 + stars * 420;
    const steps = Math.min(24, xp);
    for (let i = 1; i <= steps; i++) {
      timers.push(
        window.setTimeout(() => {
          setShownXp(Math.round((xp * i) / steps));
          play("xp");
        }, start + i * 45),
      );
    }
    return () => timers.forEach((id) => window.clearTimeout(id));
  }, [stars, xp, play]);

  return (
    <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="py-8 text-center">
      <p className="carved torchlight text-6xl text-torch-bright">{t("victoryTitle")}</p>
      <div className="mt-8 flex justify-center gap-3" aria-label={t("starsLabel", { count: stars })}>
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            initial={{ scale: 0, rotate: -90 }}
            animate={{ scale: i < stars ? [0, 1.35, 1] : 1, rotate: 0 }}
            transition={{ delay: 0.5 + i * 0.42, duration: 0.5 }}
            className={i < stars ? "text-torch drop-shadow-[0_0_14px_rgba(242,165,65,0.9)]" : "text-stone-edge"}
          >
            <StarIcon className={i === 1 ? "size-20 -translate-y-3" : "size-16"} filled={i < stars} />
          </motion.span>
        ))}
      </div>
      <p className="mt-6 font-display text-5xl tabular-nums text-moss runeglow">+{shownXp} XP</p>
      <p className="mx-auto mt-3 max-w-sm text-parchment-dim">{t(`starsHint${stars}` as "starsHint1")}</p>
      <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
        {nextHref ? (
          <RuneLink href={nextHref} sfx="door">
            {t("nextStage")}
          </RuneLink>
        ) : (
          <RuneLink href={`/app/etage/${floorSlug}`} sfx="door">
            {t("backToFloor")}
          </RuneLink>
        )}
        <RuneButton variant="stone" onClick={onReplay}>
          {t("replay")}
        </RuneButton>
      </div>
    </motion.section>
  );
}
