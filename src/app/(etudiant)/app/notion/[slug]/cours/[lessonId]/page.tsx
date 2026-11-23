import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getWorldT } from "@/universes/world-text-server";
import { LogbookIcon } from "@/components/icons";
import { GameLink } from "@/components/ui/game-button";
import { getNotion, getTracks } from "@/features/catalog/queries";
import { LessonBody } from "@/features/course/lesson-body";
import { MarkLessonRead } from "@/features/course/mark-lesson-read";

export function generateStaticParams() {
  return getTracks().flatMap((t) => t.notions.flatMap((n) => n.lessons.map((l) => ({ slug: n.slug, lessonId: l.id }))));
}

export async function generateMetadata({ params }: PageProps<"/app/notion/[slug]/cours/[lessonId]">): Promise<Metadata> {
  const { slug, lessonId } = await params;
  return { title: getNotion(slug)?.notion.lessons.find((l) => l.id === lessonId)?.title };
}

/** Côté fermé : une page du cours (le journal de bord), rendue côté serveur. */
export default async function LessonPage({ params }: PageProps<"/app/notion/[slug]/cours/[lessonId]">) {
  const { slug, lessonId } = await params;
  const found = getNotion(slug);
  const index = found?.notion.lessons.findIndex((l) => l.id === lessonId) ?? -1;
  if (!found || index < 0) notFound();
  const { track, notion } = found;
  const t = await getWorldT("course", track.universe);
  const lesson = notion.lessons[index];
  const next = notion.lessons[index + 1];

  return (
    <div className="mx-auto max-w-2xl px-3 pb-24 pt-5">
      <article className="rounded-[2rem] bg-sand px-6 py-9 shadow-[0_8px_0_var(--color-sand-edge)] sm:px-10">
        <p className="flex items-center gap-2 font-bold text-label">
          <LogbookIcon className="size-5" />
          {t("chapter", { place: notion.place })}
        </p>
        <h1 className="mt-2 font-display text-4xl font-bold leading-tight">{lesson.title}</h1>
        <p className="mt-1 font-bold text-label">{t("minutes", { minutes: lesson.minutes })}</p>
        <LessonBody blocks={lesson.blocks} />
        <div className="mt-10 border-t-2 border-dashed border-sand-edge pt-6">
          <MarkLessonRead lessonId={lesson.id} />
        </div>
      </article>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        {next ? (
          <GameLink href={`/app/notion/${notion.slug}/cours/${next.id}`} sfx="page">
            {t("nextPage", { title: next.title })}
          </GameLink>
        ) : (
          <GameLink href={`/app/notion/${notion.slug}`} sfx="enter">
            {t("toPractice")}
          </GameLink>
        )}
        <GameLink href={`/app/notion/${notion.slug}`} variant="secondary">
          {t("backToNotion")}
        </GameLink>
      </div>
    </div>
  );
}
