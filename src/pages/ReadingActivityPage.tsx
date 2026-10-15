import { useI18n } from '../lib/i18n';
import { useState } from 'react';
import { Link } from 'wouter';
import { Card } from '../components/Card';
import { Icon } from '../components/Icon';
import { PageHeading } from '../components/PageHeading';
import { QuizRunner } from '../components/QuizRunner';
import type { PracticeQuestion } from '../components/QuestionCard';
import { useLearning } from '../lib/learningContext';
import { wordMeaning, wordDefinition } from '../lib/vocabularyLanguage';

export function ReadingActivityPage({ params }: { params: { id: string } }) {
  const { t, preferences } = useI18n();
  const { data } = useLearning();
  const [run, setRun] = useState(0);
  const [selected, setSelected] = useState('');
  const passage = data.passages.find((p) => p.id === params.id);
  if (!passage)
    return (
      <Card title={t('Passage not found')}>
        <Link href="/reading">{t('Back to your reading shelf')}</Link>
      </Card>
    );
  const questions: PracticeQuestion[] = passage.questions.map((q) => ({
    ...q,
    lesson_id: '',
    topic: 'Reading comprehension',
    difficulty: passage.level.startsWith('A2') ? 'Beginner' : 'Intermediate',
    type: q.options.length ? 'choice' : 'blank',
    selfReview: !q.options.length,
  }));
  const word = data.vocabulary.find((w) => selected.toLowerCase().includes(w.word.toLowerCase()));
  return (
    <>
      <Link className="back-link" href="/reading">
        <Icon name="back" size={16} />
        {t('Reading shelf')}
      </Link>
      <PageHeading
        eyebrow={passage.level}
        title={passage.title}
        description={t('Read at your own pace. You can refer to the passage as you answer.')}
      />
      <div className="reading-layout">
        <Card className="reading-text">
          <span className="eyebrow">{t('THE PASSAGE')}</span>
          <article onMouseUp={() => setSelected(window.getSelection()?.toString().trim().slice(0, 100) ?? '')}>
            {passage.body.split('\n\n').map((p) => (
              <p key={p.slice(0, 40)}>{p}</p>
            ))}
          </article>
          <p className="muted">{t('Select a word to check whether it’s in your vocabulary collection.')}</p>
          {selected && (
            <div className="callout">
              <Icon name="vocabulary" />
              <p>
                {word ? (
                  <>
                    <strong>{word.word}</strong> · {wordMeaning(word, preferences.language)}
                    <br />
                    {wordDefinition(word, preferences.language)}
                  </>
                ) : (
                  <>
                    “{selected}
                    {t('” isn’t in your collection yet. Ask your tutor to add it.')}
                  </>
                )}
              </p>
            </div>
          )}
        </Card>
        <QuizRunner
          key={run}
          title={passage.title}
          kind="reading"
          questions={questions}
          onRetry={() => setRun(run + 1)}
        />
      </div>
    </>
  );
}
