import { useState } from "react";
import { Link } from "wouter";
import { usePlatform, joinLearningClass, createLearningClass } from "../lib/platform";
import { useLearning } from "../lib/learningContext";
import { useI18n } from "../lib/i18n";
import { Icon } from "./Icon";
export function ClassConnections() {
  const { state, refresh, loading, error: loadError } = usePlatform();
  const { profile, refresh: refreshWorkspace } = useLearning();
  const { t } = useI18n();
  const [value, setValue] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [joining, setJoining] = useState(false);
  const tutor = profile?.role === "tutor";
  const joined = state.classes.length > 0;
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      if (tutor) await createLearningClass(value);
      else await joinLearningClass(value);
      setValue("");
      setJoining(false);
      await Promise.all([refresh(), refreshWorkspace()]);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not connect to the class.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <section className="card class-connections">
      <h2>{t(tutor || joined ? "Your classes" : "Learn your way")}</h2>
      <p>
        {t(
          tutor
            ? "Create a class, share its code, then assign work to everyone."
            : joined
              ? "You are connected. Open a class to see your group and homework."
              : "Your course works on its own. Join a class only if you have a tutor.",
        )}
      </p>
      {!tutor && joined && (
        <button className="secondary spaced" aria-expanded={joining} onClick={() => setJoining(!joining)}>
          {t(joining ? "Cancel" : "Join another class")}
        </button>
      )}
      {(tutor || !joined || joining) && (
        <form className="form spaced" onSubmit={(e) => void submit(e)}>
          <label className="field">
            {t(tutor ? "Class name" : "Class code")}
            <input
              value={value}
              onChange={(e) => setValue(tutor ? e.target.value : e.target.value.toUpperCase())}
              minLength={tutor ? 2 : 10}
              maxLength={tutor ? 100 : 10}
              autoComplete="off"
              placeholder={t(tutor ? "e.g. Thursday English" : "10-character code")}
              required
            />
          </label>
          <button disabled={busy || loading}>
            <Icon name={tutor ? "plus" : "arrow"} size={16} />
            {t(busy ? "Saving…" : tutor ? "Create class" : "Join class")}
          </button>
        </form>
      )}
      {(error || loadError) && (
        <p role="alert" className="message">
          {t(error || loadError)}
        </p>
      )}
      <div className="class-code-list">
        {state.classes.map((room) => (
          <article key={room.id}>
            <Link className="class-title-link" href={`/classes/${room.id}`}>
              <strong>{room.title}</strong>
              {tutor && <code>{room.code}</code>}
              <span className="cefr-caption">{t("Leaderboard & homework")} →</span>
            </Link>
            {tutor ? (
              <button
                className="secondary"
                onClick={() => void navigator.clipboard.writeText(room.code).catch(() => setError("Select and copy the class code."))}
              >
                {t("Copy code")}
              </button>
            ) : (
              <Link href={`/classes/${room.id}`} className="text-link">
                {t("Open class")}
                <Icon name="arrow" size={16} />
              </Link>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
