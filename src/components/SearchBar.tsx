import { useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useMemo, useState, useRef, useEffect } from "react";
import { GAMES } from "@/data/games";

export function SearchBar({ autoFocus = false }: { autoFocus?: boolean }) {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const ref = useRef<HTMLDivElement>(null);

  const results = useMemo(() => {
    if (!q.trim()) return [];
    const s = q.toLowerCase();
    return GAMES.filter(
      (g) =>
        g.title.toLowerCase().includes(s) ||
        g.studio.toLowerCase().includes(s) ||
        g.genres.some((x) => x.toLowerCase().includes(s)),
    ).slice(0, 6);
  }, [q]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div ref={ref} className="relative w-full max-w-2xl">
      <div className="relative neon-border rounded-md">
        <div className="flex items-center gap-3 bg-card/80 backdrop-blur-xl border border-border rounded-md px-5 py-4">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted-foreground">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            autoFocus={autoFocus}
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            placeholder="SEARCH THE DATABASE — try 'cyberpunk', 'horror', 'rockstar'…"
            className="flex-1 bg-transparent outline-none text-sm tracking-wide placeholder:text-muted-foreground/60 placeholder:font-display placeholder:text-[11px] placeholder:tracking-[0.2em]"
          />
          <kbd className="hidden md:inline-flex text-[10px] font-display font-bold tracking-wider px-2 py-1 border border-border rounded text-muted-foreground">
            ⌘ K
          </kbd>
        </div>
      </div>

      <AnimatePresence>
        {open && results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 left-0 right-0 mt-2 bg-popover border border-border rounded-md overflow-hidden shadow-2xl"
          >
            {results.map((g) => (
              <button
                key={g.id}
                onClick={() => {
                  navigate({ to: "/game/$id", params: { id: g.id } });
                  setOpen(false);
                  setQ("");
                }}
                className="w-full flex items-center gap-3 p-3 hover:bg-secondary transition-colors text-left"
              >
                <img src={g.cover} alt="" className="w-12 h-16 object-cover rounded-sm" />
                <div className="flex-1 min-w-0">
                  <div className="font-display font-bold text-sm truncate">{g.title}</div>
                  <div className="text-[11px] text-muted-foreground tracking-wider">
                    {g.studio} · {g.year} · {g.genres[0]}
                  </div>
                </div>
                <span className="text-[10px] font-display tracking-wider text-muted-foreground">
                  {g.status === "upcoming" ? "UPCOMING" : g.rating ? `${g.rating}` : "—"}
                </span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}