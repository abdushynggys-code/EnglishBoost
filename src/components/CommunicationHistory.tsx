import { Link } from 'wouter';
import { Card } from './Card';
import { useI18n } from '../lib/i18n';
import { countWords } from '../lib/writing';
import type { ConciseAttempt } from '../lib/summaryTypes';

export function CommunicationHistory({ attempts }: { attempts: ConciseAttempt[] }) {
  const { t, preferences } = useI18n();
  return (
    <Card title={t('Your communication journey')} className="spaced">
      <p>{t('Original answers and clearer versions, side by side.')}</p>
      {attempts.length ? (
        <div className="communication-history">
          {attempts.slice(0, 10).map((attempt) => (
            <details key={attempt.id}>
              <summary>
                <span lang="en">{attempt.prompt}</span>
                <small>{new Date(attempt.created_at).toLocaleDateString(preferences.language)}</small>
              </summary>
              {attempt.improved ? (
                <div className="summary-comparison">
                  <div>
                    <small>
                      {t('Original')} · {countWords(attempt.original)} {t('words')}
                    </small>
                    <p lang="en">{attempt.original}</p>
                  </div>
                  <div>
                    <small>
                      {t('Improved')} · {countWords(attempt.improved)} {t('words')}
                    </small>
                    <p lang="en">{attempt.improved}</p>
                  </div>
                </div>
              ) : (
                <p className="spaced">
                  {t(attempt.mode === 'styles' ? t('Style matches') : t('Details checked'))}:{' '}
                  {attempt.objective_correct} / {attempt.objective_total}
                </p>
              )}
              {attempt.tutor_comment ? (
                <div className="feedback-card">
                  <strong>
                    {t('Tutor feedback')}
                    {attempt.tutor_score != null && ` · ${attempt.tutor_score}%`}
                  </strong>
                  <p>{attempt.tutor_comment}</p>
                </div>
              ) : (
                <p className="preference-hint spaced">{t('Waiting for tutor feedback.')}</p>
              )}
            </details>
          ))}
        </div>
      ) : (
        <div className="quiet-empty">
          <p>{t('No communication practice yet.')}</p>
          <Link href="/summarize" className="button secondary">
            {t('Get to the Point!')}
          </Link>
        </div>
      )}
    </Card>
  );
}
