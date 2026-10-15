import { useI18n } from '../lib/i18n';
import { useState } from 'react';
import { Card } from './Card';
import { Icon } from './Icon';
import { useLearning } from '../lib/learningContext';
import { contentFields, contentTables, parseContent } from '../lib/contentForms';
import type { ContentKind } from '../lib/contentForms';
import { saveContent } from '../lib/tutorApi';

export function TutorContentEditor({
  kind,
  initial,
  onClose,
}: {
  kind: ContentKind;
  initial?: object & { id: string };
  onClose: () => void;
}) {
  const { t } = useI18n();
  const { data, session, refresh, setNotice } = useLearning();
  const fields = contentFields(kind, data);
  const [values, setValues] = useState<Record<string, string>>(() => {
    const record = (initial ?? {}) as Record<string, unknown>;
    return Object.fromEntries(
      fields.map((field) => {
        const value = record[field.key];
        return [
          field.key,
          Array.isArray(value)
            ? value.join('\n')
            : value == null
              ? (field.options?.[0] ?? (field.type === 'number' ? String(field.minimum ?? 1) : ''))
              : String(value),
        ];
      }),
    );
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!session) return;
    setBusy(true);
    setError('');
    try {
      await saveContent(contentTables[kind], initial?.id, parseContent(values, kind), session.user.id);
      await refresh();
      setNotice(t('Learning content saved.'));
      onClose();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not save content.');
    } finally {
      setBusy(false);
    }
  }
  return (
    <Card
      title={initial ? t('Edit learning content') : t('Create learning content')}
      className="tutor-form"
      action={
        <button className="icon-button" onClick={onClose} aria-label={t('Close editor')}>
          <Icon name="close" size={18} />
        </button>
      }
    >
      <form className="form" onSubmit={(event) => void submit(event)}>
        <div className="form-grid">
          {fields.map((field) => (
            <label className={`field ${field.type === 'textarea' ? 'wide' : ''}`} key={field.key}>
              {t(field.label)}
              {field.type === 'textarea' ? (
                <textarea
                  rows={field.key === 'activities' || field.key === 'body' ? 7 : 3}
                  value={values[field.key]}
                  required={!field.optional}
                  onChange={(e) => setValues({ ...values, [field.key]: e.target.value })}
                />
              ) : field.type === 'select' ? (
                <select
                  value={values[field.key]}
                  onChange={(e) => setValues({ ...values, [field.key]: e.target.value })}
                >
                  {field.options?.map((option) => (
                    <option key={option} value={option}>
                      {t(data.lessons.find((l) => l.id === option)?.title ?? option)}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={field.type === 'number' ? 'number' : 'text'}
                  min={field.minimum}
                  max={field.maximum}
                  required={!field.optional}
                  value={values[field.key]}
                  onChange={(e) => setValues({ ...values, [field.key]: e.target.value })}
                />
              )}
            </label>
          ))}
        </div>
        {error && (
          <p className="message" role="alert">
            {error}
          </p>
        )}
        <div className="button-row">
          <button disabled={busy}>
            <Icon name="save" size={16} />
            {busy ? t('Saving…') : t('Save content')}
          </button>
          <button type="button" className="secondary" onClick={onClose}>
            {t('Cancel')}
          </button>
        </div>
      </form>
    </Card>
  );
}
