import { useI18n } from '../lib/i18n';
import { Card } from './Card';

const items = [
  'Grammar',
  'Spelling',
  'Punctuation',
  'Sentence structure',
  'Paragraph organization',
  'Transitions',
  'Supporting evidence',
  'Conclusion',
];

export function WritingChecklist() {
  const { t } = useI18n();
  return (
    <Card title={t('A quick check before you send')}>
      <div className="writing-checklist">
        {items.map((item) => (
          <label key={item}>
            <input type="checkbox" />
            {t(item)}
          </label>
        ))}
      </div>
    </Card>
  );
}
