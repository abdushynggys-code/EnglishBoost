import { useI18n } from '../lib/i18n';
import type { Reflection } from '../lib/summaryTypes';

const checks: { key: keyof Reflection; text: string }[] = [
  { key: 'main_idea', text: 'I gave the main answer early.' },
  { key: 'meaning', text: 'I kept the important meaning.' },
  { key: 'relevant', text: 'My details help answer the question.' },
];
export function SummaryReflection({ value, onChange }: { value: Reflection; onChange: (value: Reflection) => void }) {
  const { t } = useI18n();
  return (
    <fieldset className="reflection-checks">
      <legend>{t('A quick self-check')}</legend>
      {checks.map((check) => (
        <label key={check.key}>
          <input
            type="checkbox"
            checked={value[check.key]}
            onChange={(event) => onChange({ ...value, [check.key]: event.target.checked })}
          />
          {t(check.text)}
        </label>
      ))}
    </fieldset>
  );
}
