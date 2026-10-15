import { supabase } from './supabase';
import type { ClassroomResponse, ClassroomRoom } from './classroomTypes';

export async function listClassrooms() {
  const { data, error } = await supabase
    .from('classroom_rooms')
    .select('*')
    .order('created_at', { ascending: false })
    .returns<ClassroomRoom[]>();
  if (error) throw new Error(error.message);
  return data ?? [];
}
export async function createClassroom(userId: string, lessonId: string) {
  const { data, error } = await supabase
    .from('classroom_rooms')
    .insert({ user_id: userId, lesson_id: lessonId })
    .select()
    .single<ClassroomRoom>();
  if (error) throw new Error(error.message);
  return data;
}
export async function loadClassroom(id: string) {
  const [room, responses] = await Promise.all([
    supabase.from('classroom_rooms').select('*').eq('id', id).single<ClassroomRoom>(),
    supabase
      .from('classroom_responses')
      .select('*')
      .eq('room_id', id)
      .order('submitted_at')
      .returns<ClassroomResponse[]>(),
  ]);
  if (room.error || responses.error)
    throw new Error('Could not open this classroom. Check that you are signed in with the assigned account.');
  return { room: room.data, responses: responses.data ?? [] };
}
export async function controlClassroom(
  room: ClassroomRoom,
  changes: Partial<Pick<ClassroomRoom, 'active_slide' | 'activity' | 'question_id' | 'scenario_id' | 'status'>>,
) {
  const { error } = await supabase
    .from('classroom_rooms')
    .update({ ...changes, version: room.version + 1 })
    .eq('id', room.id)
    .eq('version', room.version)
    .select('id')
    .single();
  if (error) throw new Error('The lesson changed. Refresh and try again.');
}
export async function sendClassroomAnswer(room: ClassroomRoom, response: string, id: string) {
  const { error } = await supabase
    .from('classroom_responses')
    .upsert(
      {
        id,
        room_id: room.id,
        activity_version: room.version,
        response: response.trim(),
        submitted_at: new Date().toISOString(),
      },
      { onConflict: 'room_id,user_id,activity_version' },
    );
  if (error) throw new Error('Could not send your answer. The tutor may have moved to the next activity.');
}

export function subscribeClassrooms(userId: string, tutor: boolean, onChange: () => void) {
  const channel = supabase
    .channel(`classrooms:${userId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'classroom_rooms',
        filter: `${tutor ? 'tutor_id' : 'user_id'}=eq.${userId}`,
      },
      onChange,
    )
    .subscribe();
  return () => {
    void supabase.removeChannel(channel);
  };
}
