import { useState } from "react";
import { Link } from "wouter";
import { updateClassWork } from "../lib/classes";
import type { ClassWork } from "../lib/classes";
import { useI18n } from "../lib/i18n";
import { Icon } from "./Icon";

export function ClassHomework({ work, tutor, onChanged }: { work: ClassWork[]; tutor: boolean; onChanged?: () => void }) {
  const { t } = useI18n();
  const [editing, setEditing] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [instructions, setInstructions] = useState("");
  const [due, setDue] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  function startEdit(task: ClassWork) {
    setEditing(task.id);
    setTitle(task.title);
    setInstructions(task.instructions ?? "");
    setDue(task.due_at);
    setError("");
  }

  async function save(event: React.FormEvent) {
    event.preventDefault();
    if (!editing) return;
    setBusy(true);
    setError("");
    try {
      await updateClassWork(editing, title, instructions, due);
      setEditing(null);
      onChanged?.();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not update this assignment.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="card">
      <h2>{t("Homework status")}</h2>
      <p>{t(tutor ? "See who has submitted and who still needs to finish." : "Your class assignments and submission status.")}</p>
      {!work.length ? (
        <p className="spaced">{t("No homework assigned to this class yet.")}</p>
      ) : (
        <div className="class-homework-list spaced">
          {work.map((task) => editing === task.id ? (
            <form className="class-work-editor" key={task.id} onSubmit={(event) => void save(event)}>
              <div className="card-heading"><strong>{t("Edit assignment for {name}", { name: task.name })}</strong><button type="button" className="icon-button" aria-label={t("Cancel")} onClick={() => setEditing(null)}><Icon name="close" /></button></div>
              <label className="field">{t("Title")}<input value={title} maxLength={160} minLength={2} onChange={(event) => setTitle(event.target.value)} required /></label>
              <label className="field">{t("Instructions")}<textarea value={instructions} maxLength={5000} rows={5} onChange={(event) => setInstructions(event.target.value)} /></label>
              <label className="field">{t("Due date")}<input type="date" value={due} onChange={(event) => setDue(event.target.value)} required /></label>
              {error && <p className="message" role="alert">{t(error)}</p>}
              <div className="button-row"><button disabled={busy}>{t(busy ? "Saving…" : "Save changes")}</button><button type="button" className="secondary" onClick={() => setEditing(null)}>{t("Cancel")}</button></div>
            </form>
          ) : (
            <article key={task.id}>
              <div>
                <strong>{task.title}</strong>
                {tutor && <span>{task.name}</span>}
                <small>{t("Due")} · {new Date(task.due_at + "T12:00:00").toLocaleDateString()}</small>
              </div>
              <div className="class-work-actions">
                <span className={`status-badge ${task.status === "submitted" ? "green" : task.status === "overdue" ? "red" : "gray"}`}>
                  {t(task.status === "submitted" ? "Submitted" : task.status === "overdue" ? "Overdue" : "Not submitted")}
                </span>
                {tutor && <button className="secondary compact-button" onClick={() => startEdit(task)}><Icon name="edit" size={15} />{t("Edit")}</button>}
              </div>
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
