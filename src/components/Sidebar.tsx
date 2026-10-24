import { Link, useLocation } from 'wouter';
import { Icon } from './Icon';
import { navigation, isPracticePath } from '../lib/navigation';
import { useI18n } from '../lib/i18n';
import { useLearning } from '../lib/learningContext';
import { useNavigationDrawer } from '../lib/useNavigationDrawer';

export function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [location] = useLocation();
  const { t, preferences } = useI18n();
  const { profile } = useLearning();
  const drawer = useNavigationDrawer(open, onClose);
  return (
    <>
      {open && <button className="sidebar-backdrop" tabIndex={-1} onClick={onClose} aria-label={t('Close navigation')} />}
      <aside ref={drawer} className={`sidebar ${open ? 'is-open' : ''}`} aria-label={t('Main navigation')}>
        <Link href="/" className="brand" onClick={onClose}>
          <span className="brand-icon">
            <Icon name="book" size={29} />
          </span>
          <span>
            <strong>
              EnglishBoost<span className="brand-dot">.</span>
            </strong>
            <small>{t('Your workspace')}</small>
          </span>
        </Link>

        <nav aria-label={t('Main navigation')}>
          {navigation.map((item) => {
            const active =
              item.href === '/'
                ? location === '/'
                : item.href === '/course'
                  ? location.startsWith('/course') || location === '/placement'
                : item.href === '/learn'
                  ? isPracticePath(location)
                  : location.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-item ${active ? 'active' : ''}`}
                aria-current={active ? 'page' : undefined}
                onClick={onClose}
              >
                <Icon name={item.icon} size={20} />
                <span>
                  {t(
                    item.href === '/book' && preferences.learning_track === 'language_arts'
                      ? 'My learning'
                      : item.label,
                  )}
                </span>
                {active && <span className="active-dot" />}
              </Link>
            );
          })}
        </nav>
        <div className="sidebar-bottom">
          {profile?.role === 'tutor' && (
            <Link
              href="/tutor"
              className={`nav-item ${location.startsWith('/tutor') ? 'active' : ''}`}
              onClick={onClose}
            >
              <Icon name="tutor" />
              <span>{t('Tutor Workspace')}</span>
              <Icon name="external" size={14} />
            </Link>
          )}
          <Link href="/settings" className={`nav-item ${location === '/settings' ? 'active' : ''}`} onClick={onClose}>
            <Icon name="settings" />
            <span>{t('Settings')}</span>
          </Link>
        </div>
      </aside>
    </>
  );
}
