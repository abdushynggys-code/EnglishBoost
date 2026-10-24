import { useState } from 'react';
import { useI18n } from '../lib/i18n';
import { useLearning } from '../lib/learningContext';

export function HomeworkAssignmentFields() {
  const { t } = useI18n();
  const { data } = useLearning();
  const [templateId, setTemplateId] = useState('');
  const template = data.lessons.find((lesson) => lesson.id === templateId);
  return (
    <>
      <label className="field">
        {t('Homework template')}
        <select value={templateId} onChange={(event) => setTemplateId(event.target.value)}>
          <option value="">{t('Custom assignment')}</option>
          {data.lessons.filter((lesson) => lesson.id.startsWith('access2-u1-')).map((lesson) => (
            <option key={lesson.id} value={lesson.id}>{t(lesson.title)}</option>
          ))}
        </select>
      </label>
      <div className="stack" key={templateId}>
        <div className="form-grid">
          <label className="field">{t('Title')}
            <input name="title" required defaultValue={template ? t(template.title) : ''} />
          </label>
          <label className="field">{t('Due date')}<input name="due" type="date" required /></label>
          <label className="field">{t('Lesson')}
            <select name="lesson" defaultValue={templateId || data.lessons[0]?.id}>
              {data.lessons.map((lesson) => (
                <option key={lesson.id} value={lesson.id}>{t(lesson.title)}</option>
              ))}
            </select>
          </label>
          <label className="field">{t('Assigned practice')}
            <select name="practice" defaultValue={template?.practice_path || ''}>
              <option value="">{t('No linked exercise')}</option>
              {template?.practice_path && <option value={template.practice_path}>{t(template.title)}</option>}
              <option value="/practice">{t('Mixed grammar quiz')}</option>
              <option value="/vocabulary">{t('Vocabulary flashcards')}</option>
              <option value="/reading">{t('Reading practice')}</option>
              <option value="/writing">{t('Writing workshop')}</option>
              <option value="/summarize">{t('Get to the Point!')}</option>
            </select>
          </label>
        </div>
        <label className="field">{t('Instructions')}
          <textarea rows={5} name="instructions" required defaultValue={template
            ? `Access 2 · Unit 1 · ${t('Book page')} ${template.book_page}\n${t(template.homework)}` : ''} />
        </label>
        <label className="field">{t('Learning material link (optional)')}
          <input name="material" type="url" placeholder="https://…" pattern="https?://.*" />
        </label>
      </div>
    </>
  );
}
