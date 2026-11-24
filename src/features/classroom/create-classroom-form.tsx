"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { GameButton } from "@/components/ui/game-button";
import { createClassroomAction } from "./actions";

const schema = z.object({
  name: z.string().trim().min(2).max(80),
  schoolYear: z.string().trim().max(20),
  trackSlugs: z.array(z.string()).min(1),
});
type Values = z.infer<typeof schema>;

export type TrackChoice = { slug: string; title: string; domain: string };

export function CreateClassroomForm({ tracks, defaultTrackSlug }: { tracks: TrackChoice[]; defaultTrackSlug: string }) {
  const t = useTranslations("teacher");
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Values>({ resolver: zodResolver(schema), defaultValues: { name: "", schoolYear: "", trackSlugs: [defaultTrackSlug] } });

  const field = "w-full rounded-2xl bg-surface px-4 py-3 text-lg shadow-[0_0_0_2px_var(--color-line)] outline-none focus:shadow-[0_0_0_3px_var(--color-info-deep)]";

  return (
    <form
      noValidate
      className="space-y-4"
      onSubmit={handleSubmit(async (values) => {
        const res = await createClassroomAction(values);
        if (res.ok) router.push(`/prof/classes/${res.id}`);
      })}
    >
      <div>
        <label htmlFor="class-name" className="mb-1.5 block font-bold">
          {t("className")}
        </label>
        <input id="class-name" placeholder={t("classNamePlaceholder")} className={field} aria-invalid={Boolean(errors.name)} {...register("name")} />
        {errors.name && <p className="mt-1 text-sm font-bold text-danger-text">{t("classNameError")}</p>}
      </div>
      <div>
        <label htmlFor="school-year" className="mb-1.5 block font-bold">
          {t("schoolYear")}
        </label>
        <input id="school-year" placeholder={t("schoolYearPlaceholder")} className={field} {...register("schoolYear")} />
      </div>
      <fieldset>
        <legend className="mb-1.5 font-bold">{t("tracksLegend")}</legend>
        <p className="mb-2 text-sm text-muted">{t("tracksHint")}</p>
        <ul className="grid gap-2">
          {tracks.map((track) => (
            <li key={track.slug}>
              <label className="flex min-h-12 cursor-pointer items-center gap-3 rounded-2xl bg-surface px-4 py-2.5 shadow-[0_0_0_2px_var(--color-line)] has-checked:shadow-[0_0_0_3px_var(--color-info-deep)]">
                <input type="checkbox" value={track.slug} className="size-5 accent-info-deep" {...register("trackSlugs")} />
                <span className="font-semibold">{track.title}</span>
              </label>
            </li>
          ))}
        </ul>
        {errors.trackSlugs && <p className="mt-1 text-sm font-bold text-danger-text">{t("tracksError")}</p>}
      </fieldset>
      <GameButton type="submit" disabled={isSubmitting}>
        {isSubmitting ? t("creating") : t("create")}
      </GameButton>
    </form>
  );
}
