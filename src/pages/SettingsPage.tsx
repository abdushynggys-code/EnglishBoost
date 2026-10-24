import { ClassConnections } from "../components/ClassConnections";
import { usePlatform } from "../lib/platform";
import { useState } from "react";
import { PageHeading } from "../components/PageHeading";
import { Card } from "../components/Card";
import { Icon } from "../components/Icon";
import { useLearning } from "../lib/learningContext";
import { useLearningActions } from "../lib/useLearningActions";
import { PreferencesForm } from "../components/PreferencesForm";
import { useI18n } from "../lib/i18n";

export function SettingsPage() {
  const { profile, demo } = useLearning();
  const { state } = usePlatform();
  const actions = useLearningActions();
  const { t } = useI18n();
  const [name, setName] = useState(profile?.full_name ?? (demo ? "Alex Morgan" : ""));
  const [goal, setGoal] = useState(profile?.goal ?? "Improve school grades");
  const [target, setTarget] = useState(profile?.weekly_target ?? 3);
  const [busy, setBusy] = useState(false);
  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    await actions.settings(profile?.id ?? "demo", { full_name: name.trim(), goal: goal.trim(), weekly_target: target });
    setBusy(false);
  }
  return (
    <>
      <PageHeading title={t("Make this space yours.")} description={t("Your goals, your pace, your learning journey.")} />
      <Card title={t("Language & learning")} className="settings-card">
        <PreferencesForm />
      </Card>
      <ClassConnections />
      {state.developer && (
        <section className="card spaced">
          <h2>{t("Developer tools")}</h2>
          <p>{t("A separate space to test unreleased features.")}</p>
          <a className="button" href="/developer" target="_blank" rel="noreferrer">
            {t("Open developer workspace")} ↗
          </a>
        </section>
      )}
      <details className="card settings-card spaced">
        <summary>{t("Account details")}</summary>
        <div className="spaced">
          <p>{t("A few details to make EnglishBoost feel a little more like you.")}</p>
          <form className="form" onSubmit={(event) => void submit(event)}>
            <label className="field">
              {t("Your name")}
              <input value={name} onChange={(e) => setName(e.target.value)} required maxLength={80} />
            </label>
            <label className="field">
              {t("Your learning goal")}
              <input value={goal} onChange={(e) => setGoal(e.target.value)} required maxLength={160} />
            </label>
            <label className="field">
              {t("Practice days per week")}
              <select value={target} onChange={(e) => setTarget(Number(e.target.value))}>
                {Array.from({ length: 7 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1} {i ? "days" : "day"} {t("per week")}
                  </option>
                ))}
              </select>
            </label>
            <button disabled={busy}>
              <Icon name="save" size={16} />
              {busy ? t("Saving…") : t("Save settings")}
            </button>
          </form>
          <div className="settings-role">
            <Icon name="shield" size={19} />
            {demo ? t("Demo student") : profile?.role === "tutor" ? t("Tutor account") : t("Student account")}{" "}
            {t("· Roles and student approvals are managed securely.")}
          </div>
        </div>
      </details>
    </>
  );
}
