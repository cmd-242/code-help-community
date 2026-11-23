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

/** Prédire la sortie : l'étudiant tape ce que le terminal affichera. */
export function PredictPlay({ encounter, disabled, onChange, onSubmit }: Props) {
  const t = useTranslations("game");
  const id = useId();
  const [value, setValue] = useState("");
  return (
    <div>
      <CodeBlock code={encounter.code} />
      <label htmlFor={id} className="mb-2 mt-5 block text-sm text-parchment-dim">
        {t("predictLabel")}
      </label>
      <div className="flex items-center gap-2 rounded-lg border-2 border-torch/50 bg-abyss-deep px-3 focus-within:border-torch focus-within:shadow-[0_0_20px_-6px_rgba(242,165,65,0.8)]">
        <span className="font-mono text-moss-dim" aria-hidden>
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
          className="w-full bg-transparent py-3 font-mono text-lg text-torch-bright caret-torch outline-none placeholder:text-parchment-dim/50"
        />
      </div>
    </div>
  );
}
