import { useState } from "react";
import { useLocation } from "wouter";
import { Card } from "./Card";
import { Icon } from "./Icon";
import { useLearning } from "../lib/learningContext";
import { useI18n } from "../lib/i18n";
import { createClassroom } from "../lib/classroomApi";
import type { Profile } from "../lib/types";
export function StartLiveLesson({ students }: { students: Profile[] }) {
  const { data, setNotice } = useLearning();
  const { t } = useI18n();
  const [, navigate] = useLocation();
  const [student, setStudent] = useState("");
  const [lesson, setLesson] = useState(data.lessons[0]?.id ?? "");
  const [busy, setBusy] = useState(false);
  const selected = students.some((s) => s.id === student) ? student : (students[0]?.id ?? "");
  async function start(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    try {
      const room = await createClassroom(selected, lesson);
      navigate(`/classroom/${room.id}`);
    } catch (cause) {
      setNotice(t(cause instanceof Error ? cause.message : "Could not create classroom."));
    } finally {
      setBusy(false);
    }
  }
  return (
    <Card title={t("Start a live lesson")}>
      <form className="form" onSubmit={(event) => void start(event)}>
        <div className="form-grid">
          <label className="field">
            {t("Student")}
            <select value={selected} onChange={(e) => setStudent(e.target.value)}>
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.full_name || s.email}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            {t("Lesson")}
            <select value={lesson} onChange={(e) => setLesson(e.target.value)}>
              {data.lessons.map((l) => (
                <option key={l.id} value={l.id}>
                  {t(l.title)}
                </option>
              ))}
            </select>
          </label>
        </div>
        <button disabled={busy || !selected || !lesson}>
          {t(busy ? "Saving…" : "Start a live lesson")}
          <Icon name="play" size={16} />
        </button>
      </form>
      {!students.length && <p className="spaced">{t("Share a class code to welcome your first student.")}</p>}
    </Card>
  );
}
