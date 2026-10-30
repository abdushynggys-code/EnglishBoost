import { useState } from "react";
import { assignGroupWork } from "../lib/platform";
import { useLearning } from "../lib/learningContext";
import { useI18n } from "../lib/i18n";
import { courseLevels, moduleTopics, levelNumber } from "../lib/course/levels";
import { SelectMenu } from "./SelectMenu";
import { Icon } from "./Icon";
export function TutorClassAssignment({ classId, studentIds }: { classId: string; studentIds: string[] }) {
  const { setNotice } = useLearning();
  const { t } = useI18n();
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
      const count = await assignGroupWork(
        classId,
        studentIds,
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
    <section className="card">
      <h2>{t("Add the next class activity")}</h2>
      <p>{t("Choose the next learning module, add clear instructions, and set its due date.")}</p>
      <form className="form spaced" onSubmit={(e) => void submit(e)}>
        <div className="assignment-audience"><Icon name="user" size={17} />{t("Assigning to {count} selected learners", { count: studentIds.length })}</div>
        <div className="form-grid">
          <SelectMenu label={t("Level")} value={String(level)} onChange={(value) => { setLevel(Number(value)); setModule(0); }}
            options={courseLevels.map((item, index) => ({ value: String(index), label: `${t("Level")} ${levelNumber(item)} · ${item}` }))} />
          <SelectMenu label={t("Module")} value={String(module)} onChange={(value) => setModule(Number(value))}
            options={moduleTopics[level].map((name, index) => ({ value: String(index), label: t(name) }))} />
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
        <button disabled={busy || !studentIds.length}>{t(busy ? "Saving…" : "Add to class plan")}</button>
        {error && (
          <p role="alert" className="message">
            {t(error)}
          </p>
        )}
      </form>
    </section>
  );
}
