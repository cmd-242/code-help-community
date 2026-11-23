import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { JoinCodeForm } from "@/features/classroom/join-code-form";
import { JoinShell } from "@/features/classroom/join-shell";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("join");
  return { title: t("title") };
}

export default async function JoinPage() {
  const t = await getTranslations("join");
  return (
    <JoinShell>
      <h1 className="font-display text-3xl font-bold">{t("title")}</h1>
      <p className="mt-1 text-muted">{t("lede")}</p>
      <div className="mt-6">
        <JoinCodeForm />
      </div>
    </JoinShell>
  );
}
