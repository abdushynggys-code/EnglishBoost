const appRoutes = new Set(['/', '/course', '/placement', '/profile', '/settings', '/learn', '/book', '/classroom', '/lessons', '/practice', '/vocabulary', '/reading', '/writing', '/homework', '/progress', '/resources', '/tutor', '/shop', '/developer', '/materials']);
const destinationKey = 'englishboost-sign-in-next';

export function safeAppDestination(value: string | null | undefined) {
  if (!value?.startsWith('/') || value.startsWith('//') || value.includes('\\')) return '/course';
  const path = value.split(/[?#]/)[0];
  const root = `/${path.split('/')[1]}`;
  return appRoutes.has(root) ? value : '/course';
}
export function signInPath(destination = '/course') {
  return `/sign-in?next=${encodeURIComponent(safeAppDestination(destination))}`;
}
export function rememberedDestination(value?: string | null) {
  if (value) return safeAppDestination(value);
  try { return safeAppDestination(sessionStorage.getItem(destinationKey)); } catch { return '/course'; }
}
export function rememberDestination(value: string) {
  try { sessionStorage.setItem(destinationKey, safeAppDestination(value)); } catch { /* Sign-in still returns to the course. */ }
}
export function clearDestination() {
  try { sessionStorage.removeItem(destinationKey); } catch { /* Storage can be disabled. */ }
}
