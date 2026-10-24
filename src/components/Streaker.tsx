import { usePlatform } from "../lib/platform";
import { useI18n } from "../lib/i18n";
import { sparkAppearance } from "../data/streakSparks";
import { SparkMotif } from "./SparkMotif";
const symbols: Record<string, string> = {
  seed: "✦",
  fire: "♨",
  wave: "≈",
  comet: "☄",
  bloom: "✿",
  orbit: "◎",
  aurora: "≋",
  storm: "ϟ",
  supernova: "✺",
  "black-hole": "●",
  unknown: "◈",
};
export function Streaker({ item, large = false }: { item?: string; large?: boolean }) {
  const { state } = usePlatform();
  const { t } = useI18n();
  const selected = item ?? state.wallet.equipped;
  const { family, motif, tier, color } = sparkAppearance(selected);
  return (
    <span
      className={`streaker streaker-${family} spark-tier-${tier} ${large ? "streaker-large" : ""}`}
      style={color ? ({ "--symbol": color } as React.CSSProperties) : undefined}
      aria-label={t("Streak Spark")}
    >
      <span className="streaker-ring" />
      <span className="streaker-core">{motif ? <SparkMotif motif={motif} /> : (symbols[selected] ?? "✦")}</span>
      {!item && <strong>{state.streak}</strong>}
    </span>
  );
}
