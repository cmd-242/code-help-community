"use client";

import { useRouter } from "next/navigation";
import { useFormatter, useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { GameButton } from "@/components/ui/game-button";
import type { StudentRow } from "@/server/services/classroom";
import { addClassroomTrackAction, saveScheduleAction } from "./actions";
import { isValidRelease, weeklySchedule, type RiskAlert } from "./rules";
import { useMounted } from "./use-mounted";

type NotionInfo = { slug: string; place: string; position: number; concept: string };
type ReleaseIso = { gameOpensAt: string; challengeOpensAt: string; challengeClosesAt: string };

type TrackInfo = { slug: string; title: string; notions: NotionInfo[] };

type Props = {
  classroomId: string;
  students: StudentRow[];
  tracks: TrackInfo[];
  /** Parcours du catalogue que la classe ne suit pas encore */
  available: { slug: string; title: string }[];
  releases: Record<string, ReleaseIso>;
};

export function ClassroomTabs({ classroomId, students, tracks, available, releases }: Props) {
  const t = useTranslations("teacher");
  const [tab, setTab] = useState<"students" | "planning">("students");
  const watched = students.filter((s) => s.alerts.length > 0).length;
  const notions = tracks.flatMap((track) => track.notions);

  return (
    <div>
      <div role="tablist" aria-label={t("tabsLabel")} className="inline-flex rounded-full bg-surface-sunk p-1">
        {(["students", "planning"] as const).map((k) => (
          <button
            key={k}
            type="button"
            role="tab"
            aria-selected={tab === k}
            aria-controls={`panel-${k}`}
            id={`tab-${k}`}
            onClick={() => setTab(k)}
            className={`min-h-11 rounded-full px-5 font-bold transition ${tab === k ? "bg-ink text-white" : "text-ink"}`}
          >
            {k === "students" ? t("tabStudents", { count: students.length }) : t("tabPlanning")}
          </button>
        ))}
      </div>

      <div role="tabpanel" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`} className="mt-5">
        {tab === "students" ? (
          <StudentsPanel students={students} notions={notions} watched={watched} />
        ) : (
          <div className="space-y-5">
            <TracksBar classroomId={classroomId} tracks={tracks} available={available} />
            <PlanningTracks classroomId={classroomId} tracks={tracks} releases={releases} />
          </div>
        )}
      </div>
    </div>
  );
}

const ALERT_STYLE: Record<RiskAlert, string> = {
  inactive: "bg-primary/15 text-danger-text",
  behind: "bg-accent/40 text-ink",
  struggling: "bg-rarity-epic/15 text-rarity-epic",
};

function StudentsPanel({ students, notions, watched }: { students: StudentRow[]; notions: NotionInfo[]; watched: number }) {
  const t = useTranslations("teacher");
  const format = useFormatter();
  const mounted = useMounted();

  if (students.length === 0) {
    return (
      <div className="paper rounded-[2rem] p-8 text-center">
        <p className="font-display text-2xl font-bold">{t("noStudentsTitle")}</p>
        <p className="mx-auto mt-2 max-w-md text-muted">{t("noStudentsBody")}</p>
      </div>
    );
  }

  const lastActive = (day: string | null) => {
    if (!day) return t("never");
    if (!mounted) return day;
    return format.relativeTime(new Date(`${day}T12:00:00`), { now: new Date(), unit: "day" });
  };
  const scheduledNotions = notions;

  return (
    <div className="space-y-4">
      <p className="font-bold">
        {watched > 0 ? t("watchSummary", { count: watched }) : t("allGood")}
      </p>
      <ul className="grid gap-3">
        {students.map((s) => (
          <li key={s.id} className={`paper rounded-3xl p-4 ${s.alerts.length ? "outline-3 outline-primary/50" : ""}`}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-display text-xl font-bold">{s.name}</p>
                <p className="text-sm text-muted">{t("lastActive", { when: lastActive(s.lastActiveDay) })}</p>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {s.alerts.map((a) => (
                  <span key={a} className={`rounded-full px-3 py-1 text-sm font-bold ${ALERT_STYLE[a]}`}>
                    {t(`alert.${a}`)}
                  </span>
                ))}
              </div>
            </div>
            <dl className="mt-3 grid grid-cols-3 gap-2 text-center">
              <div className="rounded-2xl bg-surface-sunk py-2">
                <dt className="text-xs font-bold text-muted">{t("xpWeek")}</dt>
                <dd className="font-display text-xl font-bold tabular-nums">{s.xpWeek}</dd>
              </div>
              <div className="rounded-2xl bg-surface-sunk py-2">
                <dt className="text-xs font-bold text-muted">{t("stagesDone")}</dt>
                <dd className="font-display text-xl font-bold tabular-nums">{s.stagesDone}</dd>
              </div>
              <div className="rounded-2xl bg-surface-sunk py-2">
                <dt className="text-xs font-bold text-muted">{t("xpTotal")}</dt>
                <dd className="font-display text-xl font-bold tabular-nums">{s.xpTotal}</dd>
              </div>
            </dl>
            <ol className="mt-3 flex flex-wrap gap-1.5" aria-label={t("notionsLabel")}>
              {scheduledNotions.map((n) => {
                const ok = s.cleared.includes(n.slug);
                const fails = s.failsByNotion[n.slug] ?? 0;
                return (
                  <li
                    key={n.slug}
                    title={n.place}
                    className={`rounded-full px-2.5 py-1 text-xs font-bold ${ok ? "bg-success text-ink" : fails > 0 ? "bg-primary/15 text-danger-text" : "bg-surface-sunk text-muted"}`}
                  >
                    {t("notionChip", { position: n.position })}
                    {ok ? ` ${t("chipCleared")}` : fails > 0 ? ` ${t("chipFails", { count: fails })}` : ""}
                  </li>
                );
              })}
            </ol>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Les parcours suivis par la classe, et l'ajout d'un nouveau parcours. */
function TracksBar({ classroomId, tracks, available }: { classroomId: string; tracks: TrackInfo[]; available: Props["available"] }) {
  const t = useTranslations("teacher");
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [failed, setFailed] = useState(false);

  const add = async (trackSlug: string) => {
    setPending(true);
    setFailed(false);
    const res = await addClassroomTrackAction({ classroomId, trackSlug });
    setPending(false);
    if (res.ok) router.refresh();
    else setFailed(true);
  };

  return (
    <section className="paper rounded-3xl p-5" aria-labelledby="class-tracks-title">
      <h2 id="class-tracks-title" className="font-display text-xl font-bold">
        {t("classTracksTitle")}
      </h2>
      <p className="text-sm text-muted">{t("classTracksHint")}</p>
      <ul className="mt-3 flex flex-wrap gap-2">
        {tracks.map((track) => (
          <li key={track.slug} className="rounded-full bg-success px-3 py-1.5 text-sm font-bold text-ink">
            {track.title}
          </li>
        ))}
      </ul>
      {available.length > 0 && (
        <div className="mt-4">
          <p className="mb-1.5 text-sm font-bold">{t("addTrack")}</p>
          <ul className="flex flex-wrap gap-2">
            {available.map((track) => (
              <li key={track.slug}>
                <GameButton variant="secondary" className="min-h-11 px-4 py-1.5 text-base" disabled={pending} onClick={() => add(track.slug)}>
                  {t("addTrackNamed", { title: track.title })}
                </GameButton>
              </li>
            ))}
          </ul>
        </div>
      )}
      {failed && (
        <p className="mt-2 text-sm font-bold text-danger-text" role="alert">
          {t("addTrackFailed")}
        </p>
      )}
    </section>
  );
}

/** Un planning par parcours : un onglet par parcours quand la classe en suit plusieurs. */
function PlanningTracks({ classroomId, tracks, releases }: { classroomId: string; tracks: TrackInfo[]; releases: Record<string, ReleaseIso> }) {
  const t = useTranslations("teacher");
  const [slug, setSlug] = useState(tracks[0]?.slug);
  const track = tracks.find((tr) => tr.slug === slug) ?? tracks[0];
  if (!track) return null;

  return (
    <div className="space-y-4">
      {tracks.length > 1 && (
        <div role="tablist" aria-label={t("planningTracksLabel")} className="flex flex-wrap gap-2">
          {tracks.map((tr) => (
            <button
              key={tr.slug}
              type="button"
              role="tab"
              aria-selected={tr.slug === track.slug}
              onClick={() => setSlug(tr.slug)}
              className={`min-h-11 rounded-full px-4 font-bold transition ${tr.slug === track.slug ? "bg-info-deep text-white" : "bg-surface-sunk text-ink"}`}
            >
              {tr.title}
            </button>
          ))}
        </div>
      )}
      <PlanningPanel key={track.slug} classroomId={classroomId} notions={track.notions} releases={releases} />
    </div>
  );
}

/** Dates locales AAAA-MM-JJ pour les champs de date */
function toInput(iso: string | undefined): string {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}
function fromInput(value: string, endOfDay = false): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const [y, m, d] = value.split("-").map(Number);
  return endOfDay ? new Date(y, m - 1, d, 23, 59) : new Date(y, m - 1, d, 0, 0);
}

type Row = { open: string; guardian: string; close: string };

function PlanningPanel({ classroomId, notions, releases }: { classroomId: string; notions: NotionInfo[]; releases: Record<string, ReleaseIso> }) {
  const t = useTranslations("teacher");
  const router = useRouter();
  const mounted = useMounted();
  const initial = useMemo(
    () =>
      Object.fromEntries(
        notions.map((n) => [n.slug, { open: toInput(releases[n.slug]?.gameOpensAt), guardian: toInput(releases[n.slug]?.challengeOpensAt), close: toInput(releases[n.slug]?.challengeClosesAt) }]),
      ) as Record<string, Row>,
    [notions, releases],
  );
  const [rows, setRows] = useState<Record<string, Row> | null>(null);
  const [start, setStart] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "invalid">("idle");
  const current = rows ?? initial;

  if (!mounted) return <div className="h-80 animate-pulse rounded-[2rem] bg-surface-sunk" />;

  const update = (slug: string, key: keyof Row, value: string) => {
    setStatus("idle");
    setRows({ ...current, [slug]: { ...current[slug], [key]: value } });
  };

  const fillWeekly = () => {
    const from = fromInput(start);
    if (!from) return;
    const plan = weeklySchedule(notions.map((n) => n.slug), from);
    setStatus("idle");
    setRows(
      Object.fromEntries(
        notions.map((n) => [n.slug, { open: toInput(plan[n.slug].gameOpensAt.toISOString()), guardian: toInput(plan[n.slug].challengeOpensAt.toISOString()), close: toInput(plan[n.slug].challengeClosesAt.toISOString()) }]),
      ),
    );
  };

  const save = async () => {
    // Le planning est enregistré d'un bloc : on garde tel quel celui des autres parcours.
    const own = new Set(notions.map((n) => n.slug));
    const payload: Record<string, ReleaseIso> = Object.fromEntries(Object.entries(releases).filter(([slug]) => !own.has(slug)));
    for (const [slug, r] of Object.entries(current)) {
      if (!r.open && !r.guardian && !r.close) continue;
      const open = fromInput(r.open);
      const guardian = fromInput(r.guardian);
      const close = fromInput(r.close, true);
      if (!open || !guardian || !close || !isValidRelease({ gameOpensAt: open, challengeOpensAt: guardian, challengeClosesAt: close })) {
        setStatus("invalid");
        return;
      }
      payload[slug] = { gameOpensAt: open.toISOString(), challengeOpensAt: guardian.toISOString(), challengeClosesAt: close.toISOString() };
    }
    setStatus("saving");
    const res = await saveScheduleAction({ classroomId, releases: payload });
    setStatus(res.ok ? "saved" : "invalid");
    if (res.ok) router.refresh();
  };

  const field = "w-full rounded-xl bg-surface px-3 py-2.5 shadow-[0_0_0_2px_var(--color-line)] outline-none focus:shadow-[0_0_0_3px_var(--color-info-deep)]";

  return (
    <div className="space-y-5">
      <div className="paper flex flex-col gap-3 rounded-3xl p-5 sm:flex-row sm:items-end">
        <div className="flex-1">
          <label htmlFor="plan-start" className="mb-1.5 block font-bold">
            {t("fillLabel")}
          </label>
          <input id="plan-start" type="date" value={start} onChange={(e) => setStart(e.target.value)} className={field} />
          <p className="mt-1 text-sm text-muted">{t("fillHint")}</p>
        </div>
        <GameButton variant="secondary" onClick={fillWeekly} disabled={!start}>
          {t("fill")}
        </GameButton>
      </div>

      <ol className="grid gap-3">
        {notions.map((n) => {
          const r = current[n.slug];
          return (
            <li key={n.slug} className="paper rounded-3xl p-4">
              <p className="font-display text-xl font-bold">
                {t("notionChip", { position: n.position })} : {n.place}
              </p>
              <p className="text-sm text-muted">{n.concept}</p>
              <div className="mt-3 grid gap-3 sm:grid-cols-3">
                {(
                  [
                    ["open", t("opensOn")],
                    ["guardian", t("guardianFrom")],
                    ["close", t("guardianUntil")],
                  ] as const
                ).map(([key, label]) => (
                  <div key={key}>
                    <label htmlFor={`${n.slug}-${key}`} className="mb-1 block text-sm font-bold">
                      {label}
                    </label>
                    <input id={`${n.slug}-${key}`} type="date" value={r[key]} onChange={(e) => update(n.slug, key, e.target.value)} className={field} />
                  </div>
                ))}
              </div>
              {!r.open && <p className="mt-2 text-sm text-muted">{t("notScheduled")}</p>}
            </li>
          );
        })}
      </ol>

      <div className="sticky bottom-3 flex items-center gap-4 rounded-3xl bg-ink p-4 text-white">
        <p className="flex-1 font-semibold" role="status">
          {status === "saved" ? t("saved") : status === "invalid" ? t("invalid") : status === "saving" ? t("saving") : t("unsavedHint")}
        </p>
        <GameButton onClick={save} disabled={status === "saving"}>
          {t("save")}
        </GameButton>
      </div>
    </div>
  );
}
