import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef } from "react";
import { getGame, type Game, PLACEHOLDER_IMG } from "@/data/games";
import { fetchSteamGame } from "@/lib/steamApi";
import { PlatformBadges } from "@/components/PlatformBadges";
import { useVault } from "@/hooks/useTheme";

export const Route = createFileRoute("/game/$id")({
  loader: async ({ params }) => {
    // Local DB hit first.
    const local = getGame(params.id);
    if (local) return { game: local };
    // Live Steam fetch for `steam-<appid>` ids.
    const m = params.id.match(/^steam-(\d+)$/);
    if (m) {
      const remote = await fetchSteamGame(Number(m[1]));
      if (remote) return { game: remote };
    }
    throw notFound();
  },
  head: ({ loaderData }) => {
    const g = loaderData?.game;
    if (!g) return { meta: [{ title: "Game not found" }] };
    return {
      meta: [
        { title: `${g.title} — PLAY RIFT` },
        { name: "description", content: g.tagline + " " + g.description.slice(0, 120) },
        { property: "og:title", content: `${g.title} — PLAY RIFT` },
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
  const [trailerOpen, setTrailerOpen] = useState(false);
  const [muted, setMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const inVault = has(game.id);
  const hasMp4 = !!game.trailerMp4;
  const hasYt = !!game.trailerYoutubeId;

  return (
    <div>
      {/* Cinematic hero / "trailer" */}
      <section className="relative h-[80vh] min-h-[600px] overflow-hidden">
        {hasMp4 ? (
          <video
            ref={videoRef}
            src={game.trailerMp4}
            poster={game.hero}
            autoPlay
            loop
            muted={muted}
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <motion.img
            src={game.hero}
            alt={game.title}
            initial={{ scale: 1.2 }}
            animate={{ scale: 1.05 }}
            transition={{ duration: 14, ease: "easeOut", repeat: Infinity, repeatType: "reverse" }}
            onError={(e) => {
              const img = e.currentTarget;
              if (img.src !== PLACEHOLDER_IMG) img.src = PLACEHOLDER_IMG;
            }}
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />
        <div className="absolute inset-0 scanlines opacity-30 pointer-events-none" />

        {/* trailer controls */}
        {(hasMp4 || hasYt) && (
          <div className="absolute top-6 right-6 flex gap-2 z-10">
            {hasMp4 && (
              <button
                onClick={() => {
                  setMuted((m) => !m);
                  if (videoRef.current) videoRef.current.muted = !muted ? false : true;
                }}
                className="px-3 py-2 text-[10px] tracking-[0.25em] font-display font-bold rounded-sm bg-black/60 backdrop-blur border border-white/20 text-white hover:border-[var(--neon-1)]"
              >
                {muted ? "🔇 UNMUTE" : "🔊 MUTE"}
              </button>
            )}
            <button
              onClick={() => setTrailerOpen(true)}
              className="px-3 py-2 text-[10px] tracking-[0.25em] font-display font-bold rounded-sm bg-[var(--neon-1)] text-black hover:scale-105 transition-transform"
            >
              ▶ FULL TRAILER
            </button>
          </div>
        )}

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
                onError={(e) => {
                  const img = e.currentTarget;
                  if (img.src !== PLACEHOLDER_IMG) img.src = PLACEHOLDER_IMG;
                }}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {game.screenshots.map((src: string, i: number) => (
                <button
                  key={`${src}-${i}`}
                  onClick={() => setShotIdx(i)}
                  className={`aspect-video overflow-hidden rounded-sm border-2 transition-all ${
                    i === shotIdx ? "border-foreground" : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                >
                  <img
                    src={src}
                    alt=""
                    onError={(e) => {
                      const img = e.currentTarget;
                      if (img.src !== PLACEHOLDER_IMG) img.src = PLACEHOLDER_IMG;
                    }}
                    className="w-full h-full object-cover"
                  />
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
            {game.osSupport && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {game.osSupport.windows && <OsBadge label="WINDOWS" />}
                {game.osSupport.mac && <OsBadge label="MACOS" />}
                {game.osSupport.linux && <OsBadge label="LINUX / STEAMOS" />}
              </div>
            )}
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

          {game.tags && game.tags.length > 0 && (
            <Module label="STEAM TAGS">
              <div className="flex flex-wrap gap-1.5">
                {game.tags.map((t: string) => (
                  <span
                    key={t}
                    className="text-[10px] tracking-wider font-display px-2 py-1 rounded-sm bg-secondary/60 text-foreground/80"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </Module>
          )}
        </aside>
      </section>

      {/* Trailer modal */}
      <AnimatePresence>
        {trailerOpen && (hasMp4 || hasYt) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setTrailerOpen(false)}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm grid place-items-center p-6"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-5xl aspect-video rounded-md overflow-hidden border border-border shadow-2xl"
            >
              {hasMp4 ? (
                <video
                  src={game.trailerMp4}
                  poster={game.hero}
                  autoPlay
                  controls
                  className="w-full h-full bg-black"
                />
              ) : (
                <iframe
                  title={`${game.title} trailer`}
                  src={`https://www.youtube-nocookie.com/embed/${game.trailerYoutubeId}?autoplay=1&rel=0&modestbranding=1`}
                  allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                  allowFullScreen
                  className="w-full h-full"
                  frameBorder={0}
                />
              )}
              <button
                onClick={() => setTrailerOpen(false)}
                className="absolute top-3 right-3 w-9 h-9 grid place-items-center rounded-full bg-black/70 border border-white/20 text-white hover:bg-black"
                aria-label="Close trailer"
              >
                ✕
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function OsBadge({ label }: { label: string }) {
  return (
    <span className="text-[9px] px-2 py-0.5 font-display tracking-wider font-bold rounded-sm border border-[var(--neon-4)]/40 text-[var(--neon-4)] bg-[var(--neon-4)]/5">
      {label}
    </span>
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