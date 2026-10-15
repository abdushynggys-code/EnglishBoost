import { useState } from 'react';
import { Card } from './Card';
import { QuestionCard } from './QuestionCard';
import { useI18n } from '../lib/i18n';
import { useLearning } from '../lib/learningContext';
import { sendClassroomAnswer } from '../lib/classroomApi';
import { useLearningActions } from '../lib/useLearningActions';
import { isAnswerCorrect } from '../lib/quiz';
import type { Question } from '../lib/types';
import type { ClassroomRoom, ClassroomResponse } from '../lib/classroomTypes';

export function ClassroomQuiz({
  question,
  room,
  submitted,
  refresh,
}: {
  question: Question;
  room: ClassroomRoom;
  submitted?: ClassroomResponse;
  refresh: () => Promise<void>;
}) {
  const { t } = useI18n();
  const { setNotice } = useLearning();
  const actions = useLearningActions();
  const [response, setResponse] = useState(submitted?.response ?? '');
  const [checked, setChecked] = useState(!!submitted);
  const [busy, setBusy] = useState(false);
  const [id] = useState(() => crypto.randomUUID());
  async function check() {
    setBusy(true);
    try {
      await sendClassroomAnswer(room, response, id);
      const correct = isAnswerCorrect(response, question.answer);
      await actions.attempt({
        id,
        kind: 'grammar',
        title: `Live · ${question.topic}`,
        score: Number(correct),
        total: 1,
        answers: [{ question_id: question.id, topic: question.topic, response, correct }],
        created_at: new Date().toISOString(),
      });
      setChecked(true);
      await refresh();
    } catch (cause) {
      setNotice(t(cause instanceof Error ? cause.message : 'Could not send your answer.'));
    } finally {
      setBusy(false);
    }
  }
  return (
    <Card>
      <fieldset disabled={busy} className="live-answer-fieldset">
        <QuestionCard
          question={question}
          response={response}
          checked={checked}
          onChange={setResponse}
          onCheck={() => void check()}
        />
      </fieldset>
      {checked && (
        <p className="spaced">
          {t('Answer sent.')} {t('Your tutor will see your answer.')}
        </p>
      )}
    </Card>
  );
}
