import { Link } from 'wouter';
import { Card } from './Card';
import { Icon } from './Icon';
import { useI18n } from '../lib/i18n';
import { useLearning } from '../lib/learningContext';

export function BookHomework() {
  const { t } = useI18n();
  const { data } = useLearning();
  const lessons = data.lessons.filter((lesson) =>
    lesson.id.startsWith('access2-u1-') && data.writing.some((work) => work.id === lesson.id),
  );
  if (!lessons.length) return null;
  return (
    <section className="stack spaced" aria-label={t('Base homework · Access 2')}>
      <Card title={t('Base homework · Access 2')}>
        <p>{t('Based on your supplied pages: 10–31 and 206–207. Work through one section at a time.')}</p>
        <small>{t('Self-paced · no deadline')}</small>
      </Card>
      {lessons.map((lesson) => {
        const draft = data.drafts.find((item) => item.assignment_id === lesson.id);
        return (
          <Card key={lesson.id} className="homework-card">
            <div className="homework-header">
              <div>
                <small>Access 2 · Unit 1 · {t('Book page')} {lesson.book_page}</small>
                <h2>{t(lesson.title)}</h2>
              </div>
              <span className={`status-badge ${draft?.submitted ? 'green' : 'blue'}`}>
                {t(draft?.submitted ? 'Submitted' : draft ? 'In progress' : 'To do')}
              </span>
            </div>
            <p>{t(lesson.homework)}</p>
            <div className="button-row spaced">
              <Link className="button primary" href={`/writing?assignment=${lesson.id}`}>
                <Icon name="pen" size={16} />
                {t(draft ? 'Continue homework' : 'Open homework')}
              </Link>
              <Link className="button secondary" href={`/lessons/${lesson.id}`}>
                {t('Related lesson')}
              </Link>
            </div>
          </Card>
        );
      })}
      <p className="muted">{t('Listening and video activities need the book’s recordings; they are not included here.')}</p>
    </section>
  );
}
