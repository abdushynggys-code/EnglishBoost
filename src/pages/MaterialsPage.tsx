import { useState } from "react";
import { Link } from "wouter";
import { courseLevels, levelNumber, moduleTopics } from "../lib/course/levels";
import { useCourse } from "../lib/course/context";
import { useI18n } from "../lib/i18n";
export function MaterialsPage() {
  const { state } = useCourse();
  const { t } = useI18n();
  const [level, setLevel] = useState(state.placement?.level ?? "A1");
  const index = courseLevels.indexOf(level);
  return (
    <div className="stack">
      <section className="card">
        <p className="eyebrow">{t("REAL-WORLD ENGLISH")}</p>
        <h1>{t("Explore a useful lesson")}</h1>
        <p>{t("Choose any module for extra practice. Your personal learning path stays where you left it.")}</p>
        <div className="level-tabs" role="group" aria-label={t("Course levels")}>
          {courseLevels.map((l) => (
            <button key={l} className={level === l ? "" : "secondary"} onClick={() => setLevel(l)}>
              {t("Level")} {levelNumber(l)}
              <span className="cefr-caption">{l}</span>
            </button>
          ))}
        </div>
        <div className="material-grid">
          {moduleTopics[index].map((title, i) => (
            <Link key={title} href={`/materials/${level}/${i + 1}`}>
              <article>
                <span className="eyebrow">
                  {t("Module")} {i + 1}
                </span>
                <h2>{t(title)}</h2>
                <p>{t("Reading, patterns, listening and writing with real-life situations.")}</p>
                <span className="text-link">{t("Start lesson")} →</span>
              </article>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
