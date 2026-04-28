import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { getGame, type Game } from "@/data/games";
import { PlatformBadges } from "@/components/PlatformBadges";
import { useVault } from "@/hooks/useTheme";

export const Route = createFileRoute("/game/$id")({
  loader: ({ params }) => {
    const game = getGame(params.id);
    if (!game) throw notFound();
    return { game };
  },
  head: ({ loaderData }) => {
    const g = loaderData?.game;
    if (!g) return { meta: [{ title: "Game not found" }] };
    return {
      meta: [
        { title: `${g.title} — NULLCADE` },
        { name: "description", content: g.tagline + " " + g.description.slice(0, 120) },
        { property: "og:title", content: `${g.title} — NULLCADE` },
        { property: "og:description", content: g.tagline },
        { property: "og:image", content: g.hero },
        { name: "twitter:image", content: g.hero },
      ],
    };
  },
  notFoundComponent: () => (
    <div className="mx-auto max-w-xl px-6 py-32 text-center">
      <h1 className="font-display font-black text-5xl mb-3">404</h1>
      <p className="text-muted-foreground mb-6">Game not in the database.</p>
      <Link to="/" className="underline">
        Back to discover
      </Link>
    </div>
  ),
  errorComponent: ({ error, reset }) => (
    <div className="mx-auto max-w-xl px-6 py-32 text-center">
      <h1 className="font-display font-black text-3xl mb-3">Something went wrong</h1>
      <p className="text-muted-foreground mb-6">{error.message}</p>
      <button onClick={reset} className="underline">Try again</button>
    </div>
  ),
  component: GameDetail,
});

function GameDetail() {
  const { game } = Route.useLoaderData();
  const { has, toggle } = useVault();
  const [shotIdx, setShotIdx] = useState(0);
  const inVault = has(game.id);

  return (
    <div>
      {/* Cinematic hero / "trailer" */}
      <section className="relative h-[80vh] min-h-[600px] overflow-hidden">
        <motion.img
          src={game.hero}
          alt={game.title}
          initial={{ scale: 1.2 }}
          animate={{ scale: 1.05 }}
          transition={{ duration: 14, ease: "easeOut", repeat: Infinity, repeatType: "reverse" }}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />
        <div className="absolute inset-0 scanlines opacity-30 pointer-events-none" />

        {/* play overlay */}
        <div className="absolute inset-0 grid place-items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="w-20 h-20 rounded-full border-2 border-white/40 grid place-items-center backdrop-blur-md bg-black/30 hover:scale-110 hover:border-[var(--neon-1)] transition-all cursor-pointer"
          >
            <div className="w-0 h-0 border-y-[10px] border-y-transparent border-l-[16px] border-l-white ml-1" />
          </motion.div>
        </div>

        <div className="absolute inset-x-0 bottom-0 p-8">
          <div className="mx-auto max-w-[1400px]">
            <Link
              to="/"
              className="inline-block mb-4 text-[10px] tracking-[0.3em] font-display text-muted-foreground hover:text-foreground"
            >
              ◂ BACK TO DISCOVER
            </Link>
            <div className="text-[10px] tracking-[0.3em] font-display text-muted-foreground mb-2">
              {game.studio.toUpperCase()} · {game.year} · {game.genres.join(" / ").toUpperCase()}
            </div>
            <h1 className="font-display font-black text-5xl md:text-7xl text-glow leading-[0.9]">
              {game.title}
            </h1>
          </div>
        </div>
      </section>

      {/* Action row */}
      <section className="mx-auto max-w-[1400px] px-6 -mt-2 mb-12 flex flex-wrap items-center gap-3">
        <button
          onClick={() => toggle(game.id)}
          className={`px-6 py-3 font-display font-bold text-xs tracking-[0.25em] rounded-sm border transition-all ${
            inVault
              ? "bg-foreground text-background border-foreground"
              : "border-border hover:border-foreground"
          }`}
        >
          {inVault ? "✓ IN VAULT" : "+ ADD TO VAULT"}
        </button>
        <span className="px-6 py-3 font-display font-bold text-xs tracking-[0.25em] rounded-sm border border-border">
          {game.price}
        </span>
        {game.rating > 0 && (
          <span className="px-6 py-3 font-display font-bold text-xs tracking-[0.25em] rounded-sm bg-[var(--neon-4)] text-black">
            ★ {game.rating} / 100
          </span>
        )}
      </section>

      {/* Body grid */}
      <section className="mx-auto max-w-[1400px] px-6 pb-32 grid lg:grid-cols-3 gap-8">
        {/* Left main */}
        <div className="lg:col-span-2 space-y-10">
          {/* About */}
          <Module label="ABOUT">
            <p className="text-lg leading-relaxed text-foreground/90 italic mb-3">
              "{game.tagline}"
            </p>
            <p className="text-muted-foreground leading-relaxed">{game.description}</p>
          </Module>

          {/* Screenshots */}
          <Module label="MEDIA">
            <div className="aspect-video rounded-md overflow-hidden mb-3 bg-card">
              <img
                src={game.screenshots[shotIdx]}
                alt={`Screenshot ${shotIdx + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {game.screenshots.map((src: string, i: number) => (
                <button
                  key={src}
                  onClick={() => setShotIdx(i)}
                  className={`aspect-video overflow-hidden rounded-sm border-2 transition-all ${
                    i === shotIdx ? "border-foreground" : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                >
                  <img src={src} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </Module>

          {/* System Requirements */}
          <Module label="SYSTEM REQUIREMENTS">
            <WillItRun game={game} />
            <div className="grid md:grid-cols-2 gap-4 mt-5">
              <SpecBlock title="MINIMUM" specs={game.systemReq.minimum} />
              <SpecBlock title="RECOMMENDED" specs={game.systemReq.recommended} accent />
            </div>
          </Module>
        </div>

        {/* Right sidebar */}
        <aside className="space-y-6">
          <Module label="AVAILABILITY">
            <PlatformBadges game={game} size="md" />
          </Module>

          <Module label="MOD SUPPORT">
            <ModBadge status={game.modSupport} />
          </Module>

          <Module label="DETAILS">
            <dl className="text-sm space-y-3">
              <Row k="Release" v={new Date(game.releaseDate).toLocaleDateString("en", { month: "long", day: "numeric", year: "numeric" })} />
              <Row k="Studio" v={game.studio} />
              <Row k="Status" v={game.status === "upcoming" ? "Upcoming" : "Released"} />
              {game.hype !== undefined && <Row k="Hype Score" v={`${game.hype} / 100`} />}
            </dl>
          </Module>

          <Module label="GENRES">
            <div className="flex flex-wrap gap-1.5">
              {game.genres.map((g: string) => (
                <span
                  key={g}
                  className="text-[10px] tracking-wider font-display font-bold px-2.5 py-1 border border-border rounded-sm"
                >
                  {g.toUpperCase()}
                </span>
              ))}
            </div>
          </Module>
        </aside>
      </section>
    </div>
  );
}

function Module({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5 }}
      className="bg-card border border-border rounded-md p-6"
    >
      <div className="text-[10px] tracking-[0.35em] font-display font-bold text-muted-foreground mb-4 flex items-center gap-2">
        <span className="w-1 h-1 rounded-full bg-[var(--neon-1)]" />
        // {label}
      </div>
      {children}
    </motion.section>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between items-baseline gap-3 border-b border-border/50 pb-2 last:border-0">
      <dt className="text-muted-foreground text-xs tracking-wider uppercase">{k}</dt>
      <dd className="text-right font-display font-semibold text-sm">{v}</dd>
    </div>
  );
}

function SpecBlock({
  title,
  specs,
  accent,
}: {
  title: string;
  specs: Game["systemReq"]["minimum"];
  accent?: boolean;
}) {
  return (
    <div
      className={`rounded-sm p-4 border ${
        accent ? "border-[var(--neon-1)]/40 bg-[var(--neon-1)]/5" : "border-border bg-secondary/30"
      }`}
    >
      <div className={`text-[10px] tracking-[0.3em] font-display font-bold mb-3 ${accent ? "text-[var(--neon-1)]" : "text-muted-foreground"}`}>
        {title}
      </div>
      <dl className="space-y-2 text-xs">
        <Spec k="OS" v={specs.os} />
        <Spec k="CPU" v={specs.cpu} />
        <Spec k="GPU" v={specs.gpu} />
        <Spec k="RAM" v={specs.ram} />
        <Spec k="STORAGE" v={specs.storage} />
      </dl>
    </div>
  );
}

function Spec({ k, v }: { k: string; v: string }) {
  return (
    <div className="grid grid-cols-[60px_1fr] gap-2">
      <dt className="text-muted-foreground tracking-wider font-display">{k}</dt>
      <dd className="text-foreground/90">{v}</dd>
    </div>
  );
}

function WillItRun({ game }: { game: Game }) {
  const score = game.willItRun;
  const verdict =
    score >= 85 ? "RUNS FLAWLESSLY" : score >= 65 ? "RUNS WELL" : score >= 45 ? "DEMANDING" : "BRUTAL";
  const color =
    score >= 85 ? "var(--neon-4)" : score >= 65 ? "var(--neon-1)" : score >= 45 ? "#ffaa00" : "#ff3355";

  return (
    <div className="rounded-sm p-4 border border-border bg-background/40 relative overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-30" />
      <div className="relative flex items-center gap-5">
        <div className="relative w-20 h-20 shrink-0">
          <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
            <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeOpacity="0.15" strokeWidth="6" />
            <motion.circle
              cx="50"
              cy="50"
              r="42"
              fill="none"
              stroke={color}
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 42}
              initial={{ strokeDashoffset: 2 * Math.PI * 42 }}
              whileInView={{ strokeDashoffset: 2 * Math.PI * 42 * (1 - score / 100) }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              style={{ filter: `drop-shadow(0 0 6px ${color})` }}
            />
          </svg>
          <div className="absolute inset-0 grid place-items-center font-display font-black text-xl">
            {score}
          </div>
        </div>
        <div>
          <div className="text-[10px] tracking-[0.3em] font-display text-muted-foreground mb-1">
            WILL IT RUN?
          </div>
          <div className="font-display font-black text-2xl" style={{ color }}>
            {verdict}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            Mock score based on average mid-range hardware (RTX 3060 / Ryzen 5).
          </div>
        </div>
      </div>
    </div>
  );
}

function ModBadge({ status }: { status: Game["modSupport"] }) {
  const cfg = {
    "Highly Moddable": { color: "var(--neon-4)", icon: "▲" },
    Moderate: { color: "var(--neon-1)", icon: "◆" },
    Restricted: { color: "#ffaa00", icon: "■" },
    "No Mod Support": { color: "#ff3355", icon: "✕" },
  }[status];

  return (
    <div className="flex items-center gap-3">
      <div
        className="w-10 h-10 grid place-items-center rounded-sm font-display font-black"
        style={{ background: cfg.color, color: "#000", boxShadow: `0 0 18px ${cfg.color}80` }}
      >
        {cfg.icon}
      </div>
      <div>
        <div className="font-display font-bold text-sm" style={{ color: cfg.color }}>
          {status.toUpperCase()}
        </div>
        <div className="text-[11px] text-muted-foreground tracking-wider">
          Community modding status
        </div>
      </div>
    </div>
  );
}