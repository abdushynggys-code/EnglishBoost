import { createContext, useContext } from 'react';
import type { Session } from '@supabase/supabase-js';
import type { Dispatch, SetStateAction } from 'react';
import type { Profile, Workspace } from './types';

export type LearningState = {
  data: Workspace;
  setData: Dispatch<SetStateAction<Workspace>>;
  session: Session | null;
  profile: Profile | null;
  demo: boolean;
  loading: boolean;
  error: string;
  notice: string;
  setNotice: (message: string) => void;
  setProfile: Dispatch<SetStateAction<Profile | null>>;
  refresh: () => Promise<void>;
  exploreDemo: () => void;
};
export const LearningContext = createContext<LearningState | null>(null);

export function useLearning() {
  const context = useContext(LearningContext);
  if (!context) throw new Error('LearningProvider is missing');
  return context;
}
