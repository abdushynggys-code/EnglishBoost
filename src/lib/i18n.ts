import { createContext, useContext } from "react";
import type { Preferences } from "./preferences";

export type PhraseMap = Record<string, readonly [string, string]>;
type PolishedPhraseMap = Record<string, readonly string[]>;
export type TranslationCatalog = { phrases: PhraseMap; polished: PolishedPhraseMap; kazakh: Record<string, string> };

let catalog: TranslationCatalog | undefined;
let catalogRequest: Promise<void> | undefined;

export function loadTranslations() {
  catalogRequest ??= import("./i18nCatalog").then(({ translationCatalog }) => {
    catalog = translationCatalog;
  });
  return catalogRequest;
}
const languageIndex = { en: 0, de: 1, ru: 2, kk: 3 } as const;
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
  if (!value) throw new Error("LanguageProvider is missing");
  return value;
}

export function translate(language: Preferences["language"], text: string, values: Record<string, string | number> = {}) {
  const key = text.toLowerCase();
  let result =
    catalog?.polished[key]?.[languageIndex[language]] ??
    (language === "en"
      ? text
      : language === "kk"
        ? (catalog?.kazakh[key] ?? text)
        : (catalog?.phrases[key]?.[language === "de" ? 0 : 1] ?? text));
  for (const [key, value] of Object.entries(values)) result = result.split(`{${key}}`).join(String(value));
  return result;
}
