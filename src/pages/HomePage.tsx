import { Link } from 'wouter';
import { Card } from '../components/Card';
import { Icon } from '../components/Icon';
import { useI18n } from '../lib/i18n';
import { useLearning } from '../lib/learningContext';

export function HomePage() {
  const { t, preferences } = useI18n();
  const { data, profile, demo } = useLearning();
  const name = profile?.full_name.split(' ')[0] || (demo ? 'Alex' : '');
  const pending = data.homework.filter((h) => !data.submissions.some((s) => s.homework_id === h.id));
  return (
    <div className="calm-home">
      <div className="calm-heading">
        <p className="eyebrow">ENGLISHBOOST</p>
        <h1>{t('Welcome, {name}.', { name })}</h1>
        <p>{t('Choose one activity. Take your time.')}</p>
      </div>
      <section className="today-focus">
        <span className="focus-symbol">
          <Icon name="pen" size={30} />
        </span>
        <div>
          <p className="eyebrow">{t('Your next small step')}</p>
          <h2>{t('Get to the Point!')}</h2>
          <p>{t('Clear ideas, in your own words.')}</p>
          <Link href="/summarize" className="button primary">
            {t('Start a short practice')}
            <Icon name="arrow" size={17} />
          </Link>
        </div>
      </section>
      <div className="home-shortcuts">
        <Link href="/book">
          <Icon name="book" size={24} />
          <strong>{t(preferences.learning_track === 'language_arts' ? t('My learning') : t('My Book'))}</strong>
          <small>{t('Open my book')}</small>
          <Icon name="chevron" size={17} />
        </Link>
        <Link href="/classroom">
          <Icon name="tutor" size={24} />
          <strong>{t('Live Classroom')}</strong>
          <small>{t('Join your classroom')}</small>
          <Icon name="chevron" size={17} />
        </Link>
        <Link href="/learn">
          <Icon name="vocabulary" size={24} />
          <strong>{t('Practice')}</strong>
          <small>{t('Choose one small challenge.')}</small>
          <Icon name="chevron" size={17} />
        </Link>
      </div>
      {pending.length > 0 && (
        <Card title={t('Homework')}>
          <div className="quiet-assignment-list">
            {pending.slice(0, 2).map((h) => (
              <Link key={h.id} href="/homework">
                <span>
                  {h.title}
                  <small>
                    {new Date(`${h.due_at}T12:00:00`).toLocaleDateString(preferences.language, {
                      day: 'numeric',
                      month: 'short',
                    })}
                  </small>
                </span>
                <Icon name="chevron" size={17} />
              </Link>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
