import { createContext, useContext, useEffect, useState } from "react";

type ThemeMode = "noir" | "rgb";
const Ctx = createContext<{ mode: ThemeMode; toggle: () => void }>({
  mode: "noir",
  toggle: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>("noir");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = localStorage.getItem("theme-mode") as ThemeMode | null;
    if (saved) setMode(saved);
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.classList.toggle("rgb", mode === "rgb");
    if (typeof window !== "undefined") localStorage.setItem("theme-mode", mode);
  }, [mode]);

  return (
    <Ctx.Provider value={{ mode, toggle: () => setMode((m) => (m === "noir" ? "rgb" : "noir")) }}>
      {children}
    </Ctx.Provider>
  );
}

export const useTheme = () => useContext(Ctx);

/* ======= Vault store (localStorage) ======= */
const VAULT_KEY = "vault-game-ids";
type Listener = (ids: string[]) => void;
const listeners = new Set<Listener>();
let cache: string[] | null = null;

function read(): string[] {
  if (typeof window === "undefined") return [];
  if (cache) return cache;
  try {
    cache = JSON.parse(localStorage.getItem(VAULT_KEY) || "[]");
    return cache!;
  } catch {
    cache = [];
    return cache;
  }
}
function write(ids: string[]) {
  cache = ids;
  if (typeof window !== "undefined") localStorage.setItem(VAULT_KEY, JSON.stringify(ids));
  listeners.forEach((l) => l(ids));
}

export function useVault() {
  const [ids, setIds] = useState<string[]>(() => read());
  useEffect(() => {
    const l: Listener = (next) => setIds(next);
    listeners.add(l);
    setIds(read());
    return () => {
      listeners.delete(l);
    };
  }, []);
  return {
    ids,
    has: (id: string) => ids.includes(id),
    toggle: (id: string) =>
      write(ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]),
  };
}