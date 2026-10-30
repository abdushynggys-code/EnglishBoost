import { useEffect, useState } from 'react';
import { Card } from './Card';
import { Icon } from './Icon';
import { useI18n } from '../lib/i18n';
import { usePlatform } from '../lib/platform';
import { awardMonthlyBadge, loadBadgeCandidates } from '../lib/classBadges';
import type { BadgeCandidate } from '../lib/classBadges';

const currentMonth = () => new Date().toLocaleDateString('en-CA').slice(0, 7);

export function MonthlyBadgeAwards() {
  const { t } = useI18n();
  const { state } = usePlatform();
  const [classId, setClassId] = useState(state.classes[0]?.id ?? '');
  const [month, setMonth] = useState(currentMonth);
  const [people, setPeople] = useState<BadgeCandidate[]>([]);
  const [busy, setBusy] = useState('');
  const [error, setError] = useState('');
  const [celebrating, setCelebrating] = useState('');

  async function reload() {
    if (!classId) return;
    try {
      setPeople(await loadBadgeCandidates(classId, month));
      setError('');
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not load monthly badges.');
    }
  }
  useEffect(() => { void reload(); }, [classId, month]);

  async function award(person: BadgeCandidate) {
    setBusy(person.user_id);
    setError('');
    try {
      await awardMonthlyBadge(classId, person.user_id, month);
      setCelebrating(person.user_id);
      window.setTimeout(() => setCelebrating(''), 1800);
      await reload();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not award badge.');
    } finally {
      setBusy('');
    }
  }
  return (
    <Card title={t('Monthly achievement badges')}>
      <p>{t('Reward completed scored work. Unfinished and unsubmitted work is not included.')}</p>
      <div className="form-grid spaced">
        <label className="field">
          {t('Class')}
          <select value={classId} onChange={(event) => setClassId(event.target.value)}>
            {state.classes.map((room) => <option key={room.id} value={room.id}>{room.title}</option>)}
          </select>
        </label>
        <label className="field">
          {t('Month')}
          <input type="month" max={currentMonth()} value={month} onChange={(event) => setMonth(event.target.value)} />
        </label>
      </div>
      <div className="monthly-badge-list">
        {people.map((person) => {
          const wrong = person.answered_questions - person.correct_answers;
          const tier = person.awarded_tier || person.recommended_tier;
          return (
            <article key={person.user_id} className={celebrating === person.user_id ? 'is-celebrating' : ''}>
              <span className={`monthly-badge-icon ${tier || 'empty'}`}><Icon name="trophy" size={25} /></span>
              <div>
                <strong>{person.name}</strong>
                {person.answered_questions ? (
                  <p>{person.accuracy}% · {person.correct_answers} {t('right')} · {wrong} {t('wrong')}</p>
                ) : <p>{t('No completed scored work this month.')}</p>}
              </div>
              {person.awarded_tier ? (
                <span className={`status-badge ${person.awarded_tier}`}>{t(`${person.awarded_tier} awarded`)}</span>
              ) : (
                <button disabled={!person.answered_questions || busy === person.user_id} onClick={() => void award(person)}>
                  {busy === person.user_id ? t('Awarding…') : t(`Gift ${person.recommended_tier || 'badge'}`)}
                </button>
              )}
            </article>
          );
        })}
      </div>
      {!people.length && <p className="spaced">{t('No learners are in this class yet.')}</p>}
      {error && <p className="message" role="alert">{t(error)}</p>}
    </Card>
  );
}
