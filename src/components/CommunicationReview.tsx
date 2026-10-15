import { useState } from 'react';
import { Card } from './Card';
import { useI18n } from '../lib/i18n';
import { useLearning } from '../lib/learningContext';
import { reviewConciseAttempt } from '../lib/conciseApi';
import type { ConciseAttempt } from '../lib/summaryTypes';

export function CommunicationReview({ attempt, onSaved }: { attempt: ConciseAttempt; onSaved: () => Promise<void> }) {
  const { t } = useI18n();
  const { setNotice } = useLearning();
  const [comment, setComment] = useState(attempt.tutor_comment ?? '');
  const [score, setScore] = useState(attempt.tutor_score ?? 0);
  const [busy, setBusy] = useState(false);
  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    try {
      await reviewConciseAttempt(attempt.id, comment.trim(), score);
      await onSaved();
      setNotice(t('Your practice is saved.'));
    } catch (cause) {
      setNotice(t(cause instanceof Error ? cause.message : 'Could not save. Please try again.'));
    } finally {
      setBusy(false);
    }
  }
  return (
    <Card title={t('Get to the Point!')}>
      <h3 lang="en">{attempt.prompt}</h3>
      <div className="summary-comparison">
        <div>
          <small>{t('Original')}</small>
          <p lang="en">{attempt.original}</p>
        </div>
        <div>
          <small>{t('Improved')}</small>
          <p lang="en">{attempt.improved || `${attempt.objective_correct} / ${attempt.objective_total}`}</p>
        </div>
      </div>
      <form className="form" onSubmit={(event) => void submit(event)}>
        <label className="field">
          {t('Your feedback')}
          <textarea rows={3} value={comment} onChange={(event) => setComment(event.target.value)} required />
        </label>
        <label className="field">
          {t('Score out of 100')}
          <input
            type="number"
            className="score-input"
            value={score}
            min={0}
            max={100}
            onChange={(event) => setScore(Number(event.target.value))}
            required
          />
        </label>
        <button disabled={busy || !comment.trim()}>
          {t(busy ? t('Saving…') : t('Save feedback & mark reviewed'))}
        </button>
      </form>
    </Card>
  );
}
