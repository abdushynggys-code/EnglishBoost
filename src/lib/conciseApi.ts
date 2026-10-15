import { supabase } from './supabase';
import type { ConciseAttempt } from './summaryTypes';

export async function persistConciseAttempt(userId: string, attempt: ConciseAttempt) {
  const { tutor_comment: _comment, tutor_score: _score, ...work } = attempt;
  const { error } = await supabase
    .from('concise_attempts')
    .upsert({ ...work, user_id: userId }, { onConflict: 'id', ignoreDuplicates: true });
  if (error) throw new Error(error.message);
}

export async function reviewConciseAttempt(id: string, comment: string, score: number) {
  const { error } = await supabase
    .from('concise_attempts')
    .update({ tutor_comment: comment, tutor_score: score })
    .eq('id', id);
  if (error) throw new Error(error.message);
}
