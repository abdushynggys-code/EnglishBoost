import { useI18n } from "../../lib/i18n";
import type { CourseLesson } from "../../lib/course/types";
export function CourseLessonIntro({ lesson, onContinue }: { lesson: CourseLesson; onContinue: () => void }) {
  const { t } = useI18n();
  return (
    <section className="card course-reading">
      <p className="eyebrow">{t("Read at your own pace")}</p>
      <div className="course-passage" lang="en">
        {lesson.text}
      </div>
      {lesson.source_url && (
        <a href={lesson.source_url} target="_blank" rel="noreferrer">
          {t("Explore the grammar reference")} ↗
        </a>
      )}
      <button className="spaced" onClick={onContinue}>
        {t("Continue")}
      </button>
    </section>
  );
}
