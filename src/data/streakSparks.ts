import type { ShopItem } from "../lib/platform";
import { sparkCollections } from "./sparkCollections";
export const sparkTiers = [
  { id: "seed", title: "Seed", xp: 0, price: 0, color: "#6a975c" },
  { id: "fire", title: "Hearth", xp: 400, price: 40, color: "#e09238" },
  { id: "wave", title: "Coast", xp: 1200, price: 80, color: "#428ac0" },
  { id: "comet", title: "Trailblazers", xp: 2500, price: 140, color: "#8b73c4" },
  { id: "bloom", title: "Arcade", xp: 4500, price: 220, color: "#c57393" },
  { id: "orbit", title: "Workshop", xp: 7500, price: 320, color: "#619b9f" },
  { id: "aurora", title: "Studio", xp: 12000, price: 450, color: "#58a68f" },
  { id: "storm", title: "Mythic", xp: 18000, price: 650, color: "#7c83bd" },
  { id: "supernova", title: "Starforge", xp: 27000, price: 900, color: "#c38a48" },
  { id: "black-hole", title: "Singularity", xp: 40000, price: 1200, color: "#8c6cd0" },
  { id: "unknown", title: "Unknown", xp: 70000, price: 0, color: "#b5ad83" },
] as const;
const hues = [100, 30, 200, 160, 265, 210, 345, 280, 40, 255, 48];
export const sparkColor = (tier: number, motif: number) =>
  `hsl(${hues[tier - 1] + ((motif % 5) - 2) * 4} ${tier === 11 ? 32 : 40 + (motif % 3) * 4}% ${tier >= 8 ? 43 : 42 + (motif % 4) * 3}%)`;
export function sandboxSparkCatalog(): ShopItem[] {
  return sparkTiers.flatMap((base, index) =>
    sparkCollections[index].names.map((name, n) => ({
      id: n ? `${base.id}-${String(n).padStart(2, "0")}` : base.id,
      title: name,
      tier: index + 1,
      price: n ? (index === 0 ? 15 + n * 3 : base.price + (n - 1) * Math.max(5, Math.floor(base.price / 20))) : base.price,
      required_xp: base.xp,
      color: sparkColor(index + 1, n),
    })),
  );
}
export function sparkAppearance(id: string) {
  const match = id.match(/^(.*)-(\d{2})$/);
  const family = match?.[1] ?? id;
  const motif = match ? Number(match[2]) : 0;
  const tier = sparkTiers.findIndex((t) => t.id === family) + 1;
  return { family, motif, tier, color: sparkColor(tier || 1, motif) };
}
