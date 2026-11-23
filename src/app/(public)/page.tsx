import { getTranslations } from "next-intl/server";
import { AnchorIcon, ChestIcon, LogbookIcon, SailIcon } from "@/components/icons";
import { GameLink } from "@/components/ui/game-button";
import { SoundToggle } from "@/features/sound/sound-toggle";
import { HeroSea } from "@/universes/archipel/hero-sea";

const SEAS = [
  { key: "linux", glyph: ">_", open: true },
  { key: "python", glyph: "def", open: false },
  { key: "javascript", glyph: "{ }", open: false },
  { key: "git", glyph: "⑂", open: true },
  { key: "network", glyph: "⇄", open: false },
  { key: "security", glyph: "⚿", open: false },
] as const;

export default async function HomePage() {
  const t = await getTranslations("home");

  return (
    <>
      <header className="relative">
        <HeroSea hint={t("seaHint")}>
          <nav className="absolute inset-x-0 top-0 flex items-center justify-between px-4 py-4 sm:px-8">
            <span className="rounded-full bg-surface px-4 py-2 font-display text-lg font-bold">{t("brand")}</span>
            <SoundToggle />
          </nav>
        </HeroSea>
        <div className="relative z-10 mx-auto -mt-16 max-w-3xl px-3">
          <div className="paper rounded-[2rem] px-6 py-8 sm:px-10">
            <h1 className="font-display text-[2.6rem] font-bold leading-[1.05] text-balance sm:text-6xl">{t("headline")}</h1>
            <p className="mt-4 max-w-xl text-lg text-muted sm:text-xl">{t("lede")}</p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <GameLink href="/app" sfx="enter">
                <SailIcon className="size-6 text-white" />
                {t("enter")}
              </GameLink>
              <GameLink href="#enseignants" variant="secondary">
                {t("teacher")}
              </GameLink>
            </div>
          </div>
        </div>
      </header>

      <main>
        {/* La boucle de progression : c'est une vraie séquence, d'où la numérotation */}
        <section className="mx-auto max-w-3xl px-5 py-20" aria-labelledby="how-title">
          <h2 id="how-title" className="font-display text-4xl font-bold">
            {t("howTitle")}
          </h2>
          <ol className="mt-10 grid gap-8 sm:grid-cols-3 sm:gap-6">
            {[
              { icon: <AnchorIcon className="size-7" />, k: "choose" },
              { icon: <LogbookIcon className="size-7" />, k: "explore" },
              { icon: <ChestIcon className="size-7" />, k: "guardian" },
            ].map((step, i) => (
              <li key={step.k}>
                <span className="flex items-center gap-3">
                  <span className="grid size-12 place-items-center rounded-2xl bg-primary font-display text-2xl font-bold text-white shadow-[0_5px_0_var(--color-primary-deep)]">{i + 1}</span>
                  <span className="text-info-deep">{step.icon}</span>
                </span>
                <h3 className="mt-4 font-display text-2xl font-semibold">{t(`steps.${step.k}.title`)}</h3>
                <p className="mt-1 text-muted">{t(`steps.${step.k}.body`)}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="bg-sand px-5 py-20" aria-labelledby="seas-title">
          <div className="mx-auto max-w-3xl">
            <h2 id="seas-title" className="font-display text-4xl font-bold">
              {t("seasTitle")}
            </h2>
            <p className="mt-2 max-w-xl text-lg">{t("seasLede")}</p>
            <ul className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3">
              {SEAS.map((s) => (
                <li key={s.key} className={`rounded-3xl p-4 ${s.open ? "paper" : "bg-surface/50"}`}>
                  <span className={`grid size-12 place-items-center rounded-2xl font-mono text-lg font-semibold ${s.open ? "bg-info-deep text-white" : "bg-line text-muted"}`}>{s.glyph}</span>
                  <p className="mt-3 font-display text-xl font-semibold leading-tight">{t(`seas.${s.key}`)}</p>
                  <p className={`text-sm font-bold ${s.open ? "text-success-deep" : "text-muted"}`}>{s.open ? t("seaOpen") : t("seaSoon")}</p>
                </li>
              ))}
            </ul>
            <div className="mt-10 rounded-3xl bg-panel p-6 text-on-panel">
              <p className="font-display text-2xl font-semibold">{t("cityTitle")}</p>
              <p className="mt-2 text-[#c9dbe6]">{t("cityBody")}</p>
            </div>
          </div>
        </section>

        <section id="enseignants" className="mx-auto max-w-3xl scroll-mt-6 px-5 py-20" aria-labelledby="teachers-title">
          <h2 id="teachers-title" className="font-display text-4xl font-bold">
            {t("teachersTitle")}
          </h2>
          <div className="mt-10 grid gap-8 sm:grid-cols-3">
            {(["rhythm", "watch", "mentors"] as const).map((k) => (
              <div key={k}>
                <h3 className="font-display text-2xl font-semibold text-info-deep">{t(`roles.${k}.title`)}</h3>
                <p className="mt-2 text-muted">{t(`roles.${k}.body`)}</p>
              </div>
            ))}
          </div>
          <p className="mt-10 text-muted">{t("teachersSoon")}</p>
          <GameLink href="/prof" className="mt-6">
            {t("teacherCta")}
          </GameLink>
        </section>

        <footer className="sea px-5 py-16 text-center">
          <p className="font-display text-3xl font-bold">{t("footerTitle")}</p>
          <GameLink href="/app" className="mt-6" sfx="enter">
            {t("enter")}
          </GameLink>
        </footer>
      </main>
    </>
  );
}
