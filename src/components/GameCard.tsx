import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import type { Game } from "@/data/games";
import { PLACEHOLDER_IMG } from "@/data/games";
import { useVault } from "@/hooks/useTheme";

export function GameCard({ game, index = 0 }: { game: Game; index?: number }) {
  const [hover, setHover] = useState(false);
  const [coverFailed, setCoverFailed] = useState(false);
  const { has, toggle } = useVault();
  const inVault = has(game.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: Math.min(index * 0.04, 0.4) }}
      className="group relative"
      style={{ contain: "layout paint" }}
    >
      <Link
        to="/game/$id"
        params={{ id: game.id }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        className="block relative aspect-[3/4] overflow-hidden rounded-md bg-card neon-border"
      >
        {/* base cover — static, no hover slideshow */}
        {coverFailed || !game.cover ? (
          <NoSignalFallback title={game.title} />
        ) : (
          <img
            src={game.cover}
            alt={game.title}
            loading="lazy"
            onError={(e) => {
              const img = e.currentTarget;
              if (PLACEHOLDER_IMG && img.src !== PLACEHOLDER_IMG) {
                img.src = PLACEHOLDER_IMG;
              } else {
                setCoverFailed(true);
              }
            }}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        )}
        {/* gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent" />
        {/* scanlines */}
        <div className="absolute inset-0 scanlines opacity-40 mix-blend-overlay pointer-events-none" />

        {/* top-right rating / hype */}
        <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5">
          {game.hype ? (
            <span className="text-[9px] font-display font-bold tracking-wider px-2 py-1 bg-[var(--neon-2)] text-black rounded-sm">
              HYPE {game.hype}
            </span>
          ) : game.rating > 0 ? (
            <span className="text-[10px] font-display font-bold tracking-wider px-2 py-1 bg-background/80 backdrop-blur border border-border rounded-sm">
              {game.rating}
            </span>
          ) : null}
        </div>

        {/* vault toggle */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggle(game.id);
          }}
          className={`absolute top-2.5 left-2.5 w-8 h-8 grid place-items-center rounded-sm border transition-all backdrop-blur ${
            inVault
              ? "bg-foreground text-background border-foreground"
              : "bg-background/60 text-foreground border-border hover:border-foreground"
          }`}
          aria-label="Toggle vault"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill={inVault ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
            <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
          </svg>
        </button>

        {/* bottom info */}
        <div className="absolute inset-x-0 bottom-0 p-4">
          <div className="text-[10px] tracking-[0.25em] font-display text-muted-foreground mb-1">
            {game.studio.toUpperCase()} · {game.year}
          </div>
          <h3 className="font-display font-bold text-lg leading-tight text-white mb-2 line-clamp-2">
            {game.title}
          </h3>
          <div className="flex flex-wrap gap-1 mb-2">
            {game.genres.slice(0, 2).map((g) => (
              <span
                key={g}
                className="text-[9px] tracking-wider px-1.5 py-0.5 border border-white/20 text-white/80 rounded-sm"
              >
                {g.toUpperCase()}
              </span>
            ))}
          </div>

          <motion.div
            initial={false}
            animate={{ height: hover ? "auto" : 0, opacity: hover ? 1 : 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="flex items-center justify-between text-[11px] pt-2 border-t border-white/10">
              <span className="font-display font-bold text-white">{game.price}</span>
              <span className="text-white/60">{game.platforms.length} platforms</span>
            </div>
          </motion.div>
        </div>
      </Link>
    </motion.div>
  );
}

function NoSignalFallback({ title }: { title: string }) {
  return (
    <div className="absolute inset-0 grid place-items-center bg-gradient-to-br from-[var(--neon-2)]/20 via-background to-[var(--neon-1)]/20 overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-40" />
      <div className="absolute inset-0 scanlines opacity-50 pointer-events-none" />
      <div className="relative text-center px-4">
        <div className="text-[9px] tracking-[0.4em] font-display font-bold text-[var(--neon-1)] mb-2 animate-pulse">
          ◉ NO SIGNAL
        </div>
        <div className="font-display font-black text-2xl text-glow tracking-tight leading-tight line-clamp-3">
          {title}
        </div>
        <div className="mt-3 text-[8px] tracking-[0.5em] font-display text-muted-foreground">
          PLAY RIFT
        </div>
      </div>
    </div>
  );
}