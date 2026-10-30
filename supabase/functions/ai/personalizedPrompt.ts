import type { GeneratedQuestion } from "./coursePrompt.ts";

export type StudentContext = {
  name: string;
  currentLevel: string | null;
  currentSkills: Record<string, string | null> | null;
  currentInterest: string | null;
  personalizationSummary: string | null;
  xp: number;
  completedAssignments: number;
  pendingAssignments: number;
};

export type GeneratedPersonalization = {
  accepted: boolean;
  reason: string;
  extracted_text: string;
  plan?: {
    level: "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
    interest: "everyday" | "travel" | "stories" | "school";
    skill_levels: Record<"grammar" | "vocabulary" | "reading" | "listening", "A1" | "A2" | "B1" | "B2" | "C1" | "C2" | null>;
    summary: string;
    focus_modules: string[];
  };
  vocabulary?: Array<{
    word: string;
    translation_de: string;
    translation_ru: string;
    translation_kk: string;
    definition: string;
    example: string;
    source: "extracted" | "support";
  }>;
  lesson?: {
    title: string;
    description: string;
    objectives: string[];
    activities: string;
    homework: string;
    duration: number;
    skill: "Grammar" | "Vocabulary" | "Reading" | "Writing" | "Speaking";
    book_unit: string;
    book_page: string;
    difficulty: "Beginner" | "Intermediate";
    questions: GeneratedQuestion[];
  };
};

export function buildPersonalizationPrompt(student: StudentContext) {
  return `You create one English assignment and recalculate a learner's course from tutor-supplied photos.

SOURCE SAFETY:
1. Use only readable content visible in MATERIAL images. Do not browse, recall a book, or invent missing text, page numbers, answers, or facts.
2. Reject with accepted=false if images are unreadable, mostly cropped, unrelated to English learning, or contain too little useful material.
3. Transcribe or summarize only visible material in extracted_text, maximum 3000 characters.

LEARNER CONTEXT:
${JSON.stringify(student)}
- Treat the current level as stronger evidence than the difficulty of a photographed worksheet. A hard page does not prove the learner has a high level.
- Use currentSkills and personalizationSummary as prior evidence. The photos identify what to teach next; they are not, by themselves, proof of ability.
- Preserve a useful currentInterest unless the visible material gives a strong reason to choose a better course context.
- Move at most one CEFR step from a known current level. Keep listening at the current level when photos provide no listening evidence.
- xp, completedAssignments, and pendingAssignments affect pacing and workload, not language ability.

PERSONALIZATION:
- Choose a CEFR start level, four skill levels, and the closest course interest.
- focus_modules must contain 2-4 short, specific topics visibly supported by the photos.
- summary must explain the adjustment in friendly language without claiming certainty.
- Create exactly 10 original questions grounded in the visible material. Questions should help this exact learner enter the recalculated path.
- Return 6-12 useful vocabulary items. Prefer important words visibly extracted from the photos, then add only a few support words needed to understand the assignment. Mark each as extracted or support.
- Give a short learner-friendly English definition, one original English example, and accurate German, Russian, and Kazakh translations for every word.
- For choice/boolean questions, options must include the exact answer. For blank/correction, options must be [].

Return JSON only:
{
  "accepted": true, "reason": "confidence note", "extracted_text": "visible material",
  "plan": {
    "level": "A1|A2|B1|B2|C1|C2", "interest": "everyday|travel|stories|school",
    "skill_levels": {"grammar":"A1", "vocabulary":"A1", "reading":"A1", "listening":"A1"},
    "summary": "...", "focus_modules": ["...", "..."]
  },
  "vocabulary": [{"word":"...","translation_de":"...","translation_ru":"...","translation_kk":"...","definition":"...","example":"...","source":"extracted|support"}],
  "lesson": {
    "title":"...", "description":"...", "objectives":["..."], "activities":"...", "homework":"...",
    "duration":30, "skill":"Grammar|Vocabulary|Reading|Writing|Speaking", "book_unit":"Photo assignment",
    "book_page":"visible page or Not visible", "difficulty":"Beginner|Intermediate",
    "questions":[{"topic":"...","difficulty":"Beginner|Intermediate","type":"choice|blank|correction|boolean","prompt":"...","options":["..."],"answer":"...","explanation":"..."}]
  }
}
For rejection return accepted=false, a useful reason, extracted_text="", and omit plan and lesson.`;
}
