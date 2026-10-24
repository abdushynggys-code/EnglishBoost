import { useState } from "react";
import { usePlatform } from "../lib/platform";
import { useI18n } from "../lib/i18n";
import { courseLevels, levelNumber } from "../lib/course/levels";
import { PageLoading } from "../components/PageLoading";
export function DeveloperPage() {
  const { state, loading } = usePlatform();
  const { t } = useI18n();
  const [level, setLevel] = useState("A1");
  const [scenario, setScenario] = useState("fresh");
  const [role, setRole] = useState("student");
  const [screen, setScreen] = useState("/course");
  const [xp, setXp] = useState(20000);
  const [coins, setCoins] = useState(5000);
  if (loading) return <PageLoading />;
  if (!state.developer)
    return (
      <section className="card">
        <h1>{t("Developer access required")}</h1>
        <p>{t("Developer tools are only available to explicitly authorised accounts.")}</p>
      </section>
    );
  return (
    <div className="stack">
      <section className="card">
        <p className="eyebrow">{t("DEVELOPER WORKSPACE")}</p>
        <h1>{t("Test before release")}</h1>
        <p>
          {t(
            "The sandbox uses temporary learning data and cannot save lessons, spend real coins or send assignments. Your real account stays separate.",
          )}
        </p>
        <div className="form-grid spaced">
          <label className="field">
            {t("Starting level")}
            <select value={level} onChange={(e) => setLevel(e.target.value)}>
              {courseLevels.map((l) => (
                <option key={l} value={l}>
                  {t("Level")} {levelNumber(l)} · {l}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            {t("Test scenario")}
            <select value={scenario} onChange={(e) => setScenario(e.target.value)}>
              <option value="fresh">{t("New learner")}</option>
              <option value="midway">{t("Partly completed path")}</option>
              <option value="finished">{t("Completed course")}</option>
            </select>
          </label>
          <label className="field">
            {t("Preview role")}
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="student">{t("Student")}</option>
              <option value="tutor">{t("Tutor")}</option>
            </select>
          </label>
          <label className="field">
            {t("Start screen")}
            <select value={screen} onChange={(e) => setScreen(e.target.value)}>
              {[
                ["/course", "My course"],
                ["/shop", "Streak shop"],
                ["/classroom", "Live Classroom"],
                ["/tutor", "Teaching desk"],
                ["/settings", "Settings"],
              ].map(([value, label]) => (
                <option key={value} value={value}>
                  {t(label)}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            {t("Test XP")}
            <input type="number" min={0} max={1000000} value={xp} onChange={(e) => setXp(Number(e.target.value))} />
          </label>
          <label className="field">
            {t("Test coins")}
            <input type="number" min={0} max={100000} value={coins} onChange={(e) => setCoins(Number(e.target.value))} />
          </label>
        </div>
        <a
          className="button spaced"
          target="_blank"
          rel="noreferrer"
          href={`/developer/sandbox?level=${level}&scenario=${scenario}&role=${role}&screen=${encodeURIComponent(screen)}&xp=${xp}&coins=${coins}`}
        >
          {t("Open isolated sandbox")} ↗
        </a>
      </section>
      <section className="card">
        <h2>{t("Release checks")}</h2>
        <p>
          {t(
            "Preview every course level, answer feedback, language, reduced motion and responsive layout. Changes in the sandbox are temporary; production features still require a reviewed deployment.",
          )}
        </p>
        <p>{t("Access is assigned by account, separately from student and tutor roles.")}</p>
      </section>
    </div>
  );
}
