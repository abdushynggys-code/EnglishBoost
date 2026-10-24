import type { ShopItem } from "../lib/platform";
import { usePlatform, gameLevel } from "../lib/platform";
import { Streaker } from "./Streaker";
import { useI18n } from "../lib/i18n";
export function ShopSparkCard({ item, busy, buy }: { item: ShopItem; busy: string; buy: (id: string) => void }) {
  const { state } = usePlatform();
  const { t } = useI18n();
  const owned = state.owned.includes(item.id);
  const equipped = state.wallet.equipped === item.id;
  return (
    <article className={`shop-item tier-${item.tier}`} style={{ "--item-color": item.color } as React.CSSProperties}>
      <div className="shop-tier">
        {t("Tier")} {item.tier}
        <span>{item.tier === 11 ? t("ONE WORLDWIDE") : t(owned ? "Owned" : "Unlocked")}</span>
      </div>
      <Streaker item={item.id} large />
      <h2>
        {item.title
          .split(" · ")
          .map((part) => t(part))
          .join(" · ")}
      </h2>
      <p>
        {t("Player level")} {gameLevel(item.required_xp)} · {t("Streak Spark")}
      </p>
      {item.tier === 11 && <p>{t("A single worldwide claim. Requires at least 40,000 XP. First eligible learner to claim it wins.")}</p>}
      <button
        className={equipped ? "secondary" : ""}
        disabled={!!busy || equipped || (!owned && state.wallet.coins < item.price)}
        onClick={() => buy(item.id)}
      >
        {t(busy === item.id ? "Saving…" : equipped ? "Equipped" : owned ? "Equip" : item.tier === 11 ? "Claim" : "Buy")}
        {!owned && item.price > 0 && ` · ${item.price} ${t("coins")}`}
      </button>
    </article>
  );
}
