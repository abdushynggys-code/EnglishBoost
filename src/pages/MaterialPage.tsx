import { useState } from "react";
import { Link } from "wouter";
import { courseLevels, levelNumber } from "../lib/course/levels";
import { buildCourseUnits } from "../data/course/units";
import { shuffled } from "../data/course/questionBank";
import { CourseQuestionCard } from "../components/course/CourseQuestionCard";
import { useI18n } from "../lib/i18n";
import { usePlatform } from "../lib/platform";
export function MaterialPage({ params }: { params: { level: string; module: string } }) {
  const { t } = useI18n();
  const { state } = usePlatform();
  const [seed] = useState(() => crypto.randomUUID());
  const [answers, setAnswers] = useState<boolean[]>([]);
  const level = courseLevels.find((l) => l === params.level);
  const unit = level ? buildCourseUnits(level, "everyday")[Number(params.module) - 1] : null;
  if (!unit)
    return (
      <section className="card">
        <h1>{t("Material not found")}</h1>
        <Link href="/course">{t("Back to my path")}</Link>
      </section>
    );
  const pool = shuffled(unit.lessons[0].questions, seed);
  const question = pool[answers.length];
  return (
    <div className="stack">
      <section className="card">
        <span className="eyebrow">
          {t("Level")} {levelNumber(unit.level)} · {t("Module")} {params.module}
        </span>
        <h1>{t(unit.title)}</h1>
        <p className="cefr-caption">
          {unit.level} · {t("Extra practice · your personal path stays unchanged")}
        </p>
        <p className="course-passage" lang="en">
          {unit.lessons[0].text}
        </p>
        <p lang="en">{unit.lessons[4].writing_prompt}</p>
      </section>
      <section className="card">
        <h2>
          {t("Practice")} · {Math.min(answers.length + 1, pool.length)}/{pool.length}
        </h2>
        {question ? (
          <CourseQuestionCard key={question.id} question={question} onAnswer={(answer) => setAnswers([...answers, answer === question.answer])} />
        ) : (
          <>
            <h2>{t("Practice complete")}</h2>
            <p>
              {answers.filter(Boolean).length}/{answers.length}
            </p>
            <Link href={state.classes.length ? "/homework" : "/materials"} className="text-link">
              {t(state.classes.length ? "Open your assignment to submit your response" : "Explore more modules")}
            </Link>
          </>
        )}
      </section>
    </div>
  );
}
