import { supabase } from './supabase';

export type BadgeTier = 'bronze' | 'silver' | 'gold';
export type BadgeCandidate = {
  user_id: string;
  name: string;
  correct_answers: number;
  answered_questions: number;
  accuracy: number;
  recommended_tier: BadgeTier | '';
  awarded_tier: BadgeTier | '';
};
export type ClassBadge = {
  id: string;
  class_id: string;
  student_id: string;
  month: string;
  tier: BadgeTier;
  correct_answers: number;
  answered_questions: number;
  accuracy: number;
  created_at: string;
};

export async function loadBadgeCandidates(classId: string, month: string) {
  const { data, error } = await supabase.rpc('monthly_badge_candidates', {
    class_uuid: classId,
    badge_month: `${month}-01`,
  });
  if (error) throw new Error(error.message);
  return (data ?? []) as BadgeCandidate[];
}

export async function awardMonthlyBadge(classId: string, studentId: string, month: string) {
  const { data, error } = await supabase.rpc('award_monthly_class_badge', {
    class_uuid: classId,
    student_uuid: studentId,
    badge_month: `${month}-01`,
  });
  if (error) throw new Error(error.message);
  return data as BadgeTier;
}

export async function loadClassBadges(classId: string) {
  const { data, error } = await supabase
    .from('class_monthly_badges')
    .select('id,class_id,student_id,month,tier,correct_answers,answered_questions,accuracy,created_at')
    .eq('class_id', classId)
    .order('month', { ascending: false })
    .returns<ClassBadge[]>();
  if (error) throw new Error(error.message);
  return data ?? [];
}
