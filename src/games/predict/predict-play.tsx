"use client";

import { useTranslations } from "next-intl";
import { useId, useState } from "react";
import type { PublicEncounter } from "@/games/public";
import { CodeBlock } from "@/games/shared/code-block";

type Props = {
  encounter: Extract<PublicEncounter, { type: "predict" }>;
  disabled: boolean;
  onChange: (response: string | null) => void;
  onSubmit: () => void;
};

/** Prédire la sortie : l'apprenant tape ce que le terminal affichera. */
export function PredictPlay({ encounter, disabled, onChange, onSubmit }: Props) {
  const t = useTranslations("game");
  const id = useId();
  const [value, setValue] = useState("");
  return (
    <div>
      <CodeBlock code={encounter.code} />
      <label htmlFor={id} className="mb-2 mt-5 block text-sm font-bold text-info-deep">
        {t("predictLabel")}
      </label>
      <div className="flex items-center gap-2 rounded-2xl bg-surface px-4 shadow-[0_0_0_2px_var(--color-line)] focus-within:shadow-[0_0_0_3px_var(--color-info-deep)]">
        <span className="font-mono font-bold text-info-deep" aria-hidden>
          &gt;
        </span>
        <input
          id={id}
          value={value}
          disabled={disabled}
          autoComplete="off"
          autoCapitalize="off"
          spellCheck={false}
          placeholder={encounter.placeholder ?? t("predictPlaceholder")}
          onChange={(e) => {
            setValue(e.target.value);
            onChange(e.target.value.trim() ? e.target.value : null);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && value.trim()) onSubmit();
          }}
          className="w-full bg-transparent py-3.5 font-mono text-lg outline-none placeholder:text-muted/70"
        />
      </div>
    </div>
  );
}
