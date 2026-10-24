import { usePlatform, gameLevel, xpForLevel, fameForXp } from "../lib/platform";
import { useI18n } from "../lib/i18n";
export function ShopWallet() {
  const { state } = usePlatform();
  const { t } = useI18n();
  const level = gameLevel(state.wallet.xp);
  return (
    <section className="wallet-strip">
      <div>
        <strong>{level}</strong>
        <span>{t("Player level")}</span>
      </div>
      <div>
        <strong>{state.wallet.xp.toLocaleString()}</strong>
        <span>XP</span>
      </div>
      <div>
        <strong>{state.wallet.coins.toLocaleString()}</strong>
        <span>{t("Coins")}</span>
      </div>
      <div>
        <strong>{fameForXp(state.wallet.xp)}</strong>
        <span>{t("Fame")}</span>
      </div>
      <progress aria-label={t("Player level progress")} max={xpForLevel(level + 1) - xpForLevel(level)} value={state.wallet.xp - xpForLevel(level)} />
    </section>
  );
}
