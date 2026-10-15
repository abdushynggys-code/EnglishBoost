import type { SummaryScenario } from '../lib/summaryTypes';
import { starterReading } from './starterReading';
export const summaryReading: SummaryScenario[] = [
  {
    id: 'reading',
    level: 3,
    title: 'A story in a few words',
    question: 'Summarize how Sam’s interest in gardening changed.',
    original: starterReading.body,
    models: [
      'Sam joined the gardening club because of a friend, but growing a plant made him interested in gardening.',
      'At first, Sam thought plants were boring. After planting a seed at the school club, he became curious about how it grows.',
    ],
    details: [
      {
        id: 'friend',
        text: 'At first, Sam joined because of his friend.',
        relevant: true,
        explanation: 'This explains his starting point.',
      },
      {
        id: 'day',
        text: 'The club meets on Tuesdays.',
        relevant: false,
        explanation: 'The exact weekday does not explain how his interest changed.',
      },
      {
        id: 'seed',
        text: 'Planting a seed made Sam curious about growing plants.',
        relevant: true,
        explanation: 'This gives the important change and its cause.',
      },
      {
        id: 'window',
        text: 'The pot was by the window.',
        relevant: null,
        explanation: 'This matters for growing a plant, but may not be needed to summarize the change in his feelings.',
      },
    ],
  },
];
