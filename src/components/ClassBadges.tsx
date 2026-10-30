import { useCallback, useEffect, useState } from 'react';
import { Icon } from './Icon';
import { useI18n } from '../lib/i18n';
import { loadClassBadges } from '../lib/classBadges';
import type { ClassBadge } from '../lib/classBadges';
import { useLearning } from '../lib/learningContext';
import { useLiveSync } from '../lib/liveSync';

export function ClassBadges({ classId, userId }: { classId: string; userId?: string }) {
  const { t } = useI18n();
  const { session, preview } = useLearning();
  const [badges, setBadges] = useState<ClassBadge[]>([]);
  const reload = useCallback(async () => {
    try { setBadges(await loadClassBadges(classId)); } catch { setBadges([]); }
  }, [classId]);
  useEffect(() => { void reload(); }, [reload]);
  useLiveSync(session?.user.id, preview, ['class_monthly_badges'], reload);
  const visible = userId ? badges.filter((badge) => badge.student_id === userId) : badges;
  if (!visible.length) return null;
  return (
    <section className="card">
      <p className="eyebrow">{t('MONTHLY ACHIEVEMENTS')}</p>
      <h2>{t('Class badges')}</h2>
      <div className="class-badge-grid spaced">
        {visible.map((badge) => (
          <article key={badge.id}>
            <span className={`monthly-badge-icon ${badge.tier}`}><Icon name="trophy" size={28} /></span>
            <div><strong>{t(`${badge.tier} badge`)}</strong><p>{badge.accuracy}% · {badge.correct_answers}/{badge.answered_questions} {t('correct')}</p></div>
            <time>{new Date(`${badge.month}T12:00:00`).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</time>
          </article>
        ))}
      </div>
    </section>
  );
}
