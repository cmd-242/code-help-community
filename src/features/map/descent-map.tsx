"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { useFormatter, useTranslations } from "next-intl";
import { ChainIcon, LockIcon, SkullIcon, StarIcon, TorchIcon } from "@/components/icons";
import type { FloorSummary } from "@/features/catalog/queries";
import { useFloorStates, type FloorState } from "@/features/progression/use-floor-states";
import { useSound } from "@/features/sound/sound-provider";

/**
 * La carte : une descente verticale. Chaque étage est une salle en arche,
 * reliée à la suivante par un escalier. Plus on descend, plus la pierre s'assombrit.
 */
export function DescentMap({ floors }: { floors: FloorSummary[] }) {
  const { ready, states } = useFloorStates(floors);

  return (
    <ol className="relative mx-auto max-w-xl">
      {/* l'escalier qui relie les salles */}
      <span aria-hidden className="absolute bottom-16 left-1/2 top-16 w-1 -translate-x-1/2 bg-[repeating-linear-gradient(180deg,#3d5e69_0_10px,transparent_10px_18px)]" />
      {floors.map((f, i) => (
        <FloorRoom key={f.slug} floor={f} state={states[i]} depth={i} ready={ready} side={i % 2 === 0 ? "left" : "right"} />
      ))}
    </ol>
  );
}

function FloorRoom({ floor, state, depth, ready, side }: { floor: FloorSummary; state: FloorState; depth: number; ready: boolean; side: "left" | "right" }) {
  const t = useTranslations("map");
  const format = useFormatter();
  const { play } = useSound();
  const reachable = state.status === "open" || state.status === "guardian" || state.status === "cleared";
  const current = state.status === "open" || state.status === "guardian";
  const darkness = Math.min(0.55, depth * 0.09);

  const body = (
    <div
      className={`arch stone relative overflow-hidden border-2 px-5 pb-5 pt-10 text-center transition duration-200 ${
        current
          ? "border-torch shadow-[0_0_0_4px_rgba(242,165,65,0.15),0_0_50px_-10px_rgba(242,165,65,0.7)]"
          : state.status === "cleared"
            ? "border-moss/70 shadow-[0_0_40px_-16px_rgba(127,224,194,0.7)]"
            : "border-stone-edge/50"
      } ${reachable ? "group-hover:-translate-y-1" : ""}`}
    >
      <span aria-hidden className="pointer-events-none absolute inset-0" style={{ background: `rgba(5,11,13,${darkness})` }} />
      {current && (
        <span aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-40 animate-flicker bg-[radial-gradient(ellipse_at_50%_0%,rgba(242,165,65,0.35),transparent_70%)]" />
      )}

      <div className="relative">
        <p className={`font-display text-lg ${current ? "text-torch" : "text-parchment-dim"}`}>{t("depth", { floor: floor.floor })}</p>
        <h3 className={`carved mt-1 text-3xl leading-tight ${state.status === "sealed" || state.status === "blocked" || state.status === "soon" ? "text-parchment-dim" : "text-parchment"}`}>
          {floor.room}
        </h3>
        <p className="mt-1 text-parchment-dim">{floor.concept}</p>

        <div className="mt-4 flex min-h-8 items-center justify-center gap-3">
          {!ready ? null : state.status === "sealed" ? (
            <span className="flex items-center gap-2 text-parchment-dim">
              <ChainIcon className="size-5" />
              {t("opensOn", { date: state.release ? format.dateTime(state.release.gameOpensAt, { weekday: "long", day: "numeric", month: "long" }) : "" })}
            </span>
          ) : state.status === "soon" ? (
            <span className="flex items-center gap-2 text-parchment-dim">
              <ChainIcon className="size-5" />
              {t("soon")}
            </span>
          ) : state.status === "blocked" ? (
            <span className="flex items-center gap-2 text-parchment-dim">
              <LockIcon className="size-5" />
              {t("blocked")}
            </span>
          ) : state.status === "cleared" ? (
            <span className="flex items-center gap-2 font-display text-xl text-moss runeglow">{t("cleared")}</span>
          ) : (
            <>
              {floor.stageIds.length > 0 && (
                <span className="flex items-center gap-1 text-torch" aria-label={t("stars", { count: state.stars, max: state.maxStars })}>
                  <StarIcon className="size-5" />
                  <span className="tabular-nums">
                    {state.stars}/{state.maxStars}
                  </span>
                </span>
              )}
              <span className={`flex items-center gap-1.5 ${state.status === "guardian" ? "animate-pulse text-ember" : "text-parchment-dim"}`}>
                <SkullIcon className="size-5" />
                {state.status === "guardian" ? t("guardianAwaits") : t("explore", { done: state.stagesDone, total: floor.stageIds.length })}
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <motion.li
      initial={{ opacity: 0, y: -24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.15 + depth * 0.12 }}
      className={`relative mb-12 w-[88%] sm:w-[78%] ${side === "left" ? "mr-auto" : "ml-auto"}`}
    >
      {current && (
        <span className="absolute -top-5 left-1/2 z-10 -translate-x-1/2 rounded-full bg-torch px-3 py-0.5 font-display text-lg text-ink shadow-[0_0_20px_rgba(242,165,65,0.8)]">
          <TorchIcon className="-mt-1 mr-1 inline size-4" />
          {t("youAreHere")}
        </span>
      )}
      {reachable ? (
        <Link href={`/app/etage/${floor.slug}`} className="group block" onPointerEnter={() => play("hover")} onClick={() => play("door")}>
          {body}
        </Link>
      ) : (
        <div aria-disabled className="opacity-80 grayscale-[0.4]">
          {body}
        </div>
      )}
    </motion.li>
  );
}
