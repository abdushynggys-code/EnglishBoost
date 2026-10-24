import { useEffect, useState } from "react";
import { usePlatform, assignClassWork } from "../lib/platform";
import { useLearning } from "../lib/learningContext";
import { useI18n } from "../lib/i18n";
import { courseLevels, moduleTopics, levelNumber } from "../lib/course/levels";
export function TutorClassAssignment() {
  const { state } = usePlatform();
  const { setNotice } = useLearning();
  const { t } = useI18n();
  const [classId, setClassId] = useState("");
  useEffect(() => {
    if (classId && !state.classes.some((room) => room.id === classId)) setClassId("");
  }, [state.classes, classId]);
  const [level, setLevel] = useState(0);
  const [module, setModule] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const form = e.currentTarget;
    const fields = new FormData(form);
    try {
      const count = await assignClassWork(
        classId,
        String(fields.get("title")),
        String(fields.get("instructions")),
        String(fields.get("due")),
        `/materials/${courseLevels[level]}/${module + 1}`,
      );
      if (!count) {
        setError("No students have joined this class yet. Share the code first.");
        return;
      }
      setNotice(t("Assigned to {count} students.", { count }));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not create assignment.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <section className="card spaced">
      <h2>{t("Assign a module to your class")}</h2>
      <p>{t("Use a ready-made lesson, then add your own instructions and due date.")}</p>
      <form className="form spaced" onSubmit={(e) => void submit(e)}>
        <label className="field">
          {t("Class")}
          <select required value={classId} onChange={(e) => setClassId(e.target.value)}>
            <option value="">{t("Choose a class")}</option>
            {state.classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </select>
        </label>
        <div className="form-grid">
          <label className="field">
            {t("Level")}
            <select
              value={level}
              onChange={(e) => {
                setLevel(Number(e.target.value));
                setModule(0);
              }}
            >
              {courseLevels.map((l, i) => (
                <option key={l} value={i}>
                  {t("Level")} {levelNumber(l)} · {l}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            {t("Module")}
            <select value={module} onChange={(e) => setModule(Number(e.target.value))}>
              {moduleTopics[level].map((name, i) => (
                <option key={name} value={i}>
                  {t(name)}
                </option>
              ))}
            </select>
          </label>
        </div>
        <label className="field">
          {t("Title")}
          <input key={`${level}-${module}`} name="title" defaultValue={moduleTopics[level][module]} required maxLength={160} />
        </label>
        <label className="field">
          {t("Instructions")}
          <textarea
            name="instructions"
            required
            maxLength={5000}
            defaultValue="Read the material, complete the practice, then submit a short response explaining what you learned."
          />
        </label>
        <label className="field">
          {t("Due date")}
          <input type="date" name="due" min={new Date().toLocaleDateString("en-CA")} required />
        </label>
        <button disabled={busy || !classId}>{t(busy ? "Saving…" : "Assign to class")}</button>
        {error && (
          <p role="alert" className="message">
            {t(error)}
          </p>
        )}
      </form>
    </section>
  );
}
