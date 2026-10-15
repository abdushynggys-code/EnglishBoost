import { useI18n } from '../lib/i18n';
export function VocabularyFilters({
  theme,
  themes,
  review,
  onTheme,
  onReview,
}: {
  theme: string;
  themes: string[];
  review: boolean;
  onTheme: (value: string) => void;
  onReview: (value: boolean) => void;
}) {
  const { t } = useI18n();
  return (
    <div className="filter-bar">
      <label className="inline-select">
        {t('Theme')}
        <select
          value={theme}
          onChange={(e) => {
            onTheme(e.target.value);
          }}
        >
          <option value="All themes">{t('All themes')}</option>
          {themes.map((themeName) => (
            <option key={themeName} value={themeName}>
              {t(themeName)}
            </option>
          ))}
        </select>
      </label>
      <div className="segmented">
        <button
          className={!review ? 'selected' : ''}
          onClick={() => {
            onReview(false);
          }}
        >
          {t('All words')}
        </button>
        <button
          className={review ? 'selected' : ''}
          onClick={() => {
            onReview(true);
          }}
        >
          {t('Review difficult & due')}
        </button>
      </div>
    </div>
  );
}
