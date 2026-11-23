import { Embers } from "@/components/fx/embers";
import { LevelUpWatcher } from "@/components/hud/level-up-watcher";
import { PlayerHud } from "@/components/hud/player-hud";

export default function StudentLayout({ children }: LayoutProps<"/app">) {
  return (
    <div className="relative min-h-dvh">
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-0">
        <Embers density={0.6} />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-[linear-gradient(180deg,transparent,rgba(8,17,21,0.9))]" />
      </div>
      <PlayerHud />
      <main className="relative">{children}</main>
      <LevelUpWatcher />
    </div>
  );
}
