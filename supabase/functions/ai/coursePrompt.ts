export type AssessmentKind = 'quiz' | 'easy_test' | 'hard_test';

export type CourseImage = {
  role: 'front_cover' | 'back_cover' | 'material';
  mimeType: 'image/jpeg' | 'image/png' | 'image/webp';
  data: string;
};

export type GeneratedQuestion = {
  topic: string;
  difficulty: 'Beginner' | 'Intermediate';
  type: 'choice' | 'blank' | 'correction' | 'boolean';
  prompt: string;
  options: string[];
  answer: string;
  explanation: string;
};

export type GeneratedCourse = {
  accepted: boolean;
  reason: string;
  book_identity: string;
  extracted_text: string;
  lesson?: {
    title: string;
    description: string;
    objectives: string[];
    activities: string;
    homework: string;
    duration: number;
    skill: 'Grammar' | 'Vocabulary' | 'Reading' | 'Writing' | 'Speaking';
    book_unit: string;
    book_page: string;
    difficulty: 'Beginner' | 'Intermediate';
    questions: GeneratedQuestion[];
  };
};

export function buildCoursePrompt(input: {
  bookName: string;
  bookIdentity: string;
  assessmentKind: AssessmentKind;
  questionCount: number;
  isNewBook: boolean;
}) {
  return `You convert tutor-supplied textbook photos into one safe English lesson.

SOURCE RULES (highest priority):
1. Use only text and exercises visibly present in images labelled MATERIAL. Never browse, recall, search for, or reconstruct pages from the internet or model memory.
2. FRONT_COVER and BACK_COVER images identify a new book only. Do not use cover marketing text as lesson content.
3. Reject by setting accepted=false when an image is unreadable, substantially cropped, lacks useful learning content, conflicts with the supplied book name/identity, or may belong to a different book. When uncertain, reject; never guess.
4. Do not invent quotations, page numbers, units, answer keys, facts, or exercises. Paraphrase explanations and create original practice questions grounded only in visible MATERIAL content.
5. Keep books separate. Supplied book name: ${JSON.stringify(input.bookName)}. Saved identity: ${JSON.stringify(input.bookIdentity || 'none; derive it only from both covers')}.
6. ${input.isNewBook ? 'Both FRONT_COVER and BACK_COVER must be present and consistent with the supplied name.' : 'This is an existing saved book; reject material that conflicts with its saved identity.'}

COURSE RULES:
- Build a focused lesson that teaches the visible material, not a generic lesson about the book.
- ${input.assessmentKind === 'easy_test' ? 'This is an easier test: set the lesson and every question to Beginner.' : input.assessmentKind === 'hard_test' ? 'This is a harder test: set the lesson and every question to Intermediate.' : 'This is an adaptive quiz: infer the lesson level from visible task complexity and arrange questions from accessible to more challenging; individual questions may use either difficulty.'}
- Return exactly ${input.questionCount} unique questions.
- For choice/boolean questions, options must contain the exact answer. Use 2-4 plausible options. For blank/correction, options must be [].
- Do not require information absent from the images. Every answer must be supported by the visible material or the lesson explanation you create from it.
- extracted_text must be a concise transcription/summary of only visible MATERIAL text, at most 3000 characters.

Return JSON only with this shape:
{
  "accepted": true,
  "reason": "short confidence note",
  "book_identity": "publisher/title/edition clues visible on covers, without guessing",
  "extracted_text": "visible material only",
  "lesson": {
    "title": "...", "description": "...", "objectives": ["..."],
    "activities": "clear teaching explanation and guided practice",
    "homework": "short original follow-up grounded in the material", "duration": 30,
    "skill": "Grammar|Vocabulary|Reading|Writing|Speaking",
    "book_unit": "visible unit or topic, or Material import", "book_page": "visible page number or Not visible",
    "difficulty": "Beginner|Intermediate",
    "questions": [{"topic":"...","difficulty":"Beginner|Intermediate","type":"choice|blank|correction|boolean","prompt":"...","options":["..."],"answer":"...","explanation":"..."}]
  }
}
For rejection return accepted=false, a useful reason, book_identity if safely visible, extracted_text="", and omit lesson.`;
}
