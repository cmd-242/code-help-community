import { getTranslations } from "next-intl/server";
import { Embers } from "@/components/fx/embers";
import { TorchReveal } from "@/components/fx/torch-reveal";
import { DoorIcon, ScrollIcon, SkullIcon } from "@/components/icons";
import { RuneLink } from "@/components/ui/rune-button";
import { SoundToggle } from "@/features/sound/sound-toggle";

const KINGDOMS = [
  { key: "linux", glyph: ">_", open: true },
  { key: "python", glyph: "def", open: false },
  { key: "javascript", glyph: "{ }", open: false },
  { key: "git", glyph: "⑂", open: false },
  { key: "network", glyph: "⇄", open: false },
  { key: "security", glyph: "⚿", open: false },
  { key: "cloud", glyph: "☁", open: false },
] as const;

export default async function HomePage() {
  const t = await getTranslations("home");

  return (
    <>
      <TorchReveal>
        <div className="flex min-h-[100svh] flex-col">
          <nav className="flex items-center justify-between px-5 py-4 sm:px-8">
            <span className="font-display text-2xl text-parchment">{t("brand")}</span>
            <SoundToggle />
          </nav>
          <div className="mt-auto bg-[linear-gradient(180deg,transparent,rgba(8,17,21,0.94)_42%)] px-5 pb-14 pt-32 sm:px-10 sm:pb-20">
            <div className="mx-auto max-w-4xl">
              <h1 className="carved text-[3.4rem] leading-[0.95] text-parchment text-balance sm:text-8xl">{t("headline")}</h1>
              <p className="mt-6 max-w-xl text-xl text-parchment/90">{t("lede")}</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <RuneLink href="/app" sfx="door">
                  <DoorIcon className="size-6" />
                  {t("enter")}
                </RuneLink>
                <RuneLink href="#enseignants" variant="stone">
                  {t("teacher")}
                </RuneLink>
              </div>
              <p className="mt-6 text-parchment-dim">{t("torchHint")}</p>
            </div>
          </div>
        </div>
      </TorchReveal>

      <main className="relative">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <Embers density={0.4} />
        </div>

        {/* Une semaine : c'est une vraie séquence, d'où la numérotation */}
        <section className="relative mx-auto max-w-4xl px-5 py-24" aria-labelledby="week-title">
          <h2 id="week-title" className="carved text-5xl text-torch-bright torchlight">
            {t("weekTitle")}
          </h2>
          <ol className="mt-12 grid gap-10 sm:grid-cols-3 sm:gap-6">
            {[
              { icon: <DoorIcon className="size-9" />, k: "monday" },
              { icon: <ScrollIcon className="size-9" />, k: "week" },
              { icon: <SkullIcon className="size-9" />, k: "friday" },
            ].map((step, i) => (
              <li key={step.k} className="relative">
                <span className="font-display text-7xl leading-none text-stone-edge">{i + 1}</span>
                <span className="absolute left-12 top-3 text-torch">{step.icon}</span>
                <h3 className="mt-3 font-display text-3xl text-parchment">{t(`steps.${step.k}.title`)}</h3>
                <p className="mt-2 text-parchment-dim">{t(`steps.${step.k}.body`)}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="relative border-y border-stone-edge/40 bg-abyss-deep/60 px-5 py-24" aria-labelledby="kingdoms-title">
          <div className="mx-auto max-w-4xl">
            <h2 id="kingdoms-title" className="carved text-5xl text-parchment">
              {t("kingdomsTitle")}
            </h2>
            <p className="mt-3 max-w-xl text-lg text-parchment-dim">{t("kingdomsLede")}</p>
            <ul className="mt-12 grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-4">
              {KINGDOMS.map((k) => (
                <li key={k.key} className="flex flex-col items-center text-center">
                  {/* bannière héraldique */}
                  <span
                    className={`grid h-28 w-20 place-items-center pb-4 font-mono text-2xl [clip-path:polygon(0_0,100%_0,100%_82%,50%_100%,0_82%)] ${
                      k.open
                        ? "bg-[linear-gradient(180deg,#f2a541,#a4621d)] text-ink shadow-[0_0_30px_rgba(242,165,65,0.5)]"
                        : "bg-stone-light text-parchment-dim"
                    }`}
                  >
                    {k.glyph}
                  </span>
                  <span className="mt-3 font-display text-2xl leading-tight text-parchment">{t(`kingdoms.${k.key}`)}</span>
                  <span className={`text-sm ${k.open ? "text-moss" : "text-parchment-dim"}`}>{k.open ? t("kingdomOpen") : t("kingdomSoon")}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section id="enseignants" className="relative mx-auto max-w-4xl scroll-mt-10 px-5 py-24" aria-labelledby="teachers-title">
          <h2 id="teachers-title" className="carved text-5xl text-parchment">
            {t("teachersTitle")}
          </h2>
          <div className="mt-10 grid gap-10 sm:grid-cols-3">
            {(["rhythm", "watch", "mentors"] as const).map((k) => (
              <div key={k} className="border-l-2 border-torch/50 pl-5">
                <h3 className="font-display text-2xl text-torch-bright">{t(`roles.${k}.title`)}</h3>
                <p className="mt-2 text-parchment-dim">{t(`roles.${k}.body`)}</p>
              </div>
            ))}
          </div>
          <p className="mt-12 text-parchment-dim">{t("teachersSoon")}</p>
        </section>

        <footer className="relative border-t border-stone-edge/40 px-5 py-16 text-center">
          <p className="carved text-4xl text-parchment">{t("footerTitle")}</p>
          <RuneLink href="/app" className="mt-6" sfx="door">
            {t("enter")}
          </RuneLink>
        </footer>
      </main>
    </>
  );
}
