import { useI18n } from '../lib/i18n';
import { PageHeading } from '../components/PageHeading';
import { Card } from '../components/Card';
import { LessonList } from '../components/LessonList';
import { Icon } from '../components/Icon';
import { useLearning } from '../lib/learningContext';

export function LessonsPage() {
  const { t } = useI18n();
  const { data } = useLearning();
  const done = data.lessonProgress.filter((p) => p.status === 'completed').length;
  return (
    <>
      <PageHeading
        title={t('Your eight-week journey')}
        description={t('A clear path. Small steps. English you’ll actually use.')}
      />
      <div className="journey-banner">
        <span className="feature-icon blue-icon">
          <Icon name="target" size={26} />
        </span>
        <div>
          <h3>{t('A stronger foundation, one week at a time.')}</h3>
          <p>{t('Grammar, vocabulary, reading, writing, and the confidence to speak up.')}</p>
        </div>
        <span className="status-badge blue">
          {done} {t('/ 8 completed')}
        </span>
      </div>
      <Card title={t('The learning roadmap')} action={<span className="muted">{t('Intermediate · B1')}</span>}>
        <LessonList />
      </Card>
    </>
  );
}
