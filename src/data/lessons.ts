import type { Lesson } from '../lib/types';

export const lessons: Lesson[] = [
  {
    id: 'week-1',
    week: 1,
    title: 'English Assessment',
    skill: 'Grammar',
    duration: 45,
    description: 'A little discovery before the journey. Find your strengths and set your learning goals.',
    objectives: [
      'Check your grammar and vocabulary',
      'Read a short passage',
      'Write about yourself',
      'Set a personal learning goal',
    ],
    activities:
      'Start with the mixed grammar quiz. Try a reading activity, then write a short introduction. Discuss what felt easy and what you want to improve with your tutor.',
    homework: 'Write 80–100 words introducing yourself, your hobbies, and one thing you want to achieve in English.',
  },
  {
    id: 'week-2',
    week: 2,
    title: 'Verb Tenses',
    skill: 'Grammar',
    duration: 40,
    description: 'Present, past, and future. Learn to choose the right tense for your story.',
    objectives: [
      'Present simple and continuous',
      'Past simple and irregular verbs',
      'Present perfect',
      'Future plans and predictions',
    ],
    activities:
      'Compare “I play football” with “I am playing football.” Use the past simple for finished times and the present perfect for experiences. Practise each tense in the grammar quiz.',
    homework: 'Write five sentences about yesterday, five about your routine, and three about your future plans.',
  },
  {
    id: 'week-3',
    week: 3,
    title: 'Sentence Structure and Grammar',
    skill: 'Grammar',
    duration: 35,
    description: 'Word order, questions, negatives, articles, prepositions, and subject–verb agreement.',
    objectives: [
      'Learn the main grammar rules',
      'Do practice exercises',
      'Write your own sentences',
      'Get feedback and set homework',
    ],
    activities:
      'English sentences usually follow subject + verb + object: “Lena reads a book.” Questions often begin with an auxiliary: “Does Lena read?” Use “a” before a consonant sound, “an” before a vowel sound, and “the” for something specific.',
    homework:
      'Write eight sentences about your school day. Include two questions, two negatives, and the articles a, an, and the.',
  },
  {
    id: 'week-4',
    week: 4,
    title: 'Vocabulary and Reading Comprehension',
    skill: 'Vocabulary',
    duration: 40,
    description: 'Context clues, synonyms, antonyms, phrasal verbs, and short texts.',
    objectives: [
      'Use context to discover meaning',
      'Learn synonyms and antonyms',
      'Practise phrasal verbs',
      'Summarize a short passage',
    ],
    activities:
      'Read the whole sentence before looking up a word. Contrast words such as “but” can reveal an opposite meaning. “Give up” means stop trying; “look after” means take care of. Review the flashcards, then read The Repair Café.',
    homework: 'Learn six new words and use each one in a sentence. Summarize one reading passage in three sentences.',
  },
  {
    id: 'week-5',
    week: 5,
    title: 'Writing Better Paragraphs and Essays',
    skill: 'Writing',
    duration: 45,
    description: 'Topic sentences, supporting details, transitions, punctuation, and clear conclusions.',
    objectives: [
      'Write a clear topic sentence',
      'Support ideas with examples',
      'Connect ideas with transitions',
      'Finish with a strong conclusion',
    ],
    activities:
      'Begin a paragraph with one clear idea. Add reasons and examples. Use “however” to contrast and “therefore” for a result. Your conclusion should return to your main idea. Open the Writing Workshop and practise with a school-related opinion.',
    homework:
      'Write 120–150 words explaining whether students should have less homework. Include an example and a conclusion.',
  },
  {
    id: 'week-6',
    week: 6,
    title: 'Reading and Literature',
    skill: 'Reading',
    duration: 40,
    description: 'Main ideas, inference, character, theme, and evidence from the text.',
    objectives: [
      'Identify the main idea',
      'Make an inference using evidence',
      'Explore character and theme',
      'Explain the author’s purpose',
    ],
    activities:
      'A detail tells you something specific; a main idea connects the details. An inference combines clues with your knowledge. Use a quotation or a precise detail to support an answer. Read The Last Seat and explain how its character changes.',
    homework: 'Complete a reading activity. Write one inference and explain which detail supports it.',
  },
  {
    id: 'week-7',
    week: 7,
    title: 'Speaking and Listening',
    skill: 'Speaking',
    duration: 45,
    description: 'Everyday conversations, pronunciation, listening, and expressing your opinions.',
    objectives: [
      'Retell a short story',
      'Practise pronunciation',
      'Listen for important details',
      'Express an opinion politely',
    ],
    activities:
      'Use the vocabulary pronunciation buttons to listen and repeat. Read a passage aloud, then retell it without looking. During your tutor session, explain your opinion using “I think… because…” and ask a follow-up question.',
    homework:
      'Prepare a one-minute talk about a hobby. Note three questions to ask your tutor. Speaking is assessed by your tutor during the session.',
  },
  {
    id: 'week-8',
    week: 8,
    title: 'Review and Test Preparation',
    skill: 'Grammar',
    duration: 50,
    description: 'Mixed practice, weak areas, a writing assessment, and your final progress report.',
    objectives: [
      'Review challenging grammar',
      'Revisit difficult vocabulary',
      'Complete a reading test',
      'Reflect on your progress',
    ],
    activities:
      'Check the Progress page for topics below 70% accuracy. Retry those quizzes, review words marked Needs Practice, and complete one reading and one writing activity. Compare your results with your first attempts.',
    homework:
      'Write a reflection: What has improved? What will you practise next? Discuss your progress report with your tutor.',
  },
];
