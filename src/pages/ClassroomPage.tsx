import { ClassConnections } from '../components/ClassConnections';
import { usePlatform } from '../lib/platform';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'wouter';
import { PageHeading } from '../components/PageHeading';
import { Card } from '../components/Card';
import { Icon } from '../components/Icon';
import { ClassroomPreview } from '../components/ClassroomPreview';
import { useI18n } from '../lib/i18n';
import { useLearning } from '../lib/learningContext';
import { createClassroom, listClassrooms, subscribeClassrooms } from '../lib/classroomApi';
import { loadStudents } from '../lib/tutorApi';
import type { ClassroomRoom } from '../lib/classroomTypes';
import type { Profile } from '../lib/types';

export function ClassroomPage() {
  const { t } = useI18n();
  const { data, demo, session, profile, setNotice } = useLearning();
  const [, navigate] = useLocation();
  const {state:connections}=usePlatform();
  const tutor = profile?.role === 'tutor';
  const [rooms, setRooms] = useState<ClassroomRoom[]>([]);
  const [students, setStudents] = useState<Profile[]>([]);
  const [student, setStudent] = useState('');
  const [lesson, setLesson] = useState(data.lessons[0]?.id ?? '');
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(!demo);
  const [error, setError] = useState('');
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
            setError(cause instanceof Error ? cause.message : 'Could not load classroom.');
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
            setStudent(next[0]?.id ?? '');
          }
        })
        .catch((cause) => {
          if (active) setError(cause instanceof Error ? cause.message : 'Could not load students.');
        });
    return () => {
      active = false;
      unsubscribe();
      window.clearInterval(poll);
    };
  }, [demo, session?.user.id, tutor]);
  async function start(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    try {
      const room = await createClassroom(student, lesson);
      navigate(`/classroom/${room.id}`);
    } catch (cause) {
      setNotice(t(cause instanceof Error ? cause.message : 'Could not create classroom.'));
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <PageHeading
        title={t('Live Classroom')}
        description={t(
          tutor ? t('You control the lesson. Students follow along.') : t('Follow your tutor, then try it yourself.'),
        )}
      />
      <ClassConnections />
      {!tutor&&!connections.classes.length&&!demo ? null : demo ? (
        <ClassroomPreview />
      ) : (
        <div className="stack">
          {tutor && (
            <Card title={t('Start a live lesson')}>
              <form className="form" onSubmit={(event) => void start(event)}>
                <div className="form-grid">
                  <label className="field">
                    {t('Student')}
                    <select value={student} onChange={(event) => setStudent(event.target.value)}>
                      {students.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.full_name || s.email}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="field">
                    {t('Lesson')}
                    <select value={lesson} onChange={(event) => setLesson(event.target.value)}>
                      {data.lessons.map((l) => (
                        <option key={l.id} value={l.id}>
                          {t(l.title)}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
                <button disabled={busy || !student || !lesson}>
                  {t(busy ? t('Saving…') : t('Start a live lesson'))}
                  <Icon name="play" size={16} />
                </button>
              </form>
              {!students.length && <p className="spaced">{t('Approve a student')}</p>}
            </Card>
          )}
          <Card title={t('Your classrooms')}>
            {loading ? (
              <p>{t('Opening your workspace…')}</p>
            ) : rooms.length ? (
              <div className="classroom-list">
                {rooms.map((room) => (
                  <Link key={room.id} href={`/classroom/${room.id}`}>
                    <div>
                      <span className={`status-badge ${room.status === 'live' ? 'green' : 'gray'}`}>
                        {t(room.status === 'live' ? t('Live') : t('Ended'))}
                      </span>
                      <h3>{t(data.lessons.find((l) => l.id === room.lesson_id)?.title ?? 'Live Classroom')}</h3>
                    </div>
                    <Icon name="chevron" size={19} />
                  </Link>
                ))}
              </div>
            ) : (
              <div className="quiet-empty">
                <Icon name="tutor" size={30} />
                <h3>{t('No live lesson yet.')}</h3>
                <p>{t('Your tutor starts the lesson. It will appear here.')}</p>
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
