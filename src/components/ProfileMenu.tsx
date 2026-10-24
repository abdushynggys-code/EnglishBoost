import { useI18n } from '../lib/i18n';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'wouter';
import { useLearning } from '../lib/learningContext';
import { signOut } from '../lib/auth';
import { Icon } from './Icon';

export function ProfileMenu() {
  const { t } = useI18n();
  const { profile, session, demo, setNotice } = useLearning();
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    const close = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        trigger.current?.focus();
      }
    };
    document.addEventListener('keydown', close);
    return () => document.removeEventListener('keydown', close);
  }, [open]);
  const name = profile?.full_name || (demo ? 'Alex Morgan' : session?.user.email?.split('@')[0]) || 'Learner';
  const initials = name
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
  async function handleSignOut() {
    const { error } = await signOut();
    if (error) setNotice(error.message);
    setOpen(false);
  }
  return (
    <div className="profile-menu">
      <button ref={trigger} className="profile-trigger" aria-label={t('My profile')} aria-expanded={open} onClick={() => setOpen(!open)}>
        <span className="avatar">{initials}</span>
        <span className="profile-summary">
          <strong>{name.split(' ')[0]}</strong>
          <small>
            {demo ? t('Demo student') : profile?.role === 'tutor' ? t('Tutor account') : t('Student account')}
          </small>
        </span>
        <Icon name="down" size={14} />
      </button>
      {open && (
        <>
          <button className="menu-dismiss" aria-label={t('Close profile menu')} onClick={() => setOpen(false)} />
          <div className="dropdown profile-dropdown">
            <Link href="/profile" onClick={() => setOpen(false)}>
              <Icon name="user" size={16} />
              {t('My profile')}
            </Link>
            <Link href="/settings" onClick={() => setOpen(false)}>
              <Icon name="settings" size={16} />
              {t('Settings')}
            </Link>
            {session ? (
              <button onClick={() => void handleSignOut()}>
                <Icon name="logout" size={16} />
                {t('Sign out')}
              </button>
            ) : (
              <Link href="/sign-in" onClick={() => setOpen(false)}>
                <Icon name="arrow" size={16} />
                {t('Sign in to save')}
              </Link>
            )}
          </div>
        </>
      )}
    </div>
  );
}
