import { useState } from "react";
import { Link } from "wouter";
import { Icon } from "../Icon";
import { useI18n } from "../../lib/i18n";
import { signInPath } from "../../lib/authNavigation";
const samples = [
  { options: ["learn", "learned", "learning"], answer: "learned", feedback: "You got it. Yesterday takes the past tense." },
  {
    options: ["Platform 4", "Platform 2", "10:30"],
    answer: "Platform 4",
    feedback: "Exactly. The departure time stayed the same; the platform changed.",
  },
  { options: ["reliable", "curious", "crowded"], answer: "reliable", feedback: "Right. A reliable person does what they promise." },
];
export function FirstWin() {
  const { t } = useI18n();
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const sample = samples[index];
  const answer = answers[index] ?? "";
  const correct = answer === sample.answer;
  return (
    <section className={`first-win ${correct ? "is-correct" : ""}`} aria-labelledby="first-win-title">
      <div className="first-win-top">
        <span>{t("A TASTE OF YOUR COURSE")}</span>
        <span>
          <Icon name="clock" size={14} />
          {t("20 seconds")}
        </span>
      </div>
      <span className="first-win-sticker">{t("Try this one")}</span>
      <div className="first-win-progress" role="group" aria-label={t("Mini lessons")}>
        {samples.map((item, i) => (
          <button
            key={i}
            className={i === index ? "current" : answers[i] === item.answer ? "complete" : ""}
            aria-label={`${t("Mini lesson")} ${i + 1}`}
            aria-pressed={i === index}
            onClick={() => setIndex(i)}
          >
            {answers[i] === item.answer ? <Icon name="check" size={12} /> : i + 1}
          </button>
        ))}
      </div>
      <p className="first-win-instruction">{t(index === 1 ? "Read the notice. Choose the useful detail." : "Choose the missing word.")}</p>
      {index === 1 && (
        <p className="mini-notice" lang="en">
          The 10:30 train now departs from platform 4 instead of platform 2. Your ticket is still valid.
        </p>
      )}
      <h2 id="first-win-title" lang="en">
        {index === 0 ? (
          <>
            Yesterday, I <span>{correct ? "learned" : "___"}</span> a new word.
          </>
        ) : index === 1 ? (
          "Which platform should you use?"
        ) : (
          <>
            Maya arrives on time and keeps her promises. She is <span>{correct ? "reliable" : "___"}</span>.
          </>
        )}
      </h2>
      <div className="first-win-options" role="group" aria-label={t("Answer options")}>
        {sample.options.map((word) => (
          <button
            key={word}
            lang="en"
            aria-pressed={answer === word}
            className={answer === word ? (correct ? "right" : "try-again") : ""}
            onClick={() => setAnswers({ ...answers, [index]: word })}
          >
            {word}
            {answer === word && <Icon name={correct ? "check" : "retry"} size={16} />}
          </button>
        ))}
      </div>
      <div className="first-win-feedback" role="status" aria-live="polite">
        {answer ? (
          <>
            <Icon name={correct ? "success" : "help"} size={19} />
            <span>
              {t(
                correct
                  ? sample.feedback
                  : index === 0
                    ? "Think about when it happened. Have another go."
                    : "Look for the detail that supports your answer. Try again.",
              )}
            </span>
          </>
        ) : (
          <span>{t("No timer. Give it a go.")}</span>
        )}
      </div>
      {correct && (
        <div className="first-win-bottom">
          {index < samples.length - 1 && (
            <button className="text-button" onClick={() => setIndex(index + 1)}>
              {t("Try the next mini lesson")}
              <Icon name="arrow" size={16} />
            </button>
          )}
          <Link href={signInPath()} className="first-win-continue">
            {t("Make the next one yours")}
            <Icon name="arrow" size={16} />
          </Link>
        </div>
      )}
    </section>
  );
}
