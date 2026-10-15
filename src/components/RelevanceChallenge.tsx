import { useState } from 'react';
import { Card } from './Card';
import { SummaryResult } from './SummaryResult';
import { useI18n } from '../lib/i18n';
import { useConciseSave } from '../lib/useConciseSave';
import type { ConciseAttempt, SummaryScenario } from '../lib/summaryTypes';

export function RelevanceChallenge({
  scenario,
  onAgain,
  homeworkId,
}: {
  scenario: SummaryScenario;
  onAgain: () => void;
  homeworkId: string | null;
}) {
  const { t } = useI18n();
  const save = useConciseSave();
  const [selected, setSelected] = useState<string[]>([]);
  const [checked, setChecked] = useState(false);
  const [result, setResult] = useState<ConciseAttempt | null>(null);
  const [busy, setBusy] = useState(false);
  const [id] = useState(() => crypto.randomUUID());
  async function finish() {
    setBusy(true);
    const scored = scenario.details.filter((detail) => detail.relevant !== null);
    const correct = scored.filter((detail) => selected.includes(detail.id) === detail.relevant).length;
    const attempt: ConciseAttempt = {
      id,
      mode: 'relevance',
      scenario_id: scenario.id,
      prompt: scenario.question,
      level: scenario.level,
      original: scenario.original,
      improved: '',
      selected_details: selected,
      style_answers: {},
      reflection: {},
      objective_correct: correct,
      objective_total: scored.length,
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
    <Card className="relevance-challenge">
      <h2 className="english-prompt" lang="en">
        {scenario.question}
      </h2>
      <p>{t('Choose details that help your listener.')}</p>
      <div className="detail-choices">
        {scenario.details.map((detail) => (
          <div key={detail.id} className={`detail-choice ${checked && detail.relevant === true ? 'useful' : ''}`}>
            <label>
              <input
                type="checkbox"
                disabled={checked}
                checked={selected.includes(detail.id)}
                onChange={(event) =>
                  setSelected(
                    event.target.checked ? [...selected, detail.id] : selected.filter((id) => id !== detail.id),
                  )
                }
              />
              <span lang="en">{detail.text}</span>
            </label>
            {checked && (
              <div className="detail-explanation">
                <strong>
                  {t(
                    detail.relevant === null
                      ? t('It depends on the context')
                      : detail.relevant
                        ? t('Helpful detail')
                        : t('Usually leave this out'),
                  )}
                </strong>
                <p>{t(detail.explanation)}</p>
              </div>
            )}
          </div>
        ))}
      </div>
      <button disabled={busy} onClick={() => (checked ? void finish() : setChecked(true))}>
        {t(checked ? t('Save my practice') : t('Check my choices'))}
      </button>
    </Card>
  );
}
