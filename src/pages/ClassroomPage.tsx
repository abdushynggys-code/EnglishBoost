import { StartLiveLesson } from "../components/StartLiveLesson";
import { ClassConnections } from "../components/ClassConnections";
import { usePlatform } from "../lib/platform";
import { useEffect, useState } from "react";
import { Link } from "wouter";
import { PageHeading } from "../components/PageHeading";
import { Card } from "../components/Card";
import { Icon } from "../components/Icon";
import { ClassroomPreview } from "../components/ClassroomPreview";
import { useI18n } from "../lib/i18n";
import { useLearning } from "../lib/learningContext";
import { listClassrooms, subscribeClassrooms } from "../lib/classroomApi";
import { loadStudents } from "../lib/tutorApi";
import type { ClassroomRoom } from "../lib/classroomTypes";
import type { Profile } from "../lib/types";
import { useLiveSync } from "../lib/liveSync";

export function ClassroomPage() {
  const { t } = useI18n();
  const { data, demo, session, profile } = useLearning();
  const { state: connections } = usePlatform();
  const tutor = profile?.role === "tutor";
  const [rooms, setRooms] = useState<ClassroomRoom[]>([]);
  const [students, setStudents] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(!demo);
  const [error, setError] = useState("");
  useLiveSync(session?.user.id, demo, ["class_members", "tutor_students", "classroom_rooms"], async () => {
    try {
      setRooms(await listClassrooms());
      if (tutor) setStudents(await loadStudents());
    } catch {
      setError("Could not load classroom.");
    }
  });
  useEffect(() => {
    if (demo || !session) return;
    let active = true;
    const refresh = () =>
      void listClassrooms()
        .then((next) => {
          if (active) {
            setRooms(next);
            setLoading(false);
          }
        })
        .catch((cause) => {
          if (active) {
            setError(cause instanceof Error ? cause.message : "Could not load classroom.");
            setLoading(false);
          }
        });
    refresh();
    const unsubscribe = subscribeClassrooms(session.user.id, tutor, refresh);
    const poll = window.setInterval(refresh, 10000);
    if (tutor)
      void loadStudents()
        .then((next) => {
          if (active) {
            setStudents(next);
          }
        })
        .catch((cause) => {
          if (active) setError(cause instanceof Error ? cause.message : "Could not load students.");
        });
    return () => {
      active = false;
      unsubscribe();
      window.clearInterval(poll);
    };
  }, [demo, session?.user.id, tutor]);
  return (
    <>
      <PageHeading
        title={t("Classes & live lessons")}
        description={t(
          tutor ? "Your groups, shared work and live lessons in one place." : "Open your class, check your homework, or join a live lesson.",
        )}
      />
      <ClassConnections />
      {!tutor && !connections.classes.length && !demo ? null : demo ? (
        <ClassroomPreview />
      ) : (
        <div className="stack">
          {tutor && <StartLiveLesson students={students} />}
          <Card title={t("Your classrooms")}>
            {loading ? (
              <p>{t("Opening your workspace…")}</p>
            ) : rooms.length ? (
              <div className="classroom-list">
                {rooms.map((room) => (
                  <Link key={room.id} href={`/classroom/${room.id}`}>
                    <div>
                      <span className={`status-badge ${room.status === "live" ? "green" : "gray"}`}>
                        {t(room.status === "live" ? t("Live") : t("Ended"))}
                      </span>
                      <h3>{t(data.lessons.find((l) => l.id === room.lesson_id)?.title ?? "Live Classroom")}</h3>
                    </div>
                    <Icon name="chevron" size={19} />
                  </Link>
                ))}
              </div>
            ) : (
              <div className="quiet-empty">
                <Icon name="tutor" size={30} />
                <h3>{t("No live lesson yet.")}</h3>
                <p>{t("Your tutor starts the lesson. It will appear here.")}</p>
              </div>
            )}
            {error && (
              <p className="message" role="alert">
                {t(error)}
              </p>
            )}
          </Card>
        </div>
      )}
    </>
  );
}
