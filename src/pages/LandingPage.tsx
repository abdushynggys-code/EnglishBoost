import { useEffect } from 'react';
import { Link } from 'wouter';
import { ProductBrand } from '../components/welcome/ProductBrand';
import { PublicLanguagePicker } from '../components/welcome/PublicLanguagePicker';
import { FirstWin } from '../components/welcome/FirstWin';
import { Icon } from '../components/Icon';
import { useI18n } from '../lib/i18n';
import { signInPath } from '../lib/authNavigation';

export function LandingPage() {
  const { t } = useI18n();
  useEffect(() => { document.title = 'EnglishBoost · ' + t('English for the things you want to say.'); }, [t]);
  return <div className="welcome-page">
    <header className="welcome-nav"><ProductBrand /><div><PublicLanguagePicker /><Link className="welcome-sign-in" href={signInPath()}>{t('Sign in')}<Icon name="arrow" size={16} /></Link></div></header>
    <main className="welcome-main" id="welcome-main">
      <div className="welcome-copy">
        <p className="welcome-eyebrow"><span />{t('A LITTLE ENGLISH, EVERY DAY')}</p>
        <h1>{t('English for the things you want to say.')}<span className="welcome-underline" aria-hidden="true" /></h1>
        <p className="welcome-description">{t('Find your level. Learn something useful. Come back tomorrow knowing exactly what to do next.')}</p>
        <div className="welcome-actions"><Link href={signInPath()} className="button welcome-primary">{t('Build my learning plan')}<Icon name="arrow" size={19} /></Link><a href="#welcome-details" className="welcome-demo">{t('See how learning works')}</a></div>
        <p className="welcome-small"><Icon name="clock" size={16} />{t('Short lessons. Your pace, always.')}</p>
      </div>
      <FirstWin />
    </main>
    <section className="welcome-how" aria-label={t('How it works')}>
      {[['01','Find your starting point','A short check that meets you where you are.'],['02','Learn one useful thing','Words, stories, listening, and a little practice.'],['03','Keep the good habit','Your next lesson is ready when you are.']].map(([number,title,description]) => <div key={number}><span>{number}</span><div><h2>{t(title)}</h2><p>{t(description)}</p></div></div>)}
    </section>
    <section id="welcome-details" className="welcome-details"><p className="eyebrow">{t('FROM FIRST WORDS TO YOUR OWN VOICE')}</p><h2>{t('A path you can actually follow.')}</h2><div>{[['Six connected levels','Start where you are, then build towards confident, precise English.'],['Practice that feels useful','Read notices, solve everyday problems, explain ideas and weigh evidence.'],['Your pace. Your choice.','Learn independently or join a tutor with a class code.']].map(([title,body])=><article key={title}><h3>{t(title)}</h3><p>{t(body)}</p></article>)}</div><Link className="button" href={signInPath()}>{t('Find my starting point')}<Icon name="arrow" size={18}/></Link></section>
    <footer className="welcome-footer"><span>EnglishBoost.</span><p>{t('A place to practise. Room to get better.')}</p><Link href={signInPath()}>{t('Let’s get started')} ↗</Link></footer>
  </div>;
}
