import { useState } from 'react';
import { useI18n } from '../../lib/i18n';
import { languageNames } from '../../lib/preferences';
import type { Language } from '../../lib/preferences';

export function PublicLanguagePicker() {
  const { t, preferences, save } = useI18n();
  const [busy, setBusy] = useState(false);
  return <select className="public-language" aria-label={t('Language for explanations')} disabled={busy}
    value={preferences.language} onChange={async (event) => {
      setBusy(true);
      await save({ ...preferences, language: event.target.value as Language });
      setBusy(false);
    }}>
    {(Object.keys(languageNames) as Language[]).map((language) =>
      <option key={language} value={language} lang={language}>{languageNames[language]}</option>)}
  </select>;
}
