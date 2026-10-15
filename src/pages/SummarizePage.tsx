import { useState } from 'react';
import { Link, useLocation, useSearch } from 'wouter';
import { PageHeading } from '../components/PageHeading';
import { SummaryWriter } from '../components/SummaryWriter';
import { RelevanceChallenge } from '../components/RelevanceChallenge';
import { ResponseStyleChallenge } from '../components/ResponseStyleChallenge';
import { Icon } from '../components/Icon';
import { useI18n } from '../lib/i18n';
import { useLearning } from '../lib/learningContext';
import { summaryModes, suggestedPractice } from '../lib/summary';
import { summaryScenarios } from '../data/summaryScenarios';

export function SummarizePage() {
  const { t } = useI18n();
  const { data } = useLearning();
  const [, navigate] = useLocation();
  const params = new URLSearchParams(useSearch());
  const mode = summaryModes.find((m) => m.id === params.get('mode'));
  const recommendation = suggestedPractice(data.conciseAttempts);
  const [level, setLevel] = useState(recommendation.level);
  const [scenarioId, setScenarioId] = useState(params.get('scenario') ?? '');
  const options = summaryScenarios.filter((scenario) => scenario.level === level);
  const scenario = summaryScenarios.find((s) => s.id === scenarioId) ?? options[0] ?? summaryScenarios[0];
  const homeworkId = data.homework.some((h) => h.id === params.get('homework')) ? params.get('homework') : null;
  const suffix = homeworkId ? `?homework=${homeworkId}` : '';
  const onAgain = () => navigate(`/summarize${suffix}`);
  return (
    <>
      <PageHeading
        eyebrow={t('Clear writing & summarizing')}
        title={t(mode?.title ?? 'Get to the Point!')}
        description={t(mode?.description ?? 'Sometimes a summary helps. Sometimes the full story matters.')}
      />
      {mode ? (
        <>
          <Link href={`/summarize${suffix}`} className="back-link">
            <Icon name="back" size={16} />
            {t('Back to challenges')}
          </Link>
          {mode.id !== 'styles' && (
            <div className="summary-filters">
              <label className="field">
                {t('Choose a challenge')}
                <select
                  value={level}
                  onChange={(event) => {
                    setLevel(Number(event.target.value));
                    setScenarioId('');
                  }}
                >
                  <option value={1}>{t('Everyday answers')}</option>
                  <option value={2}>{t('Retelling & explaining')}</option>
                  <option value={3}>{t('Opinions & evidence')}</option>
                </select>
              </label>
              <label className="field">
                {t('Practice')}
                <select value={scenario.id} onChange={(event) => setScenarioId(event.target.value)}>
                  {options.map((s) => (
                    <option key={s.id} value={s.id}>
                      {t(s.title)}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          )}
          {mode.id === 'styles' ? (
            <ResponseStyleChallenge onAgain={onAgain} homeworkId={homeworkId} />
          ) : mode.id === 'relevance' ? (
            <RelevanceChallenge key={scenario.id} scenario={scenario} onAgain={onAgain} homeworkId={homeworkId} />
          ) : (
            <SummaryWriter
              key={`${mode.id}-${scenario.id}`}
              mode={mode.id}
              scenario={scenario}
              onAgain={onAgain}
              homeworkId={homeworkId}
            />
          )}
        </>
      ) : (
        <>
          <div className="summary-recommendation">
            <Icon name="sparkles" size={20} />
            <div>
              <strong>
                {t('Suggested next step')}: {t(summaryModes.find((m) => m.id === recommendation.mode)!.title)}
              </strong>
              <p>{t('Based on your saved practice, not an English level test.')}</p>
            </div>
          </div>
          <div className="summary-mode-grid">
            {summaryModes.map((item, index) => (
              <Link
                key={item.id}
                href={`/summarize?mode=${item.id}${homeworkId ? `&homework=${homeworkId}` : ''}`}
                className="summary-mode-card"
              >
                <span>{index + 1}</span>
                <div>
                  <h2>{t(item.title)}</h2>
                  <p>{t(item.description)}</p>
                </div>
                <Icon name="arrow" size={17} />
              </Link>
            ))}
          </div>
        </>
      )}
    </>
  );
}
