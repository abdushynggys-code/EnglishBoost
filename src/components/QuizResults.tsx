import { useI18n } from '../lib/i18n';
import { Link } from 'wouter';
import { Card } from './Card';
import { Icon } from './Icon';

export function QuizResults({
  title,
  score,
  total,
  onRetry,
}: {
  title: string;
  score: number;
  total: number;
  onRetry: () => void;
}) {
  const { t } = useI18n();
  return (
    <Card className="quiz-results">
      <span className="result-trophy">
        <Icon name="trophy" size={42} />
      </span>
      <span className="eyebrow">{t('PRACTICE COMPLETE')}</span>
      <h2>{!total || score / total >= 0.7 ? t('Look at you go!') : t('Every try makes you stronger.')}</h2>
      <p>
        {t('You’ve completed')} {title.toLowerCase()}
        {t('. Your results are saved.')}
      </p>
      {total > 0 ? (
        <>
          <div className="result-score">
            {Math.round((score / total) * 100)}
            <span>%</span>
          </div>
          <p>
            {score} {t('of')} {total} {t('scored answers correct')}
          </p>
        </>
      ) : (
        <p>{t('Your written answers are ready for your tutor. No automatic score is assigned.')}</p>
      )}
      <div className="button-row spaced">
        <button onClick={onRetry}>
          <Icon name="retry" size={17} />
          {t('Try again')}
        </button>
        <Link href="/progress" className="button secondary">
          {t('See your progress')} <Icon name="arrow" size={16} />
        </Link>
      </div>
    </Card>
  );
}
