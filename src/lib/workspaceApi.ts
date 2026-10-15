import { supabase } from './supabase';
import type { ConciseAttempt } from './summaryTypes';
import type {
  Attempt,
  Draft,
  Feedback,
  Homework,
  HomeworkSubmission,
  Lesson,
  LessonProgress,
  Passage,
  Profile,
  Question,
  TutoringSession,
  Word,
  WordProgress,
  Workspace,
  WritingAssignment,
} from './types';

export async function loadProfile(userId: string) {
  const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single<Profile>();
  if (error)
    throw new Error(
      'Could not load your workspace. Please retry. If this is a new setup, apply the EnglishBoost database migrations.',
    );
  return data;
}

export async function loadWorkspace(userId: string): Promise<Workspace> {
  const results = await Promise.all([
    supabase.from('lessons').select('*').order('week').returns<Lesson[]>(),
    supabase.from('quiz_questions').select('*').order('id').returns<Question[]>(),
    supabase.from('vocabulary').select('*').order('word').returns<Word[]>(),
    supabase.from('reading_passages').select('*, questions:reading_questions(*)').returns<Passage[]>(),
    supabase.from('writing_assignments').select('*').returns<WritingAssignment[]>(),
    supabase.from('lesson_progress').select('*').eq('user_id', userId).returns<LessonProgress[]>(),
    supabase
      .from('quiz_attempts')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .returns<Attempt[]>(),
    supabase
      .from('reading_attempts')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .returns<Attempt[]>(),
    supabase.from('student_vocabulary').select('*').eq('user_id', userId).returns<WordProgress[]>(),
    supabase.from('writing_submissions').select('*').eq('user_id', userId).returns<Draft[]>(),
    supabase.from('homework_assignments').select('*').eq('user_id', userId).order('due_at').returns<Homework[]>(),
    supabase.from('homework_submissions').select('*').eq('user_id', userId).returns<HomeworkSubmission[]>(),
    supabase.from('tutor_feedback').select('*').eq('user_id', userId).returns<Feedback[]>(),
    supabase
      .from('tutoring_sessions')
      .select('*')
      .eq('user_id', userId)
      .order('starts_at')
      .returns<TutoringSession[]>(),
    supabase
      .from('concise_attempts')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .returns<ConciseAttempt[]>(),
  ]);
  const failed = results.find((result) => result.error);
  if (failed?.error) throw new Error(failed.error.message);
  const [
    lessons,
    questions,
    vocabulary,
    passages,
    writing,
    lessonProgress,
    quizzes,
    readings,
    wordProgress,
    drafts,
    homework,
    submissions,
    feedback,
    sessions,
    conciseAttempts,
  ] = results;
  return {
    lessons: lessons.data ?? [],
    questions: questions.data ?? [],
    vocabulary: vocabulary.data ?? [],
    passages: passages.data ?? [],
    writing: writing.data ?? [],
    lessonProgress: lessonProgress.data ?? [],
    attempts: [
      ...(quizzes.data ?? []).map((a) => ({ ...a, kind: 'grammar' as const })),
      ...(readings.data ?? []).map((a) => ({ ...a, kind: 'reading' as const })),
    ].sort((a, b) => b.created_at.localeCompare(a.created_at)),
    wordProgress: wordProgress.data ?? [],
    drafts: drafts.data ?? [],
    homework: homework.data ?? [],
    submissions: submissions.data ?? [],
    feedback: feedback.data ?? [],
    sessions: sessions.data ?? [],
    conciseAttempts: conciseAttempts.data ?? [],
  };
}

export async function persistRow(table: string, row: object, conflict?: string) {
  const result = conflict
    ? await supabase.from(table).upsert(row, { onConflict: conflict })
    : await supabase.from(table).insert(row);
  if (result.error) throw new Error(result.error.message);
}

export async function updateProfile(id: string, settings: Pick<Profile, 'full_name' | 'goal' | 'weekly_target'>) {
  const { error } = await supabase.from('profiles').update(settings).eq('id', id);
  if (error) throw new Error(error.message);
}
