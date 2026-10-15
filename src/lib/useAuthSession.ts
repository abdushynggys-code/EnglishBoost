import { useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { isSupabaseConfigured, supabase } from './supabase';

export function useAuthSession() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(isSupabaseConfigured);
  const [error, setError] = useState(() => {
    const params = new URLSearchParams(window.location.hash.slice(1));
    return params.get('error_description') ?? params.get('error') ?? '';
  });

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    let active = true;
    let authChanged = false;
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_, nextSession) => {
      if (!active) return;
      authChanged = true;
      setSession(nextSession);
      if (nextSession) setError('');
      setLoading(false);
    });

    void supabase.auth
      .getSession()
      .then(({ data, error: sessionError }) => {
        if (!active) return;
        if (!authChanged) setSession(data.session);
        if (sessionError) setError(sessionError.message);
        setLoading(false);
      })
      .catch(() => {
        if (!active) return;
        setError('Could not check your sign-in. Please refresh and try again.');
        setLoading(false);
      });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  return { session, loading, error };
}
