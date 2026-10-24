import { supabase } from '../supabase';
import type { CourseState, LessonCompletion, PlacementResult, ReviewCard } from './types';

export const emptyCourse = (): CourseState => ({ placement: null, completions: [], reviews: [] });

export async function loadCourse(userId: string): Promise<CourseState> {
  const [profile, completions, reviews] = await Promise.all([
    supabase.from('course_profiles').select('placement').eq('user_id', userId).maybeSingle<{ placement: PlacementResult }>(),
    supabase.from('course_completions').select('lesson_id,completed_at,score,total,xp,passed,response,attempts').eq('user_id', userId).returns<LessonCompletion[]>(),
    supabase.from('course_reviews').select('item_id,stage,due_at,last_reviewed_at,lapses').eq('user_id', userId).returns<ReviewCard[]>(),
  ]);
  if (profile.error || completions.error || reviews.error) throw new Error('Could not load your course. Please try again.');
  return { placement: profile.data?.placement ?? null, completions: completions.data ?? [], reviews: reviews.data ?? [] };
}

export async function savePlacement(result: PlacementResult) {
  const { error } = await supabase.rpc('save_course_placement', { result });
  if (error) throw new Error('Could not save your course. Please try again.');
}

export async function saveLesson(completion: LessonCompletion, reviews: ReviewCard[]) {
  const { error } = await supabase.rpc('save_course_lesson', { completion: {...completion, timezone:Intl.DateTimeFormat().resolvedOptions().timeZone}, review_cards: reviews });
  if (error) throw new Error('Could not save your course. Please try again.');
}
