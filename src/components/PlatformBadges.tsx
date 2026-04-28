import type { Game, Platform } from "@/data/games";

const PLATFORM_LABEL: Record<Platform, string> = {
  steam: "STEAM",
  epic: "EPIC",
  gog: "GOG",
  xbox: "XBOX",
  playstation: "PS5",
};

export function PlatformBadges({ game, size = "sm" }: { game: Game; size?: "sm" | "md" }) {
  const cls =
    size === "sm"
      ? "text-[9px] px-1.5 py-0.5"
      : "text-[11px] px-2.5 py-1";
  return (
    <div className="flex flex-wrap gap-1.5">
      {game.platforms.map((p) => (
        <span
          key={p}
          className={`${cls} font-display tracking-wider font-bold border border-border bg-background/60 backdrop-blur rounded-sm`}
        >
          {PLATFORM_LABEL[p]}
        </span>
      ))}
      {game.gamePassTier && (
        <span
          className={`${cls} font-display tracking-wider font-bold rounded-sm bg-[#107C10] text-white`}
        >
          GAME PASS · {game.gamePassTier.toUpperCase()}
        </span>
      )}
      {game.drmFree && (
        <span
          className={`${cls} font-display tracking-wider font-bold rounded-sm border border-[var(--neon-4)] text-[var(--neon-4)]`}
        >
          DRM-FREE
        </span>
      )}
    </div>
  );
}