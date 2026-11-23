import { LevelUpWatcher } from "@/components/hud/level-up-watcher";
import { PlayerHud } from "@/components/hud/player-hud";
import { ProgressSync } from "@/features/progression/progress-sync";

export default function LearnerLayout({ children }: LayoutProps<"/app">) {
  return (
    <div className="relative min-h-dvh">
      <PlayerHud />
      <main className="relative">{children}</main>
      <LevelUpWatcher />
      <ProgressSync />
    </div>
  );
}
