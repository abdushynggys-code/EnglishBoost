import { useI18n } from '../lib/i18n';
import { useState } from 'react';
import { Card } from './Card';
import { Icon } from './Icon';
import { TutorContentEditor } from './TutorContentEditor';
import { TutorReadingQuestions } from './TutorReadingQuestions';
import { useLearning } from '../lib/learningContext';
import { contentTables } from '../lib/contentForms';
import type { ContentKind } from '../lib/contentForms';
import { removeContent } from '../lib/tutorApi';

export function TutorContent({ kind }: { kind: ContentKind }) {
  const { t } = useI18n();
  const { data, refresh, setNotice } = useLearning();
  const [editing, setEditing] = useState<string | null>(null);
  const [reading, setReading] = useState('');
  const records = data[kind];
  const initial = records.find((record) => record.id === editing);
  async function remove(id: string) {
    if (!window.confirm(t('Delete this item and its related learning records? This cannot be undone.'))) return;
    try {
      await removeContent(contentTables[kind], id);
      await refresh();
      setNotice(t('Item removed.'));
    } catch (cause) {
      setNotice(cause instanceof Error ? cause.message : 'Could not delete this item.');
    }
  }
  if (reading) return <TutorReadingQuestions passageId={reading} onClose={() => setReading('')} />;
  if (editing)
    return (
      <TutorContentEditor key={`${kind}-${editing}`} kind={kind} initial={initial} onClose={() => setEditing(null)} />
    );
  return (
    <Card
      title={`Manage ${kind}`}
      action={
        <button onClick={() => setEditing('new')}>
          <Icon name="plus" size={15} />
          {t('Add')}{' '}
          {kind === 'questions'
            ? 'question'
            : kind === 'vocabulary'
              ? 'word'
              : kind === 'passages'
                ? 'passage'
                : 'item'}
        </button>
      }
    >
      <div className="tutor-list">
        {records.map((record) => (
          <div className="tutor-row" key={record.id}>
            <div className="tutor-row-header">
              <h3>{'title' in record ? record.title : 'word' in record ? record.word : record.prompt}</h3>
              <div className="button-row" style={{ margin: 0 }}>
                <button className="icon-button" aria-label={t('Edit item')} onClick={() => setEditing(record.id)}>
                  <Icon name="edit" size={17} />
                </button>
                {kind !== 'lessons' && (
                  <button className="icon-button" aria-label={t('Delete item')} onClick={() => void remove(record.id)}>
                    <Icon name="trash" size={16} />
                  </button>
                )}
              </div>
            </div>
            <p>
              {'description' in record
                ? record.description
                : 'definition' in record
                  ? record.definition
                  : 'topic' in record
                    ? record.topic
                    : 'level' in record
                      ? record.level
                      : record.format}
            </p>
            {kind === 'passages' && (
              <button className="secondary spaced" onClick={() => setReading(record.id)}>
                {t('Manage comprehension questions')} <Icon name="arrow" size={14} />
              </button>
            )}
          </div>
        ))}
      </div>
      {!records.length && <p>{t('No content here yet. Add your first item above.')}</p>}
    </Card>
  );
}
