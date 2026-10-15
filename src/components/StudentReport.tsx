import { useI18n } from '../lib/i18n';
import { useState } from 'react';
import { Card } from './Card';
import { Icon } from './Icon';
import { ProgressReport } from './ProgressReport';
import { CommunicationHistory } from './CommunicationHistory';
import { topicAccuracy } from '../lib/progress';
import type { Profile, Workspace } from '../lib/types';

export function StudentReport({ student, data }: { student?: Profile; data: Workspace }) {
  const { t } = useI18n();
  const [summary, setSummary] = useState('');
  function generateSummary() {
    const weak = topicAccuracy(data)
      .filter((t) => t.accuracy < 70)
      .map((t) => `${t.topic} (${t.accuracy}%)`);
    setSummary(
      `${student?.full_name || student?.email}: ${data.lessonProgress.filter((p) => p.status === 'completed').length} of ${data.lessons.length} lessons completed, ${data.attempts.length} practice attempts, ${data.wordProgress.filter((w) => w.known).length} words known, and ${data.drafts.filter((d) => d.submitted).length} writing assignments submitted. ${weak.length ? `Recommended focus: ${weak.join(', ')}.` : 'No weak grammar topics identified from the available results yet.'}`,
    );
  }
  return (
    <>
      <Card
        title={t('Student progress report')}
        action={
          <button className="secondary" onClick={generateSummary}>
            {t('Generate summary')} <Icon name="file" size={15} />
          </button>
        }
      >
        <p>{student?.email}</p>
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
