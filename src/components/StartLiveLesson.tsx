import { useState } from "react";
import { useLocation } from "wouter";
import { Card } from "./Card";
import { Icon } from "./Icon";
import { useLearning } from "../lib/learningContext";
import { useI18n } from "../lib/i18n";
import { createClassroom } from "../lib/classroomApi";
import type { Profile } from "../lib/types";
import { SelectMenu } from "./SelectMenu";
export function StartLiveLesson({ students }: { students: Profile[] }) {
  const { data, setNotice } = useLearning();
  const { t } = useI18n();
  const [, navigate] = useLocation();
  const [student, setStudent] = useState("");
  const [lesson, setLesson] = useState(data.lessons[0]?.id ?? "");
  const [busy, setBusy] = useState(false);
  const selected = students.some((s) => s.id === student) ? student : (students[0]?.id ?? "");
  const selectedLesson = data.lessons.some((item) => item.id === lesson) ? lesson : (data.lessons[0]?.id ?? "");
  async function start(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    try {
      const room = await createClassroom(selected, selectedLesson);
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
          <SelectMenu label={t("Student")} value={selected} onChange={setStudent} placeholder={t("No learners available")}
            options={students.map((student) => ({ value: student.id, label: student.full_name || student.email }))} />
          <SelectMenu label={t("Lesson")} value={selectedLesson} onChange={setLesson} placeholder={t("No lessons available")}
            options={data.lessons.map((item) => ({ value: item.id, label: t(item.title) }))} />
        </div>
        <button disabled={busy || !selected || !selectedLesson}>
          {t(busy ? "Saving…" : "Start a live lesson")}
          <Icon name="play" size={16} />
        </button>
      </form>
      {!students.length && <p className="spaced">{t("Share a class code to welcome your first student.")}</p>}
    </Card>
  );
}
