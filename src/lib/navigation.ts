import type { IconName } from '../components/Icon';

export const navigation: { href: string; label: string; icon: IconName }[] = [
  { href: '/', label: 'Home', icon: 'home' },
  { href: '/course', label: 'My course', icon: 'target' },
  { href: '/materials', label: 'Material library', icon: 'book' },
  { href: '/classroom', label: 'Live Classroom', icon: 'tutor' },
  { href: '/learn', label: 'Practice', icon: 'pen' },
  { href: '/homework', label: 'Homework', icon: 'homework' },
  { href: '/shop', label: 'Streak shop', icon: 'sparkles' },
  { href: '/progress', label: 'My Progress', icon: 'chart' },
];
export function isPracticePath(path: string) {
  return ['/learn', '/practice', '/summarize', '/vocabulary', '/reading', '/writing'].some((route) =>
    path.startsWith(route),
  );
}

export function pageLabel(path: string) {
  const pages: Record<string, string> = {
    '/course': 'My course', '/placement': 'Level check',
    '/summarize': 'Get to the Point!', '/practice': 'Grammar Lab',
    '/vocabulary': 'Vocabulary Games', '/reading': 'Reading Room',
    '/writing': 'Writing Workshop', '/profile': 'My profile',
    '/settings': 'Settings', '/tutor': 'Tutor Workspace', '/resources': 'Resources',
    '/lessons': 'My learning',
  };
  const root = `/${path.split('/')[1]}`;
  return pages[root] ?? navigation.find((item) => item.href === root)?.label ?? 'Your workspace';
}
