import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { PlacementSetup } from '../components/placement/PlacementSetup';
import { PlacementExpression } from '../components/placement/PlacementExpression';
import { CourseQuestionCard } from '../components/course/CourseQuestionCard';
import { PageLoading } from '../components/PageLoading';
import { useCourse } from '../lib/course/context';
import { useI18n } from '../lib/i18n';
import { nextPlacementQuestion, placementLength } from '../lib/course/placement';
import { estimatePlacement } from '../lib/course/progress';
import type { PlacementAnswer, StudySettings } from '../lib/course/types';

export function PlacementPage() {
  const { t } = useI18n();
  const { state, loading, error, refresh, savePlacement } = useCourse();
  const [, navigate] = useLocation();
  const [settings, setSettings] = useState<StudySettings | null>(null);
  const [answers, setAnswers] = useState<PlacementAnswer[]>([]);
  const [busy, setBusy] = useState(false);
  const [saveError, setSaveError] = useState(false);
  const [seed] = useState(() => crypto.randomUUID());
  const question = nextPlacementQuestion(answers,seed);
  const target=placementLength(answers);
  async function finish(writing: string, speaking: boolean) {
    if (!settings) return;
    setBusy(true); setSaveError(false);
    const saved = await savePlacement({id:crypto.randomUUID(),created_at:new Date().toISOString(),...estimatePlacement(answers),answers,writing_sample:writing,speaking_practised:speaking,settings});
    setBusy(false);
    if (saved) navigate('/course'); else setSaveError(true);
  }
  if (loading) return <PageLoading />;
  if (error) return <section className="card error-state"><p>{t(error)}</p><button onClick={() => void refresh()}>{t('Try again')}</button></section>;
  return <div className="placement-page">
    <Link className="back-link" href="/course">← {t('Your learning path')}</Link>
    {!settings ? <PlacementSetup retaking={!!state.placement} onStart={setSettings} /> : <>
      <div className="course-assessment-progress"><span>{t('Level check')} · {Math.min(answers.length + 1,target)} / {target}</span><progress aria-label={t('Level check progress')} value={answers.length} max={target} /></div>
      {question ? <div className="card">
        <p className="eyebrow">{t(question.skill)} · {t('Question')} {answers.length+1}</p>
        <CourseQuestionCard key={question.id} assessment question={question} onAnswer={(response,assisted,skipped) => setAnswers([...answers,{question_id:question.id,skill:question.skill,level:question.level,correct:response===question.answer,assisted,skipped}])} />
      </div> : <PlacementExpression busy={busy} error={saveError} onSave={(writing,speaking) => void finish(writing,speaking)} />}
    </>}
  </div>;
}
