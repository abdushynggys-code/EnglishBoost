import { useCallback, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { Link, Redirect, useLocation, useSearch } from "wouter";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { Icon } from "./Icon";
import { useLearning } from "../lib/learningContext";
import { useI18n } from "../lib/i18n";
import { signInPath } from "../lib/authNavigation";
import { MobileNavigation } from "./MobileNavigation";
import { PageLoading } from "./PageLoading";
import { ExperimentalTools } from "./ExperimentalTools";
import { LegendBar } from "./LegendBar";

export function AppShell({ children }: { children: ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [location] = useLocation();
  const search = useSearch();
  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const { t } = useI18n();
  const { data, loading, error, refresh, session, profile, demo, preview, notice, setNotice } = useLearning();
  const dataAvailable = data.lessons.length > 0;
  useEffect(() => {
    setMenuOpen(false);
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    document.getElementById("main-content")?.focus({ preventScroll: true });
  }, [location]);
  if (location === "/sign-in") return <>{children}</>;
  if (!session && !preview) {
    if (location === "/") return <>{children}</>;
    if (loading) return <PageLoading />;
    return <Redirect to={signInPath(location + (search ? `?${search}` : ""))} replace />;
  }
  const pending = !demo && profile && !profile.approved && !["/profile", "/settings"].includes(location);
  return (
    <div className="app-shell">
      <a href="#main-content" className="skip-link">
        {t("Skip to content")}
      </a>
      <Sidebar open={menuOpen} onClose={closeMenu} />
      <div className="main-shell">
        <Topbar onMenu={() => setMenuOpen(true)} />
        <main className="main-content" id="main-content" tabIndex={-1}>
          {!loading && <LegendBar />}
          {loading ? (
            <div className="loading-state">
              <Icon name="loading" className="spin" size={28} />
              <p>{t("Opening your workspace…")}</p>
            </div>
          ) : error && (session || !dataAvailable) ? (
            <section className="card error-state">
              <Icon name="help" size={30} />
              <h1>{t("Let’s reconnect your workspace")}</h1>
              <p>{error}</p>
              <button onClick={() => void refresh()}>{t("Try again")}</button>
            </section>
          ) : pending ? (
            <section className="card error-state">
              <Icon name="shield" size={36} />
              <h1>{t("You’re on the list.")}</h1>
              <p>
                {t(
                  session?.user.user_metadata.requested_role === "tutor"
                    ? "Tutor tools are available to approved tutor accounts."
                    : "Ask your tutor to approve {email}.",
                  { email: profile.email },
                )}{" "}
                {t("Your tutoring content stays private.")}
              </p>
              <button onClick={() => void refresh()}>{t("Check approval")}</button>
            </section>
          ) : (
            <>
              {preview && sessionStorage.getItem("englishboost-lab-mode") === "experimental" && <ExperimentalTools />}
              {children}
            </>
          )}
          {demo && (
            <div className="demo-notice">
              <Icon name="shield" size={15} />
              <span>{t("Developer sandbox · Sample learning data. Changes last for this visit.")}</span>
              <Link href="/settings">
                {t("Settings")} <Icon name="arrow" size={13} />
              </Link>
            </div>
          )}
        </main>
      </div>
      <MobileNavigation onMore={() => setMenuOpen(!menuOpen)} moreOpen={menuOpen} />
      {notice && (
        <div className="toast" role="status">
          <Icon name="bell" size={18} />
          <span>{t(notice)}</span>
          <button className="icon-button" aria-label={t("Dismiss message")} onClick={() => setNotice("")}>
            <Icon name="close" size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
