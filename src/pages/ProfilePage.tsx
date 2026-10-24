import { GameProgress } from '../components/GameProgress';
import { useI18n } from '../lib/i18n';
import { Link } from 'wouter';
import { ProfileCard } from '../components/ProfileCard';
import { useLearning } from '../lib/learningContext';
import { PageHeading } from '../components/PageHeading';
import { Card } from '../components/Card';
import { Icon } from '../components/Icon';

export function ProfilePage() {
  const { t } = useI18n();
  const { session, profile } = useLearning();

  return (
    <>
      <PageHeading
        title={t('A space that’s all yours.')}
        description={t('Your profile and your place in the EnglishBoost journey.')}
      />
      <GameProgress />
      {session ? (
        <>
          <ProfileCard
            user={{
              ...session.user,
              user_metadata: {
                ...session.user.user_metadata,
                full_name: profile?.full_name || session.user.user_metadata.full_name,
              },
            }}
          />
          <div className="profile-card">
            <span className="status-badge blue">
              {profile?.role === 'tutor' ? t('Tutor account') : t('Student account')}
            </span>
            <p className="profile-detail">{profile?.goal ?? 'Improve school grades'}</p>
            <Link className="text-link" href="/settings">
              {t('Edit your learning profile')} <Icon name="arrow" size={15} />
            </Link>
          </div>
        </>
      ) : (
        <Card className="profile-card">
          <div className="profile-avatar profile-initial">{t('AM')}</div>
          <h1>{t('Alex Morgan')}</h1>
          <p className="profile-detail">{t('This is a demo profile. Sign in to start your own learning journey.')}</p>
          <Link className="button primary" href="/sign-in">
            {t('Sign in to EnglishBoost')} <Icon name="arrow" size={16} />
          </Link>
        </Card>
      )}
    </>
  );
}
