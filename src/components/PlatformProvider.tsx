import { sandboxClasses } from "../lib/sandboxFixtures";
import { useCallback, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { emptyPlatform, loadPlatform, PlatformContext } from "../lib/platform";
import { useLearning } from "../lib/learningContext";
import { supabase } from "../lib/supabase";
export function PlatformProvider({ children }: { children: ReactNode }) {
  const { session, preview } = useLearning();
  const userId = session?.user.id;
  const [state, setState] = useState(emptyPlatform);
  const [loading, setLoading] = useState(!!userId);
  const [error, setError] = useState("");
  const generation = useRef(0);
  const sandboxReady = useRef(false);
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
    setLoading(true);
    try {
      const next = await loadPlatform(userId);
      if (version === generation.current) {
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
    if (!preview) setState(emptyPlatform());
    void refresh();
    if (!userId) return;
    const channel = supabase
      .channel(`learning-updates:${userId}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "notifications", filter: `user_id=eq.${userId}` }, () => void refresh())
      .subscribe();
    const poll = window.setInterval(() => void refresh(), 30000);
    return () => {
      generation.current++;
      clearInterval(poll);
      void supabase.removeChannel(channel);
    };
  }, [refresh, userId]);
  return (
    <PlatformContext.Provider
      value={{
        state,
        loading,
        error,
        refresh,
        configureSandbox: (wallet) => {
          if (preview) setState((current) => ({ ...current, wallet }));
        },
      }}
    >
      {children}
    </PlatformContext.Provider>
  );
}
