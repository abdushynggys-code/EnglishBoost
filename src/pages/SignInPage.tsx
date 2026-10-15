import { useI18n } from '../lib/i18n';
import { Link, Redirect } from 'wouter';
import { Auth } from '../components/Auth';
import { useAuthSession } from '../lib/useAuthSession';
import { Icon } from '../components/Icon';

export function SignInPage() {
  const { t } = useI18n();
  const { session, loading, error } = useAuthSession();

  if (loading)
    return (
      <main className="loading-state" role="status">
        <Icon name="loading" className="spin" />
        {t('Opening your workspace…')}
      </main>
    );
  if (session) return <Redirect to="/profile" replace />;

  return (
    <div className="auth-page">
      <aside className="auth-aside">
        <Link href="/" className="brand">
          <span className="brand-icon">
            <Icon name="book" size={30} />
          </span>
          <span>
            <strong>EnglishBoost.</strong>
            <small>{t('Learn. Practice. Grow.')}</small>
          </span>
        </Link>
        <div>
          <h1>
            {t('A little practice.')}
            <br />
            {t('A world of possibility.')}
          </h1>
          <p>{t('Build your English, find your confidence, and take the next step — at your own pace.')}</p>
        </div>
        <img src="/mountains.svg" alt="" />
        <small>{t('Your next chapter starts with one small step.')}</small>
      </aside>
      <main className="auth-main">
        <Link href="/" className="back-link">
          <Icon name="back" size={16} />
          {t('Explore the demo')}
        </Link>
        {error && (
          <p className="auth-error" role="alert">
            {error}
          </p>
        )}
        <Auth />
      </main>
    </div>
  );
}
