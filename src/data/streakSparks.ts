import type { ShopItem } from "../lib/platform";
export const sparkMotifs = [
  "Seed",
  "Leaf",
  "Blossom",
  "Sun",
  "Moon",
  "Star",
  "Sparkle",
  "Feather",
  "Shell",
  "Heart",
  "Mountain",
  "Cloud",
  "Flame",
  "Droplet",
  "Wind",
  "Planet",
  "Lightning",
  "Diamond",
  "Crown",
  "Infinity",
] as const;
export const sparkTiers = [
  { id: "seed", title: "Seed", xp: 0, price: 0, color: "#6a975c" },
  { id: "fire", title: "Fire", xp: 416, price: 75, color: "#e09238" },
  { id: "wave", title: "Wave", xp: 1221, price: 150, color: "#428ac0" },
  { id: "comet", title: "Comet", xp: 2541, price: 300, color: "#8b73c4" },
  { id: "bloom", title: "Bloom", xp: 4556, price: 500, color: "#c57393" },
  { id: "orbit", title: "Orbit", xp: 7301, price: 800, color: "#619b9f" },
  { id: "aurora", title: "Aurora", xp: 11661, price: 1200, color: "#58a68f" },
  { id: "storm", title: "Storm", xp: 18236, price: 1800, color: "#7c83bd" },
  { id: "supernova", title: "Supernova", xp: 26061, price: 2600, color: "#c38a48" },
  { id: "black-hole", title: "Black hole", xp: 37101, price: 4000, color: "#8c6cd0" },
  { id: "unknown", title: "Unknown", xp: 70000, price: 0, color: "#b5ad83" },
] as const;
const colors = ["#648b52", "#b47a49", "#548aab", "#9a739e", "#ad8450", "#5f9592", "#81855b", "#8e7ca5", "#b57670", "#5d8299"];
export function sandboxSparkCatalog(): ShopItem[] {
  return sparkTiers.flatMap((base, index) =>
    sparkMotifs.slice(0, index === 10 ? 1 : 20).map((motif, n) => ({
      id: n ? `${base.id}-${String(n).padStart(2, "0")}` : base.id,
      title: n ? `${base.title} · ${motif}` : base.title,
      tier: index + 1,
      price: n ? (index === 0 ? 15 + n * 3 : base.price + (n - 1) * Math.max(5, Math.floor(base.price / 20))) : base.price,
      required_xp: base.xp,
      color: n ? colors[n % 10] : base.color,
    })),
  );
}
export function sparkAppearance(id: string) {
  const match = id.match(/^(.*)-(\d{2})$/);
  const family = match?.[1] ?? id;
  const motif = match ? Number(match[2]) : 0;
  return { family, motif, tier: sparkTiers.findIndex((t) => t.id === family) + 1, color: motif ? colors[motif % 10] : undefined };
}
