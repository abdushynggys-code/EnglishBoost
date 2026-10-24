import { courseSkills } from '../../lib/course/progress';
import type { PlacementResult } from '../../lib/course/types';
import { useI18n } from '../../lib/i18n';

export function CourseSkills({ placement }: { placement: PlacementResult }) {
  const { t } = useI18n();
  return <details className="card course-skill-details"><summary>{t('Your skill profile')} · {t('Estimated starting level')}: {placement.level}</summary>
    <div className="course-skill-grid">{courseSkills.map((skill) => <div key={skill}><span>{t(skill)}</span><strong>{placement.skill_levels[skill] ?? t('Not assessed')}</strong></div>)}</div>
    <p>{t('Writing and speaking samples are practice, not automatic assessments.')}</p>
  </details>;
}
