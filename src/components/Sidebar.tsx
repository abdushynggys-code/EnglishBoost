import { Link, useLocation } from 'wouter';
import { Icon } from './Icon';
import { navigation, isPracticePath } from '../lib/navigation';
import { useI18n } from '../lib/i18n';
import { useLearning } from '../lib/learningContext';

export function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [location] = useLocation();
  const { t, preferences } = useI18n();
  const { profile } = useLearning();
  return (
    <>
      {open && <button className="sidebar-backdrop" onClick={onClose} aria-label={t('Close navigation')} />}
      <aside className={`sidebar ${open ? 'is-open' : ''}`}>
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
                      ? t('My learning')
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
              <span>{t(profile?.role === 'tutor' ? t('Tutor Workspace') : t('For Tutors'))}</span>
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
