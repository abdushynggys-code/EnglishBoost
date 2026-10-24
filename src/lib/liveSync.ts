import { useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { supabase } from "./supabase";
import { DATA_CHANGED } from "./dataEvents";
export function useLiveSync(userId: string | undefined, paused: boolean, tables: string[], refresh: () => void | Promise<void>) {
  const latest = useRef(refresh);
  latest.current = refresh;
  const [path] = useLocation();
  const tableKey = tables.join(",");
  useEffect(() => {
    if (!userId || paused) return;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const update = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        if (!document.hidden) void latest.current();
      }, 180);
    };
    const channel = supabase.channel(`sync:${crypto.randomUUID()}`);
    for (const table of tableKey.split(",")) channel.on("postgres_changes", { event: "*", schema: "public", table }, update);
    channel.subscribe();
    const poll = window.setInterval(update, 10000);
    window.addEventListener(DATA_CHANGED, update);
    window.addEventListener("focus", update);
    window.addEventListener("online", update);
    document.addEventListener("visibilitychange", update);
    return () => {
      clearTimeout(timer);
      clearInterval(poll);
      window.removeEventListener(DATA_CHANGED, update);
      window.removeEventListener("focus", update);
      window.removeEventListener("online", update);
      document.removeEventListener("visibilitychange", update);
      void supabase.removeChannel(channel);
    };
  }, [userId, paused, tableKey]);
  useEffect(() => {
    if (userId && !paused) void latest.current();
  }, [path, userId, paused]);
}
