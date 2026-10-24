import { courseLevels, levelNumber } from "../../lib/course/levels";
import { useCourse } from "../../lib/course/context";
import { nextCourseStep } from "../../lib/course/nextStep";
import { useI18n } from "../../lib/i18n";
export function CourseLevelMap() {
  const { state } = useCourse();
  const { t } = useI18n();
  if (!state.placement) return null;
  const start = courseLevels.indexOf(state.placement.level);
  const active = nextCourseStep(state)?.level ?? "C2";
  const current = courseLevels.indexOf(active);
  return (
    <nav className="course-level-map" aria-label={t("Course levels")}>
      {courseLevels.map((level, index) => {
        const label =
          index < start
            ? "Placed beyond"
            : index < current ||
                state.completions.some((c) => c.lesson_id === `${level}-${state.placement!.settings.interest}-unit4-day7` && c.passed)
              ? "Completed"
              : index === current
                ? "Learning now"
                : "Coming next";
        const content = (
          <>
            <strong>
              {t("Level")} {levelNumber(level)}
            </strong>
            <span className="cefr-caption">{level}</span>
            <small>{t(label)}</small>
          </>
        );
        return index < start ? (
          <span key={level} className="placed-beyond">
            {content}
          </span>
        ) : (
          <a key={level} href={`#course-level-${level}`} className={index === current ? "current" : ""}>
            {content}
          </a>
        );
      })}
    </nav>
  );
}
