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
import { ClassBadges } from "../components/ClassBadges";
import { PageLoading } from "../components/PageLoading";
import { ClassStudentRoster } from "../components/ClassStudentRoster";
import { PhotoCourseAssignment } from "../components/PhotoCourseAssignment";
import { TutorClassAssignment } from "../components/TutorClassAssignment";
import { ClassVocabularyManager } from "../components/ClassVocabularyManager";
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
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [vocabularyVersion, setVocabularyVersion] = useState(0);
  const selectionInitialized = useRef(false);
  const request = useRef(0);
  async function reload() {
    if (!room) return;
    const version = ++request.current;
    try {
      const next = await loadClassOverview(room.id);
      if (version === request.current) {
        setOverview(next);
        setSelectedIds((current) => {
          const available = new Set(next.members.map((member) => member.user_id));
          if (!selectionInitialized.current) {
            selectionInitialized.current = true;
            return next.members.map((member) => member.user_id);
          }
          return current.filter((id) => available.has(id));
        });
        setError("");
      }
    } catch (cause) {
      if (version === request.current) setError(cause instanceof Error ? cause.message : "Could not load this class. Please try again.");
    }
  }
  useEffect(() => {
    setOverview(null);
    selectionInitialized.current = false;
    setSelectedIds([]);
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
        owner ? (
          <>
            <div className="class-management-grid">
              <div className="stack">
                <ClassStudentRoster members={overview.members} selectedIds={selectedIds} onChange={setSelectedIds} />
                <ClassBadges classId={room.id} />
              </div>
              <div className="stack">
                <PhotoCourseAssignment classId={room.id} students={overview.members} selectedIds={selectedIds}
                  onComplete={() => { void reload(); setVocabularyVersion((value) => value + 1); }} />
                <TutorClassAssignment classId={room.id} studentIds={selectedIds} />
                <ClassVocabularyManager key={vocabularyVersion} classId={room.id} members={overview.members} selectedIds={selectedIds} />
              </div>
            </div>
            <ClassHomework work={overview.work} tutor onChanged={() => void reload()} />
          </>
        ) : (
          <>
            <ClassLeaderboard members={overview.members} userId={profile?.id} />
            <ClassBadges classId={room.id} userId={profile?.id} />
            <ClassHomework work={overview.work} tutor={false} />
          </>
        )
      ) : (
        !error && <PageLoading />
      )}
    </div>
  );
}
