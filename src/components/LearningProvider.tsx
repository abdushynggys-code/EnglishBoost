import { useCallback, useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { LearningContext } from '../lib/learningContext';
import { useAuthSession } from '../lib/useAuthSession';
import { loadProfile, loadWorkspace } from '../lib/workspaceApi';
import { emptyWorkspace } from '../lib/emptyWorkspace';
import type { Profile } from '../lib/types';

export function LearningProvider({ children }: { children: ReactNode }) {
  const { session, loading: authLoading, error: authError } = useAuthSession();
  const [data, setData] = useState(emptyWorkspace);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [preview, setPreview] = useState(false);
  const [loadedUserId, setLoadedUserId] = useState<string | undefined>();
  const request = useRef(0);
  const userId = session?.user.id;
  const refresh = useCallback(async () => {
    const version = ++request.current;
    setLoading(true);
    setError('');
    try {
      if (!userId) {
        const { demoWorkspace } = await import('../data/workspace');
        if (version !== request.current) return;
        setProfile(null);
        setData(demoWorkspace());
        return;
      }
      const nextProfile = await loadProfile(userId);
      const workspace = nextProfile.approved ? await loadWorkspace(userId) : emptyWorkspace();
      if (version !== request.current) return;
      setProfile(nextProfile);
      setData(workspace);
    } catch (cause) {
      if (version !== request.current) return;
      setError(cause instanceof Error ? cause.message : 'Could not load your workspace.');
      setData(emptyWorkspace());
    } finally {
      if (version === request.current) {
        setLoading(false);
        setLoadedUserId(userId);
      }
    }
  }, [userId]);

  useEffect(() => {
    if (authLoading) return;
    setPreview(false);
    void refresh();
    return () => {
      request.current++;
    };
  }, [refresh, authLoading]);
  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(''), 5000);
    return () => window.clearTimeout(timer);
  }, [notice]);

  const exploreDemo = async () => {
    const version = ++request.current;
    setLoading(true);
    try {
      const { demoWorkspace } = await import('../data/workspace');
      if (version !== request.current) return;
      setPreview(true);
      setProfile(null);
      setData(demoWorkspace());
      setError('');
      setLoadedUserId(userId);
    } catch {
      if (version === request.current) setNotice('Could not load your workspace.');
    } finally {
      if (version === request.current) setLoading(false);
    }
  };
  return (
    <LearningContext.Provider
      value={{
        data,
        setData,
        session,
        profile,
        demo: !session || preview,
        loading: authLoading || loading || (!!userId && loadedUserId !== userId),
        error: error || authError,
        notice,
        setNotice,
        refresh,
        setProfile,
        exploreDemo,
      }}
    >
      {children}
    </LearningContext.Provider>
  );
}
