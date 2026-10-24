import type { Profile } from "./types";
import type { LearningClass } from "./platform";
export const sandboxProfile = (role: "student" | "tutor"): Profile => ({
  id: "sandbox",
  email: "sandbox@example.invalid",
  full_name: role === "tutor" ? "Test Tutor" : "Test Learner",
  role,
  approved: true,
  goal: "Test the learning experience",
  weekly_target: 3,
  language: "en",
  learning_track: "access2",
  learning_level: "A2",
  sound_effects: false,
});
export const sandboxClasses = (): LearningClass[] => [
  { id: "sandbox-class", user_id: "sandbox", title: "Sample class · temporary", code: "SAMPLEONLY", created_at: new Date().toISOString() },
];
export const sandboxReport = () => ({
  user_id: "sandbox",
  full_name: "Test Learner",
  email: "sandbox@example.invalid",
  course_level: "B2",
  lessons: 8,
  xp: 1600,
  pending: 2,
});
