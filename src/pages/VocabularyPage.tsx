import { VocabularyFilters } from '../components/VocabularyFilters';
import { useEffect, useState } from 'react';
import { useSearch } from 'wouter';
import { PageHeading } from '../components/PageHeading';
import { VocabularyMatching } from '../components/VocabularyMatching';
import { VocabularyWordChallenge } from '../components/VocabularyWordChallenge';
import { useI18n } from '../lib/i18n';
import { VocabularyFlashcard } from '../components/VocabularyFlashcard';
import { Card } from '../components/Card';
import { Icon } from '../components/Icon';
import { useLearning } from '../lib/learningContext';
import { useLearningActions } from '../lib/useLearningActions';

export function VocabularyPage() {
  const { t, preferences } = useI18n();
  const { data, setNotice } = useLearning();
  const actions = useLearningActions();
  const search = useSearch();
  const [theme, setTheme] = useState('All themes');
  const [review, setReview] = useState(false);
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [mode, setMode] = useState('cards');
  const themes = [...new Set(data.vocabulary.map((w) => w.theme))];
  const words = data.vocabulary.filter(
    (w) =>
      (preferences.learning_track === 'language_arts' ||
        preferences.learning_level !== 'A2' ||
        w.difficulty === 'A2') &&
      (theme === 'All themes' || w.theme === theme) &&
      (!review ||
        data.wordProgress.some((p) => p.vocabulary_id === w.id && (!p.known || new Date(p.review_at) <= new Date()))),
  );
  const word = words[index % words.length];
  useEffect(() => {
    const id = new URLSearchParams(search).get('word');
    const found = data.vocabulary.findIndex((w) => w.id === id);
    if (found >= 0) {
      setTheme('All themes');
      setReview(false);
      setIndex(found);
      setRevealed(false);
    }
  }, [search, data.vocabulary]);
  const known = data.wordProgress.filter((w) => w.known).length;
  const needsPractice = data.wordProgress.filter((w) => !w.known).length;
  function next() {
    setIndex(index + 1);
    setRevealed(false);
  }
  async function mark(known: boolean) {
    if (!word) return;
    setBusy(true);
    const saved = await actions.word(word.id, known);
    setBusy(false);
    if (saved) next();
  }
  function pronounce() {
    if (!word || !('speechSynthesis' in window)) {
      setNotice(t('Pronunciation audio is not available in this browser.'));
      return;
    }
    const utterance = new SpeechSynthesisUtterance(word.word);
    utterance.lang = 'en-GB';
    utterance.rate = 0.8;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  }
  return (
    <>
      <PageHeading title={t('Vocabulary Games')} description={t('Learn words, then use them.')} />
      <div className="quiet-vocabulary-count">
        {t('Words you know')}: {known} · {t('Needs practice')}: {needsPractice}
      </div>
      <div className="activity-tabs" role="group" aria-label={t('Vocabulary Games')}>
        {[
          ['cards', 'Flashcards'],
          ['matching', 'Match the pairs'],
          ['words', 'Word challenge'],
        ].map(([value, label]) => (
          <button
            key={value}
            className={mode === value ? 'selected' : ''}
            aria-pressed={mode === value}
            onClick={() => setMode(value)}
          >
            {t(label)}
          </button>
        ))}
      </div>
      <VocabularyFilters
        theme={theme}
        themes={themes}
        review={review}
        onTheme={(value) => {
          setTheme(value);
          setIndex(0);
          setRevealed(false);
        }}
        onReview={(value) => {
          setReview(value);
          setIndex(0);
          setRevealed(false);
        }}
      />
      {word ? (
        mode === 'matching' ? (
          <VocabularyMatching key={`${theme}-${review}-${preferences.language}`} words={words} />
        ) : mode === 'words' ? (
          <VocabularyWordChallenge key={`${theme}-${review}-${preferences.language}`} words={words.slice(0, 6)} />
        ) : (
          <VocabularyFlashcard
            word={word}
            position={(index % words.length) + 1}
            total={words.length}
            revealed={revealed}
            busy={busy}
            onReveal={() => setRevealed(true)}
            onPronounce={pronounce}
            onMark={mark}
            onNext={next}
          />
        )
      ) : (
        <Card className="empty-state">
          <Icon name="trophy" size={36} />
          <h2>{data.vocabulary.length ? t('You’re all caught up.') : t('Your word collection is on its way.')}</h2>
          <p>
            {data.vocabulary.length
              ? t('No words are due in this theme. Explore another theme or revisit all words.')
              : t('Your tutor can add new words to practise here.')}
          </p>
          {data.vocabulary.length > 0 && (
            <button
              className="secondary"
              onClick={() => {
                setReview(false);
                setTheme('All themes');
              }}
            >
              {t('Explore all words')}
            </button>
          )}
        </Card>
      )}
    </>
  );
}
