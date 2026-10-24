import { Link } from "wouter";
import type { ClassWork } from "../lib/classes";
import { useI18n } from "../lib/i18n";
export function ClassHomework({ work, tutor }: { work: ClassWork[]; tutor: boolean }) {
  const { t } = useI18n();
  return (
    <section className="card">
      <h2>{t("Homework status")}</h2>
      <p>{t(tutor ? "See who has submitted and who still needs to finish." : "Your class assignments and submission status.")}</p>
      {!work.length ? (
        <p className="spaced">{t("No homework assigned to this class yet.")}</p>
      ) : (
        <div className="class-homework-list spaced">
          {work.map((task) => (
            <article key={task.id}>
              <div>
                <strong>{task.title}</strong>
                {tutor && <span>{task.name}</span>}
                <small>
                  {t("Due")} · {new Date(task.due_at + "T12:00:00").toLocaleDateString()}
                </small>
              </div>
              <span className={`status-badge ${task.status === "submitted" ? "green" : task.status === "overdue" ? "red" : "gray"}`}>
                {t(task.status === "submitted" ? "Submitted" : task.status === "overdue" ? "Overdue" : "Not submitted")}
              </span>
            </article>
          ))}
        </div>
      )}
      <Link className="text-link spaced" href={tutor ? "/tutor?view=reviews" : "/homework"}>
        {t(tutor ? "Review submissions" : "Open homework")} →
      </Link>
    </section>
  );
}
