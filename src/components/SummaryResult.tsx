import { useState } from 'react';
import { useLocation } from 'wouter';
import { Card } from './Card';
import { Icon } from './Icon';
import { useI18n } from '../lib/i18n';
import { countWords } from '../lib/writing';
import { useLearning } from '../lib/learningContext';
import { useLearningActions } from '../lib/useLearningActions';
import type { ConciseAttempt } from '../lib/summaryTypes';

export function SummaryResult({ attempt, onAgain }: { attempt: ConciseAttempt; onAgain: () => void }) {
  const { t } = useI18n();
  const { data } = useLearning();
  const actions = useLearningActions();
  const [, navigate] = useLocation();
  const [busy, setBusy] = useState(false);
  async function submitHomework() {
    if (!attempt.homework_id) return;
    setBusy(true);
    const existing = data.submissions.find((s) => s.homework_id === attempt.homework_id);
    const saved = await actions.homework({
      id: existing?.id ?? crypto.randomUUID(),
      homework_id: attempt.homework_id,
      body: `${attempt.prompt}\n\nOriginal:\n${attempt.original}\n\nImproved:\n${attempt.improved}`,
      submitted_at: new Date().toISOString(),
    });
    setBusy(false);
    if (saved) navigate('/homework');
  }
  return (
    <Card className="summary-result">
      <span className="summary-done">
        <Icon name="check" size={29} />
      </span>
      <h2>{t('Your practice is saved.')}</h2>
      {attempt.objective_total > 0 ? (
        <p>
          {t(attempt.mode === 'styles' ? t('Style matches') : t('Details checked'))}: {attempt.objective_correct} /{' '}
          {attempt.objective_total}
        </p>
      ) : (
        <>
          <p>
            {t('Self-check points')}: {attempt.points} / 4
          </p>
          <p className="muted">
            {t('Points reward your reflection, not the fewest words. Your tutor checks the meaning.')}
          </p>
        </>
      )}
      {attempt.improved && (
        <div className="summary-comparison">
          <div>
            <small>
              {t('Original')} · {countWords(attempt.original)} {t('words')}
            </small>
            <p lang="en">{attempt.original}</p>
          </div>
          <div>
            <small>
              {t('Improved')} · {countWords(attempt.improved)} {t('words')}
            </small>
            <p lang="en">{attempt.improved}</p>
          </div>
        </div>
      )}
      <div className="button-row">
        {attempt.source === 'classroom' ? (
          <p>{t('The tutor controls the next activity.')}</p>
        ) : (
          <button onClick={onAgain}>
            {t('Practise another')}
            <Icon name="arrow" size={16} />
          </button>
        )}
        {attempt.homework_id && (
          <button className="secondary" disabled={busy} onClick={() => void submitHomework()}>
            {t('Use as homework response')}
          </button>
        )}
      </div>
    </Card>
  );
}
