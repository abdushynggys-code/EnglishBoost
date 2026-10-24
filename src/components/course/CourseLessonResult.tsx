import { Link } from 'wouter';
import { useI18n } from '../../lib/i18n';
import { Icon } from '../Icon';

type Props = {
  score: number; total: number; passed: boolean; xp: number; replay: boolean;
  busy: boolean; saved: boolean; failed: boolean; checkpoint: boolean;
  nextHref?: string; onSave: (destination?: string) => void; onRetry: () => void;
};
export function CourseLessonResult(props: Props) {
  const { t } = useI18n();
  const { score, total, passed, xp, replay, busy, saved, failed, checkpoint, nextHref, onSave, onRetry } = props;
  return <section className={`card course-result ${passed ? 'result-passed' : ''}`}>
    <span className="course-result-symbol">{passed ? <Icon name="check" size={35} /> : <Icon name="retry" size={32} />}</span>
    <h2>{t(passed ? 'Lesson complete!' : 'A little more practice')}</h2>
    {total > 0 && <p className="course-result-score">{score}/{total} · {Math.round(score / total * 100)}%</p>}
    {checkpoint && !passed && <p>{t('Review the explanations, then try again. You need 80% to unlock the next unit.')}</p>}
    {total === 0 && <p>{t('Your writing will be saved as practice, without an automatic score.')}</p>}
    {replay ? <p>{t('Replay practice. Your previous progress and XP are preserved.')}</p>
      : passed ? <span className="result-xp-reward"><Icon name="sparkles" size={17} />+{xp} XP</span>
      : <p>{t('Your completed lessons stay saved.')}</p>}
    {failed && <p className="message" role="alert">{t('Could not save your course. Please try again.')}</p>}
    {!saved ? <div className="lesson-result-actions">
      <button disabled={busy} onClick={() => onSave(passed ? nextHref ?? '/course' : undefined)}>
        {busy && <Icon name="loading" size={17} className="spin" />}
        {t(busy ? 'Saving…' : passed && nextHref ? 'Start next lesson' : passed ? 'Back to my path' : 'Save my progress')}
        {passed && !busy && <Icon name="arrow" size={18} />}
      </button>
      {passed && nextHref && <button className="text-button" disabled={busy} onClick={() => onSave('/course')}>{t('Finish for now')}</button>}
      {passed && <small>{t('Your progress saves when you continue.')}</small>}
    </div> : <div className="button-row spaced">
      {!passed && <button onClick={onRetry}>{t('Try again')}</button>}
      {passed && nextHref && <Link className="button" href={nextHref}>{t('Start next lesson')}<Icon name="arrow" size={18} /></Link>}
      <Link className="button secondary" href="/course">{t('Back to my path')}</Link>
    </div>}
  </section>;
}
