import { Link } from 'wouter';
import { PageHeading } from '../components/PageHeading';
import { Card } from '../components/Card';
import { Icon } from '../components/Icon';
import { useLearning } from '../lib/learningContext';
import { useI18n } from '../lib/i18n';

export function BookPage() {
  const { data } = useLearning();
  const { t, preferences } = useI18n();
  const native = preferences.learning_track === 'language_arts';
  const mapped = data.lessons.filter((lesson) => lesson.book_unit);
  return (
    <>
      <PageHeading
        eyebrow={native ? t('Language arts · including native speakers') : t('ACCESS 2 · CORNELSEN')}
        title={t(native ? t('My learning') : t('My Book'))}
        description={t(native ? t('Clear ideas, in your own words.') : t('English practice for your level.'))}
      />
      {!native && !mapped.length && (
        <div className="book-mapping-note">
          <Icon name="book" size={25} />
          <div>
            <strong>{t('Unit mapping comes next.')}</strong>
            <p>{t('Your tutor can add the exact unit and page after checking your book.')}</p>
          </div>
        </div>
      )}
      {native && (
        <Link href="/summarize" className="practice-hub-card spaced">
          <Icon name="pen" size={27} />
          <div>
            <h2>{t('Get to the Point!')}</h2>
            <p>{t('Say what matters. Keep your meaning.')}</p>
          </div>
          <Icon name="arrow" />
        </Link>
      )}
      <Card title={t(mapped.length ? t('Book practice') : t('Starter topics'))} className="spaced">
        <div className="book-topic-list">
          {data.lessons.map((lesson) => (
            <Link href={`/lessons/${lesson.id}`} key={lesson.id}>
              <span className="book-topic-icon">
                <Icon name={lesson.skill === 'Writing' ? 'pen' : 'book'} size={20} />
              </span>
              <div>
                <strong>{t(lesson.title)}</strong>
                <small>
                  {lesson.book_unit
                    ? `${lesson.book_unit}${lesson.book_page ? ` · ${t('Book page')} ${lesson.book_page}` : ''}`
                    : t(lesson.skill)}
                </small>
              </div>
              <Icon
                name={
                  data.lessonProgress.some((p) => p.lesson_id === lesson.id && p.status === 'completed')
                    ? 'check'
                    : 'chevron'
                }
                size={18}
              />
            </Link>
          ))}
        </div>
      </Card>
      {!native && (
        <p className="book-disclaimer">{t('These are original practice topics, not copied textbook exercises.')}</p>
      )}
    </>
  );
}
