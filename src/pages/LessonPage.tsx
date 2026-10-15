import { useI18n } from '../lib/i18n';
import { useState } from 'react';
import { Link } from 'wouter';
import { Card } from '../components/Card';
import { PageHeading } from '../components/PageHeading';
import { Icon } from '../components/Icon';
import { useLearning } from '../lib/learningContext';
import { useLearningActions } from '../lib/useLearningActions';
import { lessonExplanation } from '../lib/lessonLanguage';

export function LessonPage({ params }: { params: { id: string } }) {
  const { t, preferences } = useI18n();
  const { data } = useLearning();
  const actions = useLearningActions();
  const [busy, setBusy] = useState(false);
  const lesson = data.lessons.find((l) => l.id === params.id);
  if (!lesson)
    return (
      <Card title={t('Lesson not found')}>
        <Link href="/lessons">{t('Back to the lesson plan')}</Link>
      </Card>
    );
  const status = data.lessonProgress.find((p) => p.lesson_id === lesson.id)?.status;
  async function changeStatus(next: 'in_progress' | 'completed') {
    if (!lesson) return;
    setBusy(true);
    await actions.lesson(lesson.id, next);
    setBusy(false);
  }
  return (
    <>
      <Link href="/lessons" className="back-link">
        <Icon name="back" size={16} />
        {t('Your lesson plan')}
      </Link>
      <PageHeading
        eyebrow={`WEEK ${lesson.week} OF 8 · ${lesson.duration} MINUTES`}
        title={t(lesson.title)}
        description={t(lesson.description)}
      />
      <div className="content-two-column">
        <div className="stack">
          <Card title={t('Let’s learn')}>
            <p className="lesson-reading">{lessonExplanation(lesson, preferences.language)}</p>
            <div className="callout">
              <Icon name="sparkles" />
              <p>
                {t('Try explaining this idea out loud in your own words. Teaching it is a great way to remember it.')}
              </p>
            </div>
          </Card>
          <Card title={t('Put it into practice')}>
            <p>{t('Use what you’ve learned with a short activity.')}</p>
            <div className="button-row spaced">
              <Link
                className="button primary"
                href={
                  lesson.practice_path &&
                  ['/summarize', '/practice', '/vocabulary', '/reading', '/writing'].includes(lesson.practice_path)
                    ? lesson.practice_path
                    : lesson.skill === 'Reading'
                      ? '/reading'
                      : lesson.skill === 'Writing'
                        ? '/writing'
                        : lesson.skill === 'Vocabulary'
                          ? '/vocabulary'
                          : `/practice?lesson=${lesson.id}`
                }
              >
                <Icon name="play" size={16} />
                {t('Start practice')}
              </Link>
              <button
                className="secondary"
                disabled={busy || status === 'completed'}
                onClick={() => void changeStatus('completed')}
              >
                <Icon name="check" size={16} />
                {status === 'completed' ? t('Lesson completed') : t('Mark lesson complete')}
              </button>
            </div>
          </Card>
        </div>
        <div className="stack">
          <Card title={t('Your learning objectives')}>
            <ul className="checklist">
              {lesson.objectives.map((objective) => (
                <li key={objective}>
                  <Icon name="success" size={18} />
                  {t(objective)}
                </li>
              ))}
            </ul>
            {!status && (
              <button
                className="secondary full-width spaced"
                disabled={busy}
                onClick={() => void changeStatus('in_progress')}
              >
                {t('Start this lesson')} <Icon name="arrow" size={16} />
              </button>
            )}
          </Card>
          <Card title={t('Take it a little further')}>
            <span className="eyebrow">{t('HOMEWORK IDEA')}</span>
            <p className="spaced">{t(lesson.homework)}</p>
            <Link className="text-link spaced" href="/writing">
              {t('Open writing workshop')} <Icon name="arrow" size={15} />
            </Link>
          </Card>
        </div>
      </div>
    </>
  );
}
