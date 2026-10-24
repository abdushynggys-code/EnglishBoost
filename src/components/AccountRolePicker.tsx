import { Icon } from './Icon';
import { useI18n } from '../lib/i18n';
import type { AccountIntent } from '../lib/accountIntent';

export function AccountRolePicker({ value, onChange, disabled }: {
  value: AccountIntent | null;
  onChange: (role: AccountIntent) => void;
  disabled: boolean;
}) {
  const { t } = useI18n();
  return <fieldset className="account-role-picker" disabled={disabled}>
    <legend>{t('Are you a student or a tutor?')}</legend>
    <div>{(['student', 'tutor'] as const).map((role) => <label key={role} className={value === role ? 'selected' : ''}>
      <input type="radio" name="account-role" value={role} checked={value === role} onChange={() => onChange(role)} />
      <Icon name={role === 'student' ? 'book' : 'tutor'} size={22} />
      <span><strong>{t(role === 'student' ? 'Student' : 'Tutor')}</strong><small>{t(role === 'student' ? 'I want to learn English' : 'I help students learn')}</small></span>
      {value === role && <Icon name="check" size={16} />}
    </label>)}</div>
    <p role="status">{t(value === 'tutor' ? 'Tutor tools are available to approved tutor accounts.' : value === 'student' ? 'Your lessons and progress, all in one place.' : 'Choose how you will use EnglishBoost to continue.')}</p>
  </fieldset>;
}
