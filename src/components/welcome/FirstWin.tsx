import { useState } from 'react';
import { Link } from 'wouter';
import { Icon } from '../Icon';
import { useI18n } from '../../lib/i18n';
import { signInPath } from '../../lib/authNavigation';

export function FirstWin() {
  const { t } = useI18n();
  const [answer, setAnswer] = useState('');
  const correct = answer === 'learned';
  return <section className={`first-win ${correct ? 'is-correct' : ''}`} aria-labelledby="first-win-title">
    <div className="first-win-top"><span>{t('YOUR FIRST LESSON')}</span><span><Icon name="clock" size={14} />{t('20 seconds')}</span></div>
    <span className="first-win-sticker">{t('Try this one')}</span>
    <p className="first-win-instruction">{t('Choose the missing word.')}</p>
    <h2 id="first-win-title" lang="en">Yesterday, I <span>{correct ? 'learned' : '___'}</span> a new word.</h2>
    <div className="first-win-options" role="group" aria-label={t('Answer options')}>
      {['learn', 'learned', 'learning'].map((word) => <button key={word} lang="en" aria-pressed={answer === word}
        className={answer === word ? (correct ? 'right' : 'try-again') : ''}
        onClick={() => setAnswer(word)}>{word}{answer === word && <Icon name={correct ? 'check' : 'retry'} size={16} />}</button>)}
    </div>
    <div className="first-win-feedback" role="status" aria-live="polite">
      {answer ? <><Icon name={correct ? 'success' : 'help'} size={19} /><span>{t(correct ? 'You got it. Yesterday takes the past tense.' : 'Think about when it happened. Have another go.')}</span></>
        : <span>{t('No timer. Give it a go.')}</span>}
    </div>
    {correct && <Link href={signInPath()} className="first-win-continue">{t('Make the next one yours')}<Icon name="arrow" size={16} /></Link>}
  </section>;
}
