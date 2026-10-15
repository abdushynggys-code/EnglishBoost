import { Link } from 'wouter';
import { Icon } from './Icon';
import { ProfileMenu } from './ProfileMenu';
import { useI18n } from '../lib/i18n';
import { languageNames } from '../lib/preferences';

export function Topbar({ onMenu }: { onMenu: () => void }) {
  const { t, preferences } = useI18n();
  return (
    <header className="topbar simple-topbar">
      <div className="topbar-title">
        <button className="icon-button mobile-menu" aria-label={t('Open navigation')} onClick={onMenu}>
          <Icon name="menu" />
        </button>
        <span className="desktop-topbar-label">{t('Your workspace')}</span>
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
