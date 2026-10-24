import { Link } from "wouter";
import { usePlatform } from "../lib/platform";
import { useLearning } from "../lib/learningContext";
import { useI18n } from "../lib/i18n";
import { Streaker } from "./Streaker";
export function LegendBar() {
  const { state } = usePlatform();
  const { profile } = useLearning();
  const { t } = useI18n();
  if (!state.owned.includes("unknown")) return null;
  return (
    <section className="legend-banner" aria-label={t("Unknown reward")}>
      <div className="legend-starfield" aria-hidden="true">
        {Array.from({ length: 14 }, (_, i) => (
          <i key={i} style={{ "--i": i, left: `${(i * 29 + 7) % 100}%`, top: `${(i * 17 + 13) % 85}%` } as React.CSSProperties} />
        ))}
      </div>
      <div className="legend-halo" aria-hidden="true" />
      <div className="legend-sweep" aria-hidden="true" />
      <div className="legend-emblem">
        <Streaker item="unknown" large />
      </div>
      <div className="legend-copy">
        <span className="legend-kicker">{t("ONE WORLDWIDE")}</span>
        <h2>{t("The Unrepeatable")}</h2>
        <p>
          {profile?.full_name || t("A one-of-one learner")} <span aria-hidden="true">·</span> {t("World legend")}
        </p>
      </div>
      <span className="legend-badge">{t("UNKNOWN")}</span>
      <Link className="legend-link" href="/shop">
        {t("Your Sparks")} →
      </Link>
      <div className="legend-energy" aria-hidden="true">
        <span />
      </div>
    </section>
  );
}
