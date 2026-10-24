import { createContext, useContext } from 'react';
import type { CourseState, LessonCompletion, PlacementResult, ReviewCard } from './types';

export type CourseContextValue = {
  state: CourseState;
  loading: boolean;
  error: string;
  refresh: () => Promise<void>;
  setSandboxState: (state:CourseState) => void;
  savePlacement: (result: PlacementResult) => Promise<boolean>;
  saveLesson: (completion: LessonCompletion, reviews: ReviewCard[]) => Promise<boolean>;
};
export const CourseContext = createContext<CourseContextValue | null>(null);
export function useCourse() {
  const context = useContext(CourseContext);
  if (!context) throw new Error('CourseProvider is missing');
  return context;
}
