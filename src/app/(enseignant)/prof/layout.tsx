import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { AccountButton } from "@/features/account/account-button";

export default async function TeacherLayout({ children }: LayoutProps<"/prof">) {
  const t = await getTranslations("teacher");
  return (
    <div className="min-h-dvh">
      <header className="sticky top-0 z-40 px-3 pt-3">
        <div className="paper mx-auto flex max-w-5xl items-center gap-3 rounded-3xl px-4 py-2.5">
          <Link href="/prof" className="min-w-0 flex-1">
            <span className="block font-display text-xl font-bold leading-tight">{t("space")}</span>
            <span className="block truncate text-sm text-muted">{t("brand")}</span>
          </Link>
          <Link href="/app" className="hidden rounded-full bg-surface-sunk px-4 py-2 font-bold sm:block">
            {t("toGame")}
          </Link>
          <AccountButton />
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-3 pb-24 pt-6">{children}</main>
    </div>
  );
}
