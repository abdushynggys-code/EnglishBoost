import { useState } from "react";
import { Link } from "wouter";
import { courseLevels, levelNumber } from "../lib/course/levels";
import { buildCourseUnits } from "../data/course/units";
import { saveContent } from "../lib/tutorApi";
import { useLearning } from "../lib/learningContext";
import { useI18n } from "../lib/i18n";
export function TutorMaterialLibrary() {
  const { profile, refresh, setNotice } = useLearning();
  const { t } = useI18n();
  const [level, setLevel] = useState(0);
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");
  const units = buildCourseUnits(courseLevels[level], "everyday");
  async function add(index: number) {
    if (!profile) return;
    const unit = units[index];
    setBusy(unit.id);
    setError("");
    try {
      await saveContent(
        "lessons",
        undefined,
        {
          week: index + 1,
          title: unit.title,
          description: unit.description,
          objectives: ["Understand the main idea", "Use the target pattern", "Respond in your own words"],
          activities: unit.lessons
            .slice(0, 2)
            .map((l) => l.text)
            .join("\n\n"),
          homework: unit.lessons[4].writing_prompt,
          duration: 25,
          skill: "Reading",
        },
        profile.id,
      );
      await refresh();
      setNotice("Lesson added to your library.");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not save lesson.");
    } finally {
      setBusy("");
    }
  }
  return (
    <section className="card spaced">
      <h2>{t("Ready-to-teach material")}</h2>
      <p>{t("Six levels, 24 modules. Preview a lesson or copy it into your editable library.")}</p>
      <div className="level-tabs" role="group" aria-label={t("Course levels")}>
        {courseLevels.map((l, i) => (
          <button key={l} className={i === level ? "" : "secondary"} onClick={() => setLevel(i)}>
            {t("Level")} {levelNumber(l)}
            <small>{l}</small>
          </button>
        ))}
      </div>
      <div className="material-grid">
        {units.map((unit, index) => (
          <article key={unit.id}>
            <span className="eyebrow">
              {t("Module")} {index + 1}
            </span>
            <h3>{t(unit.title)}</h3>
            <p>{t("Reading, patterns, listening and writing with real-life situations.")}</p>
            <div className="button-row">
              <Link className="text-link" href={`/materials/${unit.level}/${index + 1}`}>
                {t("Preview")}
              </Link>
              <button className="secondary" disabled={!!busy} onClick={() => void add(index)}>
                {t(busy === unit.id ? "Saving…" : "Add to my lessons")}
              </button>
            </div>
          </article>
        ))}
      </div>
      {error && <p role="alert">{t(error)}</p>}
    </section>
  );
}
