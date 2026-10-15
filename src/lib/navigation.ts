import type { IconName } from '../components/Icon';

export const navigation: { href: string; label: string; icon: IconName }[] = [
  { href: '/', label: 'Home', icon: 'home' },
  { href: '/book', label: 'My Book', icon: 'book' },
  { href: '/classroom', label: 'Live Classroom', icon: 'tutor' },
  { href: '/learn', label: 'Practice', icon: 'pen' },
  { href: '/homework', label: 'Homework', icon: 'homework' },
  { href: '/progress', label: 'My Progress', icon: 'chart' },
];
export function isPracticePath(path: string) {
  return ['/learn', '/practice', '/summarize', '/vocabulary', '/reading', '/writing'].some((route) =>
    path.startsWith(route),
  );
}
