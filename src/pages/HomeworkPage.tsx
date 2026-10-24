import { useI18n } from '../lib/i18n';
import { Link } from 'wouter';
import { PageHeading } from '../components/PageHeading';
import { Card } from '../components/Card';
import { Icon } from '../components/Icon';
import { HomeworkCard } from '../components/HomeworkCard';
import { BookHomework } from '../components/BookHomework';
import { useLearning } from '../lib/learningContext';

export function HomeworkPage() {
  const { t } = useI18n();
  const { data } = useLearning();
  const baseTasks = data.writing.filter((work) => work.id.startsWith('access2-u1-')
    && data.lessons.some((lesson) => lesson.id === work.id));
  const completed = data.homework.filter((h) => data.submissions.some((s) => s.homework_id === h.id)).length
    + baseTasks.filter((work) => data.drafts.some((draft) => draft.assignment_id === work.id && draft.submitted)).length;
  return (
    <>
      <PageHeading
        title={t('Keep the learning going.')}
        description={t('A little practice between lessons makes all the difference.')}
        action={
          <span className="status-badge blue">
            {completed} {t('of')} {data.homework.length + baseTasks.length} {t('submitted')}
          </span>
        }
      />
      <div style={{ maxWidth: 900 }}>
        <BookHomework />
        {!!data.homework.length && <h2 className="spaced">{t('Tutor assignments')}</h2>}
        {data.homework.length ? (
          data.homework.map((homework) => <HomeworkCard key={homework.id} homework={homework} />)
        ) : !data.lessons.some((lesson) => lesson.id.startsWith('access2-u1-')) ? (
          <Card className="empty-state">
            <Icon name="homework" size={36} />
            <h2>{t('No homework on your desk.')}</h2>
            <p>
              {t('Your tutor’s assignments will appear here. Until then, a little practice is always a good idea.')}
            </p>
            <Link href="/practice" className="button secondary">
              {t('Try a quiz')}
              <Icon name="arrow" size={16} />
            </Link>
          </Card>
        ) : null}
      </div>
    </>
  );
}
