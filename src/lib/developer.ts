import { supabase } from "./supabase";
export async function inspectConnections() {
  const results = await Promise.all([
    supabase.from("learning_classes").select("id").limit(1),
    supabase.from("notifications").select("id").limit(1),
    supabase.from("shop_items").select("id").limit(1),
    supabase.rpc("learning_rhythm", { learner_zone: "UTC" }, { get: true }),
  ]);
  return ["Classes", "Notifications", "Streak Sparks", "Learning history"].map((name, index) => ({ name, ok: !results[index].error }));
}
