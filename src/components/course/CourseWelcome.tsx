import { Link } from 'wouter';
import { Icon } from '../Icon';
import { useI18n } from '../../lib/i18n';

export function CourseWelcome() {
  const { t } = useI18n();
  return <section className="card course-welcome">
    <span className="course-big-icon"><Icon name="target" size={36} /></span>
    <p className="eyebrow">{t('YOUR PERSONAL ENGLISH COURSE')}</p>
    <h1>{t('A path that starts with you.')}</h1>
    <p>{t('Find your starting level, then build your English in small daily lessons.')}</p>
    <div className="course-benefits">
      <div><Icon name="target" /><strong>{t('Four skills, one level check')}</strong><p>{t('Grammar, vocabulary, reading, and listening adapt as you answer.')}</p></div>
      <div><Icon name="book" /><strong>{t('Stories you can understand')}</strong><p>{t('Short texts, useful patterns, and real books to explore.')}</p></div>
      <div><Icon name="flame" /><strong>{t('Small steps that add up')}</strong><p>{t('Earn XP, build a streak, and revisit words before you forget them.')}</p></div>
    </div>
    <Link href="/placement" className="button">{t('Find your starting point')}<Icon name="arrow" size={17} /></Link>
    <p className="muted spaced">{t('Your starting level is an estimate, not a certificate.')}</p>
  </section>;
}
