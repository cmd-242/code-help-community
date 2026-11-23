import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";
import { TeacherHome } from "@/features/classroom/teacher-home";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("teacher");
  return { title: t("space") };
}

export default function TeacherPage() {
  return (
    <Suspense fallback={<div className="h-80 animate-pulse rounded-[2rem] bg-surface-sunk" />}>
      <TeacherHome />
    </Suspense>
  );
}
