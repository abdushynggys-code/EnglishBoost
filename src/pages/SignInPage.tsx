import { PageLoading } from '../components/PageLoading';
import { useEffect, useState } from 'react';
import { Link, Redirect, useSearch } from 'wouter';
import { Auth } from '../components/Auth';
import { useLearning } from '../lib/learningContext';
import { useI18n } from '../lib/i18n';
import { clearDestination, rememberedDestination, rememberDestination } from '../lib/authNavigation';
import { ProductBrand } from '../components/welcome/ProductBrand';
import { Icon } from '../components/Icon';

export function SignInPage() {
  const { t } = useI18n();
  const { session, profile, loading, error } = useLearning();
  const search = useSearch();
  const [next] = useState(() => rememberedDestination(new URLSearchParams(search).get('next')));
  useEffect(() => {
    if (session) clearDestination(); else rememberDestination(next);
  }, [next, session]);
  useEffect(() => { document.title = t('Sign in') + ' · EnglishBoost'; }, [t]);
  if (session && loading) return <PageLoading />;
  if (session) return <Redirect to={profile?.role === 'tutor' && next === '/course' ? '/tutor' : next} replace />;
  return <div className="entry-sign-in">
    <header className="welcome-nav"><ProductBrand /></header>
    <main className="entry-sign-in-main">
      <aside className="entry-sign-in-copy">
        <p className="welcome-eyebrow"><span />{t('YOUR NEXT CHAPTER')}</p>
        <h2>{t('A useful little habit. All yours.')}</h2>
        <p>{t('Your lessons, your level, your progress. Ready when you are.')}</p>
        <ul>{['A starting point that fits you','One clear next lesson','Progress that comes with you'].map((label) => <li key={label}><Icon name="check" size={18} />{t(label)}</li>)}</ul>
        <Link className="welcome-demo" href="/">← {t('Back')}</Link>
      </aside>
      <div className="entry-sign-in-form">
        {error && <p className="message" role="alert">{error}</p>}
        {loading ? <p role="status">{t('Opening your workspace…')}</p> : <Auth />}
      </div>
    </main>
  </div>;
}
