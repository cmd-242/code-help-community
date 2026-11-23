import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { AccountPanel } from "@/features/account/account-panel";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("account");
  return { title: t("title") };
}

export default function AccountPage() {
  return (
    <div className="mx-auto max-w-md px-3 pb-24 pt-5">
      <AccountPanel />
    </div>
  );
}
