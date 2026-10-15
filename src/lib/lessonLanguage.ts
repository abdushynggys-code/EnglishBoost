import { lessons } from '../data/lessons';
import { lessonExplanations } from '../data/lessonExplanations';
import type { Lesson } from './types';
import type { Language } from './preferences';

export function lessonExplanation(lesson: Lesson, language: Language) {
  if (language === 'en') return lesson.activities;
  const authored = language === 'de' ? lesson.activities_de : lesson.activities_ru;
  if (authored) return authored;
  const starter = lessons.find((item) => item.id === lesson.id && item.activities === lesson.activities);
  return (starter && lessonExplanations[starter.id]?.[language === 'de' ? 0 : 1]) || lesson.activities;
}
