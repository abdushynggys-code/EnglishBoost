import { sandboxProfile } from "../lib/sandboxFixtures";
import { supabase } from "../lib/supabase";
import { setSandboxMode } from "../lib/sandbox";
import { saveAccountIntent } from "../lib/accountIntent";
import { useCallback, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { LearningContext } from "../lib/learningContext";
import { useAuthSession } from "../lib/useAuthSession";
import { loadProfile, loadWorkspace } from "../lib/workspaceApi";
import { emptyWorkspace } from "../lib/emptyWorkspace";
import type { Profile } from "../lib/types";
import { useLiveSync } from "../lib/liveSync";

export function LearningProvider({ children }: { children: ReactNode }) {
  const { session, loading: authLoading, error: authError } = useAuthSession();
  const [data, setData] = useState(emptyWorkspace);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [preview, setPreview] = useState(false);
  const [loadedUserId, setLoadedUserId] = useState<string | undefined>();
  const request = useRef(0);
  const userId = session?.user.id;
  const load = useCallback(
    async (background = false) => {
      const version = ++request.current;
      if (!background) setLoading(true);
      setError("");
      try {
        if (!userId) {
          if (version !== request.current) return;
          setProfile(null);
          setData(emptyWorkspace());
          return;
        }
        if (session?.user) await saveAccountIntent(session.user);
        const nextProfile = await loadProfile(userId);
        const workspace = nextProfile.approved ? await loadWorkspace(userId) : emptyWorkspace();
        if (version !== request.current) return;
        setProfile(nextProfile);
        setData(workspace);
      } catch (cause) {
        if (version !== request.current) return;
        if (!background) {
          setError(cause instanceof Error ? cause.message : "Could not load your workspace.");
          setData(emptyWorkspace());
        }
      } finally {
        if (version === request.current) {
          setLoading(false);
          setLoadedUserId(userId);
        }
      }
    },
    [userId],
  );
  const refresh = useCallback(() => load(), [load]);
  useLiveSync(
    userId,
    preview || authLoading,
    [
      "homework_assignments",
      "homework_submissions",
      "tutor_feedback",
      "tutoring_sessions",
      "tutor_students",
      "class_members",
      "lessons",
      "quiz_questions",
      "vocabulary",
      "writing_assignments",
    ],
    () => load(true),
  );

  useEffect(() => {
    if (authLoading) return;
    setSandboxMode(false);
    setPreview(false);
    void refresh();
    return () => {
      request.current++;
    };
  }, [refresh, authLoading]);
  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(""), 5000);
    return () => window.clearTimeout(timer);
  }, [notice]);

  const exploreDemo = async (role: "student" | "tutor" = "student") => {
    if (!userId) throw new Error("Developer access required");
    const access = await supabase.from("developer_accounts").select("user_id").eq("user_id", userId).maybeSingle();
    if (access.error || !access.data) throw new Error("Developer access required");
    const version = ++request.current;
    setLoading(true);
    try {
      const { demoWorkspace } = await import("../data/workspace");
      if (version !== request.current) return;
      setSandboxMode(true);
      setPreview(true);
      setProfile(sandboxProfile(role));
      setData(demoWorkspace());
      setError("");
      setLoadedUserId(userId);
    } catch {
      if (version === request.current) setNotice("Could not load your workspace.");
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
        preview,
        loading: authLoading || loading || (!!userId && loadedUserId !== userId),
        error: error || authError,
        notice,
        setNotice,
        refresh,
        setProfile,
        exploreDemo,
        exitSandbox: async () => {
          setSandboxMode(false);
          setPreview(false);
          await refresh();
        },
      }}
    >
      {children}
    </LearningContext.Provider>
  );
}
