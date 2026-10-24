import { usePlatform } from "../../lib/platform";
import { useCourse } from "../../lib/course/context";
import { courseStats, localDay } from "../../lib/course/progress";
import { nextCourseStep } from "../../lib/course/nextStep";
import { levelNumber } from "../../lib/course/levels";
import { useI18n } from "../../lib/i18n";
import { StatCard } from "../StatCard";
export function CourseProgressPanel() {
  const { state } = useCourse();
  const { state: platform } = usePlatform();
  const { t, preferences } = useI18n();
  const stats = courseStats(state.completions);
  const next = nextCourseStep(state);
  const scored = state.completions.filter((c) => c.total > 0);
  const total = scored.reduce((sum, c) => sum + c.total, 0);
  const score = scored.reduce((sum, c) => sum + c.score, 0);
  const recent = [...state.completions].sort((a, b) => b.completed_at.localeCompare(a.completed_at)).slice(0, 7);
  const dates = new Set(state.completions.filter((c) => c.passed).map((c) => localDay(new Date(c.completed_at))));
  return (
    <div className="stack">
      <div className="stats-grid">
        <StatCard label={t("Lessons completed")} value={stats.completed} icon="check" />
        <StatCard label={t("Course accuracy")} value={total ? `${Math.round((score / total) * 100)}%` : "—"} icon="chart" />
        <StatCard
          label={t("Current course level")}
          value={state.placement ? `${t("Level")} ${levelNumber(next?.level ?? "C2")}` : "—"}
          icon="target"
        />
        <StatCard label={t("day streak")} value={platform.streak} icon="sparkles" />
      </div>
      <section className="card">
        <h2>{t("Your week in small wins")}</h2>
        <div className="weekly-activity">
          {Array.from({ length: 7 }, (_, i) => {
            const day = new Date();
            day.setDate(day.getDate() - 6 + i);
            return (
              <div key={i} className={`weekly-day ${dates.has(localDay(day)) ? "active" : ""}`}>
                <span>{day.toLocaleDateString(preferences.language, { weekday: "short" })}</span>
                <strong>{dates.has(localDay(day)) ? "✦" : "·"}</strong>
              </div>
            );
          })}
        </div>
      </section>
      <section className="card">
        <h2>{t("Recent course sessions")}</h2>
        {recent.length ? (
          <div className="student-course-reports">
            {recent.map((c) => (
              <article key={c.lesson_id}>
                <div>
                  <strong>
                    {t(
                      c.lesson_id.startsWith("challenge:") ? "Beyond the path" : c.lesson_id.startsWith("review:") ? "Remember and review" : "Lesson",
                    )}
                  </strong>
                  <small>{new Date(c.completed_at).toLocaleDateString(preferences.language)}</small>
                </div>
                <strong>{c.total ? `${c.score}/${c.total}` : t("Writing practice")}</strong>
                <span>{t(c.passed ? "Completed" : "Keep practising")}</span>
              </article>
            ))}
          </div>
        ) : (
          <p className="spaced">{t("Your next lesson is waiting on your learning path.")}</p>
        )}
      </section>
    </div>
  );
}
