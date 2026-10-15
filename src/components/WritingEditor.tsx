import { useI18n } from '../lib/i18n';
import { useState } from 'react';
import { WritingChecklist } from './WritingChecklist';
import { Card } from './Card';
import { Icon } from './Icon';
import { useLearning } from '../lib/learningContext';
import { useLearningActions } from '../lib/useLearningActions';
import { countWords, writingAdvice } from '../lib/writing';
import type { WritingAssignment } from '../lib/types';

export function WritingEditor({ assignment }: { assignment: WritingAssignment }) {
  const { t } = useI18n();
  const { data } = useLearning();
  const saved = data.drafts.find((d) => d.assignment_id === assignment.id);
  const [body, setBody] = useState(saved?.body ?? '');
  const [busy, setBusy] = useState(false);
  const [history, setHistory] = useState(false);
  const actions = useLearningActions();
  const count = countWords(body);
  const feedback = data.feedback.find((f) => f.kind === 'writing' && f.submission_id === saved?.id);
  const reviewIsCurrent = feedback && saved && new Date(feedback.created_at) >= new Date(saved.updated_at);
  async function save(submitted: boolean) {
    setBusy(true);
    const at = new Date().toISOString();
    const versions = saved?.body !== body ? [...(saved?.versions ?? []), { body, at }].slice(-20) : saved.versions;
    await actions.draft({
      id: saved?.id ?? crypto.randomUUID(),
      assignment_id: assignment.id,
      body,
      submitted,
      updated_at: at,
      versions,
    });
    setBusy(false);
  }
  return (
    <div className="content-two-column">
      <div className="stack">
        <Card title={t(assignment.title)} action={<span className="status-badge blue">{t(assignment.format)}</span>}>
          <p>{t(assignment.instructions)}</p>
        </Card>
        <Card>
          <div className="writing-toolbar">
            <span>
              <Icon name="pen" size={15} /> {t('Your writing space')}
            </span>
            <span>
              {body !== saved?.body && body
                ? t('Unsaved changes')
                : saved?.submitted
                  ? t('Submitted for tutor review')
                  : saved
                    ? t('Draft saved')
                    : t('A fresh page')}
            </span>
          </div>
          <textarea
            className="writing-editor"
            aria-label={t('Writing draft')}
            placeholder={t('Your ideas belong here. Start with a sentence…')}
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />
          <div className="editor-footer">
            <span>
              {count} {t('words · Goal:')} {assignment.min_words}+
            </span>
            <div className="button-row">
              <button className="secondary" disabled={busy || !body.trim()} onClick={() => void save(false)}>
                <Icon name="save" size={15} />
                {t('Save draft')}
              </button>
              <button disabled={busy || count < assignment.min_words} onClick={() => void save(true)}>
                <Icon name="send" size={15} />
                {t('Submit to tutor')}
              </button>
            </div>
          </div>
        </Card>
        {saved && (
          <Card
            title={t('Your revisions')}
            action={
              <button className="text-button" onClick={() => setHistory(!history)}>
                {history ? t('Hide history') : t('View history')}
              </button>
            }
          >
            {history ? (
              <div className="versions-list">
                {saved.versions.length ? (
                  saved.versions.map((version, i) => (
                    <button key={version.at} onClick={() => setBody(version.body)}>
                      {t('Revision')} {i + 1} · {countWords(version.body)} {t('words')}
                      <span>
                        {new Date(version.at).toLocaleString()} {t('· Restore')}
                      </span>
                    </button>
                  ))
                ) : (
                  <p>{t('No previous versions yet.')}</p>
                )}
              </div>
            ) : (
              <p>{t('Up to 20 saved versions, so you can return to an earlier idea.')}</p>
            )}
          </Card>
        )}
      </div>
      <div className="stack">
        <WritingChecklist />
        <Card title={t('A little guidance')}>
          <ul className="checklist">
            {writingAdvice(body, assignment.min_words, t).map((advice) => (
              <li key={advice}>
                <Icon name="sparkles" size={16} />
                {t(advice)}
              </li>
            ))}
          </ul>
          <p className="muted spaced" style={{ fontSize: 10 }}>
            {t('These are simple writing reminders, not automatic corrections. Your tutor provides detailed feedback.')}
          </p>
        </Card>
        <Card title={t('From your tutor')}>
          {feedback ? (
            <div className="feedback-card">
              <strong>
                {feedback.score}% · {reviewIsCurrent ? t('Reviewed') : t('Feedback on your previous version')}
              </strong>
              <p>{feedback.comment}</p>
            </div>
          ) : (
            <p>
              {saved?.submitted
                ? t('Your work is ready for your tutor. Their feedback will appear here after review.')
                : t('Submit your writing to start a conversation with your tutor.')}
            </p>
          )}
        </Card>
      </div>
    </div>
  );
}
