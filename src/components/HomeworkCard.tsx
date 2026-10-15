import { useI18n } from '../lib/i18n';
import { useState } from 'react';
import { Link } from 'wouter';
import { Card } from './Card';
import { Icon } from './Icon';
import { useLearning } from '../lib/learningContext';
import { useLearningActions } from '../lib/useLearningActions';
import { safeUrl } from '../lib/calendar';
import type { Homework } from '../lib/types';

export function HomeworkCard({ homework }: { homework: Homework }) {
  const { t, preferences } = useI18n();
  const { data } = useLearning();
  const actions = useLearningActions();
  const submission = data.submissions.find((s) => s.homework_id === homework.id);
  const feedback = data.feedback.find((f) => f.kind === 'homework' && f.submission_id === submission?.id);
  const reviewIsCurrent = feedback && submission && new Date(feedback.created_at) >= new Date(submission.submitted_at);
  const [body, setBody] = useState(submission?.body ?? '');
  const [busy, setBusy] = useState(false);
  const [editing, setEditing] = useState(!submission);
  const overdue = new Date(`${homework.due_at}T23:59:59`) < new Date() && !submission;
  const material = safeUrl(homework.material_url);
  async function submit() {
    setBusy(true);
    const saved = await actions.homework({
      id: submission?.id ?? crypto.randomUUID(),
      homework_id: homework.id,
      body: body.trim(),
      submitted_at: new Date().toISOString(),
    });
    setBusy(false);
    if (saved) setEditing(false);
  }
  return (
    <Card className="homework-card">
      <div className="homework-header">
        <div>
          <span className={`status-badge ${submission ? 'green' : overdue ? 'purple' : 'blue'}`}>
            {reviewIsCurrent ? t('Reviewed') : submission ? t('Submitted') : overdue ? t('Overdue') : t('To do')}
          </span>
          <h2>{homework.title}</h2>
        </div>
        <span className="homework-due">
          <Icon name="calendar" size={14} />
          {t('Due')}{' '}
          {new Date(`${homework.due_at}T12:00:00`).toLocaleDateString(preferences.language, {
            day: 'numeric',
            month: 'long',
          })}
        </span>
      </div>
      <p>{homework.instructions}</p>
      <div className="homework-materials">
        <Link href={`/lessons/${homework.lesson_id}`}>
          <Icon name="book" size={15} />
          {t('Related lesson')}
        </Link>
        {material && (
          <a href={material} target="_blank" rel="noreferrer">
            <Icon name="external" size={15} />
            {t('Learning material')}
          </a>
        )}
        {['/practice', '/vocabulary', '/reading', '/writing', '/summarize'].some(
          (path) => homework.practice_path === path || homework.practice_path.startsWith(`${path}?`),
        ) && (
          <Link
            href={
              homework.practice_path.startsWith('/summarize')
                ? `${homework.practice_path}${homework.practice_path.includes('?') ? '&' : '?'}homework=${homework.id}`
                : homework.practice_path
            }
          >
            <Icon name="play" size={15} />
            {t('Assigned practice')}
          </Link>
        )}
      </div>
      {editing ? (
        <>
          <label className="field">
            {t('Your response')}
            <textarea
              rows={5}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder={t('Share your work or describe the practice you completed…')}
            />
          </label>
          <button className="spaced" disabled={busy || !body.trim()} onClick={() => void submit()}>
            <Icon name="send" size={15} />
            {busy ? t('Submitting…') : t('Submit homework')}
          </button>
        </>
      ) : (
        <>
          <p className="submission-body">{submission?.body}</p>
          <button className="secondary" onClick={() => setEditing(true)}>
            <Icon name="edit" size={15} />
            {t('Revise submission')}
          </button>
        </>
      )}
      {feedback && (
        <div className="feedback-card">
          <strong>
            {reviewIsCurrent ? t('Tutor feedback') : t('Feedback on your previous version')} · {feedback.score}%
          </strong>
          <p>{feedback.comment}</p>
        </div>
      )}
    </Card>
  );
}
