import { useEffect, useRef } from 'react';

export function useNavigationDrawer(open: boolean, onClose: () => void) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const mobile = window.matchMedia('(max-width: 760px)');
    if (!open || !mobile.matches) return;
    const onResize = () => { if (!mobile.matches) onClose(); };
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    const main = document.querySelector<HTMLElement>('.main-shell');
    const previousInert = main?.inert ?? false;
    document.body.style.overflow = 'hidden';
    if (main) main.inert = true;
    const links = ref.current?.querySelectorAll<HTMLElement>('a[href], button:not(:disabled)');
    links?.[0]?.focus();
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose();
      if (event.key !== 'Tab' || !links?.length) return;
      const first = links[0];
      const last = links[links.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
    document.addEventListener('keydown', onKey);
    mobile.addEventListener('change', onResize);
    return () => {
      document.body.style.overflow = previousOverflow;
      if (main) main.inert = previousInert;
      document.removeEventListener('keydown', onKey);
      mobile.removeEventListener('change', onResize);
      if (previousFocus instanceof HTMLElement) previousFocus.focus({ preventScroll: true });
    };
  }, [open, onClose]);
  return ref;
}
