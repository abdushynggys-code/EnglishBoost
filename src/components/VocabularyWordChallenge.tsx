import { useState } from 'react';
import { Card } from './Card';
import { useI18n } from '../lib/i18n';
import { wordMeaning } from '../lib/vocabularyLanguage';
import { useLearningActions } from '../lib/useLearningActions';
import { isAnswerCorrect } from '../lib/quiz';
import type { Word } from '../lib/types';

export function VocabularyWordChallenge({ words }: { words: Word[] }) {
  const { t, preferences } = useI18n();
  const actions = useLearningActions();
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [checked, setChecked] = useState(false);
  const [busy, setBusy] = useState(false);
  const [score, setScore] = useState(0);
  const word = words[index];
  async function check(event: React.FormEvent) {
    event.preventDefault();
    if (!word || checked) return;
    setBusy(true);
    const correct = isAnswerCorrect(answer, word.word);
    if (await actions.word(word.id, correct)) {
      setChecked(true);
      if (correct) setScore(score + 1);
    }
    setBusy(false);
  }
  if (!word)
    return (
      <Card title={t('Practice complete')}>
        <p>
          {score} / {words.length}
        </p>
        <button
          className="spaced"
          onClick={() => {
            setIndex(0);
            setScore(0);
            setChecked(false);
            setAnswer('');
          }}
        >
          {t('Try again')}
        </button>
      </Card>
    );
  return (
    <Card title={t('Word challenge')}>
      <p>{t('Write the English word for this meaning.')}</p>
      <h2 className="english-prompt">{wordMeaning(word, preferences.language)}</h2>
      <form onSubmit={(event) => void check(event)} className="form">
        <label className="field">
          {t('Your answer')}
          <input
            value={answer}
            readOnly={checked}
            onChange={(event) => setAnswer(event.target.value)}
            required
            autoComplete="off"
            lang="en"
          />
        </label>
        {checked ? (
          <>
            <p role="status">
              {t(isAnswerCorrect(answer, word.word) ? t('That’s right. Nice work!') : t('Correct answer:'))}{' '}
              {!isAnswerCorrect(answer, word.word) && word.word}
            </p>
            <button
              type="button"
              onClick={() => {
                setIndex(index + 1);
                setChecked(false);
                setAnswer('');
              }}
            >
              {t('Next')}
            </button>
          </>
        ) : (
          <button disabled={busy || !answer.trim()}>{t('Check answer')}</button>
        )}
      </form>
    </Card>
  );
}
