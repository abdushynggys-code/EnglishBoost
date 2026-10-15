export type ClassroomRoom = {
  id: string;
  tutor_id: string;
  user_id: string;
  lesson_id: string;
  status: 'live' | 'ended';
  active_slide: number;
  activity: 'slide' | 'quiz' | 'summary';
  question_id: string | null;
  scenario_id: string;
  version: number;
  created_at: string;
};
export type ClassroomResponse = {
  id: string;
  room_id: string;
  user_id: string;
  activity_version: number;
  response: string;
  submitted_at: string;
};
