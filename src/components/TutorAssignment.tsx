import { useI18n } from '../lib/i18n';
import { useEffect, useState } from 'react';
import { Card } from './Card';
import { Icon } from './Icon';
import { useLearning } from '../lib/learningContext';
import { assignWork, loadStudents } from '../lib/tutorApi';
import type { Profile } from '../lib/types';
export function TutorAssignment() {
  const { t } = useI18n();
  const { data, setNotice } = useLearning();
  const [students, setStudents] = useState<Profile[]>([]);
  const [student, setStudent] = useState('');
  const [kind, setKind] = useState('homework');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => {
    void loadStudents()
      .then((people) => {
        setStudents(people);
        setStudent(people[0]?.id ?? '');
      })
      .catch((cause) => setError(cause instanceof Error ? cause.message : 'Could not load students.'));
  }, []);
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const fields = new FormData(form);
    setBusy(true);
    setError('');
    try {
      if (kind === 'homework')
        await assignWork('homework_assignments', {
          user_id: student,
          lesson_id: fields.get('lesson'),
          title: fields.get('title'),
          instructions: fields.get('instructions'),
          due_at: fields.get('due'),
          material_url: fields.get('material'),
          practice_path: fields.get('practice'),
        });
      else
        await assignWork('tutoring_sessions', {
          user_id: student,
          starts_at: new Date(String(fields.get('starts'))).toISOString(),
          duration: Number(fields.get('duration')),
          meeting_url: fields.get('meeting'),
        });
      form.reset();
      setNotice(
        kind === 'homework'
          ? 'Homework assigned to the student.'
          : 'Tutoring session scheduled. The student can add it to their calendar.',
      );
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not create assignment.');
    } finally {
      setBusy(false);
    }
  }
  return (
    <Card title={t('Give the next step a little direction')} className="tutor-form">
      <div className="filter-bar">
        <label className="inline-select">
          {t('Create')}
          <select value={kind} onChange={(e) => setKind(e.target.value)}>
            <option value="homework">{t('Homework assignment')}</option>
            <option value="session">{t('Tutoring session')}</option>
          </select>
        </label>
      </div>
      {!students.length ? (
        <p>{t('Approve a student and ask them to sign up first.')}</p>
      ) : (
        <form className="form" onSubmit={(event) => void submit(event)}>
          <label className="field">
            {t('Student')}
            <select value={student} onChange={(e) => setStudent(e.target.value)}>
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.full_name || s.email}
                </option>
              ))}
            </select>
          </label>
          {kind === 'homework' ? (
            <>
              <div className="form-grid">
                <label className="field">
                  {t('Title')}
                  <input name="title" required />
                </label>
                <label className="field">
                  {t('Due date')}
                  <input name="due" type="date" required />
                </label>
                <label className="field">
                  {t('Lesson')}
                  <select name="lesson">
                    {data.lessons.map((l) => (
                      <option value={l.id} key={l.id}>
                        {t('Week')} {l.week}: {l.title}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="field">
                  {t('Assigned practice')}
                  <select name="practice">
                    <option value="">{t('No linked exercise')}</option>
                    <option value="/summarize">{t('Get to the Point!')}</option>
                    <option value="/practice">{t('Mixed grammar quiz')}</option>
                    <option value="/vocabulary">{t('Vocabulary flashcards')}</option>
                    <option value="/reading">{t('Reading practice')}</option>
                    <option value="/writing">{t('Writing workshop')}</option>
                  </select>
                </label>
              </div>
              <label className="field">
                {t('Instructions')}
                <textarea rows={5} name="instructions" required />
              </label>
              <label className="field">
                {t('Learning material link (optional)')}
                <input name="material" type="url" placeholder={t('https://…')} pattern="https?://.*" />
              </label>
            </>
          ) : (
            <div className="form-grid">
              <label className="field">
                {t('Date and time (your local time)')}
                <input type="datetime-local" name="starts" required />
              </label>
              <label className="field">
                {t('Duration in minutes')}
                <input type="number" min={10} max={240} defaultValue={60} name="duration" required />
              </label>
              <label className="field wide">
                {t('Meeting link (optional)')}
                <input name="meeting" type="url" placeholder={t('https://meet.google.com/…')} pattern="https?://.*" />
              </label>
            </div>
          )}
          <button disabled={busy}>
            <Icon name={kind === 'homework' ? 'homework' : 'calendar'} size={16} />
            {busy ? t('Saving…') : kind === 'homework' ? t('Assign homework') : t('Schedule session')}
          </button>
        </form>
      )}
      {error && (
        <p className="message" role="alert">
          {error}
        </p>
      )}
    </Card>
  );
}
