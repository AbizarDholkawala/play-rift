import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { UPCOMING, RECENT } from "@/data/games";
import { PLACEHOLDER_IMG } from "@/data/games";
import { PlatformBadges } from "@/components/PlatformBadges";
import { useVault } from "@/hooks/useTheme";

export const Route = createFileRoute("/radar")({
  head: () => ({
    meta: [
      { title: "Radar — Upcoming & Recent Releases · NULLCADE" },
      {
        name: "description",
        content:
          "Track upcoming and recently released games on the Radar timeline — GTA VI, Resident Evil 9, Pragmata, and more.",
      },
      { property: "og:title", content: "Radar — Upcoming & Recent Releases" },
      { property: "og:description", content: "Timeline of incoming and just-released games." },
    ],
  }),
  component: Radar,
});

function Radar() {
  const [tab, setTab] = useState<"upcoming" | "recent">("upcoming");
  const list = tab === "upcoming" ? UPCOMING : RECENT;

  return (
    <div className="relative">
      <div className="absolute inset-0 grid-bg pointer-events-none -z-10" />
      <section className="mx-auto max-w-[1400px] px-6 pt-20 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-[10px] tracking-[0.35em] font-display text-[var(--neon-1)] mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[var(--neon-1)] animate-[pulse-glow_1.6s_infinite]" />
            LIVE FEED
          </div>
          <h1 className="font-display font-black text-5xl md:text-7xl text-glow mb-3">RADAR</h1>
          <p className="text-muted-foreground max-w-xl">
            Real-time tracking of incoming releases and the freshest drops. Set a ping in your Vault.
          </p>
        </motion.div>

        <div className="mt-10 flex items-center gap-2">
          {(["upcoming", "recent"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`relative px-5 py-2.5 text-[11px] tracking-[0.25em] font-display font-bold rounded-sm transition-colors ${
                tab === t
                  ? "bg-foreground text-background"
                  : "border border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {t === "upcoming" ? "INCOMING" : "RECENT DROPS"}
              {tab === t && (
                <motion.span
                  layoutId="radar-tab"
                  className="absolute inset-0 rounded-sm border border-foreground"
                />
              )}
            </button>
          ))}
          <span className="ml-auto text-[10px] tracking-[0.25em] font-display text-muted-foreground">
            {list.length} ENTRIES
          </span>
        </div>
      </section>

      {/* Timeline */}
      <section className="mx-auto max-w-[1400px] px-6 pb-32">
        <div className="relative pl-8 md:pl-16">
          {/* timeline rail */}
          <div className="absolute left-2 md:left-6 top-2 bottom-2 w-px bg-gradient-to-b from-transparent via-border to-transparent" />

          <div className="space-y-8">
            {list.map((g, i) => (
              <TimelineRow key={g.id} game={g} index={i} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function TimelineRow({ game, index }: { game: typeof UPCOMING[number]; index: number }) {
  const { has, toggle } = useVault();
  const inVault = has(game.id);
  const date = new Date(game.releaseDate);
  const month = date.toLocaleString("en", { month: "short" }).toUpperCase();
  const day = date.getDate();
  const year = date.getFullYear();

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: Math.min(index * 0.05, 0.3) }}
      className="relative"
    >
      {/* node */}
      <div className="absolute -left-6 md:-left-10 top-6 w-3 h-3 rounded-full bg-background border-2 border-foreground neon-border" />

      <Link
        to="/game/$id"
        params={{ id: game.id }}
        className="group flex flex-col md:flex-row gap-5 p-5 bg-card border border-border rounded-md hover:border-foreground transition-all"
      >
        {/* date block */}
        <div className="flex md:flex-col items-center md:items-start gap-3 md:w-32 shrink-0">
          <div className="font-display">
            <div className="text-[10px] tracking-[0.3em] text-muted-foreground">{month}</div>
            <div className="font-black text-4xl leading-none">{day}</div>
            <div className="text-[10px] tracking-[0.3em] text-muted-foreground">{year}</div>
          </div>
          {game.hype && (
            <span className="text-[9px] font-display font-bold tracking-wider px-2 py-1 bg-[var(--neon-2)] text-black rounded-sm">
              HYPE {game.hype}
            </span>
          )}
        </div>

        {/* art */}
        <img
          src={game.cover}
          alt={game.title}
          loading="lazy"
          onError={(e) => {
            const img = e.currentTarget;
            if (img.src !== PLACEHOLDER_IMG) img.src = PLACEHOLDER_IMG;
          }}
          className="w-full md:w-40 h-32 md:h-48 object-cover rounded-sm"
        />

        {/* info */}
        <div className="flex-1 min-w-0">
          <div className="text-[10px] tracking-[0.25em] font-display text-muted-foreground mb-1">
            {game.studio.toUpperCase()}
          </div>
          <h3 className="font-display font-black text-2xl md:text-3xl mb-2 group-hover:text-glow transition-all">
            {game.title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {game.description}
          </p>
          <PlatformBadges game={game} />
        </div>

        {/* action */}
        <button
          onClick={(e) => {
            e.preventDefault();
            toggle(game.id);
          }}
          className={`shrink-0 self-start px-4 py-2 text-[10px] tracking-[0.25em] font-display font-bold rounded-sm border transition-all ${
            inVault
              ? "bg-foreground text-background border-foreground"
              : "border-border hover:border-foreground"
          }`}
        >
          {inVault ? "✓ TRACKED" : "+ TRACK"}
        </button>
      </Link>
    </motion.div>
  );
}