import { supabase } from './supabase';
import type { Lesson, Question } from './types';

export type SourceBook = { id: string; name: string; identity_notes: string; created_at: string };
export type AssessmentKind = 'quiz' | 'easy_test' | 'hard_test';
type CourseImage = { role: 'front_cover' | 'back_cover' | 'material'; mimeType: string; data: string };
type GeneratedCourse = {
  book_identity: string;
  extracted_text: string;
  lesson: Omit<Lesson, 'id' | 'week'> & {
    difficulty: Question['difficulty'];
    questions: Omit<Question, 'id' | 'lesson_id'>[];
  };
};
type GenerateResponse = { course?: GeneratedCourse; rejected?: boolean; reason?: string; error?: string };

export async function loadSourceBooks() {
  const { data, error } = await supabase
    .from('ai_source_books')
    .select('id,name,identity_notes,created_at')
    .order('created_at', { ascending: false })
    .returns<SourceBook[]>();
  if (error) throw new Error(error.message);
  return data ?? [];
}

async function imagePart(file: File, role: CourseImage['role']): Promise<CourseImage> {
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
    throw new Error('Use JPG, PNG, or WebP images.');
  }
  if (file.size > 4_000_000) throw new Error(`${file.name} is larger than 4 MB. Compress it first.`);
  const bytes = new Uint8Array(await file.arrayBuffer());
  let binary = '';
  for (let start = 0; start < bytes.length; start += 32_768) {
    binary += String.fromCharCode(...bytes.subarray(start, start + 32_768));
  }
  return { role, mimeType: file.type, data: btoa(binary) };
}

function questionCount(kind: AssessmentKind) {
  if (kind === 'easy_test') return 20;
  if (kind === 'hard_test') return 10;
  const sizes = [5, 10, 15, 20] as const;
  return sizes[crypto.getRandomValues(new Uint32Array(1))[0] % sizes.length];
}

export async function createBookCourse(input: {
  userId: string;
  book?: SourceBook;
  bookName: string;
  front?: File;
  back?: File;
  materials: File[];
  assessmentKind: AssessmentKind;
}) {
  const count = questionCount(input.assessmentKind);
  const images = await Promise.all([
    ...(input.front ? [imagePart(input.front, 'front_cover')] : []),
    ...(input.back ? [imagePart(input.back, 'back_cover')] : []),
    ...input.materials.map((file) => imagePart(file, 'material')),
  ]);
  const { data, error } = await supabase.functions.invoke<GenerateResponse>('ai', {
    body: {
      mode: 'course_from_images',
      bookName: input.book?.name ?? input.bookName,
      bookIdentity: input.book?.identity_notes ?? '',
      assessmentKind: input.assessmentKind,
      questionCount: count,
      images,
    },
  });
  if (error) throw new Error(error.message);
  if (data?.rejected) throw new Error(data.reason || 'AI could not verify this material.');
  if (data?.error || !data?.course) throw new Error(data?.error || 'AI returned no course.');

  const generated = data.course;
  let bookId = input.book?.id;
  let createdBook = false;
  if (!bookId) {
    const result = await supabase
      .from('ai_source_books')
      .insert({ tutor_id: input.userId, name: input.bookName.trim(), identity_notes: generated.book_identity })
      .select('id')
      .single<{ id: string }>();
    if (result.error) throw new Error(result.error.message);
    bookId = result.data.id;
    createdBook = true;
  }

  const lessonId = `ai-${crypto.randomUUID()}`;
  const lesson: Lesson & { user_id: string } = {
    id: lessonId,
    user_id: input.userId,
    week: 1,
    title: generated.lesson.title,
    description: generated.lesson.description,
    objectives: generated.lesson.objectives,
    activities: generated.lesson.activities,
    homework: generated.lesson.homework,
    duration: Math.min(180, Math.max(5, Math.round(generated.lesson.duration))),
    skill: generated.lesson.skill,
    practice_path: `/practice?lesson=${lessonId}`,
    book_unit: `${input.book?.name ?? input.bookName}: ${generated.lesson.book_unit}`,
    book_page: generated.lesson.book_page,
  };
  try {
    const savedLesson = await supabase.from('lessons').insert(lesson);
    if (savedLesson.error) throw new Error(savedLesson.error.message);
    const questions = generated.lesson.questions.map((question, index) => ({
      ...question,
      id: `${lessonId}-q-${index + 1}`,
      lesson_id: lessonId,
      user_id: input.userId,
    }));
    const savedQuestions = await supabase.from('quiz_questions').insert(questions);
    if (savedQuestions.error) throw new Error(savedQuestions.error.message);
    const savedImport = await supabase.from('ai_course_imports').insert({
      tutor_id: input.userId,
      book_id: bookId,
      lesson_id: lessonId,
      extracted_text: generated.extracted_text,
      assessment_kind: input.assessmentKind,
      difficulty: generated.lesson.difficulty,
      question_count: questions.length,
    });
    if (savedImport.error) throw new Error(savedImport.error.message);
    return { lessonId, questionCount: questions.length, difficulty: generated.lesson.difficulty };
  } catch (cause) {
    await supabase.from('lessons').delete().eq('id', lessonId);
    if (createdBook) await supabase.from('ai_source_books').delete().eq('id', bookId);
    throw cause;
  }
}
