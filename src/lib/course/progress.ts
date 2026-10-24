import type { CourseLevel, CourseSkill, CourseUnit, LessonCompletion, PlacementAnswer, ReviewCard } from './types';

export const courseSkills: CourseSkill[] = ['grammar', 'vocabulary', 'reading', 'listening'];
const levels: CourseLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
export const localDay = (date = new Date()) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

export function estimatePlacement(answers: PlacementAnswer[]) {
  const skill_levels = Object.fromEntries(courseSkills.map((skill) => {
    const valid = answers.filter((answer) => answer.skill === skill && !answer.assisted && !answer.skipped);
    // A level needs two independent correct answers; a single guess cannot raise the estimate.
    const demonstrated = levels.filter((level) => valid.filter((answer) => levels.indexOf(answer.level) >= levels.indexOf(level) && answer.correct).length >= 2);
    return [skill, valid.length ? demonstrated[demonstrated.length-1] ?? 'A1' : null];
  })) as Record<CourseSkill, CourseLevel | null>;
  const evidence = Object.values(skill_levels).filter((level): level is CourseLevel => level !== null);
  const index = evidence.length ? Math.floor(evidence.reduce((sum, level) => sum + levels.indexOf(level), 0) / evidence.length) : 0;
  return { level: levels[index], skill_levels };
}

export function nextReview(card: ReviewCard | undefined, itemId: string, correct: boolean, now = new Date()): ReviewCard {
  const stage = correct ? Math.min((card?.stage ?? -1) + 1, 4) : 0;
  const due = new Date(now);
  due.setDate(due.getDate() + [1, 3, 7, 14, 28][stage]);
  return { item_id: itemId, stage, due_at: due.toISOString(), last_reviewed_at: now.toISOString(), lapses: (card?.lapses ?? 0) + (correct ? 0 : 1) };
}

export function courseStats(completions: LessonCompletion[], now = new Date()) {
  const passed = completions.filter((completion) => completion.passed);
  const dates = new Set(passed.map((completion) => localDay(new Date(completion.completed_at))));
  const day = new Date(now);
  if (!dates.has(localDay(day))) day.setDate(day.getDate() - 1);
  let streak = 0;
  while (dates.has(localDay(day))) { streak++; day.setDate(day.getDate() - 1); }
  return { xp: passed.reduce((sum, completion) => sum + completion.xp, 0), streak, completed: passed.filter((c) => !c.lesson_id.startsWith('review:')&&!c.lesson_id.startsWith('challenge:')).length };
}

export function isLessonUnlocked(units: CourseUnit[], completions: LessonCompletion[], lessonId: string) {
  const lessons = units.flatMap((unit) => unit.lessons);
  const index = lessons.findIndex((lesson) => lesson.id === lessonId);
  return index >= 0 && (index === 0 || completions.some((completion) => completion.lesson_id === lessons[index - 1].id && completion.passed));
}

export function shouldStretch(completions: LessonCompletion[]) {
  const checkpoints = completions.filter((item) => item.lesson_id.endsWith('-day7')).sort((a,b) => a.completed_at.localeCompare(b.completed_at)).slice(-2);
  const reviews = completions.filter((item) => item.lesson_id.startsWith('review:') && item.total>0).slice(-3);
  return checkpoints.length===2 && checkpoints.every((item)=>item.passed && item.score===item.total && (item.attempts??1)===1)
    && reviews.length>0 && reviews.reduce((sum,item)=>sum+item.score/item.total,0)/reviews.length>=0.8;
}
