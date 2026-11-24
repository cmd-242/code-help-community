import { getTranslations } from "next-intl/server";
import { GameLink } from "@/components/ui/game-button";

/** Invitation à explorer les autres parcours, en bas d'une carte. */
export async function CatalogueLink() {
  const t = await getTranslations("catalogue");
  return (
    <section className="mt-10 rounded-[2rem] bg-surface-sunk px-5 py-6 shadow-[inset_0_0_0_2px_var(--color-line)]" aria-labelledby="catalogue-link-title">
      <h2 id="catalogue-link-title" className="font-display text-2xl font-bold">
        {t("linkTitle")}
      </h2>
      <p className="mt-1 text-muted">{t("linkBody")}</p>
      <GameLink href="/app/catalogue" variant="wood" className="mt-4">
        {t("linkCta")}
      </GameLink>
    </section>
  );
}
