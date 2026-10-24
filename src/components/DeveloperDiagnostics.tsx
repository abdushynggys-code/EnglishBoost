import { useState } from "react";
import { usePlatform } from "../lib/platform";
import { announceDataChange } from "../lib/dataEvents";
import { useI18n } from "../lib/i18n";
import { inspectConnections } from "../lib/developer";
export function DeveloperDiagnostics() {
  const { t } = useI18n();
  const { refresh } = usePlatform();
  const [checks, setChecks] = useState<{ name: string; ok: boolean }[]>([]);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  async function inspect() {
    setBusy(true);
    try {
      announceDataChange();
      await refresh();
      setChecks(await inspectConnections());
      setMessage("Connection checks complete.");
    } catch {
      setMessage("Could not finish connection checks. Please try again.");
    } finally {
      setBusy(false);
    }
  }
  async function copy() {
    try {
      await navigator.clipboard.writeText(
        JSON.stringify({ app: "EnglishBoost", at: new Date().toISOString(), origin: location.origin, checks }, null, 2),
      );
      setMessage("Diagnostic summary copied.");
    } catch {
      setMessage("Could not copy. Please try again.");
    }
  }
  return (
    <section className="card">
      <h2>{t("Connection tools")}</h2>
      <p>{t("Check database access and refresh connected screens. The diagnostic summary contains no account details or keys.")}</p>
      <div className="button-row spaced">
        <button disabled={busy} onClick={() => void inspect()}>
          {t(busy ? "Checking…" : "Check connections")}
        </button>
        <button className="secondary" disabled={!checks.length} onClick={() => void copy()}>
          {t("Copy diagnostic summary")}
        </button>
      </div>
      <div className="developer-checks spaced">
        {checks.map((check) => (
          <p key={check.name}>
            <strong>{t(check.name)}</strong>
            <span className={`status-badge ${check.ok ? "green" : "red"}`}>{t(check.ok ? "Connected" : "Needs attention")}</span>
          </p>
        ))}
      </div>
      {message && <p role="status">{t(message)}</p>}
    </section>
  );
}
