import { Link } from 'wouter';
import { PageHeading } from '../components/PageHeading';
import { Icon } from '../components/Icon';
import type { IconName } from '../components/Icon';
import { useI18n } from '../lib/i18n';

const activities: { path: string; title: string; description: string; icon: IconName }[] = [
  { path: '/materials',title:'Material library',description:'Choose any module for extra practice.',icon:'book' },
  { path: '/course', title: 'My course', description: 'One small lesson. One step forward.', icon: 'target' },
  { path: '/summarize', title: 'Get to the Point!', description: 'Say what matters. Keep your meaning.', icon: 'pen' },
  { path: '/vocabulary', title: 'Vocabulary Games', description: 'Learn words, then use them.', icon: 'vocabulary' },
  { path: '/practice', title: 'Grammar Lab', description: 'Short explanations. A little practice.', icon: 'file' },
  { path: '/reading', title: 'Reading Room', description: 'Read, notice, understand.', icon: 'book' },
  { path: '/writing', title: 'Writing Workshop', description: 'Put an idea into words.', icon: 'pen' },
];

export function PracticeHubPage() {
  const { t } = useI18n();
  return (
    <>
      <PageHeading
        eyebrow="ENGLISHBOOST"
        title={t('Choose your practice.')}
        description={t('One skill at a time, at your own pace.')}
      />
      <div className="practice-hub-grid">
        {activities.map((activity) => (
          <Link key={activity.path} className="practice-hub-card" href={activity.path}>
            <span className="hub-icon">
              <Icon name={activity.icon} size={25} />
            </span>
            <div>
              <h2>{t(activity.title)}</h2>
              <p>{t(activity.description)}</p>
            </div>
            <Icon name="arrow" size={19} />
          </Link>
        ))}
      </div>
    </>
  );
}
