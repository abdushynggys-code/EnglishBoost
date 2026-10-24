import { gradeCourseAnswer } from '../../lib/course/scoring';
import { beginLesson } from '../../lib/course/api';
import { useLearning } from '../../lib/learningContext';
import { usePlatform } from '../../lib/platform';
import type { CourseLevel } from '../../lib/course/types';
import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'wouter';
import { CourseQuestionCard } from './CourseQuestionCard';
import { CourseWritingTask } from './CourseWritingTask';
import { CourseLessonResult } from './CourseLessonResult';
import { useI18n } from '../../lib/i18n';
import { useCourse } from '../../lib/course/context';
import { nextCourseStep } from '../../lib/course/nextStep';
import { nextReview } from '../../lib/course/progress';
import type { CourseLesson } from '../../lib/course/types';

export function CourseLessonRunner({ lesson, onRetry }: { lesson: CourseLesson; onRetry: () => void }) {
  const { t } = useI18n();
  const [, navigate] = useLocation();
  const {demo}=useLearning();const {refresh:refreshRewards}=usePlatform();
  const runId=useRef<string>();
  useEffect(()=>{let active=true;if(!demo)void beginLesson(lesson.id).then(id=>{if(active)runId.current=id;}).catch(()=>{ /* The lesson can still save without a speed bonus. */ });return()=>{active=false;};},[demo,lesson.id]);
  const mounted = useRef(true);
  useEffect(() => { mounted.current = true; return () => { mounted.current = false; }; }, []);
  const { state, saveLesson } = useCourse();
  const [intro, setIntro] = useState(!!lesson.text);
  const [answers, setAnswers] = useState<{ id: string; correct: boolean; independent: boolean; transcript:boolean }[]>([]);
  const [writing, setWriting] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);
  const [failed, setFailed] = useState(false);
  const [replay] = useState(() => state.completions.some((item) => item.lesson_id === lesson.id && item.passed));
  const question = lesson.questions[answers.length];
  const score = answers.filter((answer) => answer.correct).length;
  const total = answers.length;
  const passed = lesson.kind !== 'checkpoint' || (total >= 15 && score / total >= 0.8);
  const xp = replay || !passed ? 0 : lesson.id.startsWith('review:') ? 50 : lesson.id.startsWith('challenge:') ? 150 : lesson.kind === 'checkpoint' ? 250 : 100;

  const next = passed ? nextCourseStep({ ...state, completions: [
    ...state.completions.filter((item) => item.lesson_id !== lesson.id),
    { run_id:runId.current,lesson_id: lesson.id, completed_at: new Date().toISOString(), score, total, passed, xp },
  ] }) : null;
  async function finish(destination?: string) {
    setBusy(true);
    setFailed(false);
    const reviews = answers.map((answer) => nextReview(
      state.reviews.find((card) => card.item_id === answer.id), answer.id, answer.independent,
    ));
    const done = await saveLesson({
      run_id:runId.current,lesson_id: lesson.id, completed_at: new Date().toISOString(), score, total, xp, passed,
      ...(writing ? { response: writing } : {}),
    }, reviews);
    if (!mounted.current) return;
    if(done) void refreshRewards();
    if (done && destination) { navigate(destination); return; }
    setBusy(false);
    setSaved(done);
    setFailed(!done);
  }
  if (intro) return (
    <section className="card course-reading">
      <p className="eyebrow">{t('Read at your own pace')}</p>
      <div className="course-passage" lang="en">{lesson.text}</div>
      {lesson.source_url && <a href={lesson.source_url} target="_blank" rel="noreferrer">{t('Explore the grammar reference')} ↗</a>}
      <button className="spaced" onClick={() => setIntro(false)}>{t('Continue')}</button>
    </section>
  );
  if (lesson.writing_prompt && writing === null) return (
    <CourseWritingTask lesson={lesson} level={(lesson.id.split('-')[0] as CourseLevel) ?? state.placement?.level ?? 'A1'} onComplete={setWriting} />
  );
  if (question) return (
    <section className="card">
      <div className="course-assessment-progress">
        <span>{answers.length + 1}/{lesson.questions.length}</span>
        <progress aria-label={t('Lesson progress')} max={lesson.questions.length} value={answers.length} />
      </div>
      <CourseQuestionCard key={question.id} question={question} onAnswer={(response, assisted) => {
        const grade=gradeCourseAnswer(question,response,assisted,lesson.kind==='checkpoint'||lesson.kind==='review');
        setAnswers([...answers,{id:question.id,...grade}]);
      }} />
    </section>
  );
  return <CourseLessonResult score={score} total={total} passed={passed} xp={xp} replay={replay}
    busy={busy} saved={saved} failed={failed} checkpoint={lesson.kind === 'checkpoint'}
    transcriptAssisted={answers.some(answer=>answer.transcript)} nextHref={next?.href} onSave={(destination) => void finish(destination)} onRetry={onRetry} />;
}
