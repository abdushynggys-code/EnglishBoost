import { useI18n } from '../lib/i18n';
import { useState } from 'react';
import { Card } from './Card';
import { Icon } from './Icon';
import { ProgressReport } from './ProgressReport';
import { CommunicationHistory } from './CommunicationHistory';
import { askAi } from '../lib/aiApi';
import { topicAccuracy } from '../lib/progress';
import type { Profile, Workspace } from '../lib/types';

export function StudentReport({ student, data }: { student?: Profile; data: Workspace }) {
  const { t } = useI18n();
  const [summary, setSummary] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function generateSummary() {
    const weak = topicAccuracy(data)
      .filter((t) => t.accuracy < 70)
      .map((t) => `${t.topic} (${t.accuracy}%)`);
    const progress = {
      completedLessons: data.lessonProgress.filter((p) => p.status === 'completed').length,
      totalLessons: data.lessons.length,
      practiceAttempts: data.attempts.length,
      knownWords: data.wordProgress.filter((w) => w.known).length,
      submittedWriting: data.drafts.filter((d) => d.submitted).length,
      focusTopics: weak,
    };

    setBusy(true);
    setError('');
    try {
      const generated = await askAi(
        `Write a progress summary from these learning statistics:\n${JSON.stringify(progress)}`,
        'You are an encouraging English tutor. Write 2-3 concise sentences for a tutor. Mention evidence, one strength, and one practical next step. Do not invent facts or use a student name.',
      );
      setSummary(generated);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not generate the summary.');
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <Card
        title={t('Student progress report')}
        action={
          <button className="secondary" disabled={busy} onClick={() => void generateSummary()}>
            {t(busy ? 'Generating…' : 'Generate summary')} <Icon name="file" size={15} />
          </button>
        }
      >
        <p>{student?.email}</p>
        {error && <p className="form-error" role="alert">{t(error)}</p>}
        {summary && <div className="tutor-summary">{summary}</div>}
      </Card>
      <ProgressReport data={data} />
      <CommunicationHistory attempts={data.conciseAttempts} />
      <Card title={t('Lesson completion')}>
        <div className="tutor-list">
          {data.lessons.map((lesson) => (
            <div className="topic-label" key={lesson.id}>
              <span>
                {t('Week')} {lesson.week}: {lesson.title}
              </span>
              <span>
                {data.lessonProgress.find((p) => p.lesson_id === lesson.id)?.status.replace('_', ' ') ?? 'Not started'}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}
