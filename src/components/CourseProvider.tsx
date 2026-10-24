import { useCallback, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { useLearning } from "../lib/learningContext";
import { CourseContext } from "../lib/course/context";
import { emptyCourse, loadCourse, saveLesson, savePlacement } from "../lib/course/api";
import type { LessonCompletion, PlacementResult, ReviewCard } from "../lib/course/types";
import { useLiveSync } from "../lib/liveSync";

export function CourseProvider({ children }: { children: ReactNode }) {
  const { demo, preview, session, loading: workspaceLoading, setNotice } = useLearning();
  const [state, setState] = useState(emptyCourse);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [loadedUser, setLoadedUser] = useState<string | undefined>();
  const generation = useRef(0);
  const loaded = useRef(false);
  const userId = demo ? undefined : session?.user.id;
  const refresh = useCallback(async () => {
    const version = ++generation.current;
    setError("");
    if (!userId) {
      setLoading(false);
      return;
    }
    if (!loaded.current) setLoading(true);
    try {
      const next = await loadCourse(userId);
      if (version === generation.current) {
        loaded.current = true;
        setState(next);
      }
    } catch {
      if (version === generation.current) setError("Could not load your course. Please try again.");
    } finally {
      if (version === generation.current) {
        setLoading(false);
        setLoadedUser(userId);
      }
    }
  }, [userId]);
  useEffect(() => {
    if (preview) {
      setLoading(false);
      return;
    }
    loaded.current = false;
    setState(emptyCourse());
    if (!workspaceLoading) void refresh();
    return () => {
      generation.current++;
    };
  }, [userId, workspaceLoading, refresh, preview]);
  useLiveSync(userId, preview || workspaceLoading, ["course_completions", "course_profiles", "course_reviews"], refresh);
  async function place(result: PlacementResult) {
    const version = generation.current;
    try {
      if (!demo) await savePlacement(result);
      if (version !== generation.current) return false;
      setState({ placement: result, completions: [], reviews: [] });
      return true;
    } catch {
      setNotice("Could not save your course. Please try again.");
      return false;
    }
  }
  async function complete(completion: LessonCompletion, reviews: ReviewCard[]) {
    const version = generation.current;
    try {
      if (!demo) await saveLesson(completion, reviews);
      if (version !== generation.current) return false;
      setState((current) => {
        const attempts = (current.completions.find((old) => old.lesson_id === completion.lesson_id)?.attempts ?? 0) + 1;
        const existing = current.completions.find((old) => old.lesson_id === completion.lesson_id && old.passed);
        if (existing && !completion.lesson_id.startsWith("review:")) return current;
        const now = Date.now();
        const accepted = reviews.filter(
          (card) => !current.reviews.some((old) => old.item_id === card.item_id && new Date(old.due_at).getTime() > now),
        );
        return {
          ...current,
          completions: existing
            ? current.completions
            : [...current.completions.filter((old) => old.lesson_id !== completion.lesson_id), { ...completion, attempts }],
          reviews: [...current.reviews.filter((old) => !accepted.some((card) => card.item_id === old.item_id)), ...accepted],
        };
      });
      return true;
    } catch {
      setNotice("Could not save your course. Please try again.");
      return false;
    }
  }
  return (
    <CourseContext.Provider
      value={{
        state,
        loading: loading || workspaceLoading || (!!userId && loadedUser !== userId),
        error,
        refresh,
        setSandboxState: (next) => {
          if (preview && demo) {
            generation.current++;
            setState(next);
            setLoading(false);
          }
        },
        savePlacement: place,
        saveLesson: complete,
      }}
    >
      {children}
    </CourseContext.Provider>
  );
}
