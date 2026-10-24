import { useI18n } from '../lib/i18n';
import { useState } from 'react';
import { Card } from './Card';
import { Icon } from './Icon';
import { useLearning } from '../lib/learningContext';
import { saveContent, removeContent } from '../lib/tutorApi';
import type { ReadingQuestion } from '../lib/types';

export function TutorReadingQuestions({ passageId, onClose }: { passageId: string; onClose: () => void }) {
  const { t } = useI18n();
  const { data, session, refresh, setNotice } = useLearning();
  const passage = data.passages.find((p) => p.id === passageId);
  const [editing, setEditing] = useState<ReadingQuestion | null>(null);
  const [prompt, setPrompt] = useState('');
  const [options, setOptions] = useState('');
  const [answer, setAnswer] = useState('');
  const [explanation, setExplanation] = useState('');
  const [explanationDe, setExplanationDe] = useState('');
  const [explanationRu, setExplanationRu] = useState('');
  const [explanationKk, setExplanationKk] = useState('');
  const [busy, setBusy] = useState(false);
  function edit(question: ReadingQuestion) {
    setEditing(question);
    setPrompt(question.prompt);
    setOptions(question.options.join('\n'));
    setAnswer(question.answer);
    setExplanation(question.explanation);
    setExplanationDe(question.explanation_de ?? '');
    setExplanationRu(question.explanation_ru ?? '');
    setExplanationKk(question.explanation_kk ?? '');
  }
  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!session) return;
    setBusy(true);
    try {
      const choices = options
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean);
      if (choices.length && (choices.length < 2 || !choices.includes(answer)))
        throw new Error('Add at least two options. The answer must match one of them exactly.');
      await saveContent(
        'reading_questions',
        editing?.id,
        {
          passage_id: passageId,
          prompt,
          options: choices,
          answer,
          explanation,
          explanation_de: explanationDe,
          explanation_ru: explanationRu,
          explanation_kk: explanationKk,
        },
        session.user.id,
      );
      await refresh();
      setEditing(null);
      setPrompt('');
      setOptions('');
      setAnswer('');
      setExplanation('');
      setExplanationDe('');
      setExplanationRu('');
      setExplanationKk('');
      setNotice(t('Reading question saved.'));
    } catch (cause) {
      setNotice(cause instanceof Error ? cause.message : 'Could not save question.');
    } finally {
      setBusy(false);
    }
  }
  async function remove(id: string) {
    if (!window.confirm(t('Delete this comprehension question?'))) return;
    try {
      await removeContent('reading_questions', id);
      await refresh();
    } catch (cause) {
      setNotice(cause instanceof Error ? cause.message : 'Could not delete question.');
    }
  }
  return (
    <div className="stack">
      <Card
        title={`${passage?.title} · Questions`}
        action={
          <button className="secondary" onClick={onClose}>
            {t('Back to passages')}
          </button>
        }
      >
        <div className="tutor-list">
          {passage?.questions.map((question) => (
            <div className="tutor-row" key={question.id}>
              <h3>{question.prompt}</h3>
              <div className="button-row">
                <button className="secondary" onClick={() => edit(question)}>
                  {t('Edit')}
                </button>
                <button className="danger" onClick={() => void remove(question.id)}>
                  {t('Delete')}
                </button>
              </div>
            </div>
          ))}
        </div>
      </Card>
      <Card title={editing ? t('Edit question') : t('Add comprehension question')}>
        <form className="form" onSubmit={(event) => void submit(event)}>
          <label className="field">
            {t('Question')}
            <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} required />
          </label>
          <label className="field">
            {t('Options, one per line (empty for a tutor-reviewed written answer)')}
            <textarea value={options} onChange={(e) => setOptions(e.target.value)} />
          </label>
          <label className="field">
            {t('Correct or model answer')}
            <input value={answer} onChange={(e) => setAnswer(e.target.value)} required />
          </label>
          <label className="field">
            {t('Explanation')}
            <textarea value={explanation} onChange={(e) => setExplanation(e.target.value)} required />
          </label>
          <label className="field">
            {t('German explanation (optional)')}
            <textarea value={explanationDe} onChange={(event) => setExplanationDe(event.target.value)} />
          </label>
          <label className="field">
            {t('Russian explanation (optional)')}
            <textarea value={explanationRu} onChange={(event) => setExplanationRu(event.target.value)} />
          </label>
          <label className="field">
            {t('Kazakh explanation (optional)')}
            <textarea value={explanationKk} onChange={(event) => setExplanationKk(event.target.value)} />
          </label>
          <button disabled={busy}>
            <Icon name="save" size={16} />
            {t('Save question')}
          </button>
        </form>
      </Card>
    </div>
  );
}
