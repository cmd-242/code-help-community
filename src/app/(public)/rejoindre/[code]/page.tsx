import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";
import { JoinClassroom } from "@/features/classroom/join-classroom";
import { JoinShell } from "@/features/classroom/join-shell";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("join");
  return { title: t("title") };
}

export default function JoinWithCodePage({ params }: PageProps<"/rejoindre/[code]">) {
  return (
    <JoinShell>
      <Suspense fallback={<div className="h-40 animate-pulse rounded-2xl bg-surface-sunk" />}>
        <JoinFromParams params={params} />
      </Suspense>
    </JoinShell>
  );
}

async function JoinFromParams({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  return <JoinClassroom code={code} />;
}
