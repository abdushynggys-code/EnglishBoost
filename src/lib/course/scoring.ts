import type { CourseQuestion } from "./types";
export const normalizeAnswer = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[.!?]$/, "");
export function gradeCourseAnswer(question: CourseQuestion, response: string, assisted: boolean, graded: boolean) {
  const matched = normalizeAnswer(response) === normalizeAnswer(question.answer);
  return {
    correct: graded ? matched && (!assisted || !!question.audio) : matched,
    independent: matched && !assisted,
    transcript: !!question.audio && assisted,
  };
}
