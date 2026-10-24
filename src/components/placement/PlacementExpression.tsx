import { useState } from 'react';
import { useI18n } from '../../lib/i18n';
import { AudioPrompt } from '../course/AudioPrompt';

export function PlacementExpression({ busy, error, onSave }: {
  busy: boolean; error: boolean; onSave: (writing: string, speaking: boolean) => void;
}) {
  const { t } = useI18n();
  const [writing, setWriting] = useState('');
  const [speaking, setSpeaking] = useState(false);
  return <section className="card course-expression">
    <h1>{t('Make it your own')}</h1>
    <p>{t('These prompts are practice samples. They do not change your estimated level.')}</p>
    <label className="field spaced">{t('Write two or three sentences about your day and one thing you want to learn.')}<textarea rows={5} lang="en" maxLength={2000} placeholder="Today I… I want to learn…" value={writing} onChange={(event) => setWriting(event.target.value)} /></label>
    <h2 className="spaced">{t('Try speaking aloud')}</h2>
    <AudioPrompt text="I am learning English because I want to understand more people. A little practice every day helps me feel more confident." />
    <p>{t('Listen, then say the idea in your own words. Recording is not required.')}</p>
    <label className="course-confirm spaced"><input type="checkbox" checked={speaking} onChange={(event) => setSpeaking(event.target.checked)} />{t('I practised speaking aloud.')}</label>
    {error && <p className="message" role="alert">{t('Could not save your course. Please try again.')}</p>}
    <button className="spaced" disabled={busy} onClick={() => onSave(writing.trim(),speaking)}>{t(busy ? 'Saving…' : 'See my learning path')}</button>
    <p className="muted spaced">{t('You can leave the writing sample blank and practise later.')}</p>
  </section>;
}
