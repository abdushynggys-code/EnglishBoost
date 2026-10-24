import { placementQuestions } from '../../data/course/placement';
import { courseSkills } from './progress';
import type { CourseLevel, PlacementAnswer } from './types';

export function nextPlacementQuestion(answers: PlacementAnswer[]) {
  const skill = courseSkills[Math.floor(answers.length / 3)];
  if (!skill) return null;
  const previous = answers.filter((answer) => answer.skill === skill);
  const last = previous[previous.length-1];
  let level: CourseLevel = 'A2';
  if (last) {
    if (last.level === 'A2') level = last.correct && !last.assisted ? 'B1' : 'A1';
    else level = last.level === 'B1' && !last.correct ? 'A2' : last.level;
  }
  const available = placementQuestions.filter((question) => question.skill === skill && !answers.some((answer) => answer.question_id === question.id));
  return available.find((question) => question.level === level) ?? available[0];
}
