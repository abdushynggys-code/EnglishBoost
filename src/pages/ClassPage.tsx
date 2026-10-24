import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "wouter";
import { usePlatform } from "../lib/platform";
import { useLearning } from "../lib/learningContext";
import { useI18n } from "../lib/i18n";
import { loadClassOverview, deleteLearningClass } from "../lib/classes";
import type { ClassOverview } from "../lib/classes";
import { useLiveSync } from "../lib/liveSync";
import { ClassLeaderboard } from "../components/ClassLeaderboard";
import { ClassHomework } from "../components/ClassHomework";
import { PageLoading } from "../components/PageLoading";
export function ClassPage({ params }: { params: { id: string } }) {
  const { state, loading, refresh, error: platformError } = usePlatform();
  const { session, profile, preview, refresh: refreshWorkspace } = useLearning();
  const { t } = useI18n();
  const [, navigate] = useLocation();
  const room = state.classes.find((c) => c.id === params.id);
  const owner = room?.user_id === profile?.id;
  const [overview, setOverview] = useState<ClassOverview | null>(null);
  const [error, setError] = useState("");
  const [confirm, setConfirm] = useState(false);
  const [busy, setBusy] = useState(false);
  const request = useRef(0);
  async function reload() {
    if (!room) return;
    const version = ++request.current;
    try {
      const next = await loadClassOverview(room.id);
      if (version === request.current) {
        setOverview(next);
        setError("");
      }
    } catch (cause) {
      if (version === request.current) setError(cause instanceof Error ? cause.message : "Could not load this class. Please try again.");
    }
  }
  useEffect(() => {
    setOverview(null);
    void reload();
    return () => {
      request.current++;
    };
  }, [room?.id]);
  useLiveSync(
    session?.user.id,
    preview,
    ["class_members", "learning_wallets", "homework_assignments", "homework_submissions", "course_profiles"],
    reload,
  );
  async function remove() {
    if (!room) return;
    setBusy(true);
    try {
      await deleteLearningClass(room.id);
      await Promise.all([refresh(), refreshWorkspace()]);
      navigate("/classroom");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not delete class.");
    } finally {
      setBusy(false);
    }
  }
  if (loading && !room) return <PageLoading />;
  if (!room)
    return (
      <section className="card">
        <h1>{t(platformError ? "Could not load this class. Please try again." : "This class is no longer available.")}</h1>
        <Link href="/classroom">{t("Back to classes")}</Link>
        {platformError && <button onClick={() => void refresh()}>{t("Try again")}</button>}
      </section>
    );
  return (
    <div className="stack">
      <section className="card class-overview-heading">
        <Link href="/classroom" className="text-link">
          ← {t("Your classes")}
        </Link>
        <h1>{room.title}</h1>
        <p>{t("Your group, your progress, your next step.")}</p>
        {owner && (
          <div className="button-row spaced">
            <code className="class-code">{room.code}</code>
            <button
              className="secondary"
              onClick={() => void navigator.clipboard.writeText(room.code).catch(() => setError("Select and copy the class code."))}
            >
              {t("Copy code")}
            </button>
            <button className="secondary danger" onClick={() => setConfirm(!confirm)}>
              {t("Delete class")}
            </button>
          </div>
        )}
        {confirm && (
          <div className="delete-class-confirm spaced" role="alert">
            <strong>{t("Delete this class?")}</strong>
            <p>{t("The code and class membership will be removed. Learners keep their course progress and submitted work.")}</p>
            <div className="button-row">
              <button className="danger" disabled={busy} onClick={() => void remove()}>
                {t(busy ? "Saving…" : "Delete class")}
              </button>
              <button className="secondary" onClick={() => setConfirm(false)}>
                {t("Cancel")}
              </button>
            </div>
          </div>
        )}
      </section>
      {error && (
        <p role="alert" className="message">
          {t(error)}{" "}
          <button className="text-button" onClick={() => void reload()}>
            {t("Try again")}
          </button>
        </p>
      )}
      {overview ? (
        <>
          <ClassLeaderboard members={overview.members} userId={profile?.id} />
          <ClassHomework work={overview.work} tutor={owner} />
        </>
      ) : (
        !error && <PageLoading />
      )}
    </div>
  );
}
