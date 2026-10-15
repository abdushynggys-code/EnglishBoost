import { countWords } from './writing';
import type { ConciseAttempt, SummaryMode } from './summaryTypes';

export const summaryModes: { id: SummaryMode; title: string; description: string }[] = [
  { id: 'main_idea', title: 'Main idea first', description: 'Answer the question before adding details.' },
  {
    id: 'sentences',
    title: 'The sentence challenge',
    description: 'Start with one sentence. Add more only when it helps.',
  },
  { id: 'relevance', title: 'Keep it relevant', description: 'Choose details that help your listener.' },
  { id: 'shorten', title: 'The shorter answer game', description: 'Keep the important meaning in fewer words.' },
  { id: 'conversation', title: 'A little conversation', description: 'Try an answer, then make it clearer.' },
  {
    id: 'styles',
    title: 'What does the question need?',
    description: 'Match the question to the right response style.',
  },
];

export function sentenceCount(text: string) {
  return text.trim() ? (text.match(/[^.!?]+[.!?]*/g) ?? []).filter((s) => s.trim()).length : 0;
}
export function summaryReminders(text: string) {
  const hints = ['Read your first sentence: does it answer the actual question?'];
  if (countWords(text) > 65)
    hints.push('You have a full story. Try opening with the main idea, then choose one or two useful details.');
  if (text.trim() && countWords(text) < 6)
    hints.push('This is very brief. Could one useful detail help the listener understand?');
  if ((text.match(/\bthen\b/gi) ?? []).length >= 3)
    hints.push('You use “then” several times. Could you group routine steps into one idea?');
  hints.push('Read it aloud. Is anything repeated or missing?');
  return hints;
}

export function suggestedPractice(attempts: ConciseAttempt[]): { level: number; mode: SummaryMode } {
  const recent = attempts.slice(0, 3);
  if (!recent.length) return { level: 1, mode: 'main_idea' };
  if (recent.some((a) => a.objective_total > 0 && a.objective_correct / a.objective_total < 0.6))
    return { level: 1, mode: 'relevance' };
  const written = recent.filter((a) => a.improved.trim());
  if (written.some((a) => countWords(a.improved) > 65 || (a.improved.match(/\bthen\b/gi) ?? []).length >= 3))
    return { level: recent[0].level, mode: 'relevance' };
  if (written.length && written.every((a) => countWords(a.improved) < 6))
    return { level: recent[0].level, mode: 'sentences' };
  const ready =
    recent.length === 3 &&
    recent.every(
      (a) => 'meaning' in a.reflection && a.reflection.meaning && a.reflection.main_idea && a.reflection.relevant,
    );
  return {
    level: Math.min(3, Math.max(...recent.map((a) => a.level)) + Number(ready)),
    mode: ready ? 'shorten' : 'main_idea',
  };
}
