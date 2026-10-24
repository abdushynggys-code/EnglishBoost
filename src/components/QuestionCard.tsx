import { Icon } from './Icon';
import type { Question } from '../lib/types';
import { isAnswerCorrect } from '../lib/quiz';
import { useI18n } from '../lib/i18n';

export type PracticeQuestion = Question & { selfReview?: boolean };

export function QuestionCard({
  question,
  response,
  checked,
  onChange,
  onCheck,
}: {
  question: PracticeQuestion;
  response: string;
  checked: boolean;
  onChange: (value: string) => void;
  onCheck: () => void;
}) {
  const { t, preferences } = useI18n();
  const correct = isAnswerCorrect(response, question.answer);
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        if (response.trim() && !checked) onCheck();
      }}
    >
      <div className="question-label">
        <span className="status-badge blue">
          {question.type === 'correction'
            ? t('Sentence correction')
            : question.type === 'blank'
              ? question.selfReview
                ? t('Written response')
                : t('Fill in the blank')
              : t('Choose the best answer')}
        </span>
        <span className="muted">{t(question.difficulty)}</span>
      </div>
      <h2 className="question-prompt">{question.prompt}</h2>
      {question.options.length ? (
        <div className="answer-options" role="radiogroup" aria-label={t('Answer options')}>
          {question.options.map((option, i) => (
            <button
              key={option}
              type="button"
              role="radio"
              aria-checked={response === option}
              disabled={checked}
              onClick={() => onChange(option)}
              className={`answer-option ${response === option ? 'selected' : ''} ${checked && option === question.answer ? 'correct' : ''} ${checked && response === option && !correct ? 'incorrect' : ''}`}
            >
              <span>{String.fromCharCode(65 + i)}</span>
              {option}
              {checked && option === question.answer && <Icon name="check" size={18} />}
            </button>
          ))}
        </div>
      ) : (
        <label className="field">
          {t('Your answer')}
          {question.selfReview ? (
            <textarea
              rows={4}
              value={response}
              disabled={checked}
              onChange={(e) => onChange(e.target.value)}
              placeholder={t('Explain your answer in your own words…')}
              required
            />
          ) : (
            <input
              value={response}
              disabled={checked}
              onChange={(e) => onChange(e.target.value)}
              placeholder={t('Type your answer…')}
              autoComplete="off"
              required
            />
          )}
        </label>
      )}
      {checked ? (
        <div className={`answer-feedback ${correct || question.selfReview ? 'positive' : 'negative'}`} role="status">
          <Icon name={correct ? 'success' : question.selfReview ? 'book' : 'help'} size={23} />
          <div>
            <strong>
              {question.selfReview
                ? t('Compare with the model answer')
                : correct
                  ? t('That’s right. Nice work!')
                  : t('A little learning moment.')}
            </strong>
            {!correct && (
              <p>
                <b>{question.selfReview ? t('Model answer:') : t('Correct answer:')}</b> {question.answer}
              </p>
            )}
            <p>
              {(preferences.language === 'de'
                ? question.explanation_de
                : preferences.language === 'ru'
                  ? question.explanation_ru
                  : preferences.language === 'kk' ? question.explanation_kk : '') || t(question.explanation)}
            </p>
            {question.selfReview && (
              <small>{t('Written answers are saved for tutor review and excluded from the automatic score.')}</small>
            )}
          </div>
        </div>
      ) : (
        <button type="submit" className="full-width spaced" disabled={!response.trim()}>
          {question.selfReview ? t('Show model answer') : t('Check answer')}
          <Icon name="check" size={16} />
        </button>
      )}
    </form>
  );
}
