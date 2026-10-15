import { useState } from 'react';
import { Card } from './Card';
import { SummaryResult } from './SummaryResult';
import { useI18n } from '../lib/i18n';
import { useConciseSave } from '../lib/useConciseSave';
import { styleQuestions } from '../data/summaryScenarios';
import type { ConciseAttempt, ResponseStyle } from '../lib/summaryTypes';

const styles: Record<ResponseStyle, string> = {
  impression: 'General impression or feeling',
  activities: 'Main activities',
  reason: 'A reason',
  sequence: 'A detailed sequence',
};
export function ResponseStyleChallenge({ onAgain, homeworkId }: { onAgain: () => void; homeworkId: string | null }) {
  const { t } = useI18n();
  const save = useConciseSave();
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [checked, setChecked] = useState(false);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<ConciseAttempt | null>(null);
  const [id] = useState(() => crypto.randomUUID());
  async function finish() {
    setBusy(true);
    const correct = styleQuestions.filter((q) => answers[q.id] === q.style).length;
    const attempt: ConciseAttempt = {
      id,
      mode: 'styles',
      scenario_id: 'styles',
      prompt: 'What does the question need?',
      level: 1,
      original: '',
      improved: '',
      selected_details: [],
      style_answers: answers,
      reflection: {},
      objective_correct: correct,
      objective_total: styleQuestions.length,
      points: correct,
      source: homeworkId ? 'homework' : 'practice',
      homework_id: homeworkId,
      created_at: new Date().toISOString(),
    };
    if (await save(attempt)) setResult(attempt);
    setBusy(false);
  }
  if (result) return <SummaryResult attempt={result} onAgain={onAgain} />;
  return (
    <Card title={t('What does the question need?')}>
      <p>{t('A full story fits when the listener asks for every step.')}</p>
      <div className="style-questions">
        {styleQuestions.map((question) => (
          <label className="field" key={question.id}>
            <span lang="en">{question.question}</span>
            <select
              value={answers[question.id] ?? ''}
              disabled={checked}
              onChange={(event) => setAnswers({ ...answers, [question.id]: event.target.value })}
            >
              <option value="">{t('Choose a response style')}</option>
              {(Object.keys(styles) as ResponseStyle[]).map((style) => (
                <option value={style} key={style}>
                  {t(styles[style])}
                </option>
              ))}
            </select>
            {checked && (
              <small className={answers[question.id] === question.style ? 'green-text' : 'orange-text'}>
                {t('Correct answer:')} {t(styles[question.style])}
              </small>
            )}
          </label>
        ))}
      </div>
      <button
        disabled={
          busy ||
          Object.keys(answers).length !== styleQuestions.length ||
          Object.values(answers).some((value) => !value)
        }
        onClick={() => (checked ? void finish() : setChecked(true))}
      >
        {t(checked ? t('Save my practice') : t('Check my choices'))}
      </button>
    </Card>
  );
}
