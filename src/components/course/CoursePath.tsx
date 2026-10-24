import { levelNumber } from '../../lib/course/levels';
import { Link } from 'wouter';
import type { CourseUnit, LessonCompletion } from '../../lib/course/types';
import { isLessonUnlocked } from '../../lib/course/progress';
import { useI18n } from '../../lib/i18n';
import { Icon } from '../Icon';
import type { IconName } from '../Icon';

const icons: Record<string,IconName> = {story:'book',grammar:'file',practice:'pen',listening:'headphones',writing:'pen',review:'retry',checkpoint:'trophy'};
export function CoursePath({ units, completions }: { units: CourseUnit[]; completions: LessonCompletion[] }) {
  const { t } = useI18n();
  const nextId = units.flatMap((unit) => unit.lessons).find((lesson) => !completions.some((item) => item.lesson_id === lesson.id && item.passed))?.id;
  return <div className="course-path">{units.map((unit,index) => {
    const active = unit.lessons.some((lesson) => isLessonUnlocked(units,completions,lesson.id) && !completions.some((item)=>item.lesson_id===lesson.id&&item.passed));
    return <details id={index%4===0?`course-level-${unit.level}`:undefined} key={unit.id} className="course-unit" data-unit={index+1} open={active}>
    <summary><span className="eyebrow">{t('Level')} {levelNumber(unit.level)} · {t('Module')} {index%4+1}</span><h2>{t(unit.title)}</h2><span className="cefr-caption">{unit.level} · {t('CEFR reference')}</span><p>{t(unit.description)}</p></summary>
    <ol>{unit.lessons.map((lesson,day) => {
      const complete = completions.some((item) => item.lesson_id===lesson.id && item.passed);
      const open = isLessonUnlocked(units,completions,lesson.id);
      const content = <><span data-kind={lesson.kind} className={`course-node ${complete?'complete':open?'available':'locked'}`}><Icon name={complete?'check':icons[lesson.kind]} size={24} /></span><span><strong>{day+1}. {t(lesson.title)}</strong><small>{t(complete?'Completed':lesson.id===nextId?'Start here':open?'Ready when you are':'Complete the previous lesson')}</small></span>{open && <Icon name="chevron" size={18} />}</>;
      return <li key={lesson.id} className={lesson.id===nextId?'lesson-next':''}>{open?<Link href={`/course/${lesson.id}`} aria-label={`${t(lesson.title)} · ${t(complete?'Completed':'Start lesson')}`}>{content}</Link>:<div aria-disabled="true">{content}</div>}</li>;
    })}</ol>
  </details>; })}</div>;
}
