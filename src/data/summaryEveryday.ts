import type { SummaryScenario } from '../lib/summaryTypes';
export const summaryEveryday: SummaryScenario[] = [
  {
    id: 'morning',
    level: 1,
    title: 'My morning',
    question: 'How was your morning?',
    original:
      'I woke up at 8:15, then I got out of bed, then I went to the bathroom, then I brushed my teeth, then I ate breakfast, then I got dressed.',
    models: [
      'My morning was pretty normal. I got ready for school and had breakfast.',
      'It was a bit rushed because I woke up late.',
    ],
    details: [
      {
        id: 'time',
        text: 'I woke up at 8:15.',
        relevant: null,
        explanation:
          'The time helps if you explain why it made you late. A routine time alone may not tell the listener how your morning went.',
      },
      {
        id: 'teeth',
        text: 'I brushed my teeth.',
        relevant: false,
        explanation: 'This routine detail does not usually explain how your morning felt.',
      },
      {
        id: 'tired',
        text: 'I felt tired because I went to bed late.',
        relevant: true,
        explanation: 'A feeling and its reason answer “How was it?” directly.',
      },
      {
        id: 'football',
        text: 'My favourite football team won yesterday.',
        relevant: false,
        explanation: 'Interesting, but it does not answer this question about your morning.',
      },
      {
        id: 'rushed',
        text: 'I was in a hurry because I woke up late.',
        relevant: true,
        explanation: 'This explains the main impression of a rushed morning.',
      },
    ],
  },
  {
    id: 'weekend',
    level: 1,
    title: 'My weekend',
    question: 'How was your weekend?',
    original:
      'On Saturday I put my shoes on and walked to the bus stop. I waited for the bus. I went to the park with my cousin. We played football. Then we sat down, opened our bags, and ate lunch. I had a really good time.',
    models: [
      'My weekend was fun. I played football in the park with my cousin.',
      'I had a great weekend because I spent time with my cousin.',
    ],
    details: [
      {
        id: 'fun',
        text: 'I had a really good time.',
        relevant: true,
        explanation: 'This gives a clear overall impression.',
      },
      {
        id: 'shoes',
        text: 'I put my shoes on.',
        relevant: false,
        explanation: 'Routine preparation can usually be left out of a short weekend summary.',
      },
      {
        id: 'cousin',
        text: 'I played football with my cousin.',
        relevant: true,
        explanation: 'One important activity supports the main idea.',
      },
      {
        id: 'bus',
        text: 'I waited at the bus stop.',
        relevant: null,
        explanation: 'This might matter if the journey was the important part of the story.',
      },
    ],
  },
];
