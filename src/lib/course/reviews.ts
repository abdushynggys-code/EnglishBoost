import type { CourseUnit, ReviewCard } from './types';
import { courseQuestionBank } from '../../data/course/units';

export function dueQuestions(units: CourseUnit[], reviews: ReviewCard[], now = new Date()) {
  const questions = new Map(courseQuestionBank(units).map((question) => [question.id, question]));
  return reviews.filter((card) => new Date(card.due_at).getTime() <= now.getTime())
    .sort((first, second) => second.lapses - first.lapses || first.due_at.localeCompare(second.due_at))
    .flatMap((card) => { const question = questions.get(card.item_id); return question ? [question] : []; })
    .slice(0, 8);
}
