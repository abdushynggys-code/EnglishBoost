import { lessons } from './lessons';
import { questions } from './questions';
import { vocabulary } from './vocabulary';
import { passages, writingAssignments } from './reading';
import { starterWords } from './starterWords';
import { starterQuestions } from './starterQuestions';
import { starterReading } from './starterReading';
import type { Workspace } from '../lib/types';
import { accessLessons } from './access2/lessons';
import { accessQuestions } from './access2/questions';
import { accessWords } from './access2/vocabulary';
import { accessPassages } from './access2/reading';
import { accessWriting } from './access2/writing';

export function emptyWorkspace(): Workspace {
  return {
    lessons: [...accessLessons, ...lessons],
    questions: [...accessQuestions, ...starterQuestions, ...questions],
    vocabulary: [...accessWords, ...starterWords, ...vocabulary],
    passages: [...accessPassages, starterReading, ...passages],
    writing: [...accessWriting, ...writingAssignments],
    lessonProgress: [],
    attempts: [],
    wordProgress: [],
    drafts: [],
    homework: [],
    submissions: [],
    feedback: [],
    sessions: [],
    conciseAttempts: [],
  };
}

export function demoWorkspace(): Workspace {
  const data = emptyWorkspace();
  const today = new Date();
  const daysAgo = (days: number) => new Date(today.getTime() - days * 86400000).toISOString();
  const sessionDate = new Date(today);
  sessionDate.setDate(today.getDate() + 1);
  sessionDate.setHours(16, 0, 0, 0);
  return {
    ...data,
    lessonProgress: [
      { lesson_id: 'week-1', status: 'completed', updated_at: daysAgo(7) },
      { lesson_id: 'week-2', status: 'completed', updated_at: daysAgo(1) },
      { lesson_id: 'week-3', status: 'in_progress', updated_at: daysAgo(0) },
    ],
    attempts: [
      {
        id: 'demo-a1',
        title: 'Verb Tenses Quiz',
        score: 5,
        total: 6,
        kind: 'grammar',
        created_at: daysAgo(1),
        answers: questions
          .slice(0, 6)
          .map((q, i) => ({ question_id: q.id, topic: q.topic, response: q.answer, correct: i !== 3 })),
      },
      {
        id: 'demo-a2',
        title: 'The Repair Café',
        score: 2,
        total: 3,
        kind: 'reading',
        created_at: daysAgo(3),
        answers: [],
      },
    ],
    wordProgress: vocabulary
      .slice(0, 4)
      .map((word) => ({ vocabulary_id: word.id, known: true, review_at: daysAgo(-3), updated_at: daysAgo(2) })),
    sessions: [
      { id: 'demo-session', user_id: 'demo', starts_at: sessionDate.toISOString(), duration: 60, meeting_url: '' },
    ],
    homework: [
      {
        id: 'demo-h1',
        user_id: 'demo',
        lesson_id: 'week-3',
        title: 'A day at your school',
        instructions:
          'Write eight sentences about your school day. Include two questions and two negatives. Try the Sentence Structure quiz first.',
        due_at: daysAgo(-3).slice(0, 10),
        material_url: '',
        practice_path: '/practice?lesson=week-3',
      },
    ],
  };
}
