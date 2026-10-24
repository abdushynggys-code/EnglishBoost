import type { Workspace } from './types';

// Loading and error states need no bundled lesson content.
export function emptyWorkspace(): Workspace {
  return {
    lessons: [], questions: [], vocabulary: [], passages: [], writing: [],
    lessonProgress: [], attempts: [], wordProgress: [], drafts: [],
    homework: [], submissions: [], feedback: [], sessions: [], conciseAttempts: [],
  };
}
