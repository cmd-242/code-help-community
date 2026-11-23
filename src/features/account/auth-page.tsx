import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { googleEnabled } from "@/env";
import { BoatArt } from "@/universes/archipel/boat-art";
import { SeaWaves } from "@/universes/archipel/sea-waves";
import { AuthForm } from "./auth-form";

/** Gabarit commun aux pages d'inscription et de connexion. */
export async function AuthPage({ mode }: { mode: "signin" | "signup" }) {
  const t = await getTranslations("auth");
  return (
    <div className="min-h-dvh pb-16">
      <div className="sea relative h-44 overflow-hidden">
        <SeaWaves />
        <Link href="/" className="absolute left-4 top-4 rounded-full bg-surface px-4 py-2 font-display text-lg font-bold">
          {t("brand")}
        </Link>
        <BoatArt className="absolute bottom-6 left-1/2 w-20 -translate-x-1/2" />
      </div>
      <main className="relative z-10 mx-auto -mt-10 max-w-md px-3">
        <div className="paper rounded-[2rem] px-6 py-8">
          <h1 className="font-display text-3xl font-bold">{mode === "signup" ? t("signupTitle") : t("signinTitle")}</h1>
          <p className="mt-1 text-muted">{mode === "signup" ? t("signupLede") : t("signinLede")}</p>
          <div className="mt-6">
            <AuthForm mode={mode} google={googleEnabled()} />
          </div>
        </div>
        <p className="mt-6 text-center text-muted">
          <Link href="/app" className="font-bold text-info-deep underline underline-offset-4">
            {t("guest")}
          </Link>
        </p>
      </main>
    </div>
  );
}
