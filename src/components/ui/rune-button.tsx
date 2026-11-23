"use client";

import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { useSound } from "@/features/sound/sound-provider";
import type { SfxName } from "@/features/sound/sound-engine";

type Variant = "torch" | "stone" | "ember" | "moss";

const styles: Record<Variant, string> = {
  torch:
    "bg-[linear-gradient(180deg,#ffd27a_0%,#f2a541_45%,#c47a22_100%)] text-ink shadow-[0_0_0_1px_#7a4a14,0_6px_0_#6b3f10,0_10px_30px_-6px_rgba(242,165,65,0.65)] hover:brightness-110 active:translate-y-[4px] active:shadow-[0_0_0_1px_#7a4a14,0_2px_0_#6b3f10,0_6px_20px_-6px_rgba(242,165,65,0.6)]",
  stone:
    "stone text-parchment shadow-[0_0_0_1px_#3d5e69,0_5px_0_#0b1418] hover:text-torch-bright active:translate-y-[3px] active:shadow-[0_0_0_1px_#3d5e69,0_2px_0_#0b1418]",
  ember:
    "bg-[linear-gradient(180deg,#ff8a5c_0%,#e4572e_50%,#9e2f12_100%)] text-white shadow-[0_0_0_1px_#5c1a08,0_6px_0_#5c1a08,0_10px_34px_-6px_rgba(228,87,46,0.75)] hover:brightness-110 active:translate-y-[4px] active:shadow-[0_0_0_1px_#5c1a08,0_2px_0_#5c1a08]",
  moss:
    "bg-[linear-gradient(180deg,#b5f5df_0%,#7fe0c2_50%,#3e8f7a_100%)] text-ink shadow-[0_0_0_1px_#1f5246,0_6px_0_#1f5246,0_10px_30px_-6px_rgba(127,224,194,0.6)] hover:brightness-110 active:translate-y-[4px] active:shadow-[0_0_0_1px_#1f5246,0_2px_0_#1f5246]",
};

const base =
  "relative inline-flex min-h-12 select-none items-center justify-center gap-2 rounded-xl px-6 py-3 font-display text-xl font-bold tracking-wide transition-[transform,filter,box-shadow,color] duration-100 disabled:pointer-events-none disabled:opacity-45";

type Common = { variant?: Variant; children: ReactNode; className?: string; sfx?: SfxName };

export function RuneButton({
  variant = "torch",
  className = "",
  sfx = "click",
  children,
  onClick,
  ...rest
}: Common & ComponentProps<"button">) {
  const { play } = useSound();
  return (
    <button
      type="button"
      {...rest}
      onPointerEnter={() => play("hover")}
      onClick={(e) => {
        play(sfx);
        onClick?.(e);
      }}
      className={`${base} ${styles[variant]} ${className}`}
    >
      {children}
    </button>
  );
}

export function RuneLink({
  variant = "torch",
  className = "",
  sfx = "click",
  children,
  href,
  ...rest
}: Common & ComponentProps<typeof Link>) {
  const { play } = useSound();
  return (
    <Link
      href={href}
      {...rest}
      onPointerEnter={() => play("hover")}
      onClick={() => play(sfx)}
      className={`${base} ${styles[variant]} ${className}`}
    >
      {children}
    </Link>
  );
}
