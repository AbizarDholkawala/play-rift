import { Link, useLocation } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useTheme, useVault } from "@/hooks/useTheme";

const links = [
  { to: "/", label: "DISCOVER" },
  { to: "/radar", label: "RADAR" },
  { to: "/vault", label: "VAULT" },
] as const;

export function Nav() {
  const { mode, toggle } = useTheme();
  const { ids } = useVault();
  const loc = useLocation();

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/70 border-b border-border">
      <div className="mx-auto max-w-[1400px] px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <motion.div
            initial={{ rotate: 0 }}
            whileHover={{ rotate: 90 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="w-8 h-8 grid place-items-center"
          >
            <div className="w-5 h-5 border-2 border-foreground rotate-45 relative">
              <div className="absolute inset-1 bg-foreground" />
            </div>
          </motion.div>
          <span className="font-display text-lg tracking-[0.2em] font-bold">
            PLAY<span className="rgb-gradient-text"> RIFT</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {links.map((l) => {
            const active =
              l.to === "/" ? loc.pathname === "/" : loc.pathname.startsWith(l.to);
            return (
              <Link
                key={l.to}
                to={l.to}
                className="relative px-4 py-2 text-xs tracking-[0.2em] font-display font-semibold text-muted-foreground hover:text-foreground transition-colors"
              >
                {l.label}
                {l.to === "/vault" && ids.length > 0 && (
                  <span className="ml-1.5 inline-flex items-center justify-center w-5 h-5 text-[10px] rounded-full bg-accent text-accent-foreground">
                    {ids.length}
                  </span>
                )}
                {active && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute left-3 right-3 -bottom-px h-px bg-foreground"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <button
          onClick={toggle}
          className="group flex items-center gap-2 px-3 py-2 text-[10px] tracking-[0.25em] font-display font-bold border border-border hover:border-foreground transition-colors rounded-sm"
          aria-label="Toggle theme"
        >
          <span
            className={`w-2 h-2 rounded-full transition-colors ${
              mode === "rgb"
                ? "bg-[var(--neon-2)] shadow-[0_0_10px_var(--neon-2)]"
                : "bg-foreground"
            }`}
          />
          {mode === "rgb" ? "RGB" : "NOIR"}
        </button>
      </div>
    </header>
  );
}