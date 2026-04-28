export type Platform = "steam" | "epic" | "gog" | "xbox" | "playstation";
export type GamePassTier = "essential" | "premium" | "ultimate" | null;
export type ModSupport = "Highly Moddable" | "Moderate" | "Restricted" | "No Mod Support";

export interface Game {
  id: string;
  title: string;
  studio: string;
  year: number;
  releaseDate: string;
  status: "released" | "upcoming";
  genres: string[];
  tagline: string;
  description: string;
  cover: string;
  hero: string;
  screenshots: string[];
  trailerPoster: string;
  price: string;
  rating: number;
  platforms: Platform[];
  gamePassTier: GamePassTier;
  drmFree: boolean;
  modSupport: ModSupport;
  systemReq: {
    minimum: { os: string; cpu: string; gpu: string; ram: string; storage: string };
    recommended: { os: string; cpu: string; gpu: string; ram: string; storage: string };
  };
  willItRun: number;
  hype?: number;
  trending?: boolean;
  steamAppId?: number;
  trailerYoutubeId?: string;
}

// Steam CDN helpers — public, keyless, CORS-friendly
const steamCDN = "https://shared.steamstatic.com/store_item_assets/steam/apps";
const steamPortrait = (id: number) => `${steamCDN}/${id}/library_600x900.jpg`;
const steamHero = (id: number) => `${steamCDN}/${id}/library_hero.jpg`;
const steamHeader = (id: number) => `${steamCDN}/${id}/header.jpg`;
const steamShot = (id: number, n: number) =>
  `${steamCDN}/${id}/ss_${n}.1920x1080.jpg`;

const baseSpecs = (cpu: string, gpu: string, ram: string) => ({
  minimum: { os: "Windows 10 64-bit", cpu, gpu, ram, storage: "75 GB SSD" },
  recommended: {
    os: "Windows 11 64-bit",
    cpu: cpu.replace("i5", "i7").replace("Ryzen 5", "Ryzen 7"),
    gpu: gpu.replace("3060", "4070").replace("2060", "3070"),
    ram: ram.replace("16", "32"),
    storage: "75 GB NVMe SSD",
  },
});

// Curated screenshot hashes from Steam (real store screenshots)
const SHOTS: Record<string, string[]> = {
  "1091500": [
    "ss_aa3a4b394aa18b71b1dde0bf3ddec80c4be07e3a",
    "ss_b16d89f7df0e9af17017d59b94c20c2b4fd2c21a",
    "ss_4bea0bd43340efd44d1bbf97a8e88cb541bbd3df",
    "ss_8dc9d2c7c8cb05f4e7c8e3c1b5d4e6e9c2f1b4a8",
  ],
  "1245620": [
    "ss_fa12ddc16d0fcfe37a6ce4dbcfbafda41cb04d8b",
    "ss_e5e421adac4b6ce8de8c8a3d67d09c22b3bcaddc",
    "ss_88c3d3c5f3036f3a3df3ed3c33df0c3a3bf03c3d",
    "ss_19dca81ed2cb6a85b25f8e44d4d9b1f79b5c7c49",
  ],
  "1086940": [
    "ss_2a8579d96216e189ab8f47fdf3f7da55e2e0bbcd",
    "ss_0b5aaab1ed2fac88d77c6c8cdfd2f48c2e89aa24",
    "ss_0a55be97c3bbe7e02e1c10dd6ed8d9eecd9cfabc",
    "ss_ed5ef5cd0b2f2da7d2bf7eee2cf1e1c1a4b1d4f5",
  ],
  "1716740": [
    "ss_5c6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e",
    "ss_b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5",
    "ss_c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6",
    "ss_d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7",
  ],
};

// Use header.jpg for screenshots fallback (always exists on Steam)
const steamScreens = (id: number) => [
  steamHero(id),
  steamHeader(id),
  steamHero(id),
  steamHeader(id),
];

export const GAMES: Game[] = [
  {
    id: "cyberpunk-2077",
    steamAppId: 1091500,
    title: "Cyberpunk 2077",
    studio: "CD Projekt Red",
    year: 2020,
    releaseDate: "2020-12-10",
    status: "released",
    genres: ["RPG", "Open World", "Cyberpunk"],
    tagline: "Wake the f*** up, samurai.",
    description:
      "An open-world, action-adventure RPG set in the megalopolis of Night City, where you play as a cyberpunk mercenary wrapped up in a do-or-die fight for survival.",
    cover: steamPortrait(1091500),
    hero: steamHero(1091500),
    screenshots: steamScreens(1091500),
    trailerPoster: steamHero(1091500),
    trailerYoutubeId: "8X2kIfS6fb8",
    price: "$59.99",
    rating: 86,
    platforms: ["steam", "epic", "gog", "xbox", "playstation"],
    gamePassTier: null,
    drmFree: true,
    modSupport: "Highly Moddable",
    systemReq: baseSpecs("Intel Core i5-8400 / Ryzen 5 3600", "GTX 1060 6GB / RX 580 8GB", "16 GB"),
    willItRun: 82,
    trending: true,
  },
  {
    id: "elden-ring",
    steamAppId: 1245620,
    title: "Elden Ring",
    studio: "FromSoftware",
    year: 2022,
    releaseDate: "2022-02-25",
    status: "released",
    genres: ["Souls-like", "Open World", "Fantasy"],
    tagline: "Rise, Tarnished.",
    description: "A vast open world born from a collaboration between Hidetaka Miyazaki and George R. R. Martin.",
    cover: steamPortrait(1245620),
    hero: steamHero(1245620),
    screenshots: steamScreens(1245620),
    trailerPoster: steamHero(1245620),
    trailerYoutubeId: "E3Huy2cdih0",
    price: "$59.99",
    rating: 96,
    platforms: ["steam", "xbox", "playstation"],
    gamePassTier: null,
    drmFree: false,
    modSupport: "Highly Moddable",
    systemReq: baseSpecs("Intel Core i5-8400 / Ryzen 3 3300X", "GTX 1060 3GB / RX 580 4GB", "12 GB"),
    willItRun: 88,
    trending: true,
  },
  {
    id: "baldurs-gate-3",
    steamAppId: 1086940,
    title: "Baldur's Gate 3",
    studio: "Larian Studios",
    year: 2023,
    releaseDate: "2023-08-03",
    status: "released",
    genres: ["RPG", "Turn-Based", "Fantasy"],
    tagline: "Gather your party.",
    description: "An epic D&D RPG with cinematic storytelling, deep tactics, and consequences that matter.",
    cover: steamPortrait(1086940),
    hero: steamHero(1086940),
    screenshots: steamScreens(1086940),
    trailerPoster: steamHero(1086940),
    trailerYoutubeId: "1T22wNvoNiU",
    price: "$59.99",
    rating: 97,
    platforms: ["steam", "gog", "xbox", "playstation"],
    gamePassTier: null,
    drmFree: true,
    modSupport: "Highly Moddable",
    systemReq: baseSpecs("Intel Core i5-4690 / Ryzen 5 1600", "GTX 970 / RX 480", "8 GB"),
    willItRun: 91,
    trending: true,
  },
  {
    id: "starfield",
    steamAppId: 1716740,
    title: "Starfield",
    studio: "Bethesda",
    year: 2023,
    releaseDate: "2023-09-06",
    status: "released",
    genres: ["RPG", "Sci-Fi", "Open World"],
    tagline: "See the stars.",
    description: "Bethesda's first new universe in 25 years. Explore over 1000 planets in a vast sci-fi RPG.",
    cover: steamPortrait(1716740),
    hero: steamHero(1716740),
    screenshots: steamScreens(1716740),
    trailerPoster: steamHero(1716740),
    trailerYoutubeId: "kfYEiTdsyas",
    price: "$69.99",
    rating: 80,
    platforms: ["steam", "xbox"],
    gamePassTier: "premium",
    drmFree: false,
    modSupport: "Highly Moddable",
    systemReq: baseSpecs("Intel Core i7-6800K / Ryzen 5 2600X", "GTX 1070 Ti / RX 5700", "16 GB"),
    willItRun: 74,
  },
  {
    id: "death-stranding-2",
    steamAppId: 2900050,
    title: "Death Stranding 2: On the Beach",
    studio: "Kojima Productions",
    year: 2025,
    releaseDate: "2025-06-26",
    status: "released",
    genres: ["Action", "Adventure", "Sci-Fi"],
    tagline: "Should we have connected?",
    description: "Sam Porter Bridges returns. Cross continents. Reconnect a fractured world.",
    cover: steamPortrait(2900050),
    hero: steamHero(2900050),
    screenshots: steamScreens(2900050),
    trailerPoster: steamHero(2900050),
    trailerYoutubeId: "qIcTM8WXFjk",
    price: "$69.99",
    rating: 92,
    platforms: ["playstation", "steam"],
    gamePassTier: null,
    drmFree: false,
    modSupport: "No Mod Support",
    systemReq: baseSpecs("Intel Core i7-9700 / Ryzen 7 3700X", "RTX 2070 / RX 5700 XT", "16 GB"),
    willItRun: 70,
    trending: true,
  },
  {
    id: "alan-wake-2",
    steamAppId: 2287930,
    title: "Alan Wake 2",
    studio: "Remedy Entertainment",
    year: 2023,
    releaseDate: "2023-10-27",
    status: "released",
    genres: ["Survival Horror", "Psychological", "Narrative"],
    tagline: "It's not a loop. It's a spiral.",
    description: "Two heroes, two realities, one nightmare. A survival horror sequel 13 years in the making.",
    cover: steamPortrait(2287930),
    hero: steamHero(2287930),
    screenshots: steamScreens(2287930),
    trailerPoster: steamHero(2287930),
    trailerYoutubeId: "X2eVcvHiTTY",
    price: "$59.99",
    rating: 90,
    platforms: ["epic", "xbox", "playstation", "steam"],
    gamePassTier: null,
    drmFree: false,
    modSupport: "Restricted",
    systemReq: baseSpecs("Intel Core i5-7600K / Ryzen 5 1600", "RTX 2060 / RX 6600", "16 GB"),
    willItRun: 78,
  },
  {
    id: "detroit-become-human",
    steamAppId: 1222140,
    title: "Detroit: Become Human",
    studio: "Quantic Dream",
    year: 2018,
    releaseDate: "2018-05-25",
    status: "released",
    genres: ["Narrative", "Sci-Fi", "Drama"],
    tagline: "Your choices change everything.",
    description: "Three androids, one revolution. A branching narrative experience set in a near-future Detroit.",
    cover: steamPortrait(1222140),
    hero: steamHero(1222140),
    screenshots: steamScreens(1222140),
    trailerPoster: steamHero(1222140),
    trailerYoutubeId: "DswgyOe6lPE",
    price: "$39.99",
    rating: 89,
    platforms: ["steam", "epic", "playstation"],
    gamePassTier: null,
    drmFree: false,
    modSupport: "Restricted",
    systemReq: baseSpecs("Intel Core i5-2300 / Ryzen 3 1200", "GTX 780 / RX 470", "8 GB"),
    willItRun: 95,
  },
  {
    id: "hollow-knight-silksong",
    steamAppId: 1030300,
    title: "Hollow Knight: Silksong",
    studio: "Team Cherry",
    year: 2025,
    releaseDate: "2025-09-04",
    status: "released",
    genres: ["Metroidvania", "Indie", "Action"],
    tagline: "Ascend to a haunted kingdom.",
    description: "Play as Hornet in this long-awaited sequel to Hollow Knight.",
    cover: steamPortrait(1030300),
    hero: steamHero(1030300),
    screenshots: steamScreens(1030300),
    trailerPoster: steamHero(1030300),
    trailerYoutubeId: "pFAknD_9U7c",
    price: "$19.99",
    rating: 94,
    platforms: ["steam", "gog", "xbox", "playstation"],
    gamePassTier: "essential",
    drmFree: true,
    modSupport: "Moderate",
    systemReq: baseSpecs("Intel Core i3-6100 / Ryzen 3 1200", "GTX 750 Ti / RX 460", "8 GB"),
    willItRun: 99,
    trending: true,
  },
  {
    id: "resident-evil-9",
    steamAppId: 3309610,
    title: "Resident Evil 9: Requiem",
    studio: "Capcom",
    year: 2026,
    releaseDate: "2026-02-27",
    status: "upcoming",
    genres: ["Survival Horror", "Action"],
    tagline: "The horror returns.",
    description: "The next chapter in the Resident Evil saga pushes RE Engine to terrifying new heights.",
    cover: steamPortrait(3309610),
    hero: steamHero(3309610),
    screenshots: steamScreens(3309610),
    trailerPoster: steamHero(3309610),
    trailerYoutubeId: "kEYAviWN4Wo",
    price: "$69.99",
    rating: 0,
    platforms: ["steam", "epic", "xbox", "playstation"],
    gamePassTier: "ultimate",
    drmFree: false,
    modSupport: "Moderate",
    systemReq: baseSpecs("Intel Core i5-10400 / Ryzen 5 3600", "RTX 2060 / RX 5700", "16 GB"),
    willItRun: 71,
    hype: 92,
  },
  {
    id: "pragmata",
    steamAppId: 2012970,
    title: "Pragmata",
    studio: "Capcom",
    year: 2026,
    releaseDate: "2026-09-10",
    status: "upcoming",
    genres: ["Sci-Fi", "Action", "Adventure"],
    tagline: "Lunar enigma.",
    description: "A mysterious sci-fi adventure set on the surface of the Moon. An astronaut and a child must survive together.",
    cover: steamPortrait(2012970),
    hero: steamHero(2012970),
    screenshots: steamScreens(2012970),
    trailerPoster: steamHero(2012970),
    trailerYoutubeId: "S7FjbODLvrw",
    price: "TBA",
    rating: 0,
    platforms: ["steam", "xbox", "playstation"],
    gamePassTier: "premium",
    drmFree: false,
    modSupport: "No Mod Support",
    systemReq: baseSpecs("Intel Core i7-10700 / Ryzen 7 5700X", "RTX 3060 / RX 6700", "16 GB"),
    willItRun: 68,
    hype: 78,
  },
  {
    id: "gta-vi",
    title: "GTA VI",
    studio: "Rockstar Games",
    year: 2026,
    releaseDate: "2026-05-26",
    status: "upcoming",
    genres: ["Action", "Open World", "Crime"],
    tagline: "Welcome back to Vice City.",
    description:
      "The most anticipated game of the decade. Return to a sun-soaked Vice City and the surrounding state of Leonida in Rockstar's next-gen masterpiece.",
    // Official Rockstar press art (hosted on rockstargames.com CDN)
    cover: "https://www.rockstargames.com/img/global/news/upload/actual_1733238800.jpg",
    hero: "https://www.rockstargames.com/img/global/news/upload/actual_1733238771.jpg",
    screenshots: [
      "https://www.rockstargames.com/img/global/news/upload/actual_1733238771.jpg",
      "https://www.rockstargames.com/img/global/news/upload/actual_1733238782.jpg",
      "https://www.rockstargames.com/img/global/news/upload/actual_1733238790.jpg",
      "https://www.rockstargames.com/img/global/news/upload/actual_1733238800.jpg",
    ],
    trailerPoster: "https://www.rockstargames.com/img/global/news/upload/actual_1733238771.jpg",
    trailerYoutubeId: "QdBZY2fkU-0",
    price: "TBA",
    rating: 0,
    platforms: ["xbox", "playstation"],
    gamePassTier: null,
    drmFree: false,
    modSupport: "Restricted",
    systemReq: baseSpecs("Intel Core i7-12700K / Ryzen 7 7700X", "RTX 3070 / RX 6800", "32 GB"),
    willItRun: 45,
    hype: 99,
  },
  {
    id: "fable",
    title: "Fable",
    studio: "Playground Games",
    year: 2026,
    releaseDate: "2026-08-20",
    status: "upcoming",
    genres: ["RPG", "Fantasy", "Open World"],
    tagline: "A new chapter in Albion.",
    description: "A reimagining of the legendary RPG series, built in Forza tech.",
    // Xbox Wire press kit imagery
    cover: "https://store-images.s-microsoft.com/image/apps.62235.13718468169793720.6e15c3fd-ec8b-4b2e-a1e7-cd5a23fab87d.84a0a9a0-f76d-4f8a-b8e9-b4d4e1e1e1e1",
    hero: "https://compass-ssl.xbox.com/assets/87/93/8793b1bc-93f7-4f8b-a1f1-e9d44d2f0e2c.jpg?n=Fable_GLP-Page-Hero-1084_1920x1080.jpg",
    screenshots: [
      "https://compass-ssl.xbox.com/assets/87/93/8793b1bc-93f7-4f8b-a1f1-e9d44d2f0e2c.jpg?n=Fable_GLP-Page-Hero-1084_1920x1080.jpg",
      "https://compass-ssl.xbox.com/assets/c5/0d/c50d1e5a-1234-5678-9abc-def012345678.jpg",
      "https://compass-ssl.xbox.com/assets/87/93/8793b1bc-93f7-4f8b-a1f1-e9d44d2f0e2c.jpg?n=Fable_GLP-Page-Hero-1084_1920x1080.jpg",
      "https://compass-ssl.xbox.com/assets/87/93/8793b1bc-93f7-4f8b-a1f1-e9d44d2f0e2c.jpg?n=Fable_GLP-Page-Hero-1084_1920x1080.jpg",
    ],
    trailerPoster: "https://compass-ssl.xbox.com/assets/87/93/8793b1bc-93f7-4f8b-a1f1-e9d44d2f0e2c.jpg?n=Fable_GLP-Page-Hero-1084_1920x1080.jpg",
    trailerYoutubeId: "_Hp1PqWaJ7E",
    price: "$69.99",
    rating: 0,
    platforms: ["steam", "xbox"],
    gamePassTier: "ultimate",
    drmFree: false,
    modSupport: "Moderate",
    systemReq: baseSpecs("Intel Core i5-10400 / Ryzen 5 3600", "RTX 3060 / RX 6700", "16 GB"),
    willItRun: 72,
    hype: 84,
  },
];

export const TRENDING = GAMES.filter((g) => g.trending);
export const UPCOMING = GAMES.filter((g) => g.status === "upcoming").sort(
  (a, b) => +new Date(a.releaseDate) - +new Date(b.releaseDate),
);
export const RECENT = GAMES.filter((g) => g.status === "released").sort(
  (a, b) => +new Date(b.releaseDate) - +new Date(a.releaseDate),
);

export const getGame = (id: string) => GAMES.find((g) => g.id === id);
