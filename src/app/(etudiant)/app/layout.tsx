import { LevelUpWatcher } from "@/components/hud/level-up-watcher";
import { PlayerHud } from "@/components/hud/player-hud";

export default function LearnerLayout({ children }: LayoutProps<"/app">) {
  return (
    <div className="relative min-h-dvh">
      <PlayerHud />
      <main className="relative">{children}</main>
      <LevelUpWatcher />
    </div>
  );
}
