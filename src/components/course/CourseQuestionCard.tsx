import { normalizeAnswer } from "../../lib/course/scoring";
import { useState } from "react";
import type { CourseQuestion } from "../../lib/course/types";
import { useI18n } from "../../lib/i18n";
import { Icon } from "../Icon";
import { AudioPrompt } from "./AudioPrompt";

export function CourseQuestionCard({
  question,
  onAnswer,
  assessment = false,
}: {
  question: CourseQuestion;
  assessment?: boolean;
  onAnswer: (response: string, assisted: boolean, skipped: boolean) => void;
}) {
  const { t } = useI18n();
  const [response, setResponse] = useState("");
  const [assisted, setAssisted] = useState(false);
  const [listened, setListened] = useState(false);
  const usedHelp = assisted || (!!question.audio && !listened);
  const [checked, setChecked] = useState(false);
  const [tokens, setTokens] = useState<number[]>([]);
  const correct = normalizeAnswer(response) === normalizeAnswer(question.answer);
  function submit() {
    if (assessment) onAnswer(response, usedHelp, false);
    else setChecked(true);
  }
  return (
    <section className="course-question" data-question-id={question.id} aria-labelledby="course-prompt">
      {question.passage && (
        <p className="course-passage" lang="en">
          {question.passage}
        </p>
      )}
      {question.audio && (
        <AudioPrompt key={question.id} text={question.audio} onReveal={() => setAssisted(true)} onPlayed={() => setListened(true)} />
      )}
      {question.skill === "grammar" && question.prompt.includes("___") && <p className="eyebrow">{t("Complete the sentence.")}</p>}
      <h2 id="course-prompt" lang="en">
        {question.prompt}
      </h2>
      {question.type === "order" ? (
        <>
          <div className="sentence-answer" aria-live="polite">
            {tokens.map((index) => question.options[index]).join(" ") || t("Build the sentence")}
          </div>
          <div className="sentence-tokens">
            {question.options.map((token, index) => (
              <button
                key={index}
                className="secondary"
                disabled={checked || tokens.includes(index)}
                onClick={() => {
                  const next = [...tokens, index];
                  setTokens(next);
                  setResponse(next.map((i) => question.options[i]).join(" "));
                }}
              >
                {token}
              </button>
            ))}
          </div>
          <button
            className="text-button"
            disabled={checked}
            onClick={() => {
              setTokens([]);
              setResponse("");
            }}
          >
            {t("Start again")}
          </button>
        </>
      ) : question.type === "blank" ? (
        <label className="field">
          {t("Your answer")}
          <input lang="en" value={response} disabled={checked} autoComplete="off" onChange={(event) => setResponse(event.target.value)} />
        </label>
      ) : (
        <div className="course-options" role="radiogroup" aria-label={t("Answer options")}>
          {question.options.map((option) => (
            <button
              type="button"
              role="radio"
              aria-checked={response === option}
              key={option}
              disabled={checked}
              className={`course-option ${response === option ? "selected" : ""} ${checked && option === question.answer ? "answer-is-correct" : checked && response === option ? "answer-needs-review" : ""}`}
              onClick={() => setResponse(option)}
              lang="en"
            >
              {option}
              {checked && option === question.answer && <Icon name="check" size={18} />}
            </button>
          ))}
        </div>
      )}
      {checked && (
        <div className={`course-feedback ${correct ? "correct" : ""}`} role="status">
          <strong>{t(correct ? "Correct" : "Keep practising")}</strong>
          <p lang="en">{question.explanation}</p>
          {!correct && <p lang="en">{question.answer}</p>}
        </div>
      )}
      <div className="button-row spaced">
        <button disabled={!response.trim()} onClick={() => (checked ? onAnswer(response, usedHelp, false) : submit())}>
          {t(assessment ? "Continue" : checked ? "Continue" : "Check answer")}
        </button>
        {assessment && (
          <button className="ghost" onClick={() => onAnswer("", assisted, true)}>
            {t("I’m not sure · skip")}
          </button>
        )}
      </div>
    </section>
  );
}
