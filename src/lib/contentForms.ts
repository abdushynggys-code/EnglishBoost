import type { Workspace } from './types';

export type ContentKind = 'lessons' | 'questions' | 'vocabulary' | 'passages' | 'writing';
export type FieldDefinition = {
  key: string;
  label: string;
  type?: 'textarea' | 'number' | 'select';
  options?: string[];
  minimum?: number;
  maximum?: number;
  optional?: boolean;
};
export const contentTables: Record<ContentKind, string> = {
  lessons: 'lessons',
  questions: 'quiz_questions',
  vocabulary: 'vocabulary',
  passages: 'reading_passages',
  writing: 'writing_assignments',
};

export function contentFields(kind: ContentKind, data: Workspace): FieldDefinition[] {
  const titles = data.lessons.map((l) => l.id);
  const fields: Record<ContentKind, FieldDefinition[]> = {
    lessons: [
      { key: 'title', label: 'Lesson title' },
      { key: 'week', label: 'Week', type: 'number', minimum: 1, maximum: 8 },
      { key: 'description', label: 'Description', type: 'textarea' },
      { key: 'objectives', label: 'Learning objectives (one per line)', type: 'textarea' },
      { key: 'activities', label: 'Lesson content and activities', type: 'textarea' },
      { key: 'activities_de', label: 'German explanation (optional)', type: 'textarea', optional: true },
      { key: 'activities_ru', label: 'Russian explanation (optional)', type: 'textarea', optional: true },
      { key: 'activities_kk', label: 'Kazakh explanation (optional)', type: 'textarea', optional: true },
      { key: 'book_unit', label: 'Textbook unit (optional)', optional: true },
      { key: 'book_page', label: 'Textbook page (optional)', optional: true },
      {
        key: 'practice_path',
        label: 'Assigned practice',
        type: 'select',
        options: ['', '/summarize', '/practice', '/vocabulary', '/reading', '/writing'],
        optional: true,
      },
      { key: 'homework', label: 'Homework idea', type: 'textarea' },
      { key: 'duration', label: 'Minutes', type: 'number', minimum: 5, maximum: 180 },
      {
        key: 'skill',
        label: 'Skill',
        type: 'select',
        options: ['Grammar', 'Vocabulary', 'Reading', 'Writing', 'Speaking'],
      },
    ],
    questions: [
      { key: 'lesson_id', label: 'Lesson', type: 'select', options: titles },
      { key: 'topic', label: 'Topic' },
      { key: 'difficulty', label: 'Difficulty', type: 'select', options: ['Beginner', 'Intermediate'] },
      { key: 'type', label: 'Question type', type: 'select', options: ['choice', 'blank', 'correction', 'boolean'] },
      { key: 'prompt', label: 'Question', type: 'textarea' },
      {
        key: 'options',
        label: 'Answer options (one per line; leave empty for written answers)',
        type: 'textarea',
        optional: true,
      },
      { key: 'answer', label: 'Correct answer' },
      { key: 'explanation', label: 'Explanation', type: 'textarea' },
      { key: 'explanation_de', label: 'German explanation (optional)', type: 'textarea', optional: true },
      { key: 'explanation_ru', label: 'Russian explanation (optional)', type: 'textarea', optional: true },
      { key: 'explanation_kk', label: 'Kazakh explanation (optional)', type: 'textarea', optional: true },
    ],
    vocabulary: [
      { key: 'word', label: 'English word' },
      { key: 'translation', label: 'German translation (optional)', optional: true },
      { key: 'translation_ru', label: 'Russian translation (optional)', optional: true },
      { key: 'translation_kk', label: 'Kazakh translation (optional)', optional: true },
      { key: 'definition_kk', label: 'Kazakh explanation (optional)', type: 'textarea', optional: true },
      { key: 'definition_de', label: 'German explanation (optional)', type: 'textarea', optional: true },
      { key: 'definition_ru', label: 'Russian explanation (optional)', type: 'textarea', optional: true },
      { key: 'definition', label: 'English definition', type: 'textarea' },
      { key: 'example', label: 'Example sentence', type: 'textarea' },
      { key: 'theme', label: 'Theme' },
      { key: 'difficulty', label: 'Level', type: 'select', options: ['A2', 'B1', 'B2'] },
    ],
    passages: [
      { key: 'title', label: 'Title' },
      { key: 'level', label: 'Level and category' },
      { key: 'body', label: 'Reading passage', type: 'textarea' },
    ],
    writing: [
      { key: 'title', label: 'Title' },
      { key: 'format', label: 'Format' },
      { key: 'instructions', label: 'Instructions', type: 'textarea' },
      { key: 'min_words', label: 'Minimum words', type: 'number', minimum: 20, maximum: 1000 },
    ],
  };
  return fields[kind];
}

export function parseContent(values: Record<string, string>, kind: ContentKind): Record<string, unknown> {
  const result: Record<string, unknown> = { ...values };
  for (const key of ['week', 'duration', 'min_words']) if (key in result) result[key] = Number(values[key]);
  for (const key of ['objectives', 'options'])
    if (key in result)
      result[key] = values[key]
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean);
  if (kind === 'questions') {
    const options = result.options as string[];
    if (['choice', 'boolean'].includes(values.type) && (options.length < 2 || !options.includes(values.answer)))
      throw new Error('Add at least two answer options and make sure the correct answer matches one of them.');
    if (!['choice', 'boolean'].includes(values.type)) result.options = [];
  }
  return result;
}
