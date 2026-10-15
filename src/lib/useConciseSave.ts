import { useLearning } from './learningContext';
import { useI18n } from './i18n';
import { persistConciseAttempt } from './conciseApi';
import type { ConciseAttempt } from './summaryTypes';

export function useConciseSave() {
  const { demo, session, setData, setNotice } = useLearning();
  const { t } = useI18n();
  return async (attempt: ConciseAttempt) => {
    try {
      if (!demo) {
        if (!session) throw new Error('Please sign in to save your work.');
        await persistConciseAttempt(session.user.id, attempt);
      }
      setData((current) => ({
        ...current,
        conciseAttempts: [attempt, ...current.conciseAttempts.filter((a) => a.id !== attempt.id)],
      }));
      setNotice(t(demo ? 'Saved for this demo visit. Sign in to save across devices.' : 'Your practice is saved.'));
      return true;
    } catch (error) {
      setNotice(t(error instanceof Error ? error.message : 'Could not save. Please try again.'));
      return false;
    }
  };
}
