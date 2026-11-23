"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { useMounted } from "./use-mounted";

/** Code d'invitation de la classe, à dicter ou à partager en lien. */
export function InviteCard({ code }: { code: string }) {
  const t = useTranslations("teacher");
  const mounted = useMounted();
  const [copied, setCopied] = useState(false);
  const link = mounted ? `${window.location.origin}/rejoindre/${code}` : `/rejoindre/${code}`;

  return (
    <div className="paper flex items-center gap-4 rounded-3xl px-5 py-4">
      <div>
        <p className="text-sm font-bold text-muted">{t("inviteLabel")}</p>
        <p className="font-mono text-3xl font-semibold tracking-[0.25em]">{code}</p>
      </div>
      <button
        type="button"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(link);
            setCopied(true);
            window.setTimeout(() => setCopied(false), 2000);
          } catch {
            setCopied(false);
          }
        }}
        className="min-h-11 rounded-2xl bg-info-deep px-4 font-bold text-white"
      >
        {copied ? t("linkCopied") : t("copyLink")}
      </button>
    </div>
  );
}
