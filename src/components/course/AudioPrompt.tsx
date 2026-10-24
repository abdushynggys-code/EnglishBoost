import { useEffect, useState } from 'react';
import { useI18n } from '../../lib/i18n';
import { Icon } from '../Icon';

export function AudioPrompt({ text, onReveal, onPlayed }: { text: string; onReveal?: () => void; onPlayed?: () => void }) {
  const { t } = useI18n();
  const [revealed, setRevealed] = useState(false);
  const [played, setPlayed] = useState(false);
  const [failed, setFailed] = useState(false);
  const supported = 'speechSynthesis' in window;
  useEffect(() => () => { if (supported) window.speechSynthesis.cancel(); }, [text, supported]);
  function play() {
    setFailed(false);
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = 'en-GB'; speech.rate = 0.85;
    speech.onend = () => { setPlayed(true); onPlayed?.(); };
    speech.onerror = () => { setFailed(true); onReveal?.(); };
    window.speechSynthesis.cancel(); window.speechSynthesis.speak(speech);
  }
  return <div className="course-audio">
    <button type="button" className="secondary" onClick={play} disabled={!supported}><Icon name="volume" size={18} />{t(played ? 'Play again' : 'Play audio')}</button>
    <p>{t('Audio uses your browser’s English voice.')}</p>
    {(!supported || failed) && <p role="status">{t('Audio is unavailable. You can read the transcript; listening will stay unassessed.')}</p>}
    <button type="button" className="text-button" onClick={() => { setRevealed(!revealed); if (!revealed) onReveal?.(); }}>{t(revealed ? 'Hide transcript' : 'Show transcript')}</button>
    {revealed && <><p className="course-passage" lang="en">{text}</p>{onReveal && <p>{t('Transcript-assisted practice does not assess listening.')}</p>}</>}
  </div>;
}
