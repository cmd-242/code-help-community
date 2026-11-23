import type { ReactNode } from "react";
import { BoatArt } from "@/universes/archipel/boat-art";
import { SeaWaves } from "@/universes/archipel/sea-waves";

/** Mise en page des écrans pour rejoindre une classe. */
export function JoinShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh pb-16">
      <div className="sea relative h-40 overflow-hidden">
        <SeaWaves />
        <BoatArt className="absolute bottom-5 left-1/2 w-20 -translate-x-1/2" />
      </div>
      <main className="relative z-10 mx-auto -mt-10 max-w-md px-3">
        <div className="paper rounded-[2rem] px-6 py-8">{children}</div>
      </main>
    </div>
  );
}
