import { isSandboxMode } from "./sandbox";
import { announceDataChange } from "./dataEvents";
import { createClient } from "@supabase/supabase-js";

// Ключи берутся из .env локально и из Vercel → Settings → Environment Variables на проде.
const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const isSupabaseConfigured = Boolean(url && anonKey);

// Запасные значения позволяют показать понятную подсказку в интерфейсе вместо белого экрана.
export const supabase = createClient(url ?? "https://not-configured.supabase.co", anonKey ?? "not-configured", {
  global: {
    fetch: async (input, init) => {
      const method = (init?.method ?? (input instanceof Request ? input.method : "GET")).toUpperCase();
      const address = typeof input === "string" ? input : input instanceof URL ? input.href : input.url;
      if (isSandboxMode() && !["GET", "HEAD", "OPTIONS"].includes(method) && /\/(rest|storage|functions)\/v1\//.test(address))
        throw new Error("This action is disabled in the developer sandbox.");
      const response = await fetch(input, init);
      const readRpc = /\/rpc\/(class_overview|tutor_course_reports|learning_rhythm)(\?|$)/.test(address);
      if (response.ok && !["GET", "HEAD", "OPTIONS"].includes(method) && address.includes("/rest/v1/") && !readRpc) announceDataChange();
      return response;
    },
  },
});
