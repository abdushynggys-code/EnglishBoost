import { CourseProgressPanel } from '../components/course/CourseProgressPanel';
import { GameProgress } from '../components/GameProgress';
import { usePlatform } from '../lib/platform';
import { useI18n } from '../lib/i18n';
import { PageHeading } from '../components/PageHeading';
import { ProgressReport } from '../components/ProgressReport';
import { Milestones } from '../components/Milestones';
import { CommunicationHistory } from '../components/CommunicationHistory';
import { useLearning } from '../lib/learningContext';

export function ProgressPage() {
  const { t } = useI18n();
  const { data, profile } = useLearning();
  const {state}=usePlatform();
  return (
    <>
      <PageHeading
        title={t('Look how far you’re coming.')}
        description={t('Your practice, your progress. Every small win belongs here.')}
        action={
          <span className="status-badge blue">
            {t('Weekly goal:')} {profile?.weekly_target ?? 3} {t('practice days')}
          </span>
        }
      />
      <GameProgress /><CourseProgressPanel />
      {state.classes.length>0&&<details className="card spaced"><summary>{t('Class practice')}</summary><ProgressReport data={data} /></details>}
      <CommunicationHistory attempts={data.conciseAttempts} />
      <Milestones />
    </>
  );
}
