import { useLearning } from './learningContext';
import { persistRow, updateProfile } from './workspaceApi';
import type { Attempt, Draft, HomeworkSubmission, LessonProgress, Profile, WordProgress, Workspace } from './types';

export function useLearningActions() {
  const { demo, session, setData, setNotice, setProfile } = useLearning();
  async function save(table: string, row: object, update: (current: Workspace) => Workspace, conflict?: string) {
    try {
      if (!demo) {
        if (!session) throw new Error('Please sign in to save your work.');
        await persistRow(table, { ...row, user_id: session.user.id }, conflict);
      }
      setData(update);
      setNotice(demo ? 'Saved for this demo visit. Sign in to save across devices.' : 'Saved to your workspace.');
      return true;
    } catch (cause) {
      setNotice(cause instanceof Error ? cause.message : 'Could not save. Please try again.');
      return false;
    }
  }
  return {
    async lesson(lessonId: string, status: LessonProgress['status']) {
      const row: LessonProgress = { lesson_id: lessonId, status, updated_at: new Date().toISOString() };
      return save(
        'lesson_progress',
        row,
        (current) => ({
          ...current,
          lessonProgress: [...current.lessonProgress.filter((p) => p.lesson_id !== lessonId), row],
        }),
        'user_id,lesson_id',
      );
    },
    async attempt(attempt: Attempt) {
      const { kind, ...row } = attempt;
      return save(kind === 'grammar' ? 'quiz_attempts' : 'reading_attempts', row, (current) => ({
        ...current,
        attempts: [attempt, ...current.attempts],
      }));
    },
    async word(wordId: string, known: boolean) {
      const row: WordProgress = {
        vocabulary_id: wordId,
        known,
        updated_at: new Date().toISOString(),
        review_at: new Date(Date.now() + (known ? 7 : 1) * 86400000).toISOString(),
      };
      return save(
        'student_vocabulary',
        row,
        (current) => ({
          ...current,
          wordProgress: [...current.wordProgress.filter((p) => p.vocabulary_id !== wordId), row],
        }),
        'user_id,vocabulary_id',
      );
    },
    async draft(draft: Draft) {
      return save(
        'writing_submissions',
        draft,
        (current) => ({
          ...current,
          drafts: [...current.drafts.filter((d) => d.assignment_id !== draft.assignment_id), draft],
        }),
        'user_id,assignment_id',
      );
    },
    async homework(submission: HomeworkSubmission) {
      return save(
        'homework_submissions',
        submission,
        (current) => ({
          ...current,
          submissions: [...current.submissions.filter((s) => s.homework_id !== submission.homework_id), submission],
        }),
        'user_id,homework_id',
      );
    },
    async settings(id: string, values: Pick<Profile, 'full_name' | 'goal' | 'weekly_target'>) {
      try {
        if (!demo) await updateProfile(id, values);
        setProfile((current) => ({
          ...(current ?? { id: 'demo', email: '', role: 'student' as const, approved: true }),
          ...values,
        }));
        setNotice(demo ? 'Settings previewed for this visit.' : 'Your settings are saved.');
        return true;
      } catch (cause) {
        setNotice(cause instanceof Error ? cause.message : 'Could not save settings.');
        return false;
      }
    },
  };
}
