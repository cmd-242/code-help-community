"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { GameButton } from "@/components/ui/game-button";
import { isValidInviteCode, normalizeInviteCode } from "./rules";

export function JoinCodeForm() {
  const t = useTranslations("join");
  const router = useRouter();
  const [value, setValue] = useState("");
  const code = normalizeInviteCode(value);
  const valid = isValidInviteCode(code);
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (valid) router.push(`/rejoindre/${code}`);
      }}
      className="space-y-4"
    >
      <label htmlFor="code" className="block font-bold">
        {t("codeLabel")}
      </label>
      <input
        id="code"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        autoComplete="off"
        autoCapitalize="characters"
        maxLength={10}
        placeholder="AB3X7K"
        className="w-full rounded-2xl bg-surface px-4 py-3.5 text-center font-mono text-3xl tracking-[0.3em] uppercase shadow-[0_0_0_2px_var(--color-line)] outline-none focus:shadow-[0_0_0_3px_var(--color-info-deep)]"
      />
      <GameButton type="submit" className="w-full" disabled={!valid}>
        {t("continue")}
      </GameButton>
    </form>
  );
}
