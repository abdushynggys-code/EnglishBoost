import { useI18n } from "../lib/i18n";
import { useEffect, useState } from "react";
import { Card } from "./Card";
import { SubmissionReview } from "./SubmissionReview";
import { CommunicationReview } from "./CommunicationReview";
import { loadStudents } from "../lib/tutorApi";
import { loadWorkspace } from "../lib/workspaceApi";
import type { Profile, Workspace } from "../lib/types";
import { useLiveSync } from "../lib/liveSync";
import { useLearning } from "../lib/learningContext";

export function TutorReviews() {
  const { t, preferences } = useI18n();
  const { session, preview } = useLearning();
  const [students, setStudents] = useState<Profile[]>([]);
  const [selected, setSelected] = useState("");
  const [data, setData] = useState<Workspace | null>(null);
  const [error, setError] = useState("");
  useLiveSync(session?.user.id, preview, ["tutor_students", "homework_submissions", "writing_submissions", "tutor_feedback"], async () => {
    try {
      const people = await loadStudents();
      setStudents(people);
      if (selected && people.some((person) => person.id === selected)) setData(await loadWorkspace(selected));
      else setSelected(people[0]?.id ?? "");
    } catch {
      setError("Could not load student work.");
    }
  });
  useEffect(() => {
    void loadStudents()
      .then((people) => {
        setStudents(people);
        setSelected(people[0]?.id ?? "");
      })
      .catch((cause) => setError(cause instanceof Error ? cause.message : "Could not load students."));
  }, []);
  useEffect(() => {
    let active = true;
    setData(null);
    setError("");
    if (selected)
      void loadWorkspace(selected)
        .then((workspace) => {
          if (active) setData(workspace);
        })
        .catch((cause) => {
          if (active) setError(cause instanceof Error ? cause.message : "Could not load student work.");
        });
    return () => {
      active = false;
    };
  }, [selected]);
  async function reload() {
    if (selected) setData(await loadWorkspace(selected));
  }
  return (
    <div className="stack">
      <Card title={t("Student work")}>
        <label className="field">
          {t("Choose a student")}
          <select value={selected} onChange={(e) => setSelected(e.target.value)}>
            <option value="">{t("Select student")}</option>
            {students.map((s) => (
              <option value={s.id} key={s.id}>
                {s.full_name || s.email}
              </option>
            ))}
          </select>
        </label>
        {error && (
          <p role="alert" className="message">
            {error}
          </p>
        )}
        {!students.length && <p className="spaced">{t("Approve a student to begin reviewing their work.")}</p>}
      </Card>
      {data && (
        <>
          {data.conciseAttempts.map((attempt) => (
            <CommunicationReview key={attempt.id} attempt={attempt} onSaved={reload} />
          ))}
          {data.drafts
            .filter((d) => d.submitted)
            .map((draft) => (
              <SubmissionReview
                key={draft.id}
                studentId={selected}
                submissionId={draft.id}
                kind="writing"
                title={data.writing.find((w) => w.id === draft.assignment_id)?.title ?? "Writing assignment"}
                body={draft.body}
                feedback={data.feedback.find(
                  (f) => f.submission_id === draft.id && f.kind === "writing" && new Date(f.created_at) >= new Date(draft.updated_at),
                )}
                onSaved={reload}
              />
            ))}
          {data.submissions.map((submission) => (
            <SubmissionReview
              key={submission.id}
              studentId={selected}
              submissionId={submission.id}
              kind="homework"
              title={data.homework.find((h) => h.id === submission.homework_id)?.title ?? "Homework"}
              body={submission.body}
              feedback={data.feedback.find(
                (f) => f.submission_id === submission.id && f.kind === "homework" && new Date(f.created_at) >= new Date(submission.submitted_at),
              )}
              onSaved={reload}
            />
          ))}
          {!data.drafts.some((d) => d.submitted) && !data.submissions.length && (
            <Card>
              <p>{t("No writing or homework submissions yet.")}</p>
            </Card>
          )}
          <Card title={t("Recent practice answers")}>
            <div className="tutor-list">
              {data.attempts.slice(0, 10).map((attempt) => (
                <details className="tutor-row" key={attempt.id}>
                  <summary>
                    {attempt.title} · {attempt.score}/{attempt.total} · {new Date(attempt.created_at).toLocaleDateString(preferences.language)}
                  </summary>
                  <div className="spaced">
                    {attempt.answers.map((answer) => (
                      <div className="topic-label" key={answer.question_id}>
                        <span>
                          {answer.topic}: {answer.response}
                        </span>
                        <span>
                          {answer.correct
                            ? t("Correct")
                            : attempt.kind === "reading" &&
                                data.passages.some((p) => p.questions.some((q) => q.id === answer.question_id && !q.options.length))
                              ? t("Written answer · review")
                              : t("Needs practice")}
                        </span>
                      </div>
                    ))}
                  </div>
                </details>
              ))}
              {!data.attempts.length && <p>{t("No practice attempts yet.")}</p>}
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
