import { useEffect, useRef, useState } from "react";
import { usePlatform, loadShop, purchaseStreaker } from "../lib/platform";
import type { ShopItem } from "../lib/platform";
import { useLearning } from "../lib/learningContext";
import { useI18n } from "../lib/i18n";
import { sparkTiers, sandboxSparkCatalog } from "../data/streakSparks";
import { ShopSparkCard } from "../components/ShopSparkCard";
import { ShopWallet } from "../components/ShopWallet";
export function ShopPage() {
  const { state, refresh, error: walletError } = usePlatform();
  const { preview } = useLearning();
  const { t } = useI18n();
  const [items, setItems] = useState<ShopItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [tier, setTier] = useState(1);
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const request = useRef(0);
  const unlocked = sparkTiers.filter((group) => state.wallet.xp >= group.xp).length;
  async function reload() {
    const version = ++request.current;
    try {
      const catalog = preview ? sandboxSparkCatalog() : await loadShop();
      if (version === request.current) {
        setItems(catalog);
        setError("");
      }
    } catch {
      if (version === request.current) setError("Could not load the shop. Please try again.");
    } finally {
      if (version === request.current) setLoading(false);
    }
  }
  useEffect(() => {
    void reload();
    return () => {
      request.current++;
    };
  }, [preview, unlocked]);
  useEffect(() => {
    if (tier > unlocked) setTier(Math.max(1, unlocked));
  }, [unlocked, tier]);
  async function buy(item: string) {
    setBusy(item);
    setError("");
    setMessage("");
    try {
      await purchaseStreaker(item);
      await refresh();
      setMessage("Streak Spark equipped.");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not purchase item.");
    } finally {
      setBusy("");
    }
  }
  const visible = items.filter((item) => item.tier === tier && item.required_xp <= state.wallet.xp);
  return (
    <div className="shop-page">
      <div className="calm-heading">
        <p className="eyebrow">{t("MAKE YOUR STREAK YOURS")}</p>
        <h1>{t("Streak Sparks")}</h1>
        <p>{t("A little character for every day you show up. Collect a Spark and make it yours.")}</p>
      </div>
      <ShopWallet />
      <div className="spark-tier-tabs spaced" role="group" aria-label={t("Spark tiers")}>
        {sparkTiers.map((group, index) => (
          <button
            key={group.id}
            className={tier === index + 1 ? "" : "secondary"}
            disabled={index >= unlocked}
            aria-pressed={tier === index + 1}
            onClick={() => setTier(index + 1)}
          >
            <span>
              {t("Tier")} {index + 1}
            </span>
            <small>{index < unlocked ? t("Unlocked") : `${group.xp.toLocaleString()} XP`}</small>
          </button>
        ))}
      </div>
      <div className="spark-collection-heading">
        <div>
          <p className="eyebrow">{t("YOUR COLLECTION")}</p>
          <h2>
            {t("Tier")} {tier} · {t(sparkTiers[tier - 1].title)}
          </h2>
          <p>{t(tier === 11 ? "One worldwide Spark. One extraordinary learner." : "20 Sparks to discover. Choose the one that feels like you.")}</p>
        </div>
        {unlocked < 11 && (
          <p className="muted">
            {t("Next tier in {xp} XP", { xp: Math.max(0, sparkTiers[unlocked].xp - state.wallet.xp).toLocaleString() })}
            <br />
            {t("Higher-tier designs stay hidden until you unlock them.")}
          </p>
        )}
      </div>
      {(error || walletError) && (
        <p role="alert" className="message">
          {t(error || walletError)}{" "}
          <button className="text-button" onClick={() => void Promise.all([reload(), refresh()])}>
            {t("Try again")}
          </button>
        </p>
      )}
      {message && <p role="status">{t(message)}</p>}
      {loading ? (
        <p role="status" className="spaced">
          {t("Loading Sparks…")}
        </p>
      ) : visible.length ? (
        <div className="shop-grid">
          {visible.map((item) => (
            <ShopSparkCard key={item.id} item={item} busy={busy} buy={(id) => void buy(id)} />
          ))}
        </div>
      ) : (
        !error && (
          <p className="spaced">
            {t("Your collection is loading. Try again in a moment.")}{" "}
            <button className="secondary" onClick={() => void reload()}>
              {t("Try again")}
            </button>
          </p>
        )
      )}
      <details className="card spaced">
        <summary>{t("How rewards work")}</summary>
        <p className="spaced">
          {t(
            "Accuracy, daily streaks and focused completion add bonuses. Speed bonuses only apply between 45 seconds and 3 minutes; learning well comes first.",
          )}
        </p>
        <p>{t("Fame starts at 70,000 XP, then rises every 10,000 XP. Player level 200 is about 60,000 XP.")}</p>
      </details>
    </div>
  );
}
