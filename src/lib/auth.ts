import { assertLiveMutation } from './sandbox';
import type { AccountIntent } from './accountIntent';
import { supabase } from './supabase';

export function signInWithGoogle() {
  return supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: `${window.location.origin}/sign-in` },
  });
}

export function signInWithEmail(email: string, password: string) {
  return supabase.auth.signInWithPassword({ email, password });
}

export function signUpWithEmail(email: string, password: string, role: AccountIntent) {
  return supabase.auth.signUp({
    email,
    password,
    options: { emailRedirectTo: `${window.location.origin}/sign-in`, data: { requested_role: role } },
  });
}

export function signOut() {
  assertLiveMutation();
  return supabase.auth.signOut();
}
