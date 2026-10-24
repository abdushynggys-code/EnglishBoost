import { Link } from 'wouter';
import { useI18n } from '../../lib/i18n';

type Props = {
  score: number; total: number; passed: boolean; xp: number; replay: boolean;
  busy: boolean; saved: boolean; failed: boolean; checkpoint: boolean;
  onSave: () => void; onRetry: () => void;
};
export function CourseLessonResult(props: Props) {
  const { t } = useI18n();
  const { score, total, passed, xp, replay, busy, saved, failed, checkpoint, onSave, onRetry } = props;
  return (
    <section className="card course-result">
      <span className="course-result-symbol">{passed ? '✓' : '↻'}</span>
      <h2>{t(passed ? 'Lesson complete!' : 'A little more practice')}</h2>
      {total > 0 && <p className="course-result-score">{score}/{total} · {Math.round(score / total * 100)}%</p>}
      {checkpoint && !passed && <p>{t('Review the explanations, then try again. You need 80% to unlock the next unit.')}</p>}
      {total === 0 && <p>{t('Your writing will be saved as practice, without an automatic score.')}</p>}
      {replay ? <p>{t('Replay practice. Your previous progress and XP are preserved.')}</p>
        : <p>{passed ? `+${xp} XP` : t('Your completed lessons stay saved.')}</p>}
      {failed && <p className="message" role="alert">{t('Could not save your course. Please try again.')}</p>}
      {!saved ? (
        <button disabled={busy} onClick={onSave} className="spaced">{t(busy ? 'Saving…' : 'Save my progress')}</button>
      ) : (
        <div className="button-row spaced">
          <Link className="button" href="/course">{t('Back to my path')}</Link>
          {!passed && <button className="secondary" onClick={onRetry}>{t('Try again')}</button>}
        </div>
      )}
    </section>
  );
}
