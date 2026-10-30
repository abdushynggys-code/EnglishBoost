export const appearanceThemes = ["auto", "light", "dark", "beige", "green", "darker", "grey"] as const;

export type AppearanceTheme = (typeof appearanceThemes)[number];
export type ResolvedTheme = Exclude<AppearanceTheme, "auto">;

const storageKey = "englishboost-appearance";
let mediaQuery: MediaQueryList | undefined;
let initialized = false;

function isAppearanceTheme(value: string | null): value is AppearanceTheme {
  return appearanceThemes.some((theme) => theme === value);
}

export function readAppearanceTheme(): AppearanceTheme {
  try {
    const saved = localStorage.getItem(storageKey);
    return isAppearanceTheme(saved) ? saved : "auto";
  } catch {
    return "auto";
  }
}

function resolveTheme(theme: AppearanceTheme): ResolvedTheme {
  if (theme !== "auto") return theme;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function applyAppearanceTheme(theme: AppearanceTheme) {
  const resolved = resolveTheme(theme);
  document.documentElement.dataset.appearance = theme;
  document.documentElement.dataset.colorTheme = resolved;
  document.documentElement.style.colorScheme = resolved === "dark" || resolved === "darker" ? "dark" : "light";
}

export function saveAppearanceTheme(theme: AppearanceTheme) {
  try {
    localStorage.setItem(storageKey, theme);
  } catch {
    // The theme still applies for this visit when storage is unavailable.
  }
  applyAppearanceTheme(theme);
}

export function initializeAppearance() {
  applyAppearanceTheme(readAppearanceTheme());
  if (initialized) return;
  initialized = true;
  mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  mediaQuery.addEventListener("change", () => {
    if (readAppearanceTheme() === "auto") applyAppearanceTheme("auto");
  });
}
