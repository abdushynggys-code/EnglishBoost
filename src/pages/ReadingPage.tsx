import { Link } from 'wouter';
import { PageHeading } from '../components/PageHeading';
import { Card } from '../components/Card';
import { Icon } from '../components/Icon';
import { useLearning } from '../lib/learningContext';
import { useI18n } from '../lib/i18n';

export function ReadingPage() {
  const { t, preferences } = useI18n();
  const { data } = useLearning();
  return (
    <>
      <PageHeading title={t('Reading Room')} description={t('Read, notice, understand.')} />
      <div className="resource-grid">
        {data.passages
          .filter(
            (p) =>
              preferences.learning_track === 'language_arts' ||
              preferences.learning_level !== 'A2' ||
              p.level.startsWith('A2'),
          )
          .map((passage, i) => (
            <Card key={passage.id} className="reading-preview">
              <div className={`reading-cover cover-${i % 2}`}>
                <Icon name={i % 2 ? 'sparkles' : 'book'} size={46} />
                <span>{i % 2 ? t('A LITTLE FICTION') : t('REAL-WORLD STORIES')}</span>
              </div>
              <span className="eyebrow">{passage.level}</span>
              <h2>{passage.title}</h2>
              <p>{passage.body.split('\n')[0].slice(0, 155)}…</p>
              <div className="practice-facts">
                <span>
                  <Icon name="clock" size={15} />
                  {t('8–12 minutes')}
                </span>
                <span>
                  {passage.questions.length} {t('questions')}
                </span>
              </div>
              <Link className="button primary full-width" href={`/reading/${passage.id}`}>
                {t('Start reading')} <Icon name="arrow" size={16} />
              </Link>
            </Card>
          ))}
      </div>
      {!data.passages.length && (
        <Card title={t('Your reading shelf is growing')}>
          <p>{t('Your tutor can add passages from their workspace.')}</p>
        </Card>
      )}
    </>
  );
}
