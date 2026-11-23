import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";
import { ClassroomDashboard } from "@/features/classroom/classroom-dashboard";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("teacher");
  return { title: t("classTitle") };
}

/** Les paramètres et la session sont lus au moment de la requête : derrière une frontière Suspense. */
export default function ClassroomPage({ params }: PageProps<"/prof/classes/[id]">) {
  return (
    <Suspense fallback={<div className="h-96 animate-pulse rounded-[2rem] bg-surface-sunk" />}>
      <ClassroomDashboard params={params} />
    </Suspense>
  );
}
