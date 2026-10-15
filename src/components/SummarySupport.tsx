import { Card } from './Card';
import { useI18n } from '../lib/i18n';
import { summaryReminders } from '../lib/summary';
import type { SummaryMode, SummaryScenario } from '../lib/summaryTypes';
export function SummarySupport({
  mode,
  scenario,
  target,
  improved,
  editing,
}: {
  mode: SummaryMode;
  scenario: SummaryScenario;
  target: number;
  improved: string;
  editing: boolean;
}) {
  const { t } = useI18n();
  return (
    <aside className="stack summary-support">
      <Card title={t('Main idea first')}>
        <ol className="summary-steps">
          <li>{t('Sentence 1: answer the question.')}</li>
          {(mode !== 'sentences' || target >= 2) && <li>{t('Sentence 2: add one important detail.')}</li>}
          {(mode !== 'sentences' || target >= 3) && (
            <li>{t('Sentence 3: add a reason, feeling, or example if needed.')}</li>
          )}
        </ol>
        <p className="preference-hint spaced">{t('A shorter answer can already be complete.')}</p>
      </Card>
      {editing && (
        <Card title={t('A little guidance')}>
          <ul className="summary-hints">
            {summaryReminders(improved).map((hint) => (
              <li key={hint}>{t(hint)}</li>
            ))}
          </ul>
          <p className="preference-hint spaced">
            {t('These reminders do not automatically judge the meaning of your answer.')}
          </p>
        </Card>
      )}
      {mode !== 'conversation' && (
        <details className="card">
          <summary>{t('Possible answers')}</summary>
          {scenario.models.map((model) => (
            <p className="model-answer" key={model} lang="en">
              {model}
            </p>
          ))}
          <p className="preference-hint">{t('Different answers can work. Keep your own meaning.')}</p>
        </details>
      )}
    </aside>
  );
}
