import { useI18n } from '../lib/i18n';
export function SupabaseSetupMessage() {
  const { t } = useI18n();
  return (
    <section className="card">
      <h2>{t('Your learning space is almost ready.')}</h2>
      <p className="message">
        {t('Sign-in is being set up. You can explore the demo while the workspace is being connected.')}
      </p>
    </section>
  );
}
