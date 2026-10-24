import { AccountRolePicker } from './AccountRolePicker';
import { readAccountIntent, rememberAccountIntent } from '../lib/accountIntent';
import type { AccountIntent } from '../lib/accountIntent';
import { useI18n } from '../lib/i18n';
import { useState } from 'react';
import { isSupabaseConfigured } from '../lib/supabase';
import { signInWithEmail, signInWithGoogle, signUpWithEmail } from '../lib/auth';
import { SupabaseSetupMessage } from './SupabaseSetupMessage';

export function Auth() {
  const { t } = useI18n();
  const [role, setRole] = useState<AccountIntent | null>(readAccountIntent);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [googleBusy, setGoogleBusy] = useState(false);

  if (!isSupabaseConfigured) return <SupabaseSetupMessage />;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!role) return;
    rememberAccountIntent(role);
    setBusy(true);
    setMessage('');
    try {
      const fn = mode === 'signup' ? signUpWithEmail(email, password, role) : signInWithEmail(email, password);
      const { error } = await fn;
      if (error) setMessage(error.message);
      else if (mode === 'signup') setMessage(t('Your account is ready. Check your inbox to confirm your email.'));
    } catch {
      setMessage(t('Something went wrong. Please try again.'));
    } finally {
      setBusy(false);
    }
  }

  async function handleGoogleSignIn() {
    if (!role) return;
    rememberAccountIntent(role);
    setGoogleBusy(true);
    setMessage('');
    try {
      const { error } = await signInWithGoogle();
      if (error) {
        setMessage(error.message);
        setGoogleBusy(false);
      }
    } catch {
      setMessage(t('Could not open Google sign-in. Please try again.'));
      setGoogleBusy(false);
    }
  }

  return (
    <section className="card">
      <h1>{t(mode === 'signin' ? 'Sign in to keep learning' : 'Create your account')}</h1>
      <p className="auth-subtitle">
        {mode === 'signin'
          ? t('Sign in and pick up where you left off.')
          : t(role === 'tutor' ? 'Create your account to get started. Tutor access requires approval.' : 'Create an account. Your tutor will approve your workspace.')}
      </p>
      <AccountRolePicker value={role} onChange={setRole} disabled={busy || googleBusy} />
      <button type="button" className="google-sign-in" onClick={handleGoogleSignIn} disabled={!role || busy || googleBusy}>
        <span className="google-letter" aria-hidden="true">
          {t('G')}
        </span>
        {googleBusy ? t('Opening Google…') : t('Sign in with Google')}
      </button>
      <p className="auth-divider">{t('or continue with email')}</p>
      <form onSubmit={handleSubmit} className="form">
        <input
          type="email"
          aria-label={t('Email')}
          autoComplete="email"
          placeholder={t('Email address')}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          aria-label={t('Password')}
          autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
          placeholder={t('Password (6+ characters)')}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          minLength={6}
          required
        />
        <button type="submit" disabled={!role || busy || googleBusy}>
          {busy ? t('Just a moment…') : mode === 'signin' ? t('Sign in') : t('Create account')}
        </button>
      </form>
      {message && (
        <p className="message" role="status">
          {message}
        </p>
      )}
      <button
        className="ghost"
        disabled={busy || googleBusy}
        onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
      >
        {mode === 'signin' ? t('New here? Create an account') : t('Already have an account? Sign in')}
      </button>
    </section>
  );
}
