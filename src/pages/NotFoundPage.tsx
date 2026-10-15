import { useI18n } from '../lib/i18n';
import { Link } from 'wouter';
import { Card } from '../components/Card';
import { Icon } from '../components/Icon';

export function NotFoundPage() {
  const { t } = useI18n();
  return (
    <Card className="empty-state">
      <Icon name="book" size={38} />
      <span className="eyebrow">{t('PAGE NOT FOUND')}</span>
      <h1>{t('A little detour.')}</h1>
      <p>{t('This page isn’t on your learning roadmap. Let’s find your way back.')}</p>
      <Link href="/" className="button primary">
        {t('Back to your dashboard')}
        <Icon name="arrow" size={16} />
      </Link>
    </Card>
  );
}
