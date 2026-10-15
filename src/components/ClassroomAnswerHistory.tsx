import { useI18n } from '../lib/i18n';
import type { ClassroomResponse } from '../lib/classroomTypes';

export function ClassroomAnswerHistory({ responses }: { responses: ClassroomResponse[] }) {
  const { t } = useI18n();
  if (!responses.length) return null;
  return (
    <details className="card spaced">
      <summary>
        {t('Student answers')} · {responses.length}
      </summary>
      {responses.map((response) => (
        <p key={response.id} className="submission-body" lang="en">
          {response.response}
        </p>
      ))}
    </details>
  );
}
