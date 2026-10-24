import { useEffect, useState } from "react";
import { usePlatform, loadShop, purchaseStreaker, gameLevel, xpForLevel, fameForXp } from "../lib/platform";
import type { ShopItem } from "../lib/platform";
import { Streaker } from "../components/Streaker";
import { useI18n } from "../lib/i18n";
export function ShopPage() {
  const { state, refresh } = usePlatform();
  const { t } = useI18n();
  const [items, setItems] = useState<ShopItem[]>([]);
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const level = gameLevel(state.wallet.xp);
  useEffect(() => {
    void loadShop()
      .then(setItems)
      .catch(() => setError("Could not load the shop. Please try again."));
  }, []);
  async function buy(item: string) {
    setBusy(item);
    setError("");
    setMessage("");
    try {
      await purchaseStreaker(item);
      await refresh();
      setMessage("Streak symbol equipped.");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not purchase item.");
    } finally {
      setBusy("");
    }
  }
  return (
    <div className="shop-page">
      <div className="calm-heading">
        <p className="eyebrow">{t("MAKE YOUR STREAK YOURS")}</p>
        <h1>{t("The streak shop")}</h1>
        <p>{t("Earn coins by learning. Unlock richer symbols as your XP grows.")}</p>
      </div>
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
        <progress
          aria-label={t("Player level progress")}
          max={xpForLevel(level + 1) - xpForLevel(level)}
          value={state.wallet.xp - xpForLevel(level)}
        />
      </section>
      <p className="muted spaced">
        {t(
          "Accuracy, daily streaks and focused completion add bonuses. Speed bonuses only apply between 45 seconds and 3 minutes; learning well comes first.",
        )}
      </p>
      <p className="muted">{t("Fame starts at 70,000 XP, then rises every 10,000 XP. Player level 200 is about 60,000 XP.")}</p>
      {error && (
        <p role="alert" className="message">
          {t(error)}
        </p>
      )}
      {message && <p role="status">{t(message)}</p>}
      <div className="shop-grid">
        {items.map((item) => {
          const owned = state.owned.includes(item.id);
          const unlocked = state.wallet.xp >= item.required_xp;
          const equipped = state.wallet.equipped === item.id;
          return (
            <article
              className={`shop-item tier-${item.tier} ${unlocked ? "" : "tier-locked"}`}
              key={item.id}
              style={{ "--item-color": item.color } as React.CSSProperties}
            >
              <div className="shop-tier">
                {t("Tier")} {item.tier}
                <span>{item.tier === 11 ? t("ONE WORLDWIDE") : t(owned ? "Owned" : unlocked ? "Unlocked" : "Locked")}</span>
              </div>
              <Streaker item={item.id} large />
              <h2>{t(item.title)}</h2>
              <p>
                {item.required_xp.toLocaleString()} XP · {t("Player level")} {gameLevel(item.required_xp)}
              </p>
              {item.tier === 11 && <p>{t("A single worldwide claim. Requires at least 70,000 XP. First eligible learner to claim it wins.")}</p>}
              <button
                className={equipped ? "secondary" : ""}
                disabled={!!busy || !unlocked || equipped || (!owned && state.wallet.coins < item.price)}
                onClick={() => void buy(item.id)}
              >
                {t(
                  busy === item.id
                    ? "Saving…"
                    : equipped
                      ? "Equipped"
                      : owned
                        ? "Equip"
                        : item.tier === 11
                          ? "Claim"
                          : !unlocked
                            ? "Keep learning"
                            : "Buy",
                )}{" "}
                {!owned && item.price > 0 && ` · ${item.price} ${t("coins")}`}
              </button>
            </article>
          );
        })}
      </div>
    </div>
  );
}
