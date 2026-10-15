import type { Passage, WritingAssignment } from '../lib/types';

export const passages: Passage[] = [
  {
    id: 'r1',
    title: 'The Repair Café',
    level: 'B1 · Everyday life',
    body: 'On the first Saturday of each month, a small café in Hamburg becomes something unusual. Instead of serving only coffee and cake, it welcomes people carrying broken things: lamps, bicycles, and even old radios.\n\nFourteen-year-old Jonas first visited with a broken desk lamp. He expected someone to fix it for him, but a volunteer named Eva handed him a screwdriver. “I’ll help you,” she said, “but you’re going to do the repairing.” Together, they discovered a loose wire. Ten minutes later, the lamp worked again.\n\nJonas returned the following month, this time to help someone else. He couldn’t repair everything, but he could ask questions and learn. The café’s goal isn’t simply to save objects from the rubbish bin. It is also to bring neighbours together and remind them that learning has no age limit.\n\n“Buying something new is easy,” Jonas says. “Understanding how something works is much more satisfying.”',
    questions: [
      {
        id: 'r1q1',
        prompt: 'What is the main purpose of the passage?',
        options: [
          'To advertise a new lamp',
          'To explain how a repair café helps objects and people',
          'To compare different cafés',
          'To teach electrical engineering',
        ],
        answer: 'To explain how a repair café helps objects and people',
        explanation: 'The text describes both repairing objects and bringing neighbours together.',
      },
      {
        id: 'r1q2',
        prompt: 'Why did Eva give Jonas a screwdriver?',
        options: [
          'She wanted him to leave',
          'She had already repaired the lamp',
          'She wanted him to learn by repairing it himself',
          'She was selling tools',
        ],
        answer: 'She wanted him to learn by repairing it himself',
        explanation: 'Eva says she will help, but Jonas will do the repairing.',
      },
      {
        id: 'r1q3',
        prompt: 'How did Jonas’s role change on his second visit?',
        options: [],
        answer: 'He returned to help someone else.',
        explanation:
          'At first he needed help. On his second visit he became a helper. Your tutor can discuss other ways to express this answer.',
      },
      {
        id: 'r1q4',
        prompt: 'What can we infer about Jonas?',
        options: [
          'He has become more curious and willing to help',
          'He dislikes learning new skills',
          'He plans to buy a café',
          'He can fix every object',
        ],
        answer: 'He has become more curious and willing to help',
        explanation: 'He returns to help and describes understanding things as satisfying.',
      },
    ],
  },
  {
    id: 'r2',
    title: 'The Last Seat',
    level: 'B1 · A short story',
    body: 'Mila stood at the classroom door, searching for an empty seat. It was her first day at a new school, and every table seemed to belong to a group of friends. There was one free chair beside a boy who was drawing in a notebook.\n\n“Is this seat taken?” she asked. He shook his head without looking up. Mila sat down and opened her book. For the next ten minutes, neither of them spoke. Then she noticed his drawing: a tiny city built on the back of a giant turtle.\n\n“That’s incredible,” she said. The boy looked surprised. “You think so? I’m making a comic, but I can’t think of a story.” Mila paused. She had spent the whole morning wishing she could disappear. Now she had an idea. “What if the turtle gets lost?”\n\nBy lunchtime, the notebook held two new pages of adventures. Mila still didn’t know most of her classmates’ names. But the last empty seat no longer felt like the wrong place to be.',
    questions: [
      {
        id: 'r2q1',
        prompt: 'How does Mila feel at the beginning?',
        options: ['Nervous and unsure', 'Angry at the teacher', 'Excited to draw', 'Confident and popular'],
        answer: 'Nervous and unsure',
        explanation: 'She searches for a seat and wishes she could disappear.',
      },
      {
        id: 'r2q2',
        prompt: 'What starts the conversation?',
        options: [
          'A homework question',
          'Mila’s comment about the drawing',
          'The teacher’s instructions',
          'An argument about a chair',
        ],
        answer: 'Mila’s comment about the drawing',
        explanation: 'Mila says “That’s incredible” after seeing the turtle city.',
      },
      {
        id: 'r2q3',
        prompt: 'Which theme best fits this story?',
        options: [
          'Small shared interests can begin a friendship',
          'It is best to avoid strangers',
          'School rules should change',
          'Art is more important than reading',
        ],
        answer: 'Small shared interests can begin a friendship',
        explanation: 'Their interest in the comic turns an uncomfortable silence into a connection.',
      },
    ],
  },
];

export const writingAssignments: WritingAssignment[] = [
  {
    id: 'w1',
    title: 'Should students have less homework?',
    format: 'Opinion paragraph',
    min_words: 120,
    instructions:
      'Write 120–150 words explaining your opinion. Start with a clear topic sentence, give two reasons and one example, use a linking word, and finish with a conclusion.',
  },
  {
    id: 'w2',
    title: 'A small moment, a big difference',
    format: 'Short story',
    min_words: 100,
    instructions:
      'Write 100–180 words about someone who helps another person. Describe the setting, include a short conversation, and explain what changes. Use the past simple.',
  },
  {
    id: 'w3',
    title: 'A little introduction',
    format: 'Personal introduction',
    min_words: 80,
    instructions:
      'Write 80–100 words about yourself, your school, and your hobbies. Include one English learning goal and explain why it matters to you.',
  },
];
