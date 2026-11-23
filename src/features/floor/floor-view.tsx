"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { useFormatter, useTranslations } from "next-intl";
import { DoorIcon, LockIcon, ScrollIcon, SkullIcon, StarIcon } from "@/components/icons";
import { RuneLink } from "@/components/ui/rune-button";
import type { FloorSummary } from "@/features/catalog/queries";
import { GuardianArt } from "@/features/guardian/guardian-art";
import { useProgress } from "@/features/progression/progress-store";
import { useFloorStates } from "@/features/progression/use-floor-states";
import { useSound } from "@/features/sound/sound-provider";

type Props = {
  floors: FloorSummary[];
  floorIndex: number;
  stages: { id: string; title: string; description: string; xp: number; count: number }[];
  lessons: { id: string; title: string; minutes: number }[];
};

/**
 * Un étage a trois zones :
 * le donjon (côté ouvert : les étapes du jeu), le grimoire (côté fermé : le cours)
 * et la salle du gardien (le grand challenge).
 */
export function FloorView({ floors, floorIndex, stages, lessons }: Props) {
  const t = useTranslations("floor");
  const format = useFormatter();
  const { play } = useSound();
  const { ready, states } = useFloorStates(floors);
  const stageStars = useProgress((s) => s.stageStars);
  const lessonsRead = useProgress((s) => s.lessonsRead);
  const floor = floors[floorIndex];
  const state = states[floorIndex];

  if (!ready) return <div className="mt-10 h-64 animate-pulse rounded-2xl bg-stone/40" />;

  if (state.status === "sealed" || state.status === "blocked") {
    return (
      <div className="stone mx-auto mt-10 max-w-md rounded-2xl border border-stone-edge/60 p-8 text-center">
        <LockIcon className="mx-auto size-12 text-parchment-dim" />
        <p className="mt-4 text-lg text-parchment">
          {state.status === "sealed"
            ? t("sealed", { date: format.dateTime(state.release.gameOpensAt, { weekday: "long", day: "numeric", month: "long" }) })
            : t("blocked", { name: floors[floorIndex - 1]?.guardian.name ?? "" })}
        </p>
        <RuneLink href="/app" variant="stone" className="mt-6">
          {t("backToMap")}
        </RuneLink>
      </div>
    );
  }

  return (
    <div className="mt-12 space-y-14">
      {/* Côté ouvert : les salles du donjon */}
      <section aria-labelledby="dungeon-title">
        <h2 id="dungeon-title" className="carved text-3xl text-parchment">
          {t("dungeonTitle")}
        </h2>
        <p className="text-parchment-dim">{t("dungeonHint")}</p>
        <ol className="mt-6 grid gap-4">
          {stages.map((s, i) => {
            const stars = stageStars[s.id] ?? 0;
            const unlocked = i === 0 || (stageStars[stages[i - 1].id] ?? 0) > 0;
            const inner = (
              <div
                className={`stone flex items-center gap-4 rounded-2xl border-2 p-4 transition ${
                  unlocked
                    ? stars > 0
                      ? "border-moss/50 group-hover:border-moss"
                      : "border-torch/70 shadow-[0_0_30px_-12px_rgba(242,165,65,0.8)] group-hover:-translate-y-0.5"
                    : "border-stone-edge/40 opacity-60"
                }`}
              >
                <span
                  className={`grid size-14 shrink-0 place-items-center rounded-xl ${
                    unlocked ? (stars > 0 ? "bg-moss/15 text-moss" : "bg-torch/15 text-torch") : "bg-abyss text-parchment-dim"
                  }`}
                >
                  {unlocked ? <DoorIcon className="size-8" /> : <LockIcon className="size-7" />}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-parchment-dim">{t("stageNumber", { n: i + 1, count: s.count })}</p>
                  <h3 className="font-display text-2xl leading-tight text-parchment">{s.title}</h3>
                  <p className="text-parchment-dim">{s.description}</p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1">
                  <span className="flex" aria-label={t("stars", { count: stars })}>
                    {[0, 1, 2].map((k) => (
                      <StarIcon key={k} className={`size-5 ${k < stars ? "text-torch" : "text-stone-edge"}`} filled={k < stars} />
                    ))}
                  </span>
                  <span className="text-sm text-moss">+{s.xp} XP</span>
                </div>
              </div>
            );
            return (
              <motion.li key={s.id} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}>
                {unlocked ? (
                  <Link
                    href={`/app/etage/${floor.slug}/etape/${s.id}`}
                    className="group block rounded-2xl"
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

      {/* Côté fermé : le grimoire */}
      <section id="grimoire" aria-labelledby="grimoire-title" className="scroll-mt-24">
        <h2 id="grimoire-title" className="carved text-3xl text-parchment">
          {t("grimoireTitle")}
        </h2>
        <p className="text-parchment-dim">{t("grimoireHint")}</p>
        <ul className="mt-6 grid gap-3 sm:grid-cols-2">
          {lessons.map((l) => (
            <li key={l.id}>
              <Link
                href={`/app/etage/${floor.slug}/grimoire/${l.id}`}
                onPointerEnter={() => play("hover")}
                onClick={() => play("page")}
                className="flex h-full items-start gap-3 rounded-xl bg-[linear-gradient(160deg,#efe3c8,#d9c8a3)] p-4 text-ink shadow-[0_8px_24px_-10px_rgba(0,0,0,0.8)] transition hover:-translate-y-0.5 hover:rotate-[-0.4deg]"
              >
                <ScrollIcon className="mt-0.5 size-6 shrink-0 text-[#7a4a14]" />
                <span>
                  <span className="block font-display text-xl leading-tight">{l.title}</span>
                  <span className="text-sm text-ink/70">
                    {lessonsRead[l.id] ? t("lessonRead") : t("lessonMinutes", { minutes: l.minutes })}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* La salle du gardien */}
      {floor.hasGuardian && (
        <section aria-labelledby="guardian-title" className="stone relative overflow-hidden rounded-2xl border-2 border-ember/40 p-6 sm:flex sm:items-center sm:gap-6">
          <GuardianArt floor={floor.floor} className={`mx-auto h-44 w-40 shrink-0 ${state.gate === "ready" || state.status === "cleared" ? "" : "opacity-40 grayscale"}`} />
          <div className="mt-4 text-center sm:mt-0 sm:text-left">
            <p className="flex items-center justify-center gap-2 text-ember sm:justify-start">
              <SkullIcon className="size-5" />
              {t("guardianLabel")}
            </p>
            <h2 id="guardian-title" className="carved text-4xl text-parchment">
              {floor.guardian.name}
            </h2>
            <p className="text-parchment-dim">{floor.guardian.title}</p>
            <p className="mt-3 text-parchment">
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
              <RuneLink href={`/app/etage/${floor.slug}/gardien`} variant="ember" className="mt-5" sfx="door">
                {state.status === "cleared" ? t("guardianRematch") : t("guardianFace")}
              </RuneLink>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
