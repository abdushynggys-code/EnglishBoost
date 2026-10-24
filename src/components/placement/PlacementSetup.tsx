import { useState } from 'react';
import { useI18n } from '../../lib/i18n';
import type { CourseInterest, StudySettings } from '../../lib/course/types';
import { Icon } from '../Icon';

export function PlacementSetup({ retaking, onStart }: { retaking: boolean; onStart: (settings: StudySettings) => void }) {
  const { t } = useI18n();
  const [settings, setSettings] = useState<StudySettings>({daily_minutes:10,interest:'everyday'});
  const [confirmed, setConfirmed] = useState(false);
  const interests: CourseInterest[] = ['everyday','travel','stories','school'];
  return <section className="card course-setup">
    <span className="course-big-icon"><Icon name="target" size={32} /></span>
    <h1>{t('Find your starting point')}</h1>
    <p>{t('A short, adaptive check of grammar, vocabulary, reading, and listening. No timer. No pressure.')}</p>
    <p>{t('Writing and speaking prompts help you practise; they are not automatically graded.')}</p>
    <label className="field spaced">{t('Daily practice time')}<select value={settings.daily_minutes} onChange={(event) => setSettings({...settings,daily_minutes:Number(event.target.value) as 5|10|15})}>{[5,10,15].map((minutes) => <option key={minutes} value={minutes}>{minutes} {t('minutes')}</option>)}</select></label>
    <label className="field spaced">{t('What interests you?')}<select value={settings.interest} onChange={(event) => setSettings({...settings,interest:event.target.value as CourseInterest})}>{interests.map((interest) => <option key={interest} value={interest}>{t(interest)}</option>)}</select></label>
    {retaking && <label className="course-confirm spaced"><input type="checkbox" checked={confirmed} onChange={(event) => setConfirmed(event.target.checked)} /><span>{t('Saving a new level check will replace my course progress and XP.')}</span></label>}
    <button className="spaced" disabled={retaking && !confirmed} onClick={() => onStart(settings)}>{t('Start level check')}<Icon name="arrow" size={16} /></button>
    <p className="muted spaced">{t('Your starting level is an estimate, not a certificate.')}</p>
  </section>;
}
