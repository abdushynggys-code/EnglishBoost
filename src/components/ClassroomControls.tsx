import { useState } from 'react';
import { Card } from './Card';
import { Icon } from './Icon';
import { useI18n } from '../lib/i18n';
import { useLearning } from '../lib/learningContext';
import { controlClassroom } from '../lib/classroomApi';
import { summaryScenarios } from '../data/summaryScenarios';
import type { ClassroomRoom } from '../lib/classroomTypes';

export function ClassroomControls({
  room,
  slideCount,
  refresh,
}: {
  room: ClassroomRoom;
  slideCount: number;
  refresh: () => Promise<void>;
}) {
  const { t } = useI18n();
  const { data, setNotice } = useLearning();
  const [question, setQuestion] = useState(data.questions[0]?.id ?? '');
  const [scenario, setScenario] = useState('morning');
  const [busy, setBusy] = useState(false);
  async function change(changes: Parameters<typeof controlClassroom>[1]) {
    setBusy(true);
    try {
      await controlClassroom(room, changes);
      await refresh();
    } catch (cause) {
      setNotice(t(cause instanceof Error ? cause.message : 'Could not update classroom.'));
    } finally {
      setBusy(false);
    }
  }
  return (
    <Card title={t('Tutor Workspace')} className="classroom-controls">
      <div className="button-row">
        <button
          className="secondary"
          disabled={busy || room.active_slide === 0}
          onClick={() => void change({ activity: 'slide', active_slide: room.active_slide - 1 })}
        >
          {t('Previous slide')}
        </button>
        <button
          disabled={busy || room.active_slide >= slideCount - 1}
          onClick={() => void change({ activity: 'slide', active_slide: room.active_slide + 1 })}
        >
          {t('Next slide')}
          <Icon name="arrow" size={15} />
        </button>
      </div>
      <div className="form-grid spaced">
        <label className="field">
          {t('Grammar Lab')}
          <select value={question} onChange={(event) => setQuestion(event.target.value)}>
            {data.questions.map((q) => (
              <option key={q.id} value={q.id}>
                {q.prompt}
              </option>
            ))}
          </select>
          <button
            className="secondary"
            disabled={busy || !question}
            onClick={() => void change({ activity: 'quiz', question_id: question })}
          >
            {t('Launch quiz')}
          </button>
        </label>
        <label className="field">
          {t('Get to the Point!')}
          <select value={scenario} onChange={(event) => setScenario(event.target.value)}>
            {summaryScenarios.map((s) => (
              <option key={s.id} value={s.id}>
                {t(s.title)}
              </option>
            ))}
          </select>
          <button
            className="secondary"
            disabled={busy}
            onClick={() => void change({ activity: 'summary', scenario_id: scenario })}
          >
            {t('Launch summary practice')}
          </button>
        </label>
      </div>
      <div className="button-row spaced">
        <button className="text-button" disabled={busy} onClick={() => void change({ activity: 'slide' })}>
          {t('Show slides')}
        </button>
        <button className="text-button" disabled={busy} onClick={() => void change({ status: 'ended' })}>
          {t('End lesson')}
        </button>
      </div>
    </Card>
  );
}
