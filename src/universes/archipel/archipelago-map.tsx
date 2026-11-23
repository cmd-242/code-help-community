"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { useFormatter, useTranslations } from "next-intl";
import { LockIcon, StarIcon } from "@/components/icons";
import type { NotionSummary } from "@/features/catalog/queries";
import { useNotionStates, type NotionState } from "@/features/progression/use-notion-states";
import { useSound } from "@/features/sound/sound-provider";
import { BoatArt } from "./boat-art";
import { IslandArt } from "./island-art";
import { SeaWaves } from "./sea-waves";

/**
 * La carte marine : les notions sont des îles reliées par une route en pointillés.
 * Le bateau est amarré à l'île en cours ; les îles inaccessibles sont dans la brume.
 */
export function ArchipelagoMap({ notions }: { notions: NotionSummary[] }) {
  const { ready, states } = useNotionStates(notions);

  return (
    <div className="sea relative overflow-hidden rounded-[2rem] px-3 pb-10 pt-8 shadow-[inset_0_0_0_4px_rgba(255,255,255,0.35)]">
      <SeaWaves />
      <ol className="relative">
        {notions.map((n, i) => (
          <IslandStop key={n.slug} notion={n} state={states[i]} index={i} ready={ready} last={i === notions.length - 1} />
        ))}
      </ol>
    </div>
  );
}

function IslandStop({ notion, state, index, ready, last }: { notion: NotionSummary; state: NotionState; index: number; ready: boolean; last: boolean }) {
  const t = useTranslations("map");
  const format = useFormatter();
  const { play } = useSound();
  const left = index % 2 === 0;
  const reachable = state.status === "open" || state.status === "guardian" || state.status === "cleared";
  const current = state.status === "open" || state.status === "guardian";
  const art = state.status === "cleared" ? "cleared" : current ? "current" : reachable ? "open" : "locked";

  const label = (
    <div className={`paper relative w-full max-w-[15rem] rounded-2xl px-4 py-3 ${current ? "outline-4 outline-offset-0 outline-primary" : ""}`}>
      <p className="text-sm font-bold text-info-deep">{t("stop", { position: notion.position })}</p>
      <h3 className={`font-display text-xl font-semibold leading-tight ${art === "locked" ? "text-muted" : "text-ink"}`}>{notion.place}</h3>
      <p className="text-sm text-muted">{notion.concept}</p>
      {ready && (
        <p className="mt-1.5 flex items-center gap-1.5 text-sm font-bold">
          {state.status === "cleared" ? (
            <span className="text-success-deep">{t("cleared")}</span>
          ) : state.status === "guardian" ? (
            <span className="text-danger-text">{t("guardianAwaits", { name: notion.guardian.name })}</span>
          ) : state.status === "open" ? (
            <span className="flex items-center gap-1 text-ink">
              <StarIcon className="size-4 text-accent-deep" />
              {t("stars", { count: state.stars, max: state.maxStars })}
            </span>
          ) : (
            <span className="flex items-center gap-1 text-muted">
              <LockIcon className="size-4" />
              {state.status === "sealed" && state.release
                ? t("opensOn", { date: format.dateTime(state.release.gameOpensAt, { weekday: "long", day: "numeric", month: "long" }) })
                : state.status === "sealed"
                  ? t("notScheduled")
                  : state.status === "soon"
                    ? t("soon")
                    : t("blocked")}
            </span>
          )}
        </p>
      )}
    </div>
  );

  const content = (
    <div className={`flex items-center gap-2 ${left ? "flex-row" : "flex-row-reverse"}`}>
      <div className="relative w-[46%] shrink-0">
        <IslandArt seed={index} state={art} className={`w-full drop-shadow-[0_8px_0_rgba(19,50,75,0.15)] ${reachable ? "transition-transform duration-200 group-hover:-translate-y-1" : ""}`} />
        {current && (
          <BoatArt className={`absolute -bottom-2 w-16 ${left ? "-right-4" : "-left-4"}`} title={t("youAreHere")} />
        )}
      </div>
      {label}
    </div>
  );

  return (
    <motion.li
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 + index * 0.1, duration: 0.45 }}
      className="relative"
    >
      {reachable ? (
        <Link
          href={`/app/notion/${notion.slug}`}
          className="group block rounded-3xl"
          onPointerEnter={() => play("hover")}
          onClick={() => play("enter")}
        >
          {content}
        </Link>
      ) : (
        <div aria-disabled>{content}</div>
      )}
      {!last && (
        <svg viewBox="0 0 200 60" preserveAspectRatio="none" className="my-1 h-14 w-full" aria-hidden>
          <path
            d={left ? "M50 0 C 60 40, 140 20, 150 60" : "M150 0 C 140 40, 60 20, 50 60"}
            fill="none"
            stroke="#fff8ec"
            strokeWidth="3.5"
            strokeDasharray="2 10"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      )}
    </motion.li>
  );
}
