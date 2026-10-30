import { useState } from "react";
import { appearanceThemes, readAppearanceTheme, saveAppearanceTheme } from "../lib/appearance";
import type { AppearanceTheme } from "../lib/appearance";
import { useI18n } from "../lib/i18n";
import { Icon } from "./Icon";

const labels: Record<AppearanceTheme, string> = {
  auto: "Auto",
  light: "Light",
  dark: "Dark",
  beige: "Beige",
  green: "Green",
  darker: "Darker",
  grey: "Grey",
};

export function AppearancePicker() {
  const { t } = useI18n();
  const [selected, setSelected] = useState(readAppearanceTheme);

  function choose(theme: AppearanceTheme) {
    setSelected(theme);
    saveAppearanceTheme(theme);
  }

  return (
    <div className="appearance-picker">
      <p>{t("Choose a theme, or match this device automatically.")}</p>
      <div className="appearance-grid">
        {appearanceThemes.map((theme) => (
          <button
            key={theme}
            type="button"
            className={`appearance-option appearance-${theme}`}
            aria-pressed={selected === theme}
            onClick={() => choose(theme)}
          >
            <span className="appearance-preview" aria-hidden="true"><i /><i /><i /></span>
            <span>{t(labels[theme])}</span>
            {selected === theme && <Icon name="check" size={16} />}
          </button>
        ))}
      </div>
      <p className="preference-hint">{t("Auto follows your device’s light or dark setting.")}</p>
    </div>
  );
}
