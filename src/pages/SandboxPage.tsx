import { useEffect, useRef } from "react";
import { useLocation, useSearch } from "wouter";
import { useLearning } from "../lib/learningContext";
import { useCourse } from "../lib/course/context";
import { usePlatform } from "../lib/platform";
import { courseLevels } from "../lib/course/levels";
import { buildLearningPath } from "../data/course/units";
import { PageLoading } from "../components/PageLoading";
import { DeveloperPage } from "./DeveloperPage";
export function SandboxPage() {
  const { state, loading, configureSandbox } = usePlatform();
  const { exploreDemo, preview, loading: workspaceLoading, setNotice } = useLearning();
  const { setSandboxState } = useCourse();
  const [, navigate] = useLocation();
  const search = useSearch();
  const started = useRef(false);
  useEffect(() => {
    if (loading || !state.developer || started.current) return;
    started.current = true;
    sessionStorage.setItem("englishboost-lab-mode", new URLSearchParams(search).get("mode") === "experimental" ? "experimental" : "demo");
    void exploreDemo(new URLSearchParams(search).get("role") === "tutor" ? "tutor" : "student").catch(() => setNotice("Developer access required"));
  }, [loading, state.developer, exploreDemo, setNotice]);
  useEffect(() => {
    if (!preview || workspaceLoading) return;
    const timer = window.setTimeout(() => {
      const params = new URLSearchParams(search);
      const level = courseLevels.find((l) => l === params.get("level")) ?? "A1";
      const lessons = buildLearningPath(level, "everyday", "sandbox").flatMap((unit) => unit.lessons);
      const count = params.get("scenario") === "finished" ? lessons.length : params.get("scenario") === "midway" ? 8 : 0;
      setSandboxState({
        placement: {
          id: "sandbox",
          created_at: new Date().toISOString(),
          level,
          settings: { daily_minutes: 10, interest: "everyday" },
          answers: [],
          writing_sample: "",
          speaking_practised: false,
          skill_levels: { grammar: level, vocabulary: level, reading: level, listening: level },
        },
        reviews: [],
        completions: lessons.slice(0, count).map((lesson) => ({
          lesson_id: lesson.id,
          completed_at: new Date().toISOString(),
          score: lesson.questions.length,
          total: lesson.questions.length,
          xp: lesson.kind === "checkpoint" ? 250 : 100,
          passed: true,
        })),
      });
      const number = (key: string, fallback: number, max: number) => {
        const value = Number(params.get(key) ?? fallback);
        return Number.isFinite(value) ? Math.max(0, Math.min(max, Math.floor(value))) : fallback;
      };
      const legend = params.get("legend") === "1";
      configureSandbox({ xp: number("xp", 20000, 1000000), coins: number("coins", 5000, 100000), equipped: legend ? "unknown" : "seed" }, legend);
      const destination = params.get("screen");
      navigate(["/course", "/shop", "/classroom", "/tutor", "/settings"].includes(destination ?? "") ? destination! : "/course", { replace: true });
    }, 0);
    return () => clearTimeout(timer);
  }, [preview, workspaceLoading]);
  if (!loading && !state.developer && !preview) return <DeveloperPage />;
  return <PageLoading />;
}
