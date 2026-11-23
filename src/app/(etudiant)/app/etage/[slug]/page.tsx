import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { floorSummaries, getNotion, getTrack } from "@/features/catalog/queries";
import { FloorView } from "@/features/floor/floor-view";

export function generateStaticParams() {
  return getTrack()?.notions.map((n) => ({ slug: n.slug })) ?? [];
}

export async function generateMetadata({ params }: PageProps<"/app/etage/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const found = getNotion(slug);
  return { title: found?.notion.room };
}

export default async function FloorPage({ params }: PageProps<"/app/etage/[slug]">) {
  const { slug } = await params;
  const found = getNotion(slug);
  if (!found) notFound();
  const t = await getTranslations("floor");
  const { track, notion } = found;
  const floors = floorSummaries(track);

  return (
    <div className="mx-auto max-w-3xl px-4 pb-24 pt-8">
      <header className="text-center">
        <p className="text-torch">{t("depth", { floor: notion.floor })}</p>
        <h1 className="carved torchlight mt-1 text-5xl text-torch-bright text-balance sm:text-6xl">{notion.room}</h1>
        <p className="mt-2 text-xl text-parchment">{notion.concept}</p>
        <p className="mx-auto mt-2 max-w-lg text-parchment-dim">{notion.summary}</p>
      </header>

      <FloorView
        floors={floors}
        floorIndex={floors.findIndex((f) => f.slug === notion.slug)}
        stages={notion.stages.map((s) => ({ id: s.id, title: s.title, description: s.description, xp: s.xp, count: s.encounters.length }))}
        lessons={notion.lessons.map((l) => ({ id: l.id, title: l.title, minutes: l.minutes }))}
      />
    </div>
  );
}
