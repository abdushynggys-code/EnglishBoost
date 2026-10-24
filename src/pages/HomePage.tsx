import { Link } from 'wouter';
import { Card } from '../components/Card';
import { HomeProgress } from '../components/HomeProgress';
import { Icon } from '../components/Icon';
import { useI18n } from '../lib/i18n';
import { useLearning } from '../lib/learningContext';
import { shortDate } from '../lib/dateFormat';
import { useCourse } from '../lib/course/context';

export function HomePage() {
  const { t, preferences } = useI18n();
  const { data, profile, demo } = useLearning();
  const { state: course } = useCourse();
  const name = profile?.full_name.trim().split(/\s+/)[0] || (demo ? 'Alex' : '');
  const writing = preferences.learning_track === 'language_arts';
  const submitted = new Set(data.submissions.map((submission) => submission.homework_id));
  const pending = data.homework.filter((homework) => !submitted.has(homework.id))
    .sort((first, second) => first.due_at.localeCompare(second.due_at));
  return (
    <div className="calm-home">
      <div className="calm-heading">
        <p className="eyebrow">{t('Your learning space')}</p>
        <h1>{name ? t('Welcome, {name}.', { name }) : t('Welcome back.')}</h1>
        <p>{t('A little practice. Real progress.')}</p>
      </div>
      <section className="home-focus" aria-labelledby="focus-title">
        <div className="home-focus-copy">
          <p className="eyebrow"><span className="focus-dot" />{t('Your next step')}</p>
          <h2 id="focus-title">{t(course.placement ? 'Keep your momentum.' : 'Find your starting point')}</h2>
          <p>{t('Find your starting level, then build your English in small daily lessons.')}</p>
          <div className="home-focus-actions">
            <Link href={course.placement ? '/course' : '/placement'} className="button">
              {t(course.placement ? 'Continue learning' : 'Start level check')}<Icon name="arrow" size={17} />
            </Link>
            <span><Icon name="clock" size={15} />{t('At your own pace')}</span>
          </div>
        </div>
        <div className="focus-art" aria-hidden="true">
          <div className="focus-art-orbit" />
          <div className="focus-art-page">
            <span className="focus-art-icon"><Icon name={writing ? 'pen' : 'book'} size={36} /></span>
            <span className="art-line" /><span className="art-line short" />
            <span className="art-check"><Icon name="check" size={18} /><i /></span>
            <span className="art-check"><Icon name="check" size={18} /><i /></span>
          </div>
          <span className="focus-art-badge"><Icon name="sparkles" size={24} /></span>
        </div>
      </section>
      <HomeProgress />
      <div className="home-section-heading">
        <div><h2>{t('Keep learning')}</h2><p>{t('Pick up where you left off.')}</p></div>
        <Link href="/learn" className="text-link">{t('Explore activities')}<Icon name="arrow" size={16} /></Link>
      </div>
      <div className="home-shortcuts">
        <Link href="/book">
          <span className="shortcut-icon"><Icon name="book" size={24} /></span>
          <div><strong>{t(writing ? 'My learning' : 'My Book')}</strong><small>{t(writing ? 'Open my learning' : 'Open my book')}</small></div>
          <Icon name="chevron" size={17} />
        </Link>
        <Link href="/classroom">
          <span className="shortcut-icon"><Icon name="tutor" size={24} /></span>
          <div><strong>{t('Live Classroom')}</strong><small>{t('Join your classroom')}</small></div>
          <Icon name="chevron" size={17} />
        </Link>
        <Link href="/vocabulary">
          <span className="shortcut-icon"><Icon name="vocabulary" size={24} /></span>
          <div><strong>{t('Vocabulary Games')}</strong><small>{t('Learn words, then use them.')}</small></div>
          <Icon name="chevron" size={17} />
        </Link>
      </div>
      {pending.length > 0 && (
        <Card title={t('Homework')} action={<Link href="/homework" className="text-link">{t('View all')}<Icon name="arrow" size={15} /></Link>}>
          <div className="quiet-assignment-list">
            {pending.slice(0, 2).map((homework) => (
              <Link key={homework.id} href="/homework">
                <span>{t(homework.title)}<small>{t('Due {date}', { date: shortDate(new Date(`${homework.due_at}T12:00:00`), preferences.language) })}</small></span>
                <Icon name="chevron" size={17} />
              </Link>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
