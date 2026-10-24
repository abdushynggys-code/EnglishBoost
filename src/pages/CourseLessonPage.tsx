import { buildQuestionBank, shuffled } from "../data/course/questionBank";
import { quickPractice } from "../data/course/quickPractice";
import { useRef, useState } from "react";
import { Link } from "wouter";
import { useCourse } from "../lib/course/context";
import { useI18n } from "../lib/i18n";
import { buildLearningPath } from "../data/course/units";
import { isLessonUnlocked, localDay, shouldStretch } from "../lib/course/progress";
import type { CourseLesson } from "../lib/course/types";
import { dueQuestions } from "../lib/course/reviews";
import { CourseLessonRunner } from "../components/course/CourseLessonRunner";
import { PageLoading } from "../components/PageLoading";
import { PageHeading } from "../components/PageHeading";

export function CourseLessonPage({ params }: { params: { id: string } }) {
  const { t } = useI18n();
  const { state, loading, error, refresh } = useCourse();
  const [run, setRun] = useState(0);
  const reviewSnapshot = useRef<CourseLesson | null>(null);
  if (loading) return <PageLoading />;
  if (error)
    return (
      <section className="card error-state">
        <p>{t(error)}</p>
        <button onClick={() => void refresh()}>{t("Try again")}</button>
      </section>
    );
  if (!state.placement)
    return (
      <section className="card empty-state">
        <h1>{t("Find your starting point")}</h1>
        <Link className="button" href="/placement">
          {t("Start level check")}
        </Link>
      </section>
    );
  const units = buildLearningPath(state.placement.level, state.placement.settings.interest, state.placement.id);
  const review: CourseLesson = {
    id: `review:${localDay()}`,
    title: "Remember and review",
    description: "Revisit the words and patterns that are ready today.",
    kind: "review",
    difficulty: "quick",
    questions: dueQuestions(units, state.reviews).map(quickPractice),
  };
  if (params.id === "review" && !reviewSnapshot.current && review.questions.length) reviewSnapshot.current = review;
  const finished = state.completions.some((item) => item.lesson_id === `C2-${state.placement!.settings.interest}-unit4-day7` && item.passed);
  const challenge: CourseLesson = {
    id: `challenge:${localDay()}`,
    kind: "checkpoint",
    difficulty: "assessment",
    title: "Beyond the path",
    description: "A fresh advanced challenge. One reward per day.",
    questions: shuffled(buildQuestionBank("C2"), `${state.placement.id}-${localDay()}-${run}`)
      .slice(0, 15)
      .map((q) => (q.skill === "grammar" ? { ...q, type: "blank", options: [] } : q)),
  };
  const lesson =
    params.id === "challenge"
      ? challenge
      : params.id === "review"
        ? (reviewSnapshot.current ?? review)
        : units.flatMap((unit) => unit.lessons).find((item) => item.id === params.id);
  const available =
    lesson &&
    (params.id === "challenge"
      ? finished
      : params.id === "review"
        ? lesson.questions.length > 0
        : isLessonUnlocked(units, state.completions, lesson.id));
  if (!lesson || !available)
    return (
      <section className="card empty-state">
        <h1>{t(params.id === "review" ? "No reviews due yet." : "Complete the previous lesson")}</h1>
        <Link className="button" href="/course">
          {t("Back to my path")}
        </Link>
      </section>
    );
  const stretch = shouldStretch(state.completions) && (lesson.kind === "grammar" || lesson.kind === "practice");
  const activeLesson = stretch
    ? {
        ...lesson,
        questions: lesson.questions.map((question, index) =>
          index === 0 && question.skill === "grammar" ? { ...question, type: "blank" as const, options: [] } : question,
        ),
      }
    : lesson;
  return (
    <div className="course-lesson-page">
      <Link className="back-link" href="/course">
        ← {t("Your learning path")}
      </Link>
      <PageHeading
        eyebrow={t(lesson.difficulty === "assessment" ? "MODULE ASSESSMENT" : lesson.difficulty === "stretch" ? "STRETCH LESSON" : "QUICK PRACTICE")}
        title={t(lesson.title)}
        description={t(lesson.description)}
      />
      {stretch && <p className="course-feedback spaced">{t("Extra challenge: try this pattern without answer choices.")}</p>}
      <CourseLessonRunner key={`${lesson.id}-${run}`} lesson={activeLesson} onRetry={() => setRun(run + 1)} />
    </div>
  );
}
