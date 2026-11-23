"use client";

import { AnimatePresence, motion, useAnimate } from "motion/react";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useRef, useState } from "react";
import { fireConfetti } from "@/components/fx/confetti";
import { SailIcon } from "@/components/icons";
import { GameButton, GameLink } from "@/components/ui/game-button";
import { challengeScore, challengeXp } from "@/features/gamification/rules";
import type { Card } from "@/features/catalog/types";
import { CardReveal } from "@/features/collection/card-reveal";
import { guardianCardId } from "@/features/collection/rules";
import { useProgress } from "@/features/progression/progress-store";
import { useHydratedProgress } from "@/features/progression/use-hydrated-progress";
import { useSound } from "@/features/sound/sound-provider";
import { EncounterView } from "@/games/encounter-view";
import type { CheckResult, PublicEncounter } from "@/games/public";
import { CreatureArt } from "@/universes/archipel/creature-art";
import { SeaWaves } from "@/universes/archipel/sea-waves";
import { answerGuardian, startGuardianFight } from "./actions";

type Props = {
  notionSlug: string;
  position: number;
  guardian: { name: string; title: string; taunt: string };
  next: { slug: string; place: string } | null;
  /** Carte légendaire gagnée en battant ce gardien */
  guardianCard: Card | null;
};

type Fight = { questions: PublicEncounter[]; durationSeconds: number; passingScore: number; xp: number };
type Phase = "intro" | "loading" | "fight" | "won" | "lost";

export function GuardianFight({ notionSlug, position, guardian, next, guardianCard }: Props) {
  const t = useTranslations("guardian");
  const { play } = useSound();
  useHydratedProgress();
  const [phase, setPhase] = useState<Phase>("intro");
  const [fight, setFight] = useState<Fight | null>(null);
  const [index, setIndex] = useState(0);
  const [hits, setHits] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [result, setResult] = useState<{ score: number; xp: number } | null>(null);
  const [error, setError] = useState(false);
  const [creatureScope, animateCreature] = useAnimate();
  const [splash, setSplash] = useState(0);
  const hitsRef = useRef(0);
  const [reveal, setReveal] = useState<Card | null>(null);

  const finish = useCallback(
    (correct: number, f: Fight) => {
      const score = challengeScore(correct, f.questions.length);
      const passed = score >= f.passingScore;
      const state = useProgress.getState();
      const already = Boolean(state.cleared[notionSlug]);
      const xp = challengeXp(f.xp, passed, already);
      state.recordGuardian(notionSlug, score, passed);
      state.addXp({ amount: xp, reason: "guardian", ref: notionSlug });
      setResult({ score, xp });
      if (passed) {
        const id = guardianCardId(notionSlug);
        if (guardianCard && !state.cards[id]) {
          state.unlockCards([id]);
          window.setTimeout(() => setReveal(guardianCard), 3200);
        }
        play("victory");
        window.setTimeout(() => play("unlock"), 1600);
        fireConfetti("gold");
        setPhase("won");
      } else {
        play("bossRoar");
        window.setTimeout(() => play("defeat"), 700);
        setPhase("lost");
      }
    },
    [notionSlug, play, guardianCard],
  );

  // Sablier
  useEffect(() => {
    if (phase !== "fight" || !fight) return;
    if (timeLeft <= 0) {
      finish(hitsRef.current, fight);
      return;
    }
    const id = window.setTimeout(() => setTimeLeft((s) => s - 1), 1000);
    return () => window.clearTimeout(id);
  }, [phase, timeLeft, fight, finish]);

  const engage = async () => {
    play("bossRoar");
    setPhase("loading");
    setError(false);
    try {
      const f = await startGuardianFight(notionSlug);
      setFight(f);
      setIndex(0);
      setHits(0);
      hitsRef.current = 0;
      setTimeLeft(f.durationSeconds);
      setPhase("fight");
    } catch {
      setError(true);
      setPhase("intro");
    }
  };

  const onResolved = ({ correct, skill }: CheckResult) => {
    if (correct) {
      if (skill) useProgress.getState().addSkillHit(skill);
      hitsRef.current += 1;
      setHits(hitsRef.current);
      play("bossHit");
      if (creatureScope.current) {
        void animateCreature(creatureScope.current, { x: [0, 14, -10, 6, 0], rotate: [0, 8, -6, 0], scale: [1, 0.9, 1] }, { duration: 0.5 });
      }
    } else {
      play("wrong");
      setSplash((h) => h + 1);
    }
  };

  const onContinue = () => {
    if (!fight) return;
    if (index + 1 < fight.questions.length) setIndex((i) => i + 1);
    else finish(hitsRef.current, fight);
  };

  const total = fight?.questions.length ?? 0;
  const minutes = Math.floor(timeLeft / 60);
  const seconds = String(timeLeft % 60).padStart(2, "0");
  const lowTime = phase === "fight" && timeLeft <= 30;

  return (
    <div className="relative mx-auto max-w-2xl px-3 pb-20 pt-4">
      {/* une vague éclabousse l'écran quand le gardien riposte */}
      <AnimatePresence>
        {splash > 0 && (
          <motion.div
            key={splash}
            aria-hidden
            className="pointer-events-none fixed inset-0 z-50 shadow-[inset_0_0_120px_40px_rgba(46,196,214,0.75)]"
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {(phase === "intro" || phase === "loading") && (
          <motion.section key="intro" exit={{ opacity: 0 }} className="paper overflow-hidden rounded-[2rem] text-center">
            <div className="sea relative h-64 overflow-hidden">
              <SeaWaves />
              <motion.div
                initial={{ y: 140 }}
                animate={{ y: 0 }}
                transition={{ type: "spring", stiffness: 60, damping: 11, delay: 0.2 }}
                className="absolute inset-x-0 bottom-0 mx-auto w-52"
              >
                <CreatureArt position={position} className="w-52 animate-bob" />
              </motion.div>
            </div>
            <div className="px-6 pb-8 pt-6">
              <p className="font-bold text-danger-text">{t("label")}</p>
              <h1 className="font-display text-4xl font-bold">{guardian.name}</h1>
              <p className="text-muted">{guardian.title}</p>
              <motion.blockquote initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className="mx-auto mt-4 max-w-md text-xl font-semibold italic">
                « {guardian.taunt} »
              </motion.blockquote>
              <p className="mx-auto mt-5 max-w-md text-muted">{t("rules")}</p>
              {error && (
                <p className="mt-4 font-bold text-danger-text" role="alert">
                  {t("error")}
                </p>
              )}
              <GameButton className="mt-7 w-full sm:w-auto" onClick={engage} disabled={phase === "loading"}>
                {phase === "loading" ? t("loading") : t("engage")}
              </GameButton>
            </div>
          </motion.section>
        )}

        {phase === "fight" && fight && (
          <motion.section key="fight" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="sea relative flex items-end gap-3 overflow-hidden rounded-[2rem] px-4 pb-4 pt-3">
              <SeaWaves />
              <div ref={creatureScope} className="relative shrink-0">
                <CreatureArt position={position} className="w-24" />
              </div>
              <div className="relative min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-2">
                  <p className="font-display text-xl font-bold">{guardian.name}</p>
                  <p className={`rounded-full bg-surface px-2.5 font-mono text-lg font-semibold tabular-nums ${lowTime ? "animate-pulse text-danger-text" : ""}`}>
                    {minutes}:{seconds}
                  </p>
                </div>
                <div className="mt-1 flex gap-1" role="meter" aria-valuemin={0} aria-valuemax={total} aria-valuenow={total - hits} aria-label={t("hp")}>
                  {Array.from({ length: total }).map((_, i) => (
                    <motion.span key={i} className="h-4 flex-1 rounded-md" animate={{ backgroundColor: i < total - hits ? "#e8503f" : "rgba(255,255,255,0.55)" }} />
                  ))}
                </div>
                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-white/50">
                  <motion.div className="h-full bg-ink" animate={{ width: `${(timeLeft / fight.durationSeconds) * 100}%` }} transition={{ ease: "linear", duration: 1 }} />
                </div>
                <p className="mt-1 text-sm font-bold">{t("question", { current: index + 1, total })}</p>
              </div>
            </div>

            <div className="paper mt-4 rounded-[2rem] p-5 sm:p-7">
              <EncounterView
                key={fight.questions[index].id}
                encounter={fight.questions[index]}
                check={(response) => answerGuardian({ notionSlug, questionId: fight.questions[index].id, response })}
                onResolved={onResolved}
                onContinue={onContinue}
                submitLabel={t("strike")}
              />
            </div>
          </motion.section>
        )}

        {phase === "won" && result && (
          <motion.section key="won" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="paper overflow-hidden rounded-[2rem] text-center">
            <div className="sea relative h-52 overflow-hidden">
              <SeaWaves />
              <motion.div className="absolute inset-x-0 bottom-0 mx-auto w-44" initial={{ y: 0, opacity: 1 }} animate={{ y: 180, opacity: 0.2 }} transition={{ duration: 1.8, ease: "easeIn" }}>
                <CreatureArt position={position} mood="hurt" className="w-44" />
              </motion.div>
            </div>
            <div className="px-6 pb-8 pt-6">
              <h1 className="font-display text-4xl font-bold">{t("wonTitle")}</h1>
              <p className="mt-2 text-lg">{t("wonBody", { name: guardian.name, score: result.score })}</p>
              <p className="mt-3 font-display text-5xl font-bold text-success-deep">+{result.xp} XP</p>
              {next ? (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1.8 }} className="mx-auto mt-7 max-w-md rounded-3xl bg-success/20 p-5">
                  <SailIcon className="mx-auto size-10 text-info-deep" />
                  <p className="mt-2 text-lg font-semibold">{t("routeOpen", { place: next.place })}</p>
                  <GameLink href={`/app/notion/${next.slug}`} variant="success" className="mt-4" sfx="enter">
                    {t("setSail")}
                  </GameLink>
                </motion.div>
              ) : (
                <GameLink href="/app" className="mt-8" sfx="enter">
                  {t("backToMap")}
                </GameLink>
              )}
            </div>
          </motion.section>
        )}

        {phase === "lost" && result && fight && (
          <motion.section key="lost" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="paper overflow-hidden rounded-[2rem] text-center">
            <div className="sea relative h-52 overflow-hidden">
              <SeaWaves />
              <motion.div className="absolute inset-x-0 bottom-0 mx-auto w-44" animate={{ y: [0, -14, 0], scale: [1, 1.08, 1] }} transition={{ duration: 1.2 }}>
                <CreatureArt position={position} className="w-44" />
              </motion.div>
            </div>
            <div className="px-6 pb-8 pt-6">
              <h1 className="font-display text-4xl font-bold text-danger-text">{t("lostTitle")}</h1>
              <p className="mx-auto mt-2 max-w-md text-lg">{t("lostBody", { score: result.score, needed: fight.passingScore })}</p>
              <p className="mt-1 text-muted">{t("lostXp", { xp: result.xp })}</p>
              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <GameLink href={`/app/notion/${notionSlug}`} sfx="page">
                  {t("trainAgain")}
                </GameLink>
                <GameButton variant="secondary" onClick={engage}>
                  {t("retry")}
                </GameButton>
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>
      {reveal && <CardReveal items={[{ card: reveal, position }]} title={t("trophy")} onClose={() => setReveal(null)} />}
    </div>
  );
}
