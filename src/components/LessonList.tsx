import { useI18n } from '../lib/i18n';
import { Link } from 'wouter';
import { Icon } from './Icon';
import { useLearning } from '../lib/learningContext';

export function LessonList({ compact = false }: { compact?: boolean }) {
  const { t } = useI18n();
  const { data } = useLearning();
  return (
    <div className={`lesson-list ${compact ? 'compact' : ''}`}>
      {data.lessons.map((lesson) => {
        const status = data.lessonProgress.find((p) => p.lesson_id === lesson.id)?.status;
        return (
          <Link
            className={`lesson-row ${status === 'in_progress' ? 'current' : ''}`}
            href={`/lessons/${lesson.id}`}
            key={lesson.id}
          >
            <span className="week-number">
              <span>{t('WEEK')}</span>
              <strong>{String(lesson.week).padStart(2, '0')}</strong>
            </span>
            <span className="lesson-row-text">
              <strong>{lesson.title}</strong>
              <small>{lesson.description}</small>
            </span>
            <span
              className={`status-badge ${status === 'completed' ? 'green' : status === 'in_progress' ? 'blue' : 'gray'}`}
            >
              {status === 'completed' && <Icon name="check" size={11} />}
              {status === 'completed' ? t('Completed') : status === 'in_progress' ? t('In progress') : t('Not started')}
            </span>
            <Icon name="chevron" size={17} />
          </Link>
        );
      })}
    </div>
  );
}
