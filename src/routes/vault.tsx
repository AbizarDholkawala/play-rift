import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { GAMES } from "@/data/games";
import { useVault } from "@/hooks/useTheme";

export const Route = createFileRoute("/vault")({
  head: () => ({
    meta: [
      { title: "The Vault — Your Game Shelf · NULLCADE" },
      { name: "description", content: "Your curated personal game collection." },
      { property: "og:title", content: "The Vault" },
      { property: "og:description", content: "Your curated personal game collection." },
    ],
  }),
  component: Vault,
});

function Vault() {
  const { ids, toggle } = useVault();
  const games = GAMES.filter((g) => ids.includes(g.id));

  return (
    <div>
      <section className="mx-auto max-w-[1400px] px-6 pt-20 pb-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-[10px] tracking-[0.35em] font-display text-muted-foreground mb-3">
            // PRIVATE COLLECTION
          </div>
          <h1 className="font-display font-black text-5xl md:text-7xl mb-3 text-glow">
            THE VAULT
          </h1>
          <p className="text-muted-foreground max-w-xl">
            Your shelf. {games.length} {games.length === 1 ? "title" : "titles"} sealed away for safekeeping.
          </p>
        </motion.div>
      </section>

      {games.length === 0 ? (
        <EmptyVault />
      ) : (
        <Shelves games={games} onRemove={toggle} />
      )}
    </div>
  );
}

function EmptyVault() {
  return (
    <section className="mx-auto max-w-[1400px] px-6 py-24">
      <div className="border border-dashed border-border rounded-md p-16 text-center">
        <div className="font-display text-[10px] tracking-[0.35em] text-muted-foreground mb-4">
          // EMPTY
        </div>
        <h2 className="font-display font-bold text-2xl mb-3">No games on the shelf yet</h2>
        <p className="text-muted-foreground mb-6">
          Hit the bookmark icon on any card to start your collection.
        </p>
        <Link
          to="/"
          className="inline-block px-6 py-3 bg-foreground text-background font-display font-bold text-xs tracking-[0.25em] hover:bg-accent hover:text-accent-foreground transition-colors rounded-sm"
        >
          DISCOVER GAMES ▸
        </Link>
      </div>
    </section>
  );
}

function Shelves({
  games,
  onRemove,
}: {
  games: typeof GAMES;
  onRemove: (id: string) => void;
}) {
  // chunk into shelves of 6
  const shelves: (typeof games)[] = [];
  for (let i = 0; i < games.length; i += 6) shelves.push(games.slice(i, i + 6));

  return (
    <section className="mx-auto max-w-[1400px] px-6 pb-32 space-y-16">
      {shelves.map((shelf, sIdx) => (
        <div key={sIdx} className="relative">
          <div className="flex items-end justify-between mb-4">
            <div className="text-[10px] tracking-[0.3em] font-display text-muted-foreground">
              SHELF {String(sIdx + 1).padStart(2, "0")}
            </div>
            <div className="text-[10px] tracking-[0.3em] font-display text-muted-foreground">
              {shelf.length} / 6
            </div>
          </div>

          {/* the shelf */}
          <div className="relative">
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3 md:gap-4 perspective-[1000px]">
              {shelf.map((g, i) => (
                <motion.div
                  key={g.id}
                  initial={{ opacity: 0, y: 30, rotateY: -15 }}
                  animate={{ opacity: 1, y: 0, rotateY: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.06 }}
                  whileHover={{ y: -8, rotateY: 4, scale: 1.03 }}
                  className="relative group"
                >
                  <Link
                    to="/game/$id"
                    params={{ id: g.id }}
                    className="block relative aspect-[2/3] overflow-hidden rounded-sm bg-card neon-border"
                  >
                    <img
                      src={g.cover}
                      alt={g.title}
                      loading="lazy"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />
                    {/* spine effect */}
                    <div className="absolute inset-y-0 left-0 w-2 bg-gradient-to-r from-black/60 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-3">
                      <div className="font-display font-bold text-xs leading-tight text-white line-clamp-2">
                        {g.title}
                      </div>
                    </div>
                  </Link>
                  <button
                    onClick={() => onRemove(g.id)}
                    className="absolute -top-2 -right-2 w-6 h-6 grid place-items-center bg-background border border-border rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive hover:text-destructive-foreground hover:border-destructive"
                    aria-label="Remove from vault"
                  >
                    ×
                  </button>
                </motion.div>
              ))}
              {/* fill empty slots */}
              {Array.from({ length: 6 - shelf.length }).map((_, i) => (
                <div
                  key={`empty-${i}`}
                  className="aspect-[2/3] border border-dashed border-border/50 rounded-sm"
                />
              ))}
            </div>

            {/* wooden shelf bar */}
            <div className="mt-2 h-2 bg-gradient-to-b from-border to-transparent rounded-sm" />
            <div className="h-1 bg-background/40 blur-sm" />
          </div>
        </div>
      ))}
    </section>
  );
}