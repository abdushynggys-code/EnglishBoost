import { usePlatform } from '../lib/platform';
import { GameProgress } from '../components/GameProgress';
import { Link } from 'wouter';
import { Card } from '../components/Card';
import { HomeProgress } from '../components/HomeProgress';
import { Icon } from '../components/Icon';
import { useI18n } from '../lib/i18n';
import { useLearning } from '../lib/learningContext';
import { shortDate } from '../lib/dateFormat';
import { NextLessonCard } from '../components/course/NextLessonCard';

export function HomePage() {
  const { t, preferences } = useI18n();
  const { data, profile, demo } = useLearning();
  const {state}=usePlatform();const connected=profile?.role==='tutor'||state.classes.length>0;
  const name = profile?.full_name.trim().split(/\s+/)[0] || (demo ? 'Alex' : '');
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
      <NextLessonCard home />
      <GameProgress /><HomeProgress />
      <div className="home-section-heading">
        <div><h2>{t('Keep learning')}</h2><p>{t('Pick up where you left off.')}</p></div>
        <Link href="/learn" className="text-link">{t('Explore activities')}<Icon name="arrow" size={16} /></Link>
      </div>
      <div className="home-shortcuts">
        <Link href="/materials">
          <span className="shortcut-icon"><Icon name="book" size={24} /></span>
          <div><strong>{t('Material library')}</strong><small>{t('Explore a useful lesson')}</small></div>
          <Icon name="chevron" size={17} />
        </Link>
        <Link href={connected?'/classroom':'/settings'}>
          <span className="shortcut-icon"><Icon name="tutor" size={24} /></span>
          <div><strong>{t(connected?'Live Classroom':'Learn your way')}</strong><small>{t(connected?'Join your classroom':'Independent learning, optional class code')}</small></div>
          <Icon name="chevron" size={17} />
        </Link>
        <Link href="/vocabulary">
          <span className="shortcut-icon"><Icon name="vocabulary" size={24} /></span>
          <div><strong>{t('Vocabulary Games')}</strong><small>{t('Learn words, then use them.')}</small></div>
          <Icon name="chevron" size={17} />
        </Link>
      </div>
      {connected && pending.length > 0 && (
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
