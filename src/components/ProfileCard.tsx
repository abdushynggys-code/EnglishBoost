import { useI18n } from '../lib/i18n';
import { useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { signOut } from '../lib/auth';

export function ProfileCard({ user }: { user: User }) {
  const { t } = useI18n();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [imageFailed, setImageFailed] = useState(false);
  const name: unknown = user.user_metadata.full_name ?? user.user_metadata.name;
  const avatar: unknown = user.user_metadata.avatar_url;
  const displayName = typeof name === 'string' && name.trim() ? name : 'My profile';
  const avatarUrl = typeof avatar === 'string' && avatar.startsWith('https://') ? avatar : null;

  async function handleSignOut() {
    setBusy(true);
    setMessage('');
    try {
      const { error } = await signOut();
      if (error) setMessage(error.message);
    } catch {
      setMessage(t('Could not sign out. Please try again.'));
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="card profile-card">
      {avatarUrl && !imageFailed ? (
        <img
          className="profile-avatar"
          src={avatarUrl}
          alt="Profile photo"
          referrerPolicy="no-referrer"
          onError={() => setImageFailed(true)}
        />
      ) : (
        <div className="profile-avatar profile-initial" aria-hidden="true">
          {(user.email ?? displayName).charAt(0).toUpperCase()}
        </div>
      )}
      <h1>{displayName}</h1>
      {user.email && <p className="profile-email">{user.email}</p>}
      <button type="button" onClick={handleSignOut} disabled={busy}>
        {busy ? t('Signing out…') : t('Sign out')}
      </button>
      {message && (
        <p className="message" role="alert">
          {message}
        </p>
      )}
    </section>
  );
}
