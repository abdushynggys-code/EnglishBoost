import { useI18n } from '../lib/i18n';
import { Link, useSearch } from 'wouter';
import { Card } from '../components/Card';
import { PageHeading } from '../components/PageHeading';
import { Icon } from '../components/Icon';
import { TutorStudents } from '../components/TutorStudents';
import { TutorContent } from '../components/TutorContent';
import { TutorAssignment } from '../components/TutorAssignment';
import { TutorReviews } from '../components/TutorReviews';
import { useLearning } from '../lib/learningContext';
import type { ContentKind } from '../lib/contentForms';

const tabs = [
  { id: 'students', title: 'Students & reports' },
  { id: 'lessons', title: 'Lessons' },
  { id: 'questions', title: 'Quizzes' },
  { id: 'vocabulary', title: 'Vocabulary' },
  { id: 'passages', title: 'Reading' },
  { id: 'writing', title: 'Writing' },
  { id: 'assign', title: 'Assign & schedule' },
  { id: 'reviews', title: 'Review work' },
];

export function TutorPage() {
  const { t } = useI18n();
  const { session, profile, demo } = useLearning();
  const search = useSearch();
  const view = new URLSearchParams(search).get('view') ?? 'students';
  if (!session || demo || profile?.role !== 'tutor')
    return (
      <Card className="empty-state">
        <Icon name="tutor" size={40} />
        <h1>{t('A space for the person in your corner.')}</h1>
        <p>
          {t(
            'The tutor workspace is available to approved tutor accounts. Students can explore their lessons from the learning dashboard.',
          )}
        </p>
        <Link className="button primary" href={session ? '/' : '/sign-in'}>
          {session ? t('Back to your dashboard') : t('Sign in as a tutor')}
          <Icon name="arrow" size={16} />
        </Link>
      </Card>
    );
  return (
    <>
      <PageHeading
        eyebrow={t('THE TUTOR WORKSPACE')}
        title={t('A little guidance makes a big difference.')}
        description={t('Plan the learning, celebrate the progress, and help your students find their confidence.')}
        action={
          <span className="status-badge green">
            <Icon name="shield" size={13} />
            {t('Tutor access')}
          </span>
        }
      />
      <nav className="tutor-tabs" aria-label={t('Tutor workspace')}>
        {tabs.map((tab) => (
          <Link key={tab.id} href={`/tutor?view=${tab.id}`} className={view === tab.id ? 'active' : ''}>
            {t(tab.title)}
          </Link>
        ))}
      </nav>
      <Link href="/classroom" className="text-link spaced">
        {t('Live Classroom')} <Icon name="arrow" size={15} />
      </Link>
      {view === 'students' ? (
        <TutorStudents />
      ) : view === 'assign' ? (
        <TutorAssignment />
      ) : view === 'reviews' ? (
        <TutorReviews />
      ) : ['lessons', 'questions', 'vocabulary', 'passages', 'writing'].includes(view) ? (
        <TutorContent key={view} kind={view as ContentKind} />
      ) : (
        <Card title={t('Choose a workspace section')}>
          <p>{t('Use the tabs above to manage your tutoring.')}</p>
        </Card>
      )}
    </>
  );
}
