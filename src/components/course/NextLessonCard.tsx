import { levelNumber } from '../../lib/course/levels';
import { Link } from 'wouter';
import { useCourse } from '../../lib/course/context';
import { nextCourseStep } from '../../lib/course/nextStep';
import { localDay } from '../../lib/course/progress';
import { useI18n } from '../../lib/i18n';
import { Icon } from '../Icon';

export function NextLessonCard({ home = false }: { home?: boolean }) {
  const { state, loading, error, refresh } = useCourse();
  const { t } = useI18n();
  const step = nextCourseStep(state);
  const done = state.completions.filter((item) => item.passed && localDay(new Date(item.completed_at)) === localDay()).length;
  const target = (state.placement?.settings.daily_minutes ?? 10) / 5;
  const hasReviews = state.reviews.some((card) => new Date(card.due_at).getTime() <= Date.now());
  const href = step?.href ?? (!state.placement ? '/placement' : hasReviews ? '/course/review' : '/course/challenge');
  return <section className={`next-lesson-card ${home ? 'at-home' : ''} ${!state.placement ? 'is-starting' : ''}`} aria-labelledby="next-lesson-title">
    <div className="next-lesson-copy">
      <p className="next-lesson-label"><span className="next-status-dot" />{t('NEXT UP')}</p>
      <h2 id="next-lesson-title">{t(step ? step.lesson.title : state.placement ? hasReviews?'Remember and review':'Beyond the path' : 'Find your starting point')}</h2>
      <p>{step ? `${t('Level')} ${levelNumber(step.level)} · ${t('Module')} ${(step.unitNumber-1)%4+1} · ${t(step.unit)} · ${t('Lesson')} ${step.lessonNumber}`
        : t(state.placement ? hasReviews?'Revisit the words and patterns that are ready today.':'Your course is complete. Keep growing with a fresh advanced challenge.' : 'A quick level check. Then a plan that fits.')}</p>
      <div className="next-lesson-actions">
        {loading ? <button disabled><Icon name="loading" size={18} className="spin" />{t('Getting your lesson ready…')}</button>
          : error ? <button onClick={() => void refresh()}>{t('Try again')}</button>
          : <Link href={href} className="button next-lesson-button">{t(step ? 'Start next lesson' : state.placement ? 'Keep practising' : 'Start level check')}<Icon name="arrow" size={19} /></Link>}
        <span><Icon name="clock" size={15} />{t(step ? 'Focused practice' : 'At your own pace')}</span>
      </div>
      {error && <p role="alert">{t(error)}</p>}
    </div>
    <div className="next-daily-goal">
      <span className="next-goal-icon"><Icon name="target" size={25} /></span>
      <strong>{Math.min(done, target)}<span> / {target}</span></strong>
      <span>{t('lessons today')}</span>
      <div className="next-goal-pips" aria-label={t('Daily goal progress')}>{Array.from({ length: target }, (_, index) => <span key={index} className={done > index ? 'filled' : ''} />)}</div>
    </div>
  </section>;
}
