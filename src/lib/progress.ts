import type { Skill, Workspace } from './types';

export function skillProgress(data: Workspace): Record<Skill, number> {
  const completion = (skill: Skill) => {
    const ids = data.lessons.filter((l) => l.skill === skill).map((l) => l.id);
    return ids.length
      ? data.lessonProgress.filter((p) => ids.includes(p.lesson_id) && p.status === 'completed').length / ids.length
      : 0;
  };
  return {
    Grammar: Math.round(completion('Grammar') * 100),
    Vocabulary: data.vocabulary.length
      ? Math.round((data.wordProgress.filter((w) => w.known).length / data.vocabulary.length) * 100)
      : 0,
    Reading: data.passages.length
      ? Math.min(
          100,
          Math.round(
            (new Set(data.attempts.filter((a) => a.kind === 'reading').map((a) => a.title)).size /
              data.passages.length) *
              100,
          ),
        )
      : 0,
    Writing: data.writing.length
      ? Math.round((data.drafts.filter((d) => d.submitted).length / data.writing.length) * 100)
      : 0,
    Speaking: Math.round(completion('Speaking') * 100),
  };
}

export function activityDays(data: Workspace) {
  return [
    ...data.conciseAttempts.map((attempt) => attempt.created_at),
    ...data.attempts.map((a) => a.created_at),
    ...data.wordProgress.map((w) => w.updated_at),
    ...data.lessonProgress.map((p) => p.updated_at),
    ...data.drafts.map((d) => d.updated_at),
    ...data.submissions.map((s) => s.submitted_at),
  ].map((d) => new Date(d).toLocaleDateString('en-CA'));
}

export function weeklyStreak(data: Workspace) {
  const dates = new Set(activityDays(data));
  let count = 0;
  const date = new Date();
  if (!dates.has(date.toLocaleDateString('en-CA'))) date.setDate(date.getDate() - 1);
  while (dates.has(date.toLocaleDateString('en-CA'))) {
    count++;
    date.setDate(date.getDate() - 1);
  }
  return count;
}

export function topicAccuracy(data: Workspace) {
  const topics = new Map<string, { total: number; correct: number }>();
  data.attempts
    .filter((a) => a.kind === 'grammar')
    .forEach((a) =>
      a.answers.forEach((answer) => {
        const entry = topics.get(answer.topic) ?? { total: 0, correct: 0 };
        topics.set(answer.topic, { total: entry.total + 1, correct: entry.correct + Number(answer.correct) });
      }),
    );
  return [...topics.entries()].map(([topic, value]) => ({
    topic,
    ...value,
    accuracy: Math.round((value.correct / value.total) * 100),
  }));
}

export function relativeDate(value: string) {
  const date = new Date(value);
  const today = new Date();
  if (date.toDateString() === today.toDateString()) return 'Today';
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
  return date.toLocaleDateString('en-GB', { month: 'short', day: 'numeric' });
}
