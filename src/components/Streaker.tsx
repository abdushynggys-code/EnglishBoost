import { usePlatform } from "../lib/platform";
import { useI18n } from "../lib/i18n";
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
  return (
    <span className={`streaker streaker-${selected} ${large ? "streaker-large" : ""}`} aria-label={t("Streak symbol")}>
      <span className="streaker-ring" />
      <span className="streaker-core">{symbols[selected] ?? "✦"}</span>
      {!item && <strong>{state.streak}</strong>}
    </span>
  );
}
