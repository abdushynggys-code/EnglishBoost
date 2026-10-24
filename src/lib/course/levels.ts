import type { CourseLevel } from "./types";
export const courseLevels: CourseLevel[] = ["A1", "A2", "B1", "B2", "C1", "C2"];
export const levelNumber = (level: CourseLevel) => courseLevels.indexOf(level) + 1;
export const questionCount = (level: CourseLevel) => (levelNumber(level) <= 2 ? 30 : levelNumber(level) <= 4 ? 20 : 15);
export const levelThemes = [
  "Everyday beginnings",
  "Life in motion",
  "Connected conversations",
  "Ideas that matter",
  "Nuance and influence",
  "Precision and perspective",
];
export const moduleTopics = [
  ["Meeting people", "Home and neighbourhood", "Food and shopping", "Getting around"],
  ["Making plans", "Health and routines", "Trips and problems", "Stories from life"],
  ["Work and study", "Solving everyday problems", "Opinions and evidence", "People and communities"],
  ["Presenting an argument", "News and media", "Choices and consequences", "Culture and identity"],
  ["Professional diplomacy", "Research and claims", "Style and register", "Negotiation and nuance"],
  ["Subtext and implication", "Evaluating uncertainty", "Rhetoric and precision", "Synthesis and mediation"],
];
