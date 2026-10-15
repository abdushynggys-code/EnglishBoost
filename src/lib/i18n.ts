import { createContext, useContext } from 'react';
import type { Preferences } from './preferences';
import { commonPhrases } from '../locales/common';
import { learningPhrases } from '../locales/learning';
import { accountPhrases } from '../locales/account';
import { summaryPhrases } from '../locales/summary';
import { tutorPhrases } from '../locales/tutor';
import { contentPhrases } from '../locales/content';
import { interfacePhrases } from '../locales/interface';
import { feedbackPhrases } from '../locales/feedback';
import { writingPhrases } from '../locales/writing';
import { readingPhrases } from '../locales/reading';

export type PhraseMap = Record<string, readonly [string, string]>;
const phrases: PhraseMap = {
  ...commonPhrases,
  ...learningPhrases,
  ...accountPhrases,
  ...summaryPhrases,
  ...tutorPhrases,
  ...contentPhrases,
  ...interfacePhrases,
  ...feedbackPhrases,
  ...writingPhrases,
  ...readingPhrases,
};
const normalizedPhrases = Object.fromEntries(Object.entries(phrases).map(([key, value]) => [key.toLowerCase(), value]));
export type Translator = (text: string, values?: Record<string, string | number>) => string;
export type LanguageContextValue = {
  preferences: Preferences;
  onboarded: boolean;
  t: Translator;
  save: (value: Preferences) => Promise<boolean>;
};
export const LanguageContext = createContext<LanguageContextValue | null>(null);

export function useI18n() {
  const value = useContext(LanguageContext);
  if (!value) throw new Error('LanguageProvider is missing');
  return value;
}

export function translate(
  language: Preferences['language'],
  text: string,
  values: Record<string, string | number> = {},
) {
  let result = language === 'en' ? text : (normalizedPhrases[text.toLowerCase()]?.[language === 'de' ? 0 : 1] ?? text);
  for (const [key, value] of Object.entries(values)) result = result.split(`{${key}}`).join(String(value));
  return result;
}
