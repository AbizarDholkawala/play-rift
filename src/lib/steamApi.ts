import type { Game, ModSupport, Platform } from "@/data/games";
import { PLACEHOLDER_IMG } from "@/data/games";

// Steam Store endpoints are keyless but lack CORS headers.
// We tunnel them through public CORS proxies, with fallback chain.
const STEAM = "https://store.steampowered.com/api";
const CDN = "https://shared.steamstatic.com/store_item_assets/steam/apps";

// Ordered list — cors.eu.org is currently the most reliable keyless proxy.
const PROXIES = [
  (url: string) => `https://cors.eu.org/${url}`,
  (url: string) =>
    `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
];

async function proxiedFetch(url: string): Promise<Response | null> {
  for (const wrap of PROXIES) {
    try {
      const res = await fetch(wrap(url));
      if (!res.ok) continue;
      // Steam returns JSON; some proxies return HTML error pages with 200.
      const ct = res.headers.get("content-type") || "";
      if (ct.includes("text/html")) continue;
      return res;
    } catch {
      // try next proxy
    }
  }
  return null;
}

export interface SteamSearchHit {
  appId: number;
  name: string;
  cover: string;
  year?: string;
  metascore?: string;
  price?: string;
}

/** Live keyless search against Steam's public storesearch endpoint. */
export async function searchSteam(term: string, limit = 6): Promise<SteamSearchHit[]> {
  const q = term.trim();
  if (!q) return [];
  try {
    const url = `${STEAM}/storesearch/?term=${encodeURIComponent(q)}&l=en&cc=us`;
    const res = await proxiedFetch(url);
    if (!res) return [];
    const data = await res.json();
    const items: any[] = data.items ?? [];
    return items
      .filter((i) => i.type === "app" && i.id)
      .slice(0, limit)
      .map((i) => ({
        appId: i.id,
        name: i.name,
        cover: `${CDN}/${i.id}/library_600x900.jpg`,
        metascore: i.metascore || undefined,
        price:
          i.price?.final != null
            ? `$${(i.price.final / 100).toFixed(2)}`
            : undefined,
      }));
  } catch {
    return [];
  }
}

/** Strip Steam's HTML requirement blob into clean labelled rows. */
function parseRequirements(html: string | undefined) {
  const out = { os: "—", cpu: "—", gpu: "—", ram: "—", storage: "—" };
  if (!html) return out;
  const text = html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ");
  const grab = (label: RegExp) => {
    const m = text.match(label);
    return m ? m[1].trim().replace(/\s+/g, " ") : undefined;
  };
  out.os = grab(/OS[^:]*:\s*([^\n]+)/i) ?? out.os;
  out.cpu = grab(/Processor[^:]*:\s*([^\n]+)/i) ?? out.cpu;
  out.gpu = grab(/Graphics[^:]*:\s*([^\n]+)/i) ?? out.gpu;
  out.ram = grab(/Memory[^:]*:\s*([^\n]+)/i) ?? out.ram;
  out.storage = grab(/Storage[^:]*:\s*([^\n]+)/i) ?? out.storage;
  return out;
}

/** Heuristic: derive mod-support tier from Steam categories. */
function inferModSupport(categories: any[] | undefined): ModSupport {
  const names = (categories ?? []).map((c) => String(c.description).toLowerCase());
  if (names.some((n) => n.includes("workshop") || n.includes("includes level editor"))) {
    return "Highly Moddable";
  }
  if (names.some((n) => n.includes("mod") || n.includes("editor"))) return "Moderate";
  if (names.some((n) => n.includes("anti-cheat") || n.includes("vac"))) return "Restricted";
  return "No Mod Support";
}

/** Heuristic "Will it run?" score from min vs recommended GPU presence. */
function inferWillItRun(req: ReturnType<typeof parseRequirements>) {
  const gpu = req.gpu.toLowerCase();
  if (/rtx\s*40|rx\s*7\d{3}/.test(gpu)) return 55;
  if (/rtx\s*30|rx\s*6\d{3}/.test(gpu)) return 70;
  if (/rtx\s*20|gtx\s*16|rx\s*5\d{3}/.test(gpu)) return 82;
  if (/gtx\s*10|rx\s*[45]\d{2}/.test(gpu)) return 92;
  return 78;
}

function platformsFrom(p: any | undefined): Platform[] {
  const out: Platform[] = [];
  if (p?.windows || p?.mac || p?.linux) out.push("steam");
  return out.length ? out : ["steam"];
}

/** Hydrate a full Game record live from Steam appdetails. */
export async function fetchSteamGame(appId: number): Promise<Game | null> {
  try {
    const url = `${STEAM}/appdetails?appids=${appId}&l=en&cc=us`;
    const res = await proxiedFetch(url);
    if (!res) return null;
    const json = await res.json();
    const entry = json[String(appId)];
    if (!entry?.success || !entry.data) return null;
    const d = entry.data;

    const min = parseRequirements(d.pc_requirements?.minimum);
    const rec = parseRequirements(d.pc_requirements?.recommended);
    const screenshots: string[] =
      (d.screenshots ?? []).slice(0, 8).map((s: any) => s.path_full).filter(Boolean);
    const trailer = (d.movies ?? [])[0];
    const release: string = d.release_date?.date ?? "";
    const parsedDate = release ? new Date(release) : null;
    const validDate = parsedDate && !isNaN(parsedDate.getTime()) ? parsedDate : null;

    const game: Game = {
      id: `steam-${appId}`,
      steamAppId: appId,
      title: d.name,
      studio: (d.developers ?? d.publishers ?? ["Unknown"])[0],
      year: validDate ? validDate.getFullYear() : new Date().getFullYear(),
      releaseDate: validDate ? validDate.toISOString().slice(0, 10) : "",
      status: d.release_date?.coming_soon ? "upcoming" : "released",
      genres: (d.genres ?? []).map((g: any) => g.description),
      tagline: d.short_description?.slice(0, 100) ?? d.name,
      description:
        (d.short_description as string) ||
        (d.about_the_game as string)?.replace(/<[^>]+>/g, "").slice(0, 400) ||
        "No description available.",
      cover: `${CDN}/${appId}/library_600x900.jpg`,
      hero: `${CDN}/${appId}/library_hero.jpg`,
      screenshots: screenshots.length
        ? screenshots
        : [`${CDN}/${appId}/library_hero.jpg`, `${CDN}/${appId}/header.jpg`],
      trailerPoster: `${CDN}/${appId}/library_hero.jpg`,
      trailerYoutubeId: undefined,
      trailerMp4: trailer?.mp4?.max ?? trailer?.mp4?.["480"],
      tags: (d.categories ?? []).map((c: any) => c.description).slice(0, 16),
      osSupport: {
        windows: !!d.platforms?.windows,
        mac: !!d.platforms?.mac,
        linux: !!d.platforms?.linux,
      },
      price: d.is_free
        ? "Free"
        : d.price_overview?.final_formatted ?? "TBA",
      rating: d.metacritic?.score ?? 0,
      platforms: platformsFrom(d.platforms),
      gamePassTier: null,
      drmFree: false,
      modSupport: inferModSupport(d.categories),
      systemReq: { minimum: min, recommended: rec },
      willItRun: inferWillItRun(rec.gpu === "—" ? min : rec),
      hype: d.release_date?.coming_soon ? 80 : undefined,
    };
    return game;
  } catch {
    return null;
  }
}

export { PLACEHOLDER_IMG };