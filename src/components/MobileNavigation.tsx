import { Link, useLocation } from 'wouter';
import { Icon } from './Icon';
import { useI18n } from '../lib/i18n';
import { isPracticePath } from '../lib/navigation';

export function MobileNavigation({ onMore, moreOpen }: { onMore: () => void; moreOpen: boolean }) {
  const [location] = useLocation();
  const { t } = useI18n();
  return (
    <nav className="mobile-bottom-nav" aria-label={t('Main navigation')}>
      <Link href="/" className={location === '/' && !moreOpen ? 'selected' : ''}>
        <Icon name="home" size={21} />
        <span>{t('Home')}</span>
      </Link>
      <Link href="/learn" className={isPracticePath(location) && !moreOpen ? 'selected' : ''}>
        <Icon name="pen" size={21} />
        <span>{t('Practice')}</span>
      </Link>
      <Link href="/classroom" className={location.startsWith('/classroom') && !moreOpen ? 'selected' : ''}>
        <Icon name="tutor" size={21} />
        <span>{t('Live Classroom')}</span>
      </Link>
      <button className={moreOpen ? 'selected' : ''} onClick={onMore} aria-expanded={moreOpen}>
        <Icon name="menu" size={21} />
        <span>{t('More')}</span>
      </button>
    </nav>
  );
}
