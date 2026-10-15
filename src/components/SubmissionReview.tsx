import { useI18n } from '../lib/i18n';
import { useState } from 'react';
import { Card } from './Card';
import { Icon } from './Icon';
import { useLearning } from '../lib/learningContext';
import { reviewSubmission } from '../lib/tutorApi';
import type { Feedback } from '../lib/types';

export function SubmissionReview({
  studentId,
  submissionId,
  kind,
  title,
  body,
  feedback,
  onSaved,
}: {
  studentId: string;
  submissionId: string;
  kind: 'writing' | 'homework';
  title: string;
  body: string;
  feedback?: Feedback;
  onSaved: () => Promise<void>;
}) {
  const { t } = useI18n();
  const { setNotice } = useLearning();
  const [comment, setComment] = useState(feedback?.comment ?? '');
  const [score, setScore] = useState(feedback?.score ?? 0);
  const [busy, setBusy] = useState(false);
  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    try {
      await reviewSubmission({ user_id: studentId, submission_id: submissionId, kind, comment: comment.trim(), score });
      await onSaved();
      setNotice(t('Feedback saved. The student can read it in their workspace.'));
    } catch (cause) {
      setNotice(cause instanceof Error ? cause.message : 'Could not save feedback.');
    } finally {
      setBusy(false);
    }
  }
  return (
    <Card
      title={title}
      action={
        <span className={`status-badge ${feedback ? 'green' : 'blue'}`}>
          {feedback ? t('Reviewed') : t('Awaiting feedback')}
        </span>
      }
    >
      <p className="submission-body">{body}</p>
      <form className="form" onSubmit={(event) => void submit(event)}>
        <label className="field">
          {t('Your feedback')}
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
            placeholder={t('What went well? What should the student try next?')}
            required
          />
        </label>
        <label className="field">
          {t('Score out of 100')}
          <input
            className="score-input"
            type="number"
            min={0}
            max={100}
            value={score}
            onChange={(e) => setScore(Number(e.target.value))}
            required
          />
        </label>
        <button disabled={busy || !comment.trim()}>
          <Icon name="check" size={16} />
          {busy ? t('Saving…') : t('Save feedback & mark reviewed')}
        </button>
      </form>
    </Card>
  );
}
