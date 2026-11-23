import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { ScrollIcon } from "@/components/icons";
import { RuneLink } from "@/components/ui/rune-button";
import { getNotion, getTrack } from "@/features/catalog/queries";
import { LessonBody } from "@/features/grimoire/lesson-body";
import { MarkLessonRead } from "@/features/grimoire/mark-lesson-read";

export function generateStaticParams() {
  return getTrack()?.notions.flatMap((n) => n.lessons.map((l) => ({ slug: n.slug, lessonId: l.id }))) ?? [];
}

export async function generateMetadata({ params }: PageProps<"/app/etage/[slug]/grimoire/[lessonId]">): Promise<Metadata> {
  const { slug, lessonId } = await params;
  return { title: getNotion(slug)?.notion.lessons.find((l) => l.id === lessonId)?.title };
}

/** Côté fermé : une page du grimoire (le cours), rendue côté serveur. */
export default async function LessonPage({ params }: PageProps<"/app/etage/[slug]/grimoire/[lessonId]">) {
  const { slug, lessonId } = await params;
  const found = getNotion(slug);
  const index = found?.notion.lessons.findIndex((l) => l.id === lessonId) ?? -1;
  if (!found || index < 0) notFound();
  const t = await getTranslations("grimoire");
  const { notion } = found;
  const lesson = notion.lessons[index];
  const next = notion.lessons[index + 1];

  return (
    <div className="mx-auto max-w-2xl px-4 pb-24 pt-8">
      <article className="relative rounded-2xl bg-[linear-gradient(170deg,#f1e6cc_0%,#e2d0a8_60%,#cdb88b_100%)] px-6 py-10 text-ink shadow-[0_40px_80px_-30px_rgba(0,0,0,0.9),inset_0_0_80px_rgba(122,74,20,0.25)] sm:px-12">
        <p className="flex items-center gap-2 text-[#7a4a14]">
          <ScrollIcon className="size-5" />
          {t("chapter", { floor: notion.floor, room: notion.room })}
        </p>
        <h1 className="mt-2 font-display text-5xl leading-tight text-ink">{lesson.title}</h1>
        <p className="mt-1 text-ink/60">{t("minutes", { minutes: lesson.minutes })}</p>
        <LessonBody blocks={lesson.blocks} />
        <div className="mt-10 border-t border-ink/20 pt-6">
          <MarkLessonRead lessonId={lesson.id} />
        </div>
      </article>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        {next ? (
          <RuneLink href={`/app/etage/${notion.slug}/grimoire/${next.id}`} sfx="page">
            {t("nextPage", { title: next.title })}
          </RuneLink>
        ) : (
          <RuneLink href={`/app/etage/${notion.slug}`} sfx="door">
            {t("toDungeon")}
          </RuneLink>
        )}
        <RuneLink href={`/app/etage/${notion.slug}`} variant="stone">
          {t("backToFloor")}
        </RuneLink>
      </div>
    </div>
  );
}
