"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { authClient } from "@/lib/auth-client";

/** Pastille de compte dans la barre du haut : initiale si connecté, sinon invitation. */
export function AccountButton() {
  const t = useTranslations("account");
  const { data: session } = authClient.useSession();
  const initial = session?.user.name.slice(0, 1).toUpperCase();
  return (
    <Link
      href="/app/compte"
      aria-label={session ? t("open") : t("guestTitle")}
      title={session ? t("open") : t("guestTitle")}
      className={`grid size-11 shrink-0 place-items-center rounded-full font-display text-lg font-bold shadow-[0_0_0_2px_var(--color-line),0_4px_0_var(--color-line)] transition active:translate-y-[3px] ${
        session ? "bg-info-deep text-white" : "bg-surface text-muted"
      }`}
    >
      {initial ?? (
        <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
          <circle cx="12" cy="8" r="4" />
          <path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" strokeLinecap="round" />
        </svg>
      )}
    </Link>
  );
}
