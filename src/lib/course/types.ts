export type CourseLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
export type CourseSkill = "grammar" | "vocabulary" | "reading" | "listening";
export type CourseInterest = "everyday" | "travel" | "stories" | "school";
export type StudySettings = { daily_minutes: 5 | 10 | 15; interest: CourseInterest };

export type CourseQuestion = {
  target_word?: string;
  quick?: boolean;
  type?: "choice" | "blank" | "order";
  id: string;
  skill: CourseSkill;
  level: CourseLevel;
  prompt: string;
  options: string[];
  answer: string;
  explanation: string;
  passage?: string;
  audio?: string;
};
export type PlacementAnswer = {
  question_id: string;
  skill: CourseSkill;
  level: CourseLevel;
  correct: boolean;
  assisted: boolean;
  skipped: boolean;
};
export type PlacementResult = {
  id: string;
  created_at: string;
  level: CourseLevel;
  skill_levels: Record<CourseSkill, CourseLevel | null>;
  answers: PlacementAnswer[];
  writing_sample: string;
  speaking_practised: boolean;
  settings: StudySettings;
  personalization?: {
    summary: string;
    focus_modules: string[];
    source: "tutor_photos";
    updated_at: string;
  };
};
export type LessonCompletion = {
  attempts?: number;
  run_id?: string;
  response?: string;
  lesson_id: string;
  completed_at: string;
  score: number;
  total: number;
  xp: number;
  passed: boolean;
};
export type ReviewCard = {
  item_id: string;
  stage: number;
  due_at: string;
  last_reviewed_at: string;
  lapses: number;
};
export type CourseState = {
  placement: PlacementResult | null;
  completions: LessonCompletion[];
  reviews: ReviewCard[];
};
export type CourseLesson = {
  difficulty?: "quick" | "stretch" | "assessment";
  id: string;
  title: string;
  description: string;
  kind: "story" | "grammar" | "practice" | "listening" | "writing" | "review" | "checkpoint";
  questions: CourseQuestion[];
  text?: string;
  source_url?: string;
  writing_prompt?: string;
  speaking_prompt?: string;
};
export type CourseUnit = {
  id: string;
  title: string;
  description: string;
  level: CourseLevel;
  lessons: CourseLesson[];
};
