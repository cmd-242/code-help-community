"use client";

import { AnimatePresence, motion, useAnimate } from "motion/react";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useRef, useState } from "react";
import { fireConfetti } from "@/components/fx/confetti";
import { StairsIcon } from "@/components/icons";
import { RuneButton, RuneLink } from "@/components/ui/rune-button";
import { challengeScore, challengeXp } from "@/features/gamification/rules";
import { useProgress } from "@/features/progression/progress-store";
import { useHydratedProgress } from "@/features/progression/use-hydrated-progress";
import { useSound } from "@/features/sound/sound-provider";
import { EncounterView } from "@/games/encounter-view";
import type { PublicEncounter } from "@/games/public";
import { answerGuardian, startGuardianFight } from "./actions";
import { GuardianArt } from "./guardian-art";

type Props = {
  floorSlug: string;
  floorNumber: number;
  guardian: { name: string; title: string; taunt: string };
  next: { slug: string; floor: number; room: string } | null;
};

type Fight = { questions: PublicEncounter[]; durationSeconds: number; passingScore: number; xp: number };
type Phase = "intro" | "loading" | "fight" | "won" | "lost";

export function GuardianFight({ floorSlug, floorNumber, guardian, next }: Props) {
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
  const [guardianScope, animateGuardian] = useAnimate();
  const [hurt, setHurt] = useState(0);
  const hitsRef = useRef(0);

  const finish = useCallback(
    (correct: number, f: Fight) => {
      const score = challengeScore(correct, f.questions.length);
      const passed = score >= f.passingScore;
      const state = useProgress.getState();
      const already = Boolean(state.cleared[floorSlug]);
      const xp = challengeXp(f.xp, passed, already);
      state.recordGuardian(floorSlug, score, passed);
      state.addXp({ amount: xp, reason: "guardian", ref: floorSlug });
      setResult({ score, xp });
      if (passed) {
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
    [floorSlug, play],
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
      const f = await startGuardianFight(floorSlug);
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

  const onResolved = (correct: boolean) => {
    if (correct) {
      hitsRef.current += 1;
      setHits(hitsRef.current);
      play("bossHit");
      if (guardianScope.current) {
        void animateGuardian(
          guardianScope.current,
          { x: [0, 14, -10, 6, 0], filter: ["brightness(1)", "brightness(3)", "brightness(1)"] },
          { duration: 0.45 },
        );
      }
    } else {
      play("wrong");
      setHurt((h) => h + 1);
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
    <div className="relative mx-auto max-w-2xl px-4 pb-20 pt-6">
      {/* éclair rouge quand le gardien riposte */}
      <AnimatePresence>
        {hurt > 0 && (
          <motion.div
            key={hurt}
            aria-hidden
            className="pointer-events-none fixed inset-0 z-50 shadow-[inset_0_0_140px_40px_rgba(228,87,46,0.75)]"
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.7 }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {(phase === "intro" || phase === "loading") && (
          <motion.section key="intro" exit={{ opacity: 0 }} className="text-center">
            <p className="text-ember">{t("floorGuardian", { floor: floorNumber })}</p>
            <motion.div
              initial={{ opacity: 0, scale: 0.6, filter: "blur(12px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              transition={{ duration: 1.4, ease: "easeOut" }}
            >
              <GuardianArt floor={floorNumber} className="mx-auto mt-4 h-72 w-64" />
            </motion.div>
            <h1 className="carved mt-2 text-5xl text-parchment">{guardian.name}</h1>
            <p className="text-parchment-dim">{guardian.title}</p>
            <motion.blockquote
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="mx-auto mt-5 max-w-md text-xl italic text-ember"
            >
              « {guardian.taunt} »
            </motion.blockquote>
            <p className="mx-auto mt-6 max-w-md text-parchment-dim">{t("rules")}</p>
            {error && <p className="mt-4 text-ember" role="alert">{t("error")}</p>}
            <RuneButton variant="ember" className="mt-8" onClick={engage} disabled={phase === "loading"} sfx="click">
              {phase === "loading" ? t("loading") : t("engage")}
            </RuneButton>
          </motion.section>
        )}

        {phase === "fight" && fight && (
          <motion.section key="fight" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="flex items-end gap-4">
              <div ref={guardianScope} className="shrink-0">
                <GuardianArt floor={floorNumber} className="h-28 w-24" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between">
                  <p className="font-display text-2xl text-parchment">{guardian.name}</p>
                  <p className={`font-mono text-lg tabular-nums ${lowTime ? "animate-pulse text-ember" : "text-torch"}`} aria-live="off">
                    ⧗ {minutes}:{seconds}
                  </p>
                </div>
                <div className="mt-1 flex gap-1" role="meter" aria-valuemin={0} aria-valuemax={total} aria-valuenow={total - hits} aria-label={t("hp")}>
                  {Array.from({ length: total }).map((_, i) => (
                    <motion.span
                      key={i}
                      className="h-4 flex-1 rounded-sm"
                      animate={{
                        backgroundColor: i < total - hits ? "#e4572e" : "#1f3138",
                        boxShadow: i < total - hits ? "0 0 10px rgba(228,87,46,0.7)" : "0 0 0 rgba(0,0,0,0)",
                      }}
                    />
                  ))}
                </div>
                <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-abyss-deep">
                  <motion.div
                    className="h-full bg-torch"
                    animate={{ width: `${(timeLeft / fight.durationSeconds) * 100}%` }}
                    transition={{ ease: "linear", duration: 1 }}
                  />
                </div>
                <p className="mt-1 text-sm text-parchment-dim">{t("question", { current: index + 1, total })}</p>
              </div>
            </div>

            <div className="stone mt-6 rounded-2xl border border-ember/40 p-5 shadow-[0_20px_60px_-20px_rgba(228,87,46,0.35)] sm:p-7">
              <EncounterView
                key={fight.questions[index].id}
                encounter={fight.questions[index]}
                check={(response) => answerGuardian({ notionSlug: floorSlug, questionId: fight.questions[index].id, response })}
                onResolved={(r) => onResolved(r.correct)}
                onContinue={onContinue}
                submitLabel={t("strike")}
              />
            </div>
          </motion.section>
        )}

        {phase === "won" && result && (
          <motion.section key="won" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
            <motion.div
              initial={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              animate={{ opacity: 0, scale: 1.4, filter: "blur(16px)" }}
              transition={{ duration: 1.8, ease: "easeIn" }}
            >
              <GuardianArt floor={floorNumber} className="mx-auto h-56 w-48" />
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2 }} className="-mt-40">
              <p className="carved torchlight text-6xl text-torch-bright">{t("wonTitle")}</p>
              <p className="mt-3 text-xl text-parchment">{t("wonBody", { name: guardian.name, score: result.score })}</p>
              <p className="mt-4 font-display text-5xl text-moss runeglow">+{result.xp} XP</p>
              {next ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 2 }}
                  className="mx-auto mt-8 max-w-md rounded-2xl border-2 border-moss/60 bg-moss/10 p-5"
                >
                  <StairsIcon className="mx-auto size-10 text-moss" />
                  <p className="mt-2 text-lg text-parchment">{t("stairsOpen", { floor: next.floor, room: next.room })}</p>
                  <RuneLink href={`/app/etage/${next.slug}`} variant="moss" className="mt-4" sfx="door">
                    {t("descend")}
                  </RuneLink>
                </motion.div>
              ) : (
                <RuneLink href="/app" className="mt-8" sfx="door">
                  {t("backToMap")}
                </RuneLink>
              )}
            </motion.div>
          </motion.section>
        )}

        {phase === "lost" && result && fight && (
          <motion.section key="lost" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
            <motion.div animate={{ y: [0, -10, 0], scale: [1, 1.06, 1] }} transition={{ duration: 1.2 }}>
              <GuardianArt floor={floorNumber} className="mx-auto h-56 w-48" />
            </motion.div>
            <p className="carved mt-2 text-5xl text-ember">{t("lostTitle")}</p>
            <p className="mx-auto mt-3 max-w-md text-lg text-parchment">
              {t("lostBody", { score: result.score, needed: fight.passingScore })}
            </p>
            <p className="mt-2 text-parchment-dim">{t("lostXp", { xp: result.xp })}</p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <RuneLink href={`/app/etage/${floorSlug}`} sfx="page">
                {t("trainAgain")}
              </RuneLink>
              <RuneButton variant="stone" onClick={engage}>
                {t("retry")}
              </RuneButton>
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
}
