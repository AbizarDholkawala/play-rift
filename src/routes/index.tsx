import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { GAMES, TRENDING, UPCOMING } from "@/data/games";
import { Hero } from "@/components/Hero";
import { GameCard } from "@/components/GameCard";
import { SearchBar } from "@/components/SearchBar";

export const Route = createFileRoute("/")({
  component: Index,
});

const ALL_GENRES = Array.from(new Set(GAMES.flatMap((g) => g.genres))).sort();

function Index() {
  const [genre, setGenre] = useState<string | null>(null);
  const featured = TRENDING[0] ?? GAMES[0];

  const filtered = useMemo(
    () => (genre ? GAMES.filter((g) => g.genres.includes(genre)) : GAMES),
    [genre],
  );

  return (
    <div>
      <Hero game={featured} />

      {/* Search section */}
      <section className="relative -mt-20 z-20 mx-auto max-w-[1400px] px-6">
        <div className="flex flex-col items-center gap-4">
          <SearchBar />
        </div>
      </section>

      {/* Trending */}
      <Section title="TRENDING NOW" subtitle="Highest signal across the network">
        <Grid games={TRENDING} />
      </Section>

      {/* Upcoming preview */}
      <Section
        title="ON THE RADAR"
        subtitle="Incoming releases — track them in /radar"
        right={
          <a
            href="/radar"
            className="text-[10px] tracking-[0.25em] font-display text-muted-foreground hover:text-foreground"
          >
            VIEW ALL ▸
          </a>
        }
      >
        <Grid games={UPCOMING.slice(0, 4)} />
      </Section>

      {/* Catalog with filter */}
      <Section title="THE DATABASE" subtitle={`${filtered.length} entries indexed`}>
        <div className="flex flex-wrap gap-2 mb-8">
          <FilterChip active={!genre} onClick={() => setGenre(null)}>
            ALL
          </FilterChip>
          {ALL_GENRES.map((g) => (
            <FilterChip key={g} active={genre === g} onClick={() => setGenre(g)}>
              {g.toUpperCase()}
            </FilterChip>
          ))}
        </div>
        <Grid games={filtered} />
      </Section>
    </div>
  );
}

function Section({
  title,
  subtitle,
  right,
  children,
}: {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="mx-auto max-w-[1400px] px-6 py-16">
      <div className="flex items-end justify-between mb-8 gap-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <div className="text-[10px] tracking-[0.35em] font-display text-muted-foreground mb-2">
            // {title.split(" ")[0]}
          </div>
          <h2 className="font-display font-black text-3xl md:text-4xl">{title}</h2>
          {subtitle && (
            <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
          )}
        </motion.div>
        {right}
      </div>
      {children}
    </section>
  );
}

function Grid({ games }: { games: typeof GAMES }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
      {games.map((g, i) => (
        <GameCard key={g.id} game={g} index={i} />
      ))}
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 text-[10px] font-display font-bold tracking-[0.2em] rounded-sm border transition-all ${
        active
          ? "bg-foreground text-background border-foreground"
          : "border-border text-muted-foreground hover:text-foreground hover:border-foreground"
      }`}
    >
      {children}
    </button>
  );
}
