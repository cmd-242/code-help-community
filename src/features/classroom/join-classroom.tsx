"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { GameButton, GameLink } from "@/components/ui/game-button";
import { joinClassroomAction, previewInviteAction } from "./actions";

type Preview = { name: string; teacher: string | null; signedIn: boolean } | null | undefined;

/** Rejoindre une classe à partir d'un code : aperçu, puis connexion si besoin, puis inscription. */
export function JoinClassroom({ code }: { code: string }) {
  const t = useTranslations("join");
  const router = useRouter();
  const [preview, setPreview] = useState<Preview>(undefined);
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    let alive = true;
    void previewInviteAction(code).then((p) => alive && setPreview(p));
    return () => {
      alive = false;
    };
  }, [code]);

  if (preview === undefined) return <div className="h-40 animate-pulse rounded-2xl bg-surface-sunk" />;

  if (preview === null) {
    return (
      <div>
        <h1 className="font-display text-3xl font-bold">{t("notFoundTitle")}</h1>
        <p className="mt-2 text-muted">{t("notFoundBody")}</p>
        <GameLink href="/rejoindre" variant="secondary" className="mt-6 w-full">
          {t("retry")}
        </GameLink>
      </div>
    );
  }

  const next = encodeURIComponent(`/rejoindre/${code}`);

  return (
    <div>
      <p className="font-bold text-info-deep">{t("invited")}</p>
      <h1 className="mt-1 font-display text-3xl font-bold">{preview.name}</h1>
      {preview.teacher && <p className="text-muted">{t("teacher", { name: preview.teacher })}</p>}
      <p className="mt-4">{t("explain")}</p>
      {preview.signedIn ? (
        <GameButton
          className="mt-6 w-full"
          disabled={joining}
          sfx="enter"
          onClick={async () => {
            setJoining(true);
            const res = await joinClassroomAction(code);
            if (res.ok) {
              router.push("/app");
              router.refresh();
            } else {
              setError(true);
              setJoining(false);
            }
          }}
        >
          {joining ? t("joining") : t("join")}
        </GameButton>
      ) : (
        <div className="mt-6 flex flex-col gap-3">
          <GameLink href={`/inscription?next=${next}`}>{t("signupToJoin")}</GameLink>
          <GameLink href={`/connexion?next=${next}`} variant="secondary">
            {t("signinToJoin")}
          </GameLink>
        </div>
      )}
      {error && (
        <p role="alert" className="mt-4 font-bold text-danger-text">
          {t("error")}
        </p>
      )}
    </div>
  );
}
