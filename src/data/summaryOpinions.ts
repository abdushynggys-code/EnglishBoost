import type { SummaryScenario } from '../lib/summaryTypes';
export const summaryOpinions: SummaryScenario[] = [
  {
    id: 'opinion',
    level: 3,
    title: 'An opinion with a reason',
    question: 'Should our school have a longer lunch break?',
    original:
      'Yesterday I got to the dining hall and there were lots of people. I waited in the queue. Then I got my food. I looked for my friends. I sat down. I only had five minutes to eat before the bell. I think our lunch break should be longer.',
    models: [
      'Our lunch break should be longer because queues leave us too little time to eat. Yesterday I had only five minutes for my meal.',
      'I think a longer lunch break would help. After waiting for food, some students barely have time to eat.',
    ],
    details: [
      {
        id: 'view',
        text: 'I think the lunch break should be longer.',
        relevant: true,
        explanation: 'Start with the opinion the question asks for.',
      },
      {
        id: 'reason',
        text: 'Queues leave too little time to eat.',
        relevant: true,
        explanation: 'A reason helps the listener understand your opinion.',
      },
      {
        id: 'friends',
        text: 'I looked for my friends.',
        relevant: false,
        explanation: 'This detail does not support the main reason for changing the break.',
      },
      {
        id: 'evidence',
        text: 'Yesterday I had only five minutes to eat.',
        relevant: true,
        explanation: 'A relevant example makes your reasoning stronger.',
      },
    ],
  },
];
