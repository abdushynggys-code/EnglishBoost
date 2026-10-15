import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { Link, useLocation } from 'wouter';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { Icon } from './Icon';
import { useLearning } from '../lib/learningContext';
import { useI18n } from '../lib/i18n';
import { LanguageWelcome } from './LanguageWelcome';
import { MobileNavigation } from './MobileNavigation';

export function AppShell({ children }: { children: ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [location] = useLocation();
  const { t, onboarded } = useI18n();
  const { loading, error, refresh, session, profile, demo, exploreDemo, notice, setNotice } = useLearning();
  useEffect(() => setMenuOpen(false), [location]);
  if (!loading && !onboarded) return <LanguageWelcome />;
  if (location === '/sign-in') return <>{children}</>;
  const pending = !demo && profile && !profile.approved && !['/profile', '/settings'].includes(location);
  return (
    <div className="app-shell">
      <a href="#main-content" className="skip-link">
        {t('Skip to content')}
      </a>
      <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} />
      <div className="main-shell">
        <Topbar onMenu={() => setMenuOpen(true)} />
        <main className="main-content" id="main-content">
          {loading ? (
            <div className="loading-state">
              <Icon name="loading" className="spin" size={28} />
              <p>{t('Opening your workspace…')}</p>
            </div>
          ) : error && session ? (
            <section className="card error-state">
              <Icon name="help" size={30} />
              <h1>{t('Let’s reconnect your workspace')}</h1>
              <p>{error}</p>
              <button onClick={() => void refresh()}>{t('Try again')}</button>
              <button className="secondary" onClick={exploreDemo}>
                {t('Explore the demo')}
              </button>
            </section>
          ) : pending ? (
            <section className="card error-state">
              <Icon name="shield" size={36} />
              <h1>{t('You’re on the list.')}</h1>
              <p>
                {t('Ask your tutor to approve {email}.', { email: profile.email })}{' '}
                {t('Your tutoring content stays private.')}
              </p>
              <button onClick={() => void refresh()}>{t('Check approval')}</button>
              <button className="secondary" onClick={exploreDemo}>
                {t('Explore the demo')}
              </button>
            </section>
          ) : (
            children
          )}
          {demo && (
            <div className="demo-notice">
              <Icon name="shield" size={15} />
              <span>{t('Demo workspace · Sample learning data. Changes last for this visit.')}</span>
              <Link href="/sign-in">
                {t('Sign in to save')} <Icon name="arrow" size={13} />
              </Link>
            </div>
          )}
        </main>
      </div>
      <MobileNavigation onMore={() => setMenuOpen(!menuOpen)} moreOpen={menuOpen} />
      {notice && (
        <div className="toast" role="status">
          <Icon name="bell" size={18} />
          <span>{t(notice)}</span>
          <button className="icon-button" aria-label={t('Dismiss message')} onClick={() => setNotice('')}>
            <Icon name="close" size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
