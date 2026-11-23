"use client";

import { useTranslations } from "next-intl";
import { GameLink } from "@/components/ui/game-button";
import { authClient } from "@/lib/auth-client";

/** Invite l'invité à créer un compte pour sauvegarder sa progression (rien n'est bloqué sans compte). */
export function GuestBanner() {
  const t = useTranslations("account");
  const { data: session, isPending } = authClient.useSession();
  if (isPending || session) return null;
  return (
    <div className="mt-4 flex flex-col gap-3 rounded-[2rem] bg-panel p-5 text-on-panel sm:flex-row sm:items-center">
      <p className="flex-1">
        <span className="block font-display text-xl font-semibold">{t("bannerTitle")}</span>
        <span className="text-[#c9dbe6]">{t("bannerBody")}</span>
      </p>
      <GameLink href="/inscription" className="shrink-0">
        {t("bannerCta")}
      </GameLink>
    </div>
  );
}
