import { useI18n } from "../../lib/i18n";
export function CourseRoundBreak({ answered, total, onContinue }: { answered: number; total: number; onContinue: () => void }) {
  const { t } = useI18n();
  return (
    <section className="card course-round-break">
      <p className="eyebrow">{t("SMALL STEPS, REAL PROGRESS")}</p>
      <h2>{t("Round {round} complete", { round: answered / 10 })}</h2>
      <p>{t("{done} of {total} quick questions done. Take a breath, then keep going.", { done: answered, total })}</p>
      <progress aria-label={t("Lesson progress")} value={answered} max={total} />
      <button className="spaced" onClick={onContinue}>
        {t("Next round")} →
      </button>
    </section>
  );
}
