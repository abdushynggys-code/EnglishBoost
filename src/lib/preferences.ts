import { supabase } from './supabase';

export type Language = 'en' | 'de' | 'ru';
export type Preferences = {
  language: Language;
  learning_track: 'access2' | 'language_arts';
  learning_level: 'A2' | 'B1';
  sound_effects: boolean;
};
export const defaultPreferences: Preferences = {
  language: 'en',
  learning_track: 'access2',
  learning_level: 'A2',
  sound_effects: false,
};
export const languageNames: Record<Language, string> = { en: 'English', de: 'Deutsch', ru: 'Русский' };
const preferenceKey = 'englishboost-preferences';

export function readPreferences(): Preferences | null {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(preferenceKey) ?? 'null');
    if (
      !value ||
      typeof value !== 'object' ||
      !('language' in value) ||
      !['en', 'de', 'ru'].includes(String(value.language))
    )
      return null;
    const saved = value as Partial<Preferences>;
    return {
      language: saved.language!,
      learning_track: saved.learning_track === 'language_arts' ? 'language_arts' : 'access2',
      learning_level: saved.learning_level === 'B1' ? 'B1' : 'A2',
      sound_effects: saved.sound_effects === true,
    };
  } catch {
    return null;
  }
}

export function cachePreferences(value: Preferences) {
  try {
    localStorage.setItem(preferenceKey, JSON.stringify(value));
  } catch {
    /* Preferences still work in memory. */
  }
}

export async function savePreferences(userId: string, value: Preferences) {
  const { error } = await supabase.from('profiles').update(value).eq('id', userId);
  if (error) throw new Error(error.message);
}
