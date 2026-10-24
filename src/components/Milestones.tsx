import { useCourse } from '../lib/course/context';
import { useI18n } from '../lib/i18n';
import { Card } from './Card';
import { Icon } from './Icon';
import type { IconName } from './Icon';
import { useLearning } from '../lib/learningContext';

export function Milestones() {
  const { t } = useI18n();
  const { data } = useLearning();
  const {state}=useCourse();
  const milestones: { title: string; description: string; icon: IconName; earned: boolean }[] = [
    {
      title: 'The first step',
      description: 'Complete your first lesson',
      icon: 'target',
      earned: state.completions.some(c=>c.passed)||data.lessonProgress.some((p) => p.status === 'completed'),
    },
    {
      title: 'Word collector',
      description: 'Learn five new words',
      icon: 'vocabulary',
      earned: data.wordProgress.filter((w) => w.known).length >= 5,
    },
    {
      title: 'Keep showing up',
      description: 'Complete three practices',
      icon: 'sparkles',
      earned: data.attempts.length+state.completions.filter(c=>c.passed).length >= 3,
    },
    {
      title: 'Your own voice',
      description: 'Submit your first piece of writing',
      icon: 'pen',
      earned: state.completions.some(c=>c.passed&&c.response)||data.drafts.some((d) => d.submitted),
    },
  ];
  return (
    <Card title={t('Milestones worth celebrating')} className="spaced">
      <div className="milestones-grid">
        {milestones.map((milestone) => (
          <div className={`milestone ${milestone.earned ? 'earned' : ''}`} key={t(milestone.title)}>
            <span>
              <Icon name={milestone.icon} size={24} />
            </span>
            <h3>{milestone.title}</h3>
            <p>{t(milestone.description)}</p>
            <small>{milestone.earned ? t('Achievement unlocked') : t('A little goal to grow towards')}</small>
          </div>
        ))}
      </div>
    </Card>
  );
}
