import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { usePlatform, readNotification } from "../lib/platform";
import { useLearning } from "../lib/learningContext";
import { useI18n } from "../lib/i18n";
import { Icon } from "./Icon";
export function NotificationMenu() {
  const { state, refresh, error } = usePlatform();
  const { setNotice } = useLearning();
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        trigger.current?.focus();
      }
    };
    document.addEventListener("keydown", close);
    return () => document.removeEventListener("keydown", close);
  }, [open]);
  const unread = state.notifications.filter((n) => !n.read_at).length;
  async function mark(id: string) {
    try {
      await readNotification(id);
      await refresh();
      setOpen(false);
    } catch {
      setNotice("Could not update notification.");
    }
  }
  return (
    <div className="notification-menu">
      <button
        ref={trigger}
        className="icon-button"
        aria-label={`${t("Notifications")}${unread ? ` (${unread})` : ""}`}
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        <Icon name="bell" />
        {unread > 0 && <span className="notification-dot" />}
      </button>
      {open && (
        <>
          <button className="menu-dismiss" onClick={() => setOpen(false)} aria-label={t("Close notifications")} />
          <section className="notification-panel">
            <h2>{t("Notifications")}</h2>
            {error ? (
              <button onClick={() => void refresh()}>{t("Try again")}</button>
            ) : !state.notifications.length ? (
              <p>{t("You are all caught up. New assignments and updates appear here.")}</p>
            ) : (
              state.notifications.map((n) => (
                <Link
                  key={n.id}
                  href={n.href.startsWith("/") && !n.href.startsWith("//") ? n.href : "/course"}
                  className={n.read_at ? "" : "unread"}
                  onClick={() => void mark(n.id)}
                >
                  <strong>{t(n.title)}</strong>
                  <p>{t(n.body)}</p>
                  <small>{new Date(n.created_at).toLocaleDateString()}</small>
                </Link>
              ))
            )}
          </section>
        </>
      )}
    </div>
  );
}
