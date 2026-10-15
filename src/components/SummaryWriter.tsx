import { SummaryReflection } from './SummaryReflection';
import { useState } from 'react';
import { Card } from './Card';
import { Icon } from './Icon';
import { SummarySupport } from './SummarySupport';
import { SummaryResult } from './SummaryResult';
import { useI18n } from '../lib/i18n';
import { useConciseSave } from '../lib/useConciseSave';
import { sentenceCount } from '../lib/summary';
import { countWords } from '../lib/writing';
import type { ConciseAttempt, Reflection, SummaryMode, SummaryScenario } from '../lib/summaryTypes';
import { conversationPrompts } from '../data/summaryScenarios';

export function SummaryWriter({
  mode,
  scenario,
  onAgain,
  homeworkId = null,
  onComplete,
}: {
  mode: SummaryMode;
  scenario: SummaryScenario;
  onAgain: () => void;
  homeworkId?: string | null;
  onComplete?: (attempt: ConciseAttempt) => Promise<boolean>;
}) {
  const { t } = useI18n();
  const save = useConciseSave();
  const [original, setOriginal] = useState(mode === 'conversation' ? '' : scenario.original);
  const [question, setQuestion] = useState(mode === 'conversation' ? conversationPrompts[0] : scenario.question);
  const [improved, setImproved] = useState('');
  const [editing, setEditing] = useState(mode !== 'conversation');
  const [target, setTarget] = useState(Math.min(3, scenario.level));
  const [reflection, setReflection] = useState<Reflection>({ main_idea: false, meaning: false, relevant: false });
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<ConciseAttempt | null>(null);
  const [id] = useState(() => crypto.randomUUID());
  async function finish() {
    setBusy(true);
    const attempt: ConciseAttempt = {
      id,
      mode,
      scenario_id: scenario.id,
      prompt: question,
      level: scenario.level,
      original,
      improved: improved.trim(),
      selected_details: [],
      style_answers: {},
      reflection,
      objective_correct: 0,
      objective_total: 0,
      points: Number(reflection.meaning) * 2 + Number(reflection.main_idea) + Number(reflection.relevant),
      source: onComplete ? 'classroom' : homeworkId ? 'homework' : 'practice',
      homework_id: homeworkId,
      created_at: new Date().toISOString(),
    };
    const saved = await save(attempt);
    if (saved && (!onComplete || (await onComplete(attempt)))) setResult(attempt);
    setBusy(false);
  }
  if (result) return <SummaryResult attempt={result} onAgain={onAgain} />;
  return (
    <div className="summary-workspace">
      <div className="stack">
        <Card>
          {mode === 'conversation' && (
            <label className="field">
              {t('Question for you')}
              <select
                value={question}
                onChange={(event) => {
                  setQuestion(event.target.value);
                  setEditing(false);
                  setOriginal('');
                  setImproved('');
                }}
              >
                {conversationPrompts.map((prompt) => (
                  <option key={prompt}>{prompt}</option>
                ))}
              </select>
            </label>
          )}
          <h2 className="english-prompt" lang="en">
            {question}
          </h2>
          {mode === 'conversation' ? (
            <label className="field">
              {t('Your first answer')}
              <textarea
                rows={4}
                value={original}
                onChange={(event) => setOriginal(event.target.value)}
                readOnly={editing}
                maxLength={6000}
                placeholder={t('Write your answer in English…')}
              />
            </label>
          ) : (
            <>
              <p className="eyebrow">{t('A detailed version')}</p>
              <blockquote className="original-answer" lang="en">
                {scenario.original}
              </blockquote>
            </>
          )}
          {!editing && (
            <button className="spaced" disabled={!original.trim()} onClick={() => setEditing(true)}>
              {t('Now make it clearer')}
              <Icon name="arrow" size={16} />
            </button>
          )}
        </Card>
        {editing && (
          <Card>
            {mode === 'sentences' && (
              <label className="field summary-guide-select">
                {t('Sentence guide')}
                <select value={target} onChange={(event) => setTarget(Number(event.target.value))}>
                  {[1, 2, 3].map((n) => (
                    <option key={n} value={n}>
                      {t(n === 1 ? t('one sentence') : n === 2 ? t('up to two sentences') : t('up to three sentences'))}
                    </option>
                  ))}
                </select>
              </label>
            )}
            <label className="field">
              {t('Your clearer answer')}
              <textarea
                lang="en"
                rows={6}
                value={improved}
                onChange={(event) => setImproved(event.target.value)}
                maxLength={6000}
                placeholder={t('Write your answer in English…')}
              />
            </label>
            <p className="word-counter">
              {countWords(improved)} {t('words')} · {sentenceCount(improved)} {t('sentences')}
            </p>
            <SummaryReflection value={reflection} onChange={setReflection} />
            <button className="spaced" disabled={!improved.trim() || busy} onClick={() => void finish()}>
              {t(busy ? t('Saving…') : t('Save my practice'))}
              <Icon name="check" size={16} />
            </button>
          </Card>
        )}
      </div>
      <SummarySupport mode={mode} scenario={scenario} target={target} improved={improved} editing={editing} />
    </div>
  );
}
