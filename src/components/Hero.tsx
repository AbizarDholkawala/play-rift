import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import type { Game } from "@/data/games";
import { PlatformBadges } from "./PlatformBadges";

export function Hero({ game }: { game: Game }) {
  return (
    <section className="relative h-[88vh] min-h-[640px] overflow-hidden">
      {/* mock "video" — animated zoom on hero image */}
      <motion.img
        src={game.hero}
        alt={game.title}
        initial={{ scale: 1.15 }}
        animate={{ scale: 1.05 }}
        transition={{ duration: 12, ease: "easeOut", repeat: Infinity, repeatType: "reverse" }}
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/20" />
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/40 to-transparent" />
      <div className="absolute inset-0 scanlines opacity-30 pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-[1400px] px-6 h-full flex flex-col justify-end pb-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl"
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="flex items-center gap-2 text-[10px] tracking-[0.3em] font-display font-bold text-[var(--neon-1)]">
              <span className="w-2 h-2 rounded-full bg-[var(--neon-1)] animate-[pulse-glow_1.6s_infinite] shadow-[0_0_10px_var(--neon-1)]" />
              NOW TRENDING
            </span>
            <span className="text-[10px] tracking-[0.25em] font-display text-muted-foreground">
              {game.studio.toUpperCase()} · {game.year}
            </span>
          </div>

          <h1 className="font-display font-black text-5xl md:text-7xl leading-[0.95] mb-4 text-glow">
            {game.title}
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-6 max-w-xl">
            {game.tagline} {game.description}
          </p>

          <div className="mb-6">
            <PlatformBadges game={game} size="md" />
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/game/$id"
              params={{ id: game.id }}
              className="px-6 py-3 bg-foreground text-background font-display font-bold text-xs tracking-[0.25em] hover:bg-accent hover:text-accent-foreground transition-colors rounded-sm"
            >
              ENTER ▸
            </Link>
            <Link
              to="/radar"
              className="px-6 py-3 border border-border hover:border-foreground font-display font-bold text-xs tracking-[0.25em] transition-colors rounded-sm"
            >
              SEE RADAR
            </Link>
          </div>
        </motion.div>
      </div>

      {/* corner ornaments */}
      <div className="absolute top-4 left-4 text-[10px] tracking-[0.3em] font-display text-muted-foreground">
        // FEATURED.001
      </div>
      <div className="absolute top-4 right-4 text-[10px] tracking-[0.3em] font-display text-muted-foreground">
        SIG: {(Math.random() * 1e6).toFixed(0).padStart(6, "0")}
      </div>
    </section>
  );
}