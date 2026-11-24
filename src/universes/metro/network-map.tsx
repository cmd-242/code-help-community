"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useTranslations } from "next-intl";
import type { NotionSummary } from "@/features/catalog/queries";
import { useProgress } from "@/features/progression/progress-store";
import { useHydratedProgress } from "@/features/progression/use-hydrated-progress";
import { computeNotionStates, type NotionState } from "@/features/progression/use-notion-states";
import { lineStyle } from "./lines";

export type NetworkLine = { slug: string; title: string; notions: NotionSummary[] };

const GAP = 84;
const PAD = 34;

type Shape = "cleared" | "current" | "locked" | "soon";
const shapeOf = (s: NotionState | undefined): Shape =>
  !s ? "locked" : s.status === "cleared" ? "cleared" : s.status === "open" || s.status === "guardian" ? "current" : s.status === "soon" ? "soon" : "locked";

/**
 * « Mon réseau » : une rangée par ligne, avec une pastille à lettre, ses stations et sa progression.
 * La ligne du moment est en couleur ; les autres sont en transparence. La forme dit l'état
 * (la couleur seule ne suffirait pas) : disque plein = validée, anneau = en cours,
 * cercle vide + cadenas = verrouillée, pointillés = à venir.
 */
export function NetworkMap({ lines }: { lines: NetworkLine[] }) {
  const t = useTranslations("metroNetwork");
  const ready = useHydratedProgress();
  const stageStars = useProgress((s) => s.stageStars);
  const cleared = useProgress((s) => s.cleared);
  const classroom = useProgress((s) => s.classroom);

  const all = useMemo(
    () => lines.map((l) => ({ ...l, states: computeNotionStates(l.notions, { ready, stageStars, cleared, classroom }) })),
    [lines, ready, stageStars, cleared, classroom],
  );

  // Ligne du moment : celle qui a une station en cours, sinon celle où l'on a le plus avancé, sinon la première.
  const doneOf = (l: (typeof all)[number]) => l.states.filter((s) => s.status === "cleared").length;
  const activeIndex = (() => {
    const withCurrent = all.findIndex((l) => l.states.some((s) => s.status === "open" || s.status === "guardian"));
    if (withCurrent >= 0) return withCurrent;
    const best = all.reduce((b, l, i) => (doneOf(l) > doneOf(all[b]) ? i : b), 0);
    return best;
  })();

  const active = all[activeIndex];
  const nextIndex = active ? active.states.findIndex((s) => s.status === "open" || s.status === "guardian") : -1;
  const next = active && nextIndex >= 0 ? active.notions[nextIndex] : null;
  const ordered = all.map((l, i) => ({ l, i })).sort((a, b) => Number(b.i === activeIndex) - Number(a.i === activeIndex) || a.i - b.i);

  return (
    <div>
      {ready && active && (
        <section aria-labelledby="next-stop" className="rounded-[1.5rem] border-2 border-accent bg-surface p-4">
          <h2 id="next-stop" className="font-display text-xl font-bold text-info-deep">
            {t("nextStop")}
          </h2>
          {next ? (
            <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <Roundel letter={lineStyle(active.slug, activeIndex).letter} color={lineStyle(active.slug, activeIndex).color} size={40} />
                <div>
                  <p className="font-display text-2xl font-bold leading-tight text-ink">{next.place}</p>
                  <p className="text-sm text-muted">{next.concept}</p>
                </div>
              </div>
              <Link href={`/app/notion/${next.slug}`} className="rounded-full bg-primary px-5 py-2.5 font-bold text-white focus-visible:outline-2 focus-visible:outline-offset-4">
                {t("board")}
              </Link>
            </div>
          ) : (
            <p className="mt-2 text-muted">{t("nothingNext")}</p>
          )}
        </section>
      )}

      <ul className="mt-5 flex flex-col gap-4" aria-label={t("listLabel")}>
        {ordered.map(({ l, i }) => (
          <LineRow key={l.slug} line={l} states={l.states} index={i} active={i === activeIndex} ready={ready} />
        ))}
      </ul>

      <Legend />
    </div>
  );
}

function Roundel({ letter, color, size = 44 }: { letter: string; color: string; size?: number }) {
  return (
    <span
      aria-hidden
      className="grid shrink-0 place-items-center rounded-full font-display font-bold text-white"
      style={{ background: color, width: size, height: size, fontSize: size * 0.5 }}
    >
      {letter}
    </span>
  );
}

function LineRow({ line, states, index, active, ready }: { line: NetworkLine; states: NotionState[]; index: number; active: boolean; ready: boolean }) {
  const t = useTranslations("metroNetwork");
  const { letter, color } = lineStyle(line.slug, index);
  const n = line.notions.length;
  const done = states.filter((s) => s.status === "cleared").length;
  const width = PAD * 2 + (n - 1) * GAP;
  const termini = line.notions[0]?.requires ?? [];
  const interchanges = line.notions.filter((s) => s.interchange);
  const clearedThrough = states.reduce((last, s, i) => (s.status === "cleared" ? i : last), -1);

  return (
    <li className={`rounded-[1.5rem] border-2 bg-surface p-4 transition-opacity ${active ? "border-accent" : "border-line opacity-60 hover:opacity-100 focus-within:opacity-100"}`}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Roundel letter={letter} color={color} />
          <h3 className="font-display text-xl font-bold leading-tight text-ink">
            {line.title}
          </h3>
        </div>
        {ready && <span className="rounded-full bg-surface-sunk px-3 py-1 text-sm font-bold text-ink">{t("progress", { done, total: n })}</span>}
      </div>

      <div className="mt-3 overflow-x-auto pb-1" tabIndex={0} role="group" aria-label={t("lineLabel", { letter, title: line.title })}>
        <svg width={width} height={96} className="block">
          <path d={`M${PAD} 34 H${PAD + (n - 1) * GAP}`} stroke={color} strokeWidth={9} strokeLinecap="round" opacity={0.28} fill="none" />
          {clearedThrough >= 0 && <path d={`M${PAD} 34 H${PAD + clearedThrough * GAP}`} stroke={color} strokeWidth={9} strokeLinecap="round" fill="none" />}
          {line.notions.map((s, k) => (
            <Station key={s.slug} x={PAD + k * GAP} color={color} shape={ready ? shapeOf(states[k]) : "locked"} notion={s} />
          ))}
        </svg>
      </div>

      {interchanges.length > 0 && (
        <div className="mt-2">
          <h4 className="text-sm font-bold text-info-deep">{t("interchanges")}</h4>
          <ul className="mt-1 text-sm text-muted">
            {interchanges.map((s) => (
              <li key={s.slug}>{t("interchangeItem", { place: s.place, text: s.interchange ?? "" })}</li>
            ))}
          </ul>
        </div>
      )}

      {termini.length > 0 && (
        <div className="mt-2 rounded-xl bg-surface-sunk p-3">
          <h4 className="text-sm font-bold text-ink">{t("termini")}</h4>
          <ul className="mt-1 flex flex-wrap gap-2">
            {termini.map((r) => (
              <li key={r.slug} className="rounded-full border-2 border-line px-3 py-0.5 text-sm font-semibold text-muted">
                {r.place}
              </li>
            ))}
          </ul>
          <p className="mt-1 text-sm text-muted">{t("terminusHint")}</p>
        </div>
      )}

      <div className="mt-3">
        <Link href={`/app/parcours/${line.slug}`} className="inline-block rounded-full border-2 border-line px-4 py-1.5 text-sm font-bold text-ink focus-visible:outline-2 focus-visible:outline-offset-4">
          {t("openLine")}
          <span className="sr-only"> : {line.title}</span>
        </Link>
      </div>
    </li>
  );
}

function Station({ x, color, shape, notion }: { x: number; color: string; shape: Shape; notion: NotionSummary }) {
  const t = useTranslations("metroNetwork");
  const label = t(
    shape === "cleared" ? "stationCleared" : shape === "current" ? "stationCurrent" : shape === "soon" ? "stationSoon" : "stationLocked",
    { place: notion.place },
  );
  const y = 34;
  const hasInterchange = Boolean(notion.interchange);
  return (
    <g role="img" aria-label={label}>
      <title>{label}</title>
      {hasInterchange && <circle cx={x} cy={y} r={19} fill="none" stroke="var(--color-ink)" strokeWidth={2} />}
      <circle cx={x} cy={y} r={14} style={{ fill: "var(--color-surface)" }} />
      {shape === "cleared" && (
        <>
          <circle cx={x} cy={y} r={12} fill={color} />
          <path d={`M${x - 5.5} ${y} l4 4.2 l7.5-8`} fill="none" stroke="#fff" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
        </>
      )}
      {shape === "current" && (
        <>
          <circle cx={x} cy={y} r={12} fill="#fff" stroke={color} strokeWidth={6} />
          <circle cx={x} cy={y} r={4} fill={color} />
        </>
      )}
      {shape === "locked" && <circle cx={x} cy={y} r={11} fill="none" stroke={color} strokeWidth={4} opacity={0.6} />}
      {shape === "soon" && <circle cx={x} cy={y} r={11} fill="none" stroke={color} strokeWidth={4} strokeDasharray="3 4" opacity={0.7} />}
      <text x={x} y={74} textAnchor="middle" fontSize={11} fontWeight={700} style={{ fill: "var(--color-ink)" }}>
        {notion.place.length > 14 ? `${notion.place.slice(0, 13)}…` : notion.place}
      </text>
    </g>
  );
}

function Legend() {
  const t = useTranslations("metroNetwork");
  const items: { shape: Shape; label: string }[] = [
    { shape: "cleared", label: t("legendCleared") },
    { shape: "current", label: t("legendCurrent") },
    { shape: "locked", label: t("legendLocked") },
    { shape: "soon", label: t("legendSoon") },
  ];
  return (
    <section className="mt-5 rounded-[1.5rem] bg-surface-sunk p-4" aria-labelledby="legend-title">
      <h2 id="legend-title" className="font-display text-lg font-bold text-ink">
        {t("legendTitle")}
      </h2>
      <ul className="mt-2 flex flex-wrap gap-x-5 gap-y-2">
        {items.map((it) => (
          <li key={it.shape} className="flex items-center gap-2 text-sm font-semibold text-ink">
            <svg width={30} height={30} aria-hidden>
              <g transform="translate(-4 -19)">
                <Station x={19} color="#2f6bff" shape={it.shape} notion={{ place: "", interchange: null } as NotionSummary} />
              </g>
            </svg>
            {it.label}
          </li>
        ))}
      </ul>
      <p className="mt-2 text-sm text-muted">{t("scrollHint")}</p>
    </section>
  );
}
