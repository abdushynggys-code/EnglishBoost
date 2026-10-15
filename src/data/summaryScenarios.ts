import type { SummaryScenario, ResponseStyle } from '../lib/summaryTypes';
import { summaryReading } from './summaryReading';
import { summaryEveryday } from './summaryEveryday';
import { summaryRetelling } from './summaryRetelling';
import { summaryOpinions } from './summaryOpinions';

export const summaryScenarios: SummaryScenario[] = [
  ...summaryEveryday,
  ...summaryRetelling,
  ...summaryOpinions,
  ...summaryReading,
];

export const styleQuestions: { id: string; question: string; style: ResponseStyle }[] = [
  { id: 's1', question: 'How was your morning?', style: 'impression' },
  { id: 's2', question: 'What did you do this morning?', style: 'activities' },
  { id: 's3', question: 'Tell me everything you did this morning.', style: 'sequence' },
  { id: 's4', question: 'Why were you late this morning?', style: 'reason' },
  { id: 's5', question: 'Walk me through your morning step by step.', style: 'sequence' },
];
export const conversationPrompts = [
  'How was your weekend?',
  'What did you do after school?',
  'How was your day?',
  'What happened at school today?',
  'Tell me about your favourite game.',
  'What did you do during your holiday?',
  'How was your trip?',
  'What did you think of the movie?',
];
