import { useLearning } from "../lib/learningContext";
import { sandboxReport } from "../lib/sandboxFixtures";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useI18n } from "../lib/i18n";
import { courseLevels, levelNumber } from "../lib/course/levels";
type Report = { user_id: string; full_name: string; email: string; course_level: string | null; lessons: number; xp: number; pending: number };
export function TutorCourseReports() {
  const { t } = useI18n();
  const { preview } = useLearning();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  async function refresh() {
    if (preview) {
      setReports([sandboxReport()]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data, error } = await supabase.rpc("tutor_course_reports");
    if (error) setError("Could not load student progress.");
    else {
      setReports((data ?? []) as Report[]);
      setError("");
    }
    setLoading(false);
  }
  useEffect(() => {
    void refresh();
  }, []);
  return (
    <section className="card spaced">
      <h2>{t("Your students, moving forward")}</h2>
      <p>{t("Personal course progress and outstanding work, shared only with their tutor.")}</p>
      {loading ? (
        <p>{t("Loading…")}</p>
      ) : error ? (
        <button onClick={() => void refresh()}>{t("Try again")}</button>
      ) : !reports.length ? (
        <p className="spaced">{t("Share a class code to welcome your first student.")}</p>
      ) : (
        <div className="student-course-reports">
          {reports.map((report) => {
            const level = courseLevels.find((l) => l === report.course_level);
            return (
              <article key={report.user_id}>
                <div>
                  <strong>{report.full_name || report.email}</strong>
                  <small>{level ? `${t("Level")} ${levelNumber(level)} · ${level}` : t("Level check not completed")}</small>
                </div>
                <div>
                  <strong>{report.lessons}</strong>
                  <small>{t("Lessons completed")}</small>
                </div>
                <div>
                  <strong>{Number(report.xp).toLocaleString()} XP</strong>
                  <small>
                    {report.pending} {t("assignments pending")}
                  </small>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
