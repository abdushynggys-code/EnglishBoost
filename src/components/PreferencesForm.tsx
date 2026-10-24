import { useEffect, useState } from 'react';
import { useI18n, translate } from '../lib/i18n';
import { languageNames } from '../lib/preferences';
import type { Language } from '../lib/preferences';
import { Icon } from './Icon';

export function PreferencesForm({ onboarding = false }: { onboarding?: boolean }) {
  const Heading = onboarding ? 'h1' : 'h2';
  const { preferences, save } = useI18n();
  const [draft, setDraft] = useState(preferences);
  const [step, setStep] = useState(1);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);
  useEffect(() => setSaved(false), [draft]);
  const t = (text: string) => translate(draft.language, text);
  async function submit() {
    setBusy(true);
    setError('');
    const saved = await save(draft);
    if (!saved) setError(t('Could not save your language. Please try again.'));
    setSaved(saved);
    setBusy(false);
  }
  return (
    <div className="preferences-form">
      {(!onboarding || step === 1) && (
        <>
          <Heading>{t('What language feels most comfortable?')}</Heading>
          <p>{t('Choose a language for instructions and feedback.')}</p>
          <div className="language-choices">
            {(Object.keys(languageNames) as Language[]).map((language) => (
              <button
                key={language}
                type="button"
                className={`language-choice ${draft.language === language ? 'selected' : ''}`}
                onClick={() => setDraft({ ...draft, language })}
                aria-pressed={draft.language === language}
                lang={language}
              >
                <span className="language-code">{language.toUpperCase()}</span>
                <strong>{languageNames[language]}</strong>
                {draft.language === language && <Icon name="check" size={18} />}
              </button>
            ))}
          </div>
          <p className="preference-hint">{t('English practice stays in English. You can change this any time.')}</p>
        </>
      )}
      {(!onboarding || step === 2) && (
        <div className="preference-focus">
          <Heading>{t('What would you like to work on?')}</Heading>
          <div className="focus-choices">
            <button
              type="button"
              className={`focus-choice ${draft.learning_track === 'access2' ? 'selected' : ''}`}
              onClick={() => setDraft({ ...draft, learning_track: 'access2' })}
              aria-pressed={draft.learning_track === 'access2'}
            >
              <Icon name="book" />
              <span>
                <strong>{t('Learning English')}</strong>
                <small>{t('School English · Access 2')}</small>
              </span>
            </button>
            <button
              type="button"
              className={`focus-choice ${draft.learning_track === 'language_arts' ? 'selected' : ''}`}
              onClick={() => setDraft({ ...draft, learning_track: 'language_arts' })}
              aria-pressed={draft.learning_track === 'language_arts'}
            >
              <Icon name="pen" />
              <span>
                <strong>{t('Clear writing & summarizing')}</strong>
                <small>{t('Language arts · including native speakers')}</small>
              </span>
            </button>
          </div>
          {draft.learning_track === 'access2' && (
            <label className="field spaced">
              {t('Practice level')}
              <select
                value={draft.learning_level}
                onChange={(event) => setDraft({ ...draft, learning_level: event.target.value as 'A2' | 'B1' })}
              >
                <option value="A2">{t('Start gently · A1–A2')}</option>
                <option value="B1">{t('Step up · B1')}</option>
              </select>
            </label>
          )}
          {!onboarding && (
            <label className="sound-setting">
              <input
                type="checkbox"
                checked={draft.sound_effects}
                onChange={(event) => setDraft({ ...draft, sound_effects: event.target.checked })}
              />
              <span>
                <strong>{t('Click sounds')}</strong>
                <small>{t('Soft clicks and pops. Off by default.')}</small>
              </span>
            </label>
          )}
        </div>
      )}
      {error && (
        <p className="message" role="alert">
          {error}
        </p>
      )}
      {saved && !onboarding && <p role="status">{t('Settings saved.')}</p>}
      <div className="button-row spaced">
        {onboarding && step === 2 && (
          <button className="secondary" onClick={() => setStep(1)}>
            {t('Back')}
          </button>
        )}
        <button disabled={busy} onClick={() => (onboarding && step === 1 ? setStep(2) : void submit())}>
          {busy ? t('Saving…') : t(onboarding ? (step === 1 ? 'Continue' : 'Let’s begin') : 'Save settings')}
          <Icon name="arrow" size={16} />
        </button>
      </div>
    </div>
  );
}
