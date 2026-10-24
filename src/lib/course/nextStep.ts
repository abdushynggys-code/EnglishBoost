import { buildLearningPath } from '../../data/course/units';
import { isLessonUnlocked } from './progress';
import type { CourseState } from './types';

export function nextCourseStep(state: CourseState) {
  if (!state.placement) return null;
  const { level, settings } = state.placement;
  const units = buildLearningPath(level, settings.interest,state.placement.id);
  for (const [index, unit] of units.entries()) {
    const lessonIndex = unit.lessons.findIndex((lesson) =>
      !state.completions.some((completion) => completion.lesson_id === lesson.id && completion.passed)
      && isLessonUnlocked(units, state.completions, lesson.id));
    if (lessonIndex >= 0) return {
      level:unit.level,lesson: unit.lessons[lessonIndex], unit: unit.title, unitNumber: index + 1,
      lessonNumber: lessonIndex + 1, href: `/course/${unit.lessons[lessonIndex].id}`,
    };
  }
  return null;
}
