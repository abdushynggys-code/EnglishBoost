import { encodeCourseImage } from "./courseImages";
import { supabase } from "./supabase";
import type { ClassMember } from "./classes";
import type { Lesson, Question } from "./types";
import type { CourseInterest, CourseLevel, CourseSkill } from "./course/types";

export type PersonalizedPlan = {
  level: CourseLevel;
  interest: CourseInterest;
  skill_levels: Record<CourseSkill, CourseLevel | null>;
  summary: string;
  focus_modules: string[];
};

type GeneratedLesson = Omit<Lesson, "id" | "week"> & {
  difficulty: Question["difficulty"];
  questions: Omit<Question, "id" | "lesson_id">[];
};
type PersonalizationResponse = {
  personalization?: {
    plan: PersonalizedPlan;
    lesson: GeneratedLesson;
    extracted_text: string;
    vocabulary: Array<{
      word: string;
      translation_de: string;
      translation_ru: string;
      translation_kk: string;
      definition: string;
      example: string;
      source: "extracted" | "support";
    }>;
  };
  rejected?: boolean;
  reason?: string;
  error?: string;
};

export async function createPersonalizedAssignment(input: {
  tutorId: string;
  classId: string;
  student: ClassMember;
  files: File[];
  due: string;
}) {
  const images = await Promise.all(input.files.map((file) => encodeCourseImage(file, "material")));
  const { data, error } = await supabase.functions.invoke<PersonalizationResponse>("ai", {
    body: {
      mode: "personalize_student_course",
      student: {
        name: input.student.name,
        currentLevel: input.student.course_level || null,
        currentSkills: input.student.skill_levels ?? null,
        currentInterest: input.student.course_interest ?? null,
        personalizationSummary: input.student.personalization_summary ?? null,
        xp: input.student.xp,
        completedAssignments: input.student.completed,
        pendingAssignments: input.student.pending,
      },
      images,
    },
  });
  if (error) throw new Error(error.message);
  if (data?.rejected) throw new Error(data.reason || "AI could not verify this material.");
  if (data?.error || !data?.personalization) throw new Error(data?.error || "AI returned no learning plan.");

  const generated = data.personalization;
  const lessonId = `personal-${crypto.randomUUID()}`;
  const lesson: Lesson & { user_id: string } = {
    id: lessonId,
    user_id: input.tutorId,
    week: 1,
    title: generated.lesson.title,
    description: generated.lesson.description,
    objectives: generated.lesson.objectives,
    activities: generated.lesson.activities,
    homework: generated.lesson.homework,
    duration: Math.min(180, Math.max(5, Math.round(generated.lesson.duration))),
    skill: generated.lesson.skill,
    practice_path: `/practice?lesson=${lessonId}`,
    book_unit: generated.lesson.book_unit,
    book_page: generated.lesson.book_page,
  };
  const savedLesson = await supabase.from("lessons").insert(lesson);
  if (savedLesson.error) throw new Error(savedLesson.error.message);
  try {
    const questions = generated.lesson.questions.map((question, index) => ({
      ...question,
      id: `${lessonId}-q-${index + 1}`,
      lesson_id: lessonId,
      user_id: input.tutorId,
    }));
    const savedQuestions = await supabase.from("quiz_questions").insert(questions);
    if (savedQuestions.error) throw new Error(savedQuestions.error.message);
    const assignmentInstructions = `${generated.lesson.description}\n\nSource text extracted from your assignment photos:\n${generated.extracted_text}`;
    const personalized = await supabase.rpc("personalize_student_course_v2", {
      class_uuid: input.classId,
      student_uuid: input.student.user_id,
      course_plan: generated.plan,
      vocabulary_items: generated.vocabulary,
      work_title: generated.lesson.title,
      work_instructions: assignmentInstructions,
      due_date: input.due,
      practice: `/lessons/${lessonId}`,
    });
    if (personalized.error) throw new Error(personalized.error.message);
    return { lessonId, plan: generated.plan, title: generated.lesson.title, vocabularyCount: generated.vocabulary.length };
  } catch (cause) {
    await supabase.from("lessons").delete().eq("id", lessonId);
    throw cause;
  }
}
