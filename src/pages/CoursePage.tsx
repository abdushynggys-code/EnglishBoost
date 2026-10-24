import { Link } from 'wouter';
import { useCourse } from '../lib/course/context';
import { useI18n } from '../lib/i18n';
import { courseStats, localDay } from '../lib/course/progress';
import { buildCourseUnits } from '../data/course/units';
import { courseBooks } from '../data/course/books';
import { CourseWelcome } from '../components/course/CourseWelcome';
import { CoursePath } from '../components/course/CoursePath';
import { CourseSkills } from '../components/course/CourseSkills';
import { PageLoading } from '../components/PageLoading';
import { PageHeading } from '../components/PageHeading';
import { Icon } from '../components/Icon';

export function CoursePage() {
  const { state, loading, error, refresh } = useCourse();
  const { t } = useI18n();
  if (loading) return <PageLoading />;
  if (error) return <section className="card error-state"><p>{t(error)}</p><button onClick={() => void refresh()}>{t('Try again')}</button></section>;
  if (!state.placement) return <CourseWelcome />;
  const { placement, completions, reviews } = state;
  const units = buildCourseUnits(placement.level,placement.settings.interest);
  const stats = courseStats(completions);
  const due = reviews.filter((card) => new Date(card.due_at).getTime() <= Date.now()).length;
  const daily = completions.filter((item) => item.passed && localDay(new Date(item.completed_at))===localDay()).length;
  const target = placement.settings.daily_minutes/5;
  const total = units.flatMap((unit) => unit.lessons).length;
  const next = units.flatMap((unit)=>unit.lessons).find((lesson)=>!completions.some((item)=>item.lesson_id===lesson.id&&item.passed));
  return <div className="course-page">
    <PageHeading eyebrow="YOUR PERSONAL ENGLISH COURSE" title={t('Your learning path')} description={t('One small lesson. One step forward.')} action={<Link className="text-link" href="/placement">{t('Retake level check')}</Link>} />
    <div className="course-stat-strip"><div><Icon name="sparkles" /><strong>{stats.xp}</strong><span>XP</span></div><div><Icon name="flame" /><strong>{stats.streak}</strong><span>{t('day streak')}</span></div><div><Icon name="target" /><strong>{Math.min(daily,target)}/{target}</strong><span>{t('daily lessons')}</span></div></div>
    <section className="course-daily-card"><div><p className="eyebrow">{t('Your next step')}</p><h2>{t(next?'Keep your momentum.':'You completed this course cycle!')}</h2><p>{stats.completed}/{total} {t('lessons completed')} · {placement.settings.daily_minutes} {t('minutes a day')}</p></div>{next && <Link className="button" href={`/course/${next.id}`}>{t('Continue learning')}<Icon name="arrow" size={16} /></Link>}</section>
    {due>0 && <Link className="course-review-link" href="/course/review"><Icon name="retry" /><span>{t('{count} items ready to review',{count:due})}</span><Icon name="arrow" size={18} /></Link>}
    <div className="course-layout"><CoursePath units={units} completions={completions} /><aside className="course-side">
      <CourseSkills placement={placement} />
      <section className="card"><h2>{t('Your milestones')}</h2><ul className="course-badges"><li className={stats.completed>=1?'earned':''}><Icon name="sparkles" />{t('First lesson')}</li><li className={stats.completed>=7?'earned':''}><Icon name="trophy" />{t('Seven lessons')}</li><li className={stats.streak>=7?'earned':''}><Icon name="flame" />{t('Seven-day streak')}</li></ul></section>
      <details className="card"><summary>{t('Explore real books')}</summary><p className="spaced">{t('Use your own copy. Course stories are original simplified practice texts.')}</p>{courseBooks.map((book)=><a className="course-book" key={book.title} href={book.url} target="_blank" rel="noreferrer"><strong lang="en">{book.title}</strong><small>{book.level} · {t('Publisher details')} ↗</small></a>)}</details>
    </aside></div>
  </div>;
}
