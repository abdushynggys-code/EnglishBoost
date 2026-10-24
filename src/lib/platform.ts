import { assertLiveMutation } from "./sandbox";
import { createContext, useContext } from "react";
import { supabase } from "./supabase";
export type LearningClass = { id: string; user_id: string; title: string; code: string; created_at: string };
export type LearningNotice = { id: string; title: string; body: string; href: string; read_at: string | null; created_at: string };
export type Wallet = { xp: number; coins: number; equipped: string };
export type ShopItem = { id: string; title: string; tier: number; price: number; required_xp: number; color: string };
export type PlatformState = {
  classes: LearningClass[];
  notifications: LearningNotice[];
  wallet: Wallet;
  owned: string[];
  developer: boolean;
  streak: number;
};
export const emptyPlatform = (): PlatformState => ({
  classes: [],
  notifications: [],
  wallet: { xp: 0, coins: 0, equipped: "seed" },
  owned: ["seed"],
  developer: false,
  streak: 0,
});
export const PlatformContext = createContext<{
  state: PlatformState;
  loading: boolean;
  error: string;
  refresh: () => Promise<void>;
  configureSandbox: (wallet: Wallet) => void;
} | null>(null);
export function usePlatform() {
  const value = useContext(PlatformContext);
  if (!value) throw Error("PlatformProvider is missing");
  return value;
}
export async function loadPlatform(userId: string): Promise<PlatformState> {
  const [classes, notifications, wallet, inventory, developer, rhythm] = await Promise.all([
    supabase.from("learning_classes").select("*").order("created_at", { ascending: false }).returns<LearningClass[]>(),
    supabase.from("notifications").select("*").eq("user_id", userId).order("created_at", { ascending: false }).limit(40).returns<LearningNotice[]>(),
    supabase.from("learning_wallets").select("xp,coins,equipped").eq("user_id", userId).maybeSingle<Wallet>(),
    supabase.from("streak_inventory").select("item_id").eq("user_id", userId).returns<{ item_id: string }[]>(),
    supabase.from("developer_accounts").select("user_id").eq("user_id", userId).maybeSingle(),
    supabase.rpc("learning_rhythm", { learner_zone: Intl.DateTimeFormat().resolvedOptions().timeZone }, { get: true }),
  ]);
  if ([classes, notifications, wallet, inventory, developer, rhythm].some((result) => result.error))
    throw Error("Could not load your learning connections. Please try again.");
  return {
    classes: classes.data ?? [],
    notifications: notifications.data ?? [],
    wallet: wallet.data ?? { xp: 0, coins: 0, equipped: "seed" },
    owned: ["seed", ...(inventory.data ?? []).map((item) => item.item_id)],
    developer: !!developer.data,
    streak: Number(rhythm.data ?? 0),
  };
}
export async function createLearningClass(title: string) {
  assertLiveMutation();
  const { error } = await supabase.from("learning_classes").insert({ title: title.trim() });
  if (error) throw new Error(error.message);
}
export async function joinLearningClass(code: string) {
  assertLiveMutation();
  const { error } = await supabase.rpc("join_learning_class", { class_code: code.trim().toUpperCase() });
  if (error) throw new Error(error.message);
}
export async function assignClassWork(classId: string, title: string, instructions: string, due: string, path: string) {
  assertLiveMutation();
  const { data, error } = await supabase.rpc("assign_class_work", {
    class_uuid: classId,
    work_title: title,
    work_instructions: instructions,
    due_date: due,
    practice: path,
  });
  if (error) throw new Error(error.message);
  return data as number;
}
export async function readNotification(id: string) {
  assertLiveMutation();
  const { error } = await supabase.from("notifications").update({ read_at: new Date().toISOString() }).eq("id", id);
  if (error) throw new Error(error.message);
}
export async function loadShop() {
  const { data, error } = await supabase.from("shop_items").select("*").order("tier").returns<ShopItem[]>();
  if (error) throw new Error(error.message);
  return data ?? [];
}
export async function purchaseStreaker(item: string) {
  assertLiveMutation();
  const { error } = await supabase.rpc("purchase_streaker", { item });
  if (error) throw new Error(error.message);
}
export { gameLevel, xpForLevel, fameForXp } from "./gamification";
