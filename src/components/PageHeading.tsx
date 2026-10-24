import type { ReactNode } from 'react';
import { useI18n } from '../lib/i18n';

export function PageHeading({
  eyebrow = 'YOUR LEARNING JOURNEY',
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  const { t } = useI18n();
  return (
    <div className="page-heading">
      <div>
        <p className="eyebrow">{t(eyebrow)}</p>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {action}
    </div>
  );
}
