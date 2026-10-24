import { useState } from 'react';
import { useSearch } from 'wouter';
import { PageHeading } from '../components/PageHeading';
import { WritingEditor } from '../components/WritingEditor';
import { Card } from '../components/Card';
import { useLearning } from '../lib/learningContext';
import { useI18n } from '../lib/i18n';

export function WritingPage() {
  const { t, preferences } = useI18n();
  const { data } = useLearning();
  const requested = new URLSearchParams(useSearch()).get('assignment');
  const [selected, setSelected] = useState('');
  const assignment =
    data.writing.find((w) => w.id === (selected || requested)) ??
    (preferences.learning_track === 'access2' && preferences.learning_level === 'A2'
      ? data.writing.find((w) => w.id === 'w3')
      : undefined) ??
    data.writing[0];
  return (
    <>
      <PageHeading title={t('Writing Workshop')} description={t('Put an idea into words.')} />
      {assignment ? (
        <>
          <div className="filter-bar">
            <label className="inline-select">
              {t('Assignment')}
              <select value={assignment.id} onChange={(e) => setSelected(e.target.value)}>
                {data.writing.map((w) => (
                  <option key={w.id} value={w.id}>
                    {t(w.title)}
                  </option>
                ))}
              </select>
            </label>
            <span className="muted">{t('Good writing starts with a first draft.')}</span>
          </div>
          <WritingEditor key={assignment.id} assignment={assignment} />
        </>
      ) : (
        <Card title={t('A fresh page is coming')}>
          <p>{t('Your tutor can create a writing assignment for you.')}</p>
        </Card>
      )}
    </>
  );
}
