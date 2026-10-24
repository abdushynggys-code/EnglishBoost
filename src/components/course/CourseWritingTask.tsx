import { useState } from 'react';
import { useI18n } from '../../lib/i18n';
import type { CourseLesson, CourseLevel } from '../../lib/course/types';

export function CourseWritingTask({ lesson, level, onComplete }: {
  lesson: CourseLesson; level: CourseLevel; onComplete: (text: string) => void;
}) {
  const { t } = useI18n();
  const [writing, setWriting] = useState('');
  const [speaking, setSpeaking] = useState(false);
  const minWords = level === 'A1' ? 5 : level === 'A2' ? 12 : 20;
  const wordCount = writing.trim().split(/\s+/).filter(Boolean).length;
  return (
    <section className="card course-expression">
      <h2>{t('Use your own words')}</h2>
      <p lang="en">{lesson.writing_prompt}</p>
      <label className="field spaced">
        {t('Your answer')}
        <textarea lang="en" rows={6} maxLength={5000} value={writing}
          onChange={(event) => setWriting(event.target.value)} />
      </label>
      <p className="muted">{wordCount} / {minWords} {t('words minimum')}</p>
      <p className="spaced" lang="en">{lesson.speaking_prompt}</p>
      <label className="course-confirm spaced">
        <input type="checkbox" checked={speaking} onChange={(event) => setSpeaking(event.target.checked)} />
        {t('I practised speaking aloud.')}
      </label>
      <p className="muted spaced">{t('Writing and speaking samples are practice, not automatic assessments.')}</p>
      <button disabled={wordCount < minWords} className="spaced" onClick={() => onComplete(writing)}>
        {t('Finish lesson')}
      </button>
    </section>
  );
}
