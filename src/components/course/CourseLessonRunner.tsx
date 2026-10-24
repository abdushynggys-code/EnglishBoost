import { useState } from 'react';
import { CourseQuestionCard } from './CourseQuestionCard';
import { CourseWritingTask } from './CourseWritingTask';
import { CourseLessonResult } from './CourseLessonResult';
import { useI18n } from '../../lib/i18n';
import { useCourse } from '../../lib/course/context';
import { nextReview } from '../../lib/course/progress';
import type { CourseLesson } from '../../lib/course/types';

const normalize = (value: string) => value.trim().toLowerCase().replace(/[.!?]$/, '');
export function CourseLessonRunner({ lesson, onRetry }: { lesson: CourseLesson; onRetry: () => void }) {
  const { t } = useI18n();
  const { state, saveLesson } = useCourse();
  const [intro, setIntro] = useState(!!lesson.text);
  const [answers, setAnswers] = useState<{ id: string; correct: boolean; independent: boolean }[]>([]);
  const [writing, setWriting] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);
  const [failed, setFailed] = useState(false);
  const [replay] = useState(() => state.completions.some((item) => item.lesson_id === lesson.id && item.passed));
  const question = lesson.questions[answers.length];
  const score = answers.filter((answer) => answer.correct).length;
  const total = answers.length;
  const passed = lesson.kind !== 'checkpoint' || (total >= 5 && score / total >= 0.8);
  const xp = replay || !passed ? 0 : lesson.id.startsWith('review:') ? 5 : lesson.kind === 'checkpoint' ? 30 : 10;

  async function finish() {
    setBusy(true);
    setFailed(false);
    const reviews = answers.map((answer) => nextReview(
      state.reviews.find((card) => card.item_id === answer.id), answer.id, answer.independent,
    ));
    const done = await saveLesson({
      lesson_id: lesson.id, completed_at: new Date().toISOString(), score, total, xp, passed,
      ...(writing ? { response: writing } : {}),
    }, reviews);
    setBusy(false);
    setSaved(done);
    setFailed(!done);
  }
  if (intro) return (
    <section className="card course-reading">
      <p className="eyebrow">{t('Read at your own pace')}</p>
      <div className="course-passage" lang="en">{lesson.text}</div>
      {lesson.source_url && <a href={lesson.source_url} target="_blank" rel="noreferrer">{t('Explore the original book')} ↗</a>}
      <button className="spaced" onClick={() => setIntro(false)}>{t('Continue')}</button>
    </section>
  );
  if (lesson.writing_prompt && writing === null) return (
    <CourseWritingTask lesson={lesson} level={state.placement?.level ?? 'A1'} onComplete={setWriting} />
  );
  if (question) return (
    <section className="card">
      <div className="course-assessment-progress">
        <span>{answers.length + 1}/{lesson.questions.length}</span>
        <progress aria-label={t('Lesson progress')} max={lesson.questions.length} value={answers.length} />
      </div>
      <CourseQuestionCard key={question.id} question={question} onAnswer={(response, assisted) => {
        const matched = normalize(response) === normalize(question.answer);
        const independent = matched && !assisted;
        const correct = lesson.kind === 'checkpoint' || lesson.kind === 'review' ? independent : matched;
        setAnswers([...answers, { id: question.id, correct, independent }]);
      }} />
    </section>
  );
  return <CourseLessonResult score={score} total={total} passed={passed} xp={xp} replay={replay}
    busy={busy} saved={saved} failed={failed} checkpoint={lesson.kind === 'checkpoint'}
    onSave={() => void finish()} onRetry={onRetry} />;
}
