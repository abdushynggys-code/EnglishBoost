import { isSandboxMode } from './sandbox';
import { sandboxProfile } from './sandboxFixtures';
import { supabase } from './supabase';
import type { Profile } from './types';

export async function loadStudents() {
  if(isSandboxMode())return [sandboxProfile('student')];
  const { data, error } = await supabase
    .from('tutor_students')
    .select('student:profiles!tutor_students_user_id_fkey(*)')
    .returns<{ student: Profile }[]>();
  if (error) throw new Error(error.message);
  return (data ?? []).map((link) => link.student);
}

export async function loadInvitations() {
  if(isSandboxMode())return [];
  const { data, error } = await supabase
    .from('student_invitations')
    .select('email, created_at')
    .order('created_at', { ascending: false })
    .returns<{ email: string; created_at: string }[]>();
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function approveStudent(email: string) {
  const { error } = await supabase.rpc('approve_student', { student_email: email });
  if (error) throw new Error(error.message);
}

export async function saveContent(table: string, id: string | undefined, values: object, userId: string) {
  const result = id
    ? await supabase.from(table).update(values).eq('id', id).select('id').single()
    : await supabase.from(table).insert({ ...values, id: crypto.randomUUID(), user_id: userId });
  if (result.error) throw new Error(result.error.message);
}

export async function removeContent(table: string, id: string) {
  const { error } = await supabase.from(table).delete().eq('id', id);
  if (error) throw new Error(error.message);
}

export async function assignWork(table: 'homework_assignments' | 'tutoring_sessions', values: object) {
  const { error } = await supabase.from(table).insert(values);
  if (error) throw new Error(error.message);
}

export async function reviewSubmission(values: {
  user_id: string;
  submission_id: string;
  kind: string;
  comment: string;
  score: number;
}) {
  const { error } = await supabase
    .from('tutor_feedback')
    .upsert({ ...values, created_at: new Date().toISOString() }, { onConflict: 'submission_id,kind' });
  if (error) throw new Error(error.message);
}
