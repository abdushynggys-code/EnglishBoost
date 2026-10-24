import { usePlatform } from '../lib/platform';
import { useLearning } from '../lib/learningContext';
import { Link, useLocation } from 'wouter';
import { Icon } from './Icon';
import { useI18n } from '../lib/i18n';

export function MobileNavigation({ onMore, moreOpen }: { onMore: () => void; moreOpen: boolean }) {
  const [location] = useLocation();
  const { t } = useI18n();
  const {state}=usePlatform();const {profile}=useLearning();const connected=profile?.role==='tutor'||state.classes.length>0;const extra=connected?'/classroom':'/shop';
  return (
    <nav className="mobile-bottom-nav" aria-label={t('Main navigation')}>
      <Link href="/" aria-current={location === '/' ? 'page' : undefined} className={location === '/' && !moreOpen ? 'selected' : ''}>
        <Icon name="home" size={21} />
        <span>{t('Home')}</span>
      </Link>
      <Link href="/course" aria-current={location.startsWith('/course') || location === '/placement' ? 'page' : undefined} className={(location.startsWith('/course') || location === '/placement') && !moreOpen ? 'selected' : ''}>
        <Icon name="target" size={21} />
        <span>{t('My course')}</span>
      </Link>
      <Link href={extra} aria-current={location.startsWith(extra) ? 'page' : undefined} className={location.startsWith(extra) && !moreOpen ? 'selected' : ''}>
        <Icon name={connected?'tutor':'sparkles'} size={21} />
        <span>{t(connected?'Live Classroom':'Streak shop')}</span>
      </Link>
      <button className={moreOpen ? 'selected' : ''} onClick={onMore} aria-expanded={moreOpen}>
        <Icon name="menu" size={21} />
        <span>{t('More')}</span>
      </button>
    </nav>
  );
}
