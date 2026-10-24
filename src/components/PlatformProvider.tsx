import { sandboxClasses } from "../lib/sandboxFixtures";
import { useCallback, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { emptyPlatform, loadPlatform, PlatformContext } from "../lib/platform";
import { useLearning } from "../lib/learningContext";
import { useLiveSync } from "../lib/liveSync";
export function PlatformProvider({ children }: { children: ReactNode }) {
  const { session, preview } = useLearning();
  const userId = session?.user.id;
  const [state, setState] = useState(emptyPlatform);
  const [loading, setLoading] = useState(!!userId);
  const [error, setError] = useState("");
  const generation = useRef(0);
  const sandboxReady = useRef(false);
  const loaded = useRef(false);
  const refresh = useCallback(async () => {
    const version = ++generation.current;
    if (preview) {
      if (!sandboxReady.current) {
        sandboxReady.current = true;
        setState((current) => ({
          ...emptyPlatform(),
          developer: current.developer,
          classes: sandboxClasses(),
          wallet: { xp: 20000, coins: 5000, equipped: "seed" },
        }));
      }
      setLoading(false);
      return;
    }
    sandboxReady.current = false;
    if (!userId) {
      setState(emptyPlatform());
      setLoading(false);
      return;
    }
    if (!loaded.current) setLoading(true);
    try {
      const next = await loadPlatform(userId);
      if (version === generation.current) {
        loaded.current = true;
        setState(next);
        setError("");
      }
    } catch (cause) {
      if (version === generation.current)
        setError(cause instanceof Error ? cause.message : "Could not load your learning connections. Please try again.");
    } finally {
      if (version === generation.current) setLoading(false);
    }
  }, [userId, preview]);
  useEffect(() => {
    loaded.current = false;
    if (!preview) setState(emptyPlatform());
    void refresh();
    return () => {
      generation.current++;
    };
  }, [refresh, userId]);
  useLiveSync(
    userId,
    preview,
    ["notifications", "learning_classes", "class_members", "learning_wallets", "streak_inventory", "developer_accounts"],
    refresh,
  );
  return (
    <PlatformContext.Provider
      value={{
        state,
        loading,
        error,
        refresh,
        configureSandbox: (wallet, legend = false) => {
          if (preview) setState((current) => ({ ...current, wallet, owned: legend ? ["seed", "unknown"] : ["seed"] }));
        },
      }}
    >
      {children}
    </PlatformContext.Provider>
  );
}
