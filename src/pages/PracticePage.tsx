import { useState } from 'react';
import { useSearch } from 'wouter';
import { PageHeading } from '../components/PageHeading';
import { Card } from '../components/Card';
import { Icon } from '../components/Icon';
import { QuizRunner } from '../components/QuizRunner';
import { useLearning } from '../lib/learningContext';
import { useI18n } from '../lib/i18n';

export function PracticePage() {
  const { t, preferences } = useI18n();
  const { data } = useLearning();
  const search = useSearch();
  const params = new URLSearchParams(search);
  const lessonId = params.get('lesson');
  const [topic, setTopic] = useState(params.get('topic') || 'All topics');
  const [difficulty, setDifficulty] = useState(
    preferences.learning_track === 'access2' && preferences.learning_level === 'A2' ? 'Beginner' : 'All levels',
  );
  const [started, setStarted] = useState(false);
  const [run, setRun] = useState(0);
  const lessonQuestions = data.questions.filter((q) => !lessonId || q.lesson_id === lessonId);
  const source = lessonQuestions.length ? lessonQuestions : data.questions;
  const filtered = source.filter(
    (q) =>
      (topic === 'All topics' || q.topic === topic) && (difficulty === 'All levels' || q.difficulty === difficulty),
  );
  const topics = [...new Set(source.map((q) => q.topic))];
  const title =
    topic === 'All topics'
      ? lessonId
        ? (data.lessons.find((l) => l.id === lessonId)?.title ?? 'Mixed grammar practice')
        : 'Mixed grammar practice'
      : topic;
  return (
    <>
      <PageHeading title={t('Grammar Lab')} description={t('Short explanations. A little practice.')} />
      <div className="practice-layout">
        <div>
          {started ? (
            <QuizRunner
              key={`${run}-${topic}`}
              questions={filtered}
              title={title}
              onRetry={() => {
                setRun(run + 1);
                setStarted(false);
              }}
            />
          ) : (
            <Card className="practice-start">
              <span className="feature-icon blue-icon">
                <Icon name="pen" size={30} />
              </span>
              <span className="eyebrow">{t('YOUR NEXT SMALL WIN')}</span>
              <h2>{t('Ready to give it a go?')}</h2>
              <p>{t('Short questions, clear explanations, and a fresh start whenever you need one.')}</p>
              <div className="form-grid spaced">
                <label className="field">
                  {t('Grammar topic')}
                  <select value={topic} onChange={(e) => setTopic(e.target.value)}>
                    <option value="All topics">{t('All topics')}</option>
                    {topics.map((topicName) => (
                      <option key={topicName} value={topicName}>{t(topicName)}</option>
                    ))}
                  </select>
                </label>
                <label className="field">
                  {t('Difficulty')}
                  <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
                    <option value="All levels">{t('All levels')}</option>
                    <option value="Beginner">{t('Beginner')}</option>
                    <option value="Intermediate">{t('Intermediate')}</option>
                  </select>
                </label>
              </div>
              <div className="practice-facts">
                <span>
                  <Icon name="file" size={16} />
                  {filtered.length} {t('questions')}
                </span>
                <span>
                  <Icon name="clock" size={16} />
                  {Math.max(2, filtered.length)} {t('minutes')}
                </span>
                <span>
                  <Icon name="success" size={16} />
                  {t('Instant feedback')}
                </span>
              </div>
              <button className="full-width" disabled={!filtered.length} onClick={() => setStarted(true)}>
                <Icon name="play" size={16} />
                {t('Start practice')}
              </button>
              {!filtered.length && (
                <p className="muted spaced">{t('No questions match these filters. Try another topic or level.')}</p>
              )}
            </Card>
          )}
        </div>
        <div className="stack">
          <Card title={t('A good way to practise')}>
            <ul className="checklist">
              <li>
                <Icon name="check" />
                {t('Read the whole sentence first.')}
              </li>
              <li>
                <Icon name="check" />
                {t('Look for time words and clues.')}
              </li>
              <li>
                <Icon name="check" />
                {t('Take a moment to read the explanation.')}
              </li>
              <li>
                <Icon name="check" />
                {t('Try a tricky topic again tomorrow.')}
              </li>
            </ul>
          </Card>
          <div className="gentle-note">
            <Icon name="sparkles" size={24} />
            <h3>{t('Progress over perfection.')}</h3>
            <p>{t('Getting something wrong is where learning begins.')}</p>
          </div>
        </div>
      </div>
    </>
  );
}
