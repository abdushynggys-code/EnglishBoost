import { ClassroomAnswerHistory } from '../components/ClassroomAnswerHistory';
import { Link } from 'wouter';
import { Card } from '../components/Card';
import { PageHeading } from '../components/PageHeading';
import { ClassroomControls } from '../components/ClassroomControls';
import { ClassroomQuiz } from '../components/ClassroomQuiz';
import { SummaryWriter } from '../components/SummaryWriter';
import { Icon } from '../components/Icon';
import { useClassroom } from '../lib/useClassroom';
import { useLearning } from '../lib/learningContext';
import { useI18n } from '../lib/i18n';
import { sendClassroomAnswer } from '../lib/classroomApi';
import { summaryScenarios } from '../data/summaryScenarios';
import { isAnswerCorrect } from '../lib/quiz';
import { lessonExplanation } from '../lib/lessonLanguage';
import type { ConciseAttempt } from '../lib/summaryTypes';

export function ClassroomRoomPage({ params }: { params: { id: string } }) {
  const { t, preferences } = useI18n();
  const { session, demo, profile, data, setNotice } = useLearning();
  const { room, responses, loading, error, live, refresh } = useClassroom(params.id, !!session && !demo);
  if (loading) return <p role="status">{t('Opening your workspace…')}</p>;
  if (!room)
    return (
      <Card>
        <p>{t(error || 'Sign in to join your classroom.')}</p>
        <Link href="/classroom" className="button secondary spaced">
          {t('Back')}
        </Link>
      </Card>
    );
  const tutor = profile?.role === 'tutor' && room.tutor_id === session?.user.id;
  const lesson = data.lessons.find((l) => l.id === room.lesson_id);
  const translatedActivities = lesson ? lessonExplanation(lesson, preferences.language) : '';
  const slides = [
    { title: lesson?.title ?? 'Live Classroom', body: lesson?.description ?? '' },
    { title: 'Let’s learn', body: translatedActivities || lesson?.activities || '' },
    ...(lesson?.objectives ?? []).map((title) => ({ title, body: 'Try one example in English.' })),
  ];
  const slide = slides[Math.min(room.active_slide, slides.length - 1)];
  const question = data.questions.find((q) => q.id === room.question_id);
  const current = responses.find((response) => response.activity_version === room.version);
  const scenario = summaryScenarios.find((s) => s.id === room.scenario_id) ?? summaryScenarios[0];
  async function sendSummary(attempt: ConciseAttempt) {
    if (!room) return false;
    try {
      await sendClassroomAnswer(room, `Original:\n${attempt.original}\n\nImproved:\n${attempt.improved}`, attempt.id);
      await refresh();
      return true;
    } catch (cause) {
      setNotice(t(cause instanceof Error ? cause.message : 'Could not send your answer.'));
      return false;
    }
  }
  return (
    <>
      <Link href="/classroom" className="back-link">
        <Icon name="back" size={16} />
        {t('Live Classroom')}
      </Link>
      <PageHeading
        title={t(lesson?.title ?? 'Live Classroom')}
        description={t(live ? t('Connected live') : t('Reconnecting · checking for updates'))}
        action={
          <button className="secondary" onClick={() => void refresh()}>
            {t('Refresh')}
          </button>
        }
      />
      {room.status === 'ended' ? (
        <Card>
          <p>{t('This lesson has ended. Your saved answers are still available to your tutor.')}</p>
        </Card>
      ) : (
        <div className="stack">
          {tutor && <ClassroomControls room={room} slideCount={slides.length} refresh={refresh} />}
          {room.activity === 'slide' ? (
            <Card className="classroom-slide">
              <span className="eyebrow">
                {room.active_slide + 1} / {slides.length}
              </span>
              <h2>{t(slide.title)}</h2>
              <p>{t(slide.body)}</p>
            </Card>
          ) : room.activity === 'quiz' && question ? (
            tutor ? (
              <Card title={t('Grammar Lab')}>
                <h2 className="english-prompt" lang="en">
                  {question.prompt}
                </h2>
                <p>{t('The tutor controls the next activity.')}</p>
              </Card>
            ) : (
              <ClassroomQuiz key={room.version} room={room} question={question} submitted={current} refresh={refresh} />
            )
          ) : room.activity === 'summary' ? (
            tutor ? (
              <Card title={t('Get to the Point!')}>
                <h2 className="english-prompt" lang="en">
                  {scenario.question}
                </h2>
                <p lang="en">{scenario.original}</p>
              </Card>
            ) : current ? (
              <Card className="summary-result">
                <h2>{t('Answer sent.')}</h2>
                <p className="spaced">{t('The tutor controls the next activity.')}</p>
                <p className="submission-body spaced" lang="en">
                  {current.response}
                </p>
              </Card>
            ) : (
              <SummaryWriter
                key={room.version}
                mode="shorten"
                scenario={scenario}
                onAgain={() => void refresh()}
                onComplete={sendSummary}
              />
            )
          ) : (
            <Card>
              <p>{t('The tutor controls the next activity.')}</p>
            </Card>
          )}
          {tutor && (
            <Card title={t('Student answers')}>
              {current ? (
                <>
                  <p className="submission-body" lang="en">
                    {current.response}
                  </p>
                  {room.activity === 'quiz' && question && (
                    <span
                      className={`status-badge ${isAnswerCorrect(current.response, question.answer) ? 'green' : 'blue'}`}
                    >
                      {t(isAnswerCorrect(current.response, question.answer) ? t('Correct') : t('Needs practice'))}
                    </span>
                  )}
                </>
              ) : (
                <p>{t('Waiting for an answer…')}</p>
              )}
            </Card>
          )}
        </div>
      )}
      <ClassroomAnswerHistory responses={responses} />
    </>
  );
}
