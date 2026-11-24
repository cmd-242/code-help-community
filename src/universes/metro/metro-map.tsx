"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { useFormatter, useTranslations } from "next-intl";
import { LockIcon, StarIcon } from "@/components/icons";
import type { NotionSummary } from "@/features/catalog/queries";
import { useNotionStates, type NotionState } from "@/features/progression/use-notion-states";
import { useSound } from "@/features/sound/sound-provider";
import { TrainArt } from "./train-art";

/**
 * Le plan du réseau : chaque notion est une station. La ligne principale descend le long du bord gauche ;
 * quand une notion est sur la voie de dérivation (lane 1), la ligne se sépare puis se rejoint plus bas,
 * exactement comme une branche Git. Le trait s'allume derrière toi à mesure que tu valides les stations.
 */

const ROW = 216;
const LANE_X = [34, 92] as const;
const LANE_COLOR = ["var(--color-line-main)", "var(--color-line-branch)"] as const;
const R = 11;
const cy = (i: number) => i * ROW + ROW / 2;

type Segment = { d: string; lane: 0 | 1; lit: boolean; bypass?: boolean };

function buildSegments(notions: NotionSummary[], cleared: boolean[]): Segment[] {
  const out: Segment[] = [];
  for (let i = 0; i < notions.length - 1; i++) {
    const a = notions[i].lane as 0 | 1;
    const b = notions[i + 1].lane as 0 | 1;
    const y0 = cy(i);
    const y1 = cy(i + 1);
    const lit = cleared[i];
    if (a === b) {
      out.push({ d: `M${LANE_X[a]} ${y0} V${y1}`, lane: a, lit });
    } else if (a === 0) {
      // embranchement : la ligne de dérivation quitte la principale
      out.push({ d: `M${LANE_X[0]} ${y0} V${y0 + 36} L${LANE_X[1]} ${y0 + 36 + (LANE_X[1] - LANE_X[0])} V${y1}`, lane: 1, lit });
      const join = notions.findIndex((n, k) => k > i + 1 && n.lane === 0);
      if (join > 0) out.push({ d: `M${LANE_X[0]} ${y0} V${cy(join)}`, lane: 0, lit: false, bypass: true });
    } else {
      // jonction : la dérivation rejoint la principale
      out.push({ d: `M${LANE_X[1]} ${y0} V${y1 - 36 - (LANE_X[1] - LANE_X[0])} L${LANE_X[0]} ${y1 - 36} V${y1}`, lane: 1, lit });
    }
  }
  return out;
}

export function MetroMap({ notions, name }: { notions: NotionSummary[]; name: string }) {
  const t = useTranslations("metroMap");
  const { ready, states } = useNotionStates(notions);
  const cleared = states.map((s) => s.status === "cleared");
  const segments = buildSegments(notions, cleared);

  return (
    <div className="relative" style={{ height: notions.length * ROW }} role="group" aria-label={t("planLabel", { name })}>
      <svg className="absolute inset-0" width="100%" height={notions.length * ROW} aria-hidden>
        {segments.map((s, i) => (
          <path
            key={i}
            d={s.d}
            fill="none"
            strokeWidth={9}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={s.bypass ? "2 14" : undefined}
            style={{
              stroke: LANE_COLOR[s.lane],
              opacity: s.lit ? 1 : s.bypass ? 0.55 : 0.28,
              filter: s.lit ? `drop-shadow(0 0 5px ${LANE_COLOR[s.lane]})` : undefined,
            }}
          />
        ))}
        {notions.map((n, i) => (
          <StationNode key={n.slug} lane={n.lane as 0 | 1} y={cy(i)} state={ready ? states[i] : null} />
        ))}
      </svg>

      <ol className="absolute inset-0">
        {notions.map((n, i) => (
          <StationCard key={n.slug} notion={n} state={states[i]} ready={ready} index={i} previous={i > 0 ? notions[i - 1] : null} />
        ))}
      </ol>
    </div>
  );
}

function StationNode({ lane, y, state }: { lane: 0 | 1; y: number; state: NotionState | null }) {
  const x = LANE_X[lane];
  const color = LANE_COLOR[lane];
  const status = state?.status;
  const done = status === "cleared";
  const current = status === "open" || status === "guardian";
  return (
    <g>
      {current && (
        <circle cx={x} cy={y} r={R + 4} fill="none" strokeWidth={3} className="animate-pulse-ring" style={{ stroke: color, transformBox: "fill-box", transformOrigin: "center" }} />
      )}
      <circle cx={x} cy={y} r={R + 5} style={{ fill: "var(--color-page)" }} />
      <circle cx={x} cy={y} r={R} strokeWidth={5} style={{ stroke: color, fill: done ? color : current ? "#fff" : "var(--color-page)", opacity: done || current ? 1 : 0.5 }} />
      {done && <path d={`M${x - 5} ${y} l3.6 3.8 l7-7.6`} fill="none" stroke="#fff" strokeWidth={2.8} strokeLinecap="round" strokeLinejoin="round" />}
    </g>
  );
}

function StationCard({ notion, state, ready, index, previous }: { notion: NotionSummary; state: NotionState; ready: boolean; index: number; previous: NotionSummary | null }) {
  const t = useTranslations("metroMap");
  const format = useFormatter();
  const { play } = useSound();
  const lane = notion.lane as 0 | 1;
  const reachable = state.status === "open" || state.status === "guardian" || state.status === "cleared";
  const current = state.status === "open" || state.status === "guardian";
  const left = LANE_X[lane] + 36;
  // Ce qu'il faut vaincre pour ouvrir la station : le gardien précédent et/ou les prérequis des autres lignes
  const needs = [
    ...(state.previousMissing && previous ? [t("previousGuardian", { name: previous.guardian.name })] : []),
    ...state.missing.map((m) => t("guardianOf", { place: m.place })),
  ];
  const missingLink = state.missing[0] ?? (state.previousMissing && previous ? { slug: previous.slug, place: previous.place } : null);

  const body = (
    <div
      className={`relative flex h-full flex-col justify-center rounded-xl border-2 bg-surface py-2 pl-3 pr-3 ${current ? "border-accent" : "border-line"} ${reachable ? "transition-transform duration-150 group-hover:-translate-y-0.5" : ""}`}
      style={{ borderLeftWidth: 8, borderLeftColor: LANE_COLOR[lane] }}
    >
      <p className="flex items-center gap-2 text-sm font-bold text-info-deep">
        <span className="grid size-6 place-items-center rounded-full font-display text-sm font-bold text-white" style={{ background: LANE_COLOR[lane] }}>
          {notion.position}
        </span>
        {t("stop", { position: notion.position })}
      </p>
      <h3 className={`mt-0.5 font-display text-xl font-bold leading-tight ${reachable ? "text-ink" : "text-muted"}`}>{notion.place}</h3>
      <p className="line-clamp-2 text-sm leading-snug text-muted">{notion.concept}</p>
      {ready && (
        <p className="mt-1 flex items-center gap-1.5 text-sm font-bold">
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
              <LockIcon className="size-4 shrink-0" />
              {state.status === "sealed" && state.release
                ? t("opensOn", { date: format.dateTime(state.release.gameOpensAt, { weekday: "long", day: "numeric", month: "long" }) })
                : state.status === "sealed"
                  ? t("notScheduled")
                  : state.status === "soon"
                    ? t("soon")
                    : t("mustDefeat", { names: needs.join(" · ") })}
            </span>
          )}
        </p>
      )}
      {notion.interchange && <p className="mt-0.5 line-clamp-1 text-sm text-info-deep">{t("interchange", { text: notion.interchange })}</p>}
      {ready && state.status === "blocked" && missingLink && (
        <Link href={`/app/notion/${missingLink.slug}`} className="mt-1 text-sm font-bold text-primary underline focus-visible:outline-2 focus-visible:outline-offset-2" onClick={() => play("enter")}>
          {t("goTo", { place: missingLink.place })}
        </Link>
      )}
      {current && <TrainArt bobbing={false} className="absolute -top-5 right-3 w-14" title={t("youAreHere")} />}
    </div>
  );

  return (
    <motion.li
      initial={{ opacity: 0, x: 14 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.1 + index * 0.08, duration: 0.4 }}
      className="absolute right-0"
      style={{ top: index * ROW + 14, height: ROW - 28, left }}
    >
      {reachable ? (
        <Link href={`/app/notion/${notion.slug}`} className="group block h-full rounded-xl" onPointerEnter={() => play("hover")} onClick={() => play("enter")}>
          {body}
        </Link>
      ) : (
        <div aria-disabled className="h-full">
          {body}
        </div>
      )}
    </motion.li>
  );
}
