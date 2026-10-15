import { useI18n } from '../lib/i18n';
import { useEffect, useState } from 'react';
import { Card } from './Card';
import { Icon } from './Icon';
import { StudentReport } from './StudentReport';
import { useLearning } from '../lib/learningContext';
import { approveStudent, loadStudents, loadInvitations } from '../lib/tutorApi';
import { loadWorkspace } from '../lib/workspaceApi';
import type { Profile, Workspace } from '../lib/types';

export function TutorStudents() {
  const { t } = useI18n();
  const { setNotice } = useLearning();
  const [students, setStudents] = useState<Profile[]>([]);
  const [invitations, setInvitations] = useState<{ email: string }[]>([]);
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(false);
  const [selected, setSelected] = useState('');
  const [report, setReport] = useState<Workspace | null>(null);
  const [error, setError] = useState('');
  async function reload() {
    try {
      const [people, invites] = await Promise.all([loadStudents(), loadInvitations()]);
      setStudents(people);
      setInvitations(invites);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not load students.');
    }
  }
  useEffect(() => {
    void reload();
  }, []);
  useEffect(() => {
    let active = true;
    setReport(null);
    if (selected)
      void loadWorkspace(selected)
        .then((data) => {
          if (active) setReport(data);
        })
        .catch((cause) => {
          if (active) setError(cause instanceof Error ? cause.message : 'Could not load report.');
        });
    return () => {
      active = false;
    };
  }, [selected]);
  async function invite(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      await approveStudent(email.trim());
      setEmail('');
      await reload();
      setNotice(
        t(
          'Student approved. If they haven’t registered yet, they’ll be approved when they join. No invitation email is sent; share your app link with them.',
        ),
      );
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not approve student.');
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="stack">
      <Card title={t('Approve a student')}>
        <p>
          {t(
            'Enter their sign-in email to give them access to your tutoring workspace. Share the website link with them separately.',
          )}
        </p>
        <form className="button-row spaced" onSubmit={(event) => void invite(event)}>
          <input
            type="email"
            aria-label={t('Student email')}
            placeholder={t('student@example.com')}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ flex: 1, minWidth: 190 }}
          />
          <button disabled={busy}>
            <Icon name="plus" size={16} />
            {busy ? t('Approving…') : t('Approve student')}
          </button>
        </form>
        {error && (
          <p role="alert" className="message">
            {error}
          </p>
        )}
      </Card>
      <Card title={t('Your students')}>
        <div className="tutor-list">
          {students.length ? (
            students.map((student) => (
              <div className="tutor-row" key={student.id}>
                <div className="tutor-row-header">
                  <div>
                    <h3>{student.full_name || 'Your student'}</h3>
                    <p>{student.email}</p>
                  </div>
                  <button className="secondary" onClick={() => setSelected(student.id)}>
                    {t('View report')}
                    <Icon name="chart" size={16} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>{t('No registered students yet. Approve an email above to get started.')}</p>
          )}
        </div>
        {invitations.filter((i) => !students.some((s) => s.email === i.email)).length > 0 && (
          <div className="spaced">
            <h3>{t('Approved, awaiting sign-up')}</h3>
            {invitations
              .filter((i) => !students.some((s) => s.email === i.email))
              .map((i) => (
                <p key={i.email}>{i.email}</p>
              ))}
          </div>
        )}
      </Card>
      {selected && !report && !error && (
        <Card>
          <p>{t('Loading the student report…')}</p>
        </Card>
      )}
      {report && <StudentReport key={selected} student={students.find((s) => s.id === selected)} data={report} />}
    </div>
  );
}
