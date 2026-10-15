import type { ReactNode } from 'react';
import { Card } from './Card';
import { Icon } from './Icon';
import type { IconName } from './Icon';

export function StatCard({
  label,
  value,
  icon,
  className = '',
}: {
  label: string;
  value: ReactNode;
  icon: IconName;
  className?: string;
}) {
  return (
    <Card>
      <span className="stat-label">{label}</span>
      <strong className={`stat-value ${className}`}>
        {value}
        <Icon name={icon} />
      </strong>
    </Card>
  );
}
