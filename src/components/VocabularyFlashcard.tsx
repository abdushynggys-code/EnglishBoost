import { Card } from './Card';
import { Icon } from './Icon';
import type { Word } from '../lib/types';
import { useI18n } from '../lib/i18n';
import { wordMeaning, wordDefinition } from '../lib/vocabularyLanguage';

export function VocabularyFlashcard({
  word,
  position,
  total,
  revealed,
  busy,
  onReveal,
  onPronounce,
  onMark,
  onNext,
}: {
  word: Word;
  position: number;
  total: number;
  revealed: boolean;
  busy: boolean;
  onReveal: () => void;
  onPronounce: () => void;
  onMark: (known: boolean) => Promise<void>;
  onNext: () => void;
}) {
  const { t, preferences } = useI18n();
  return (
    <div className="flashcard-wrap">
      <Card className="flashcard">
        <div className="flashcard-top">
          <span className="status-badge purple">{t(word.theme)}</span>
          <span>
            {word.difficulty}{' '}
            <span className="muted">
              · {position} / {total}
            </span>
          </span>
        </div>
        <span className="eyebrow">{t('YOUR NEXT NEW WORD')}</span>
        <h2>
          {word.word}
          <button className="icon-button" aria-label={`Hear ${word.word}`} onClick={onPronounce}>
            <Icon name="volume" size={24} />
          </button>
        </h2>
        <p className="word-definition">{wordDefinition(word, preferences.language)}</p>
        <blockquote>“{word.example}”</blockquote>
        {revealed ? (
          <div className="translation" role="status">
            <small>
              {t(
                preferences.language === 'de'
                  ? t('German translation')
                  : preferences.language === 'ru'
                    ? t('Russian translation')
                    : t('Meaning in English'),
              )}
            </small>
            <strong>{wordMeaning(word, preferences.language)}</strong>
          </div>
        ) : (
          <button className="secondary reveal-button" onClick={onReveal}>
            {t('Reveal meaning')}
            <Icon name="down" size={16} />
          </button>
        )}
        <div className="flashcard-actions">
          <button className="secondary" disabled={busy} onClick={() => void onMark(false)}>
            <Icon name="retry" size={17} />
            {t('Needs practice')}
          </button>
          <button disabled={busy} onClick={() => void onMark(true)}>
            <Icon name="check" size={18} />
            {t('I know this word')}
          </button>
        </div>
      </Card>
      <button className="text-button next-card" onClick={onNext} disabled={busy}>
        {t('Skip to next word')} <Icon name="arrow" size={16} />
      </button>
      <p className="centered muted">{t('Difficult words return tomorrow. Known words return in seven days.')}</p>
    </div>
  );
}
