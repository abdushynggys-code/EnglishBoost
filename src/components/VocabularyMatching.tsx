import { useState } from 'react';
import { Card } from './Card';
import { Icon } from './Icon';
import { useI18n } from '../lib/i18n';
import { wordMeaning } from '../lib/vocabularyLanguage';
import { useLearningActions } from '../lib/useLearningActions';
import type { Word } from '../lib/types';

function shuffle<T>(values: T[]) {
  const result = [...values];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
export function VocabularyMatching({ words }: { words: Word[] }) {
  const { t, preferences } = useI18n();
  const actions = useLearningActions();
  const [cards] = useState(() => shuffle(words).slice(0, 4));
  const [meanings] = useState(() => shuffle(cards));
  const [selected, setSelected] = useState('');
  const [matched, setMatched] = useState<string[]>([]);
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  async function match(id: string) {
    if (!selected) return;
    setBusy(true);
    if (selected === id) {
      if (await actions.word(id, true)) {
        setMatched([...matched, id]);
        setMessage(t('That’s right. Nice work!'));
      }
    } else {
      await actions.word(selected, false);
      setMessage(t('Not quite. Try a different pair.'));
    }
    setSelected('');
    setBusy(false);
  }
  return (
    <Card title={t('Match the pairs')}>
      <p>{t('Choose an English word, then its meaning.')}</p>
      <div className="matching-grid">
        <div>
          {cards.map((word) => (
            <button
              key={word.id}
              className={`matching-card ${matched.includes(word.id) ? 'matched' : selected === word.id ? 'selected' : ''}`}
              disabled={busy || matched.includes(word.id)}
              onClick={() => {
                setSelected(word.id);
                setMessage('');
              }}
              lang="en"
            >
              {word.word}
              {matched.includes(word.id) && <Icon name="check" size={17} />}
            </button>
          ))}
        </div>
        <div>
          {meanings.map((word) => (
            <button
              className={`matching-card ${matched.includes(word.id) ? 'matched' : ''}`}
              key={word.id}
              disabled={busy || !selected || matched.includes(word.id)}
              onClick={() => void match(word.id)}
            >
              {wordMeaning(word, preferences.language)}
              {matched.includes(word.id) && <Icon name="check" size={17} />}
            </button>
          ))}
        </div>
      </div>
      <p role="status" className="spaced">
        {matched.length === cards.length ? t('All pairs matched. Nice work!') : t(message)} {matched.length} /{' '}
        {cards.length}
      </p>
    </Card>
  );
}
