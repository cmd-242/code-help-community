"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { useFormatter, useTranslations } from "next-intl";
import { ChestIcon, LockIcon, LogbookIcon, StarIcon } from "@/components/icons";
import { GameLink } from "@/components/ui/game-button";
import type { NotionSummary } from "@/features/catalog/queries";
import { useProgress } from "@/features/progression/progress-store";
import { useNotionStates } from "@/features/progression/use-notion-states";
import { useSound } from "@/features/sound/sound-provider";
import { CreatureArt } from "@/universes/archipel/creature-art";

type Props = {
  notions: NotionSummary[];
  index: number;
  stages: { id: string; title: string; description: string; xp: number; count: number }[];
  lessons: { id: string; title: string; minutes: number }[];
};

/**
 * Une notion a trois zones :
 * les épreuves (côté ouvert : le jeu), le cours (côté fermé) et le gardien (grand challenge).
 * Dans l'Archipel : les criques, le journal de bord et le gardien de l'île.
 */
export function NotionView({ notions, index, stages, lessons }: Props) {
  const t = useTranslations("notion");
  const format = useFormatter();
  const { play } = useSound();
  const { ready, states } = useNotionStates(notions);
  const stageStars = useProgress((s) => s.stageStars);
  const lessonsRead = useProgress((s) => s.lessonsRead);
  const notion = notions[index];
  const state = states[index];

  if (!ready) return <div className="mt-6 h-64 animate-pulse rounded-[2rem] bg-surface-sunk" />;

  if (state.status === "sealed" || state.status === "blocked" || state.status === "soon") {
    return (
      <div className="paper mx-auto mt-6 max-w-md rounded-[2rem] p-8 text-center">
        <LockIcon className="mx-auto size-12 text-muted" />
        <p className="mt-4 text-lg">
          {state.status === "soon"
            ? t("soon")
            : state.status === "sealed" && state.release
              ? t("sealed", { date: format.dateTime(state.release.gameOpensAt, { weekday: "long", day: "numeric", month: "long" }) })
              : t("blocked", { name: notions[index - 1]?.guardian.name ?? "" })}
        </p>
        <GameLink href="/app" variant="secondary" className="mt-6">
          {t("backToMap")}
        </GameLink>
      </div>
    );
  }

  return (
    <div className="mt-8 space-y-10">
      {/* Côté ouvert : les épreuves */}
      <section aria-labelledby="stages-title">
        <h2 id="stages-title" className="px-2 font-display text-3xl font-bold">
          {t("stagesTitle")}
        </h2>
        <p className="px-2 text-muted">{t("stagesHint")}</p>
        <ol className="mt-4 grid gap-3">
          {stages.map((s, i) => {
            const stars = stageStars[s.id] ?? 0;
            const unlocked = i === 0 || (stageStars[stages[i - 1].id] ?? 0) > 0;
            const next = unlocked && stars === 0;
            const inner = (
              <div
                className={`flex items-center gap-4 rounded-3xl p-4 transition ${
                  unlocked
                    ? `paper ${next ? "outline-4 outline-offset-0 outline-primary" : ""} group-hover:-translate-y-0.5`
                    : "bg-surface-sunk text-muted"
                }`}
              >
                <span
                  className={`grid size-14 shrink-0 place-items-center rounded-2xl font-display text-2xl font-bold ${
                    !unlocked ? "bg-line text-muted" : stars > 0 ? "bg-success text-ink" : "bg-primary text-white"
                  }`}
                >
                  {unlocked ? i + 1 : <LockIcon className="size-6" />}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-muted">{t("stageNumber", { n: i + 1, count: s.count })}</p>
                  <h3 className="font-display text-xl font-semibold leading-tight">{s.title}</h3>
                  <p className="text-[0.95rem] text-muted">{s.description}</p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1">
                  <span className="flex" aria-label={t("stars", { count: stars })}>
                    {[0, 1, 2].map((k) => (
                      <StarIcon key={k} className={`size-5 ${k < stars ? "text-accent-deep" : "text-line"}`} filled={k < stars} />
                    ))}
                  </span>
                  <span className="text-sm font-bold text-success-deep">+{s.xp} XP</span>
                </div>
              </div>
            );
            return (
              <motion.li key={s.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}>
                {unlocked ? (
                  <Link
                    href={`/app/notion/${notion.slug}/etape/${s.id}`}
                    className="group block rounded-3xl"
                    onPointerEnter={() => play("hover")}
                    onClick={() => play("click")}
                  >
                    {inner}
                  </Link>
                ) : (
                  <div aria-disabled title={t("stageLocked")}>
                    {inner}
                  </div>
                )}
              </motion.li>
            );
          })}
        </ol>
      </section>

      {/* Côté fermé : le cours */}
      <section id="cours" aria-labelledby="course-title" className="scroll-mt-24">
        <h2 id="course-title" className="px-2 font-display text-3xl font-bold">
          {t("courseTitle")}
        </h2>
        <p className="px-2 text-muted">{t("courseHint")}</p>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {lessons.map((l) => (
            <li key={l.id}>
              <Link
                href={`/app/notion/${notion.slug}/cours/${l.id}`}
                onPointerEnter={() => play("hover")}
                onClick={() => play("page")}
                className="flex h-full items-start gap-3 rounded-3xl bg-sand p-4 shadow-[0_6px_0_#e2c27f] transition hover:-translate-y-0.5"
              >
                <LogbookIcon className="mt-0.5 size-7 shrink-0 text-wood-deep" />
                <span>
                  <span className="block font-display text-xl font-semibold leading-tight">{l.title}</span>
                  <span className="text-sm font-bold text-wood-deep">
                    {lessonsRead[l.id] ? t("lessonRead") : t("lessonMinutes", { minutes: l.minutes })}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Le gardien */}
      {notion.hasGuardian && (
        <section aria-labelledby="guardian-title" className="paper relative overflow-hidden rounded-[2rem] p-6 sm:flex sm:items-center sm:gap-6">
          <CreatureArt
            position={notion.position}
            className={`mx-auto w-40 shrink-0 ${state.gate === "ready" || state.status === "cleared" ? "animate-bob" : "opacity-40 grayscale"}`}
          />
          <div className="mt-4 text-center sm:mt-0 sm:text-left">
            <p className="flex items-center justify-center gap-2 font-bold text-danger-text sm:justify-start">
              <ChestIcon className="size-5" />
              {t("guardianLabel")}
            </p>
            <h2 id="guardian-title" className="font-display text-3xl font-bold">
              {notion.guardian.name}
            </h2>
            <p className="text-muted">{notion.guardian.title}</p>
            <p className="mt-3">
              {state.status === "cleared"
                ? t("guardianDefeated")
                : state.gate === "explore-first"
                  ? t("guardianExploreFirst", { done: state.stagesDone, total: stages.length })
                  : state.gate === "not-yet"
                    ? t("guardianNotYet")
                    : state.gate === "closed"
                      ? t("guardianClosed")
                      : t("guardianReady")}
            </p>
            {(state.gate === "ready" || state.status === "cleared") && (
              <GameLink href={`/app/notion/${notion.slug}/gardien`} className="mt-5" sfx="enter">
                {state.status === "cleared" ? t("guardianRematch") : t("guardianFace")}
              </GameLink>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
