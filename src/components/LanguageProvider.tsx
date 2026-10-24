import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { LanguageContext, translate } from '../lib/i18n';
import { cachePreferences, defaultPreferences, readPreferences, savePreferences } from '../lib/preferences';
import type { Preferences } from '../lib/preferences';
import { useLearning } from '../lib/learningContext';
import { useClickSound } from '../lib/useClickSound';

export function LanguageProvider({ children }: { children: ReactNode }) {
  const { profile, session, demo, setProfile, setNotice } = useLearning();
  const [preferences, setPreferences] = useState(() => readPreferences() ?? defaultPreferences);
  const [onboarded, setOnboarded] = useState(() => !!readPreferences());
  const synced = useRef('');
  useClickSound(preferences.sound_effects);
  const save = useCallback(
    async (value: Preferences) => {
      try {
        if (session && profile && !demo) await savePreferences(session.user.id, value);
        cachePreferences(value);
        setPreferences(value);
        setOnboarded(true);
        if (profile) setProfile((current) => current && { ...current, ...value });
        return true;
      } catch {
        setNotice(translate(value.language, 'Could not save your language. Please try again.'));
        return false;
      }
    },
    [session, profile, demo, setProfile, setNotice],
  );

  useEffect(() => {
    if (!profile) {
      synced.current = '';
      return;
    }
    if (profile.id === synced.current || demo) return;
    synced.current = profile.id;
    if (profile.language) {
      const value: Preferences = {
        language: profile.language,
        learning_track: profile.learning_track ?? 'access2',
        learning_level: profile.learning_level ?? 'A2',
        sound_effects: profile.sound_effects ?? false,
      };
      setPreferences(value);
      setOnboarded(true);
      cachePreferences(value);
    } else if (readPreferences()) void save(readPreferences()!);
    else setOnboarded(false);
  }, [profile, demo, save]);
  useEffect(() => {
    document.documentElement.lang = preferences.language;
  }, [preferences.language]);
  const t = useCallback(
    (text: string, values?: Record<string, string | number>) => translate(preferences.language, text, values),
    [preferences.language],
  );
  const value = useMemo(() => ({ preferences, onboarded, save, t }), [preferences, onboarded, save, t]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}
