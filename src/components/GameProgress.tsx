import { Link } from "wouter";
import { usePlatform, gameLevel, xpForLevel, fameForXp } from "../lib/platform";
import { useI18n } from "../lib/i18n";
import { Streaker } from "./Streaker";
export function GameProgress() {
  const { state, error, refresh } = usePlatform();
  const { t } = useI18n();
  const level = gameLevel(state.wallet.xp);
  const earned = state.wallet.xp - xpForLevel(level);
  const needed = xpForLevel(level + 1) - xpForLevel(level);
  return (
    <section className="game-progress">
      <div>
        <Streaker />
        <span>{t("Your daily rhythm")}</span>
      </div>
      <div className="game-xp">
        <strong>
          {t("Player level")} {level}
        </strong>
        <span>
          {earned}/{needed} XP
        </span>
        <progress aria-label={t("Player level progress")} value={earned} max={needed} />
      </div>
      <Link href="/shop">
        <strong>{state.wallet.coins} ◈</strong>
        <span>
          {t("Coins")} · {t("Streak shop")}
        </span>
      </Link>
      {fameForXp(state.wallet.xp) > 0 && (
        <div>
          <strong>{fameForXp(state.wallet.xp)}</strong>
          <span>{t("Fame")}</span>
        </div>
      )}
      {error && (
        <button className="text-button" onClick={() => void refresh()}>
          {t("Try again")}
        </button>
      )}
    </section>
  );
}
