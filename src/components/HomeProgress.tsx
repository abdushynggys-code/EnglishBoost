import { useCourse } from '../lib/course/context';
import { Icon } from './Icon';
import type { IconName } from './Icon';
import { useLearning } from '../lib/learningContext';
import { useI18n } from '../lib/i18n';

export function HomeProgress() {
  const { data } = useLearning();
  const {state}=useCourse();
  const { t, preferences } = useI18n();
  const format = new Intl.NumberFormat(preferences.language);
  const stats: { label: string; count: number; icon: IconName }[] = [
    { label: 'Lessons completed', count: state.completions.filter(item=>item.passed&&!item.lesson_id.startsWith('review:')).length + data.lessonProgress.filter((item) => item.status === 'completed').length, icon: 'book' },
    { label: 'Words learned', count: data.wordProgress.filter((word) => word.known).length, icon: 'vocabulary' },
    { label: 'Activities completed', count: data.attempts.length + data.conciseAttempts.length, icon: 'check' },
  ];
  return (
    <dl className="home-progress">
      {stats.map(({ label, count, icon }) => (
        <div key={label}>
          <Icon name={icon} size={19} />
          <dt>{t(label)}</dt>
          <dd>{format.format(count)}</dd>
        </div>
      ))}
    </dl>
  );
}
