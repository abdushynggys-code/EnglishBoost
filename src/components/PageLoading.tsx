import { useI18n } from '../lib/i18n';

export function PageLoading() {
  const { t } = useI18n();
  return <p role="status">{t('Opening your workspace…')}</p>;
}
