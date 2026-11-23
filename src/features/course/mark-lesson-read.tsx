"use client";

import { useTranslations } from "next-intl";
import { GameButton } from "@/components/ui/game-button";
import { LESSON_XP } from "@/features/gamification/rules";
import { useProgress } from "@/features/progression/progress-store";
import { useHydratedProgress } from "@/features/progression/use-hydrated-progress";

export function MarkLessonRead({ lessonId }: { lessonId: string }) {
  const t = useTranslations("course");
  const ready = useHydratedProgress();
  const read = useProgress((s) => Boolean(s.lessonsRead[lessonId]));

  if (!ready) return <div className="h-12" />;
  if (read) return <p className="font-display text-2xl font-bold text-success-deep">{t("read")}</p>;
  return (
    <GameButton
      variant="success"
      sfx="unlock"
      onClick={() => {
        const s = useProgress.getState();
        s.markLesson(lessonId);
        s.addXp({ amount: LESSON_XP, reason: "lesson", ref: lessonId });
      }}
    >
      {t("markRead", { xp: LESSON_XP })}
    </GameButton>
  );
}
