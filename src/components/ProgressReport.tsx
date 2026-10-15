import { useI18n } from '../lib/i18n';
import { Link } from 'wouter';
import { StatCard } from './StatCard';
import { Card } from './Card';
import { Icon } from './Icon';
import { topicAccuracy, activityDays } from '../lib/progress';
import type { Workspace } from '../lib/types';
export function ProgressReport({ data }: { data: Workspace }) {
  const { t } = useI18n();
  const accuracy = topicAccuracy(data);
  const weak = accuracy.filter((t) => t.accuracy < 70).sort((a, b) => a.accuracy - b.accuracy);
  const scored = data.attempts.filter((a) => a.total > 0);
  const scores = scored.slice(0, 7).reverse();
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - 6 + i);
    return d;
  });
  const active = new Set(activityDays(data));
  const average = scored.length
    ? Math.round(scored.reduce((sum, a) => sum + (a.score / a.total) * 100, 0) / scored.length)
    : 0;
  const homeworkDone = data.homework.filter((h) => data.submissions.some((s) => s.homework_id === h.id)).length;
  return (
    <>
      <div className="stats-grid">
        <StatCard
          label={t('Average practice score')}
          value={scored.length ? String(average) + '%' : '?'}
          icon="chart"
        />
        <StatCard
          label={t('Words you know')}
          value={data.wordProgress.filter((w) => w.known).length}
          icon="vocabulary"
        />
        <StatCard label={t('Writing submitted')} value={data.drafts.filter((d) => d.submitted).length} icon="pen" />
        <StatCard
          label={t('Homework submitted')}
          value={data.homework.length ? Math.round((homeworkDone / data.homework.length) * 100) + '%' : '?'}
          icon="homework"
        />
      </div>
      <div className="content-two-column">
        <div className="stack">
          <Card title={t('Your scores over time')} action={<span className="muted">{t('Most recent practices')}</span>}>
            {scores.length ? (
              <>
                <div
                  className="chart"
                  role="img"
                  aria-label={scores.map((a) => `${a.title}: ${Math.round((a.score / a.total) * 100)}%`).join(', ')}
                >
                  {scores.map((attempt) => (
                    <div className="chart-bar" key={attempt.id}>
                      <span>{Math.round((attempt.score / attempt.total) * 100)}%</span>
                      <div style={{ height: `${(attempt.score / attempt.total) * 125}px` }} title={attempt.title} />
                    </div>
                  ))}
                </div>
                <div className="chart-labels">
                  {scores.map((a) => (
                    <span key={a.id}>
                      {new Date(a.created_at).toLocaleDateString('en-GB', { month: 'short', day: 'numeric' })}
                    </span>
                  ))}
                </div>
              </>
            ) : (
              <div className="empty-state">
                <Icon name="chart" size={30} />
                <p>{t('Complete a quiz or reading practice to begin your score history.')}</p>
              </div>
            )}
          </Card>
          <Card title={t('Grammar, topic by topic')}>
            {accuracy.length ? (
              <div className="topic-list">
                {accuracy.map((topic) => (
                  <div key={topic.topic}>
                    <div className="topic-label">
                      <span>{topic.topic}</span>
                      <span>
                        {topic.accuracy}% · {topic.total} {t('answers')}
                      </span>
                    </div>
                    <div className="progress-track">
                      <span
                        className={topic.accuracy >= 70 ? 'green' : 'orange'}
                        style={{ width: `${topic.accuracy}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>{t('Your topic strengths will appear after your first grammar quiz.')}</p>
            )}
          </Card>
        </div>
        <div className="stack">
          <Card title={t('Your week in small wins')}>
            <div className="weekly-activity">
              {days.map((day) => (
                <div
                  className={`weekly-day ${active.has(day.toLocaleDateString('en-CA')) ? 'active' : ''}`}
                  key={day.toISOString()}
                >
                  <span>
                    {active.has(day.toLocaleDateString('en-CA')) ? (
                      <Icon name="check" size={16} />
                    ) : (
                      <Icon name="circle" size={6} />
                    )}
                  </span>
                  {day.toLocaleDateString('en-GB', { weekday: 'short' })}
                </div>
              ))}
            </div>
          </Card>
          <Card title={t('Your next best step')}>
            {weak.length ? (
              <div className="stack">
                {weak.slice(0, 3).map((topic) => (
                  <div key={topic.topic}>
                    <h3>{topic.topic}</h3>
                    <p className="spaced" style={{ marginTop: 5 }}>
                      {t('You’re at')} {topic.accuracy}
                      {t('% accuracy from')} {topic.total} {t('answers. A little more practice will help.')}
                    </p>
                    <Link className="text-link spaced" href={`/practice?topic=${encodeURIComponent(topic.topic)}`}>
                      {t('Practise this topic')} <Icon name="arrow" size={14} />
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="checklist">
                <Icon name="sparkles" size={24} />
                <p>
                  {accuracy.length
                    ? t('Your practised topics are looking strong. Try a new topic to keep growing.')
                    : t('Start with a mixed grammar quiz. We’ll use your results to suggest what to practise next.')}
                </p>
                <Link href="/practice" className="text-link">
                  {t('Find your next challenge')} <Icon name="arrow" size={14} />
                </Link>
              </div>
            )}
          </Card>
        </div>
      </div>
    </>
  );
}
