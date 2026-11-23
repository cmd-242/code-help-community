import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getNotion, getTracks, notionSummaries } from "@/features/catalog/queries";
import { mapHref } from "@/features/catalog/paths";
import { NotionView } from "@/features/notion/notion-view";
import { Backdrop, sceneClass } from "@/universes/universe-art";
import { getWorldT } from "@/universes/world-text-server";

export function generateStaticParams() {
  return getTracks().flatMap((t) => t.notions.map((n) => ({ slug: n.slug })));
}

export async function generateMetadata({ params }: PageProps<"/app/notion/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  return { title: getNotion(slug)?.notion.place };
}

export default async function NotionPage({ params }: PageProps<"/app/notion/[slug]">) {
  const { slug } = await params;
  const found = getNotion(slug);
  if (!found) notFound();
  const { track, notion } = found;
  const t = await getWorldT("notion", track.universe);
  const notions = notionSummaries(track);

  return (
    <div className="mx-auto max-w-3xl px-3 pb-24 pt-5">
      <header className={`${sceneClass(track.universe)} relative overflow-hidden rounded-[2rem] px-6 pb-8 pt-7 ${track.universe === "metro" ? "text-white" : "text-ink"}`}>
        <Backdrop universe={track.universe} />
        <div className="relative">
          <p className="inline-block rounded-full bg-surface px-3 py-1 text-sm font-bold text-info-deep">{t("stop", { position: notion.position })}</p>
          <h1 className="mt-3 font-display text-5xl font-bold leading-[1.05] text-balance">{notion.place}</h1>
          <p className="mt-2 text-xl font-bold">{notion.concept}</p>
          <p className="mt-1 max-w-lg text-lg">{notion.summary}</p>
        </div>
      </header>

      <NotionView
        notions={notions}
        index={notions.findIndex((n) => n.slug === notion.slug)}
        stages={notion.stages.map((s) => ({ id: s.id, title: s.title, description: s.description, xp: s.xp, count: s.encounters.length }))}
        lessons={notion.lessons.map((l) => ({ id: l.id, title: l.title, minutes: l.minutes }))}
        universe={track.universe}
        mapHref={mapHref(track)}
      />
    </div>
  );
}
