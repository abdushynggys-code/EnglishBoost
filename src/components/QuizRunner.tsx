import { useI18n } from '../lib/i18n';
import { useState } from 'react';
import { Link } from 'wouter';
import { Card } from './Card';
import { Icon } from './Icon';
import { QuizResults } from './QuizResults';
import { QuestionCard } from './QuestionCard';
import type { PracticeQuestion } from './QuestionCard';
import type { QuizAnswer } from '../lib/types';
import { isAnswerCorrect } from '../lib/quiz';
import { useLearningActions } from '../lib/useLearningActions';

export function QuizRunner({
  questions,
  title,
  kind = 'grammar',
  onRetry,
}: {
  questions: PracticeQuestion[];
  title: string;
  kind?: 'grammar' | 'reading';
  onRetry: () => void;
}) {
  const { t } = useI18n();
  const [index, setIndex] = useState(0);
  const [response, setResponse] = useState('');
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [checked, setChecked] = useState(false);
  const [finished, setFinished] = useState(false);
  const [busy, setBusy] = useState(false);
  const [attemptId] = useState(() => crypto.randomUUID());
  const actions = useLearningActions();
  const question = questions[index];
  const objective = questions.filter((q) => !q.selfReview);
  const score = answers.filter((a) => a.correct && objective.some((q) => q.id === a.question_id)).length;
  function checkAnswer() {
    setAnswers([
      ...answers,
      {
        question_id: question.id,
        topic: question.topic,
        response: response.trim(),
        correct: !question.selfReview && isAnswerCorrect(response, question.answer),
      },
    ]);
    setChecked(true);
  }
  async function next() {
    if (index < questions.length - 1) {
      setIndex(index + 1);
      setResponse('');
      setChecked(false);
      return;
    }
    setBusy(true);
    const saved = await actions.attempt({
      id: attemptId,
      title,
      kind,
      score,
      total: objective.length,
      answers,
      created_at: new Date().toISOString(),
    });
    setBusy(false);
    if (saved) setFinished(true);
  }
  if (!questions.length)
    return (
      <Card title={t('More practice is on the way')}>
        <p>{t('Your tutor can add questions for this topic.')}</p>
        {kind === 'reading' ? (
          <Link href="/reading" className="button secondary spaced">
            {t('Choose another passage')}
          </Link>
        ) : (
          <button className="secondary spaced" onClick={onRetry}>
            {t('Choose another topic')}
          </button>
        )}
      </Card>
    );
  if (finished) return <QuizResults title={title} score={score} total={objective.length} onRetry={onRetry} />;
  return (
    <Card className="quiz-runner">
      <div className="quiz-topline">
        <span>
          {t('Question')} <strong>{index + 1}</strong> {t('of')} {questions.length}
        </span>
        <span>
          <Icon name="sparkles" size={15} />
          {score} {t('correct')}
        </span>
      </div>
      <div className="quiz-progress">
        <span style={{ width: `${((index + Number(checked)) / questions.length) * 100}%` }} />
      </div>
      <QuestionCard
        key={question.id}
        question={question}
        response={response}
        checked={checked}
        onChange={setResponse}
        onCheck={checkAnswer}
      />
      {checked && (
        <button className="full-width spaced" disabled={busy} onClick={() => void next()}>
          {busy
            ? t('Saving your results…')
            : index === questions.length - 1
              ? t('Finish & save results')
              : t('Next question')}
          <Icon name="arrow" size={16} />
        </button>
      )}
    </Card>
  );
}
