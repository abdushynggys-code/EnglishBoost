import type { User } from '@supabase/supabase-js';
import { supabase } from './supabase';

export type AccountIntent = 'student' | 'tutor';
const key = 'englishboost-account-intent';

export function readAccountIntent(): AccountIntent | null {
  try {
    const value = sessionStorage.getItem(key);
    return value === 'student' || value === 'tutor' ? value : null;
  } catch { return null; }
}

export function rememberAccountIntent(value: AccountIntent) {
  try { sessionStorage.setItem(key, value); } catch { /* Email signup also sends the choice directly. */ }
}

// This records a preference, never permissions. The database controls tutor access.
export async function saveAccountIntent(user: User) {
  const intent = readAccountIntent();
  if (!intent) return;
  if (user.user_metadata.requested_role !== intent) {
    const { error } = await supabase.auth.updateUser({ data: { requested_role: intent } });
    if (error) throw error;
  }
  try { sessionStorage.removeItem(key); } catch { /* Repeating the same preference is safe. */ }
}
