import { useState } from "react";
import type { ClassMember } from "../lib/classes";
import { createPersonalizedAssignment } from "../lib/personalizedCourse";
import type { PersonalizedPlan } from "../lib/personalizedCourse";
import { useI18n } from "../lib/i18n";
import { useLearning } from "../lib/learningContext";
import { Card } from "./Card";
import { Icon } from "./Icon";

const tomorrow = () => new Date(Date.now() + 86_400_000).toLocaleDateString("en-CA");

export function PhotoCourseAssignment({ classId, students, selectedIds, onComplete }: {
  classId: string;
  students: ClassMember[];
  selectedIds: string[];
  onComplete: () => void;
}) {
  const { t } = useI18n();
  const { session, refresh, setNotice } = useLearning();
  const [files, setFiles] = useState<File[]>([]);
  const [due, setDue] = useState(tomorrow);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState("");
  const [results, setResults] = useState<Array<{ title: string; plan: PersonalizedPlan; vocabularyCount: number }>>([]);

  function addFiles(list: FileList | null) {
    const incoming = Array.from(list ?? []);
    setFiles((current) => {
      const unique = new Map([...current, ...incoming].map((file) => [`${file.name}-${file.size}-${file.lastModified}`, file]));
      return [...unique.values()].slice(0, 6);
    });
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const targets = students.filter((person) => selectedIds.includes(person.user_id));
    if (!session || !targets.length || !files.length) return;
    setBusy(true);
    setError("");
    setResults([]);
    try {
      const created: Array<Awaited<ReturnType<typeof createPersonalizedAssignment>>> = [];
      for (const [index, student] of targets.entries()) {
        setProgress(t("Personalizing for {name} ({current}/{total})", { name: student.name, current: index + 1, total: targets.length }));
        created.push(await createPersonalizedAssignment({ tutorId: session.user.id, classId, student, files, due }));
      }
      setResults(created);
      setFiles([]);
      await refresh();
      onComplete();
      setNotice(t("Assignments and vocabulary added for {count} learners.", { count: targets.length }));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not create the personalized assignment.");
    } finally {
      setProgress("");
      setBusy(false);
    }
  }

  return (
    <Card title={t("Add an assignment from camera or photos")} className="photo-assignment-card">
      <p>{t("AI extracts the source text, creates work and vocabulary, then recalculates the selected learners’ levels, modules, and course paths.")}</p>
      <form className="form spaced" onSubmit={(event) => void submit(event)}>
        <div className="assignment-audience"><Icon name="user" size={17} /><span>{selectedIds.length ? t("Assigning to {count} selected learners", { count: selectedIds.length }) : t("Select learners from the class panel first")}</span></div>
        <div className="photo-source-row">
          <label className="photo-source-button"><Icon name="camera" /><span><strong>{t("Take photos")}</strong><small>{t("Use the camera")}</small></span>
            <input type="file" accept="image/jpeg,image/png,image/webp" capture="environment" multiple onChange={(event) => addFiles(event.target.files)} />
          </label>
          <label className="photo-source-button"><Icon name="images" /><span><strong>{t("Choose photos")}</strong><small>{t("Up to 6 images")}</small></span>
            <input type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={(event) => addFiles(event.target.files)} />
          </label>
        </div>
        {!!files.length && <div className="photo-file-list">{files.map((file, index) => <span key={`${file.name}-${file.lastModified}`}>{file.name}<button type="button" aria-label={t("Remove photo")} onClick={() => setFiles(files.filter((_, item) => item !== index))}><Icon name="close" size={13} /></button></span>)}</div>}
        <label className="field">{t("Due date")}<input type="date" min={new Date().toLocaleDateString("en-CA")} value={due} onChange={(event) => setDue(event.target.value)} required /></label>
        <div className="gentle-note"><Icon name="shield" size={21} /><p>{t("Photos are analyzed securely and are not kept after the lesson is generated. Existing earned XP and completed work are preserved.")}</p></div>
        {error && <p className="message" role="alert">{t(error)}</p>}
        <button disabled={busy || !selectedIds.length || !files.length}><Icon name={busy ? "loading" : "sparkles"} className={busy ? "spin" : ""} size={17} />{progress || t("Create personalized assignment")}</button>
      </form>
      {!!results.length && <div className="personalization-result" role="status"><Icon name="success" /><div><strong>{t("Personalized work ready for {count} learners", { count: results.length })}</strong><p>{t("Vocabulary created")}: {results.reduce((sum, result) => sum + result.vocabularyCount, 0)}</p><small>{results.map((result) => `${result.plan.level} · ${result.title}`).join("; ")}</small></div></div>}
    </Card>
  );
}
