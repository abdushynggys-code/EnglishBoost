import { useEffect, useRef } from "react";
import { beginLesson } from "./api";
export function useLessonRun(lessonId: string, demo: boolean) {
  const runId = useRef<string>();
  useEffect(() => {
    let active = true;
    runId.current = undefined;
    if (!demo)
      void beginLesson(lessonId)
        .then((id) => {
          if (active) runId.current = id;
        })
        .catch(() => {
          /* Saving can continue without a timed bonus. */
        });
    return () => {
      active = false;
    };
  }, [demo, lessonId]);
  return runId;
}
