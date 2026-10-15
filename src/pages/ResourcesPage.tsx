import { useI18n } from '../lib/i18n';
import { Link } from 'wouter';
import { PageHeading } from '../components/PageHeading';
import { Card } from '../components/Card';
import { Icon } from '../components/Icon';
import type { IconName } from '../components/Icon';

const resources: { title: string; description: string; icon: IconName; href: string; external?: boolean }[] = [
  {
    title: 'Your grammar toolkit',
    description: 'Tenses, articles, word order, and explanations you can come back to.',
    icon: 'file',
    href: '/lessons',
  },
  {
    title: 'Your vocabulary collection',
    description: 'English definitions, German translations, and pronunciation practice.',
    icon: 'vocabulary',
    href: '/vocabulary',
  },
  {
    title: 'British Council · LearnEnglish Teens',
    description: 'Extra reading, listening, and grammar activities created for teenagers.',
    icon: 'headphones',
    href: 'https://learnenglishteens.britishcouncil.org/',
    external: true,
  },
  {
    title: 'Cambridge Dictionary',
    description: 'Check a meaning, hear a pronunciation, or find another example sentence.',
    icon: 'book',
    href: 'https://dictionary.cambridge.org/',
    external: true,
  },
  {
    title: 'Your writing workshop',
    description: 'Writing prompts, a revision checklist, and a place for your ideas to grow.',
    icon: 'pen',
    href: '/writing',
  },
  {
    title: 'Your next reading adventure',
    description: 'Short stories and real-world texts, with questions to help you think deeper.',
    icon: 'folder',
    href: '/reading',
  },
];

export function ResourcesPage() {
  const { t } = useI18n();
  return (
    <>
      <PageHeading
        title={t('A little help along the way.')}
        description={t('Useful places to explore, revisit, and keep learning.')}
      />
      <div className="resource-grid">
        {resources.map((resource) => (
          <Card className="resource-card" key={resource.title}>
            <span className="feature-icon">
              <Icon name={resource.icon} size={25} />
            </span>
            <div>
              <h2>{resource.title}</h2>
              <p>{resource.description}</p>
              {resource.external ? (
                <a href={resource.href} target="_blank" rel="noreferrer" className="text-link">
                  {t('Explore resource')} <Icon name="external" size={14} />
                </a>
              ) : (
                <Link href={resource.href} className="text-link">
                  {t('Open resource')} <Icon name="arrow" size={14} />
                </Link>
              )}
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}
