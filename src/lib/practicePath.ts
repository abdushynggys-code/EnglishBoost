export function isPracticeLink(path: string) {
  const [pathname] = path.split('?');
  return ['/practice', '/vocabulary', '/reading', '/writing', '/summarize'].includes(pathname)
    || /^\/reading\/[a-zA-Z0-9-]+$/.test(pathname);
}
