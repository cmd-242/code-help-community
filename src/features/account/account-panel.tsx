"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { GameButton, GameLink } from "@/components/ui/game-button";
import { SoundToggle } from "@/features/sound/sound-toggle";
import { authClient } from "@/lib/auth-client";

export function AccountPanel() {
  const t = useTranslations("account");
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  if (isPending) return <div className="h-60 animate-pulse rounded-[2rem] bg-surface-sunk" />;

  if (!session) {
    return (
      <div className="paper rounded-[2rem] p-6">
        <h1 className="font-display text-3xl font-bold">{t("guestTitle")}</h1>
        <p className="mt-2 text-muted">{t("guestBody")}</p>
        <div className="mt-6 flex flex-col gap-3">
          <GameLink href="/inscription">{t("signup")}</GameLink>
          <GameLink href="/connexion" variant="secondary">
            {t("signin")}
          </GameLink>
        </div>
      </div>
    );
  }

  return (
    <div className="paper rounded-[2rem] p-6">
      <div className="flex items-center gap-4">
        <span className="grid size-16 place-items-center rounded-full bg-info-deep font-display text-3xl font-bold text-white" aria-hidden>
          {session.user.name.slice(0, 1).toUpperCase()}
        </span>
        <div className="min-w-0">
          <h1 className="truncate font-display text-3xl font-bold">{session.user.name}</h1>
          <p className="truncate text-muted">{session.user.email}</p>
        </div>
      </div>
      <p className="mt-5 rounded-2xl bg-success/20 px-4 py-3 font-semibold">{t("saved")}</p>
      <div className="mt-5 flex items-center justify-between gap-3 rounded-2xl bg-surface-sunk px-4 py-3">
        <span className="font-bold">{t("sound")}</span>
        <SoundToggle />
      </div>
      <div className="mt-5 grid gap-2">
        <GameLink href="/rejoindre" variant="secondary">
          {t("joinClass")}
        </GameLink>
        <GameLink href="/prof" variant="secondary">
          {t("teacherSpace")}
        </GameLink>
      </div>
      <GameButton
        variant="secondary"
        className="mt-6 w-full"
        onClick={async () => {
          await authClient.signOut();
          router.push("/");
          router.refresh();
        }}
      >
        {t("signout")}
      </GameButton>
    </div>
  );
}
