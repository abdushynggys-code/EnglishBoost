import { useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { Icon } from './Icon';
import { ProfileMenu } from './ProfileMenu';
import { useI18n } from '../lib/i18n';
import { languageNames } from '../lib/preferences';
import { pageLabel } from '../lib/navigation';

export function Topbar({ onMenu }: { onMenu: () => void }) {
  const { t, preferences } = useI18n();
  const [location] = useLocation();
  const label = t(location === '/book' && preferences.learning_track === 'language_arts' ? 'My learning' : pageLabel(location));
  useEffect(() => { document.title = `${label} · EnglishBoost`; }, [label]);
  return (
    <header className="topbar simple-topbar">
      <div className="topbar-title">
        <button className="icon-button mobile-menu" aria-label={t('Open navigation')} onClick={onMenu}>
          <Icon name="menu" />
        </button>
        <span className="desktop-topbar-label">{label}</span>
        <span className="mobile-topbar-brand">EnglishBoost.</span>
      </div>
      <div className="topbar-right">
        <Link href="/settings" className="language-shortcut" aria-label={t('Language for explanations')}>
          {languageNames[preferences.language]}
        </Link>
        <ProfileMenu />
      </div>
    </header>
  );
}
