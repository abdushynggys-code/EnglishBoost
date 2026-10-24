import type { CourseQuestion } from "../../lib/course/types";
import { levelNumber } from "../../lib/course/levels";
const basicEvidence = [[1], [1], [2], [4], [3], [0], [5], [1], [5], [2, 3]];
const middleEvidence = [[0], [0], [1], [2], [1], [0], [0], [0], [0], [1]];
const advancedEvidence = [[1], [2], [3], [0], [0, 1], [4], [2], [0, 2], [5], [0, 2]];
export function balancedAssessment(questions: CourseQuestion[], count: number) {
  const skills = ["grammar", "vocabulary", "reading", "listening"] as const;
  return Array.from({ length: count }, (_, index) => questions.filter((q) => q.skill === skills[index % 4])[Math.floor(index / 4)]);
}
export function quickPractice(question: CourseQuestion): CourseQuestion {
  if (question.quick || question.type === "order") return question;
  let prompt = question.prompt;
  if (question.skill === "grammar") prompt = prompt.split('reads: "')[1]?.slice(0, -1) ?? prompt;
  if (question.skill === "vocabulary") prompt = `What does "${prompt.match(/what does "(.+?)" mean\?/)?.[1] ?? question.answer}" mean?`;
  if (question.skill === "reading" || question.skill === "listening") prompt = prompt.replace(/^[^:]+: /, "");
  const text = question.passage ?? question.audio;
  let excerpt = text;
  if (text) {
    const sentences = text.match(/[^.!?]+(?:[.!?](?=\s+[A-Z]|$)|$)/g)?.map((s) => s.trim()) ?? [text];
    const variant = Number(question.id.match(/\d+$/)?.[0]) % 10;
    const evidence = (levelNumber(question.level) >= 4 ? advancedEvidence : question.level === "B1" ? middleEvidence : basicEvidence)[variant];
    excerpt =
      evidence
        .map((index) => sentences[index])
        .filter(Boolean)
        .join(" ") || text;
  }
  const wrong = question.options.find((option) => option !== question.answer);
  const options = wrong ? question.options.filter((option) => option === question.answer || option === wrong) : question.options;
  return {
    ...question,
    quick: true,
    prompt,
    options,
    ...(question.passage ? { passage: excerpt } : {}),
    ...(question.audio ? { audio: excerpt } : {}),
  };
}
