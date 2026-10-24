import { useEffect, useState } from "react";
import { Link } from "wouter";
import { useI18n } from "../lib/i18n";
export function ExperimentalTools() {
  const { t } = useI18n();
  const [compact, setCompact] = useState(false);
  const [focus, setFocus] = useState(false);
  const [calm, setCalm] = useState(false);
  useEffect(() => {
    document.body.classList.toggle("lab-compact", compact);
    document.body.classList.toggle("lab-focus", focus);
    document.body.classList.toggle("lab-calm", calm);
    return () => {
      document.body.classList.remove("lab-compact", "lab-focus", "lab-calm");
    };
  }, [compact, focus, calm]);
  return (
    <details className="experimental-tools">
      <summary>{t("Experimental demo tools")}</summary>
      <p>{t("Temporary visual experiments. These controls never change the live app for learners.")}</p>
      <div>
        {[
          { value: compact, set: setCompact, label: "Compact cards" },
          { value: focus, set: setFocus, label: "Focus layout" },
          { value: calm, set: setCalm, label: "Pause animations" },
        ].map(({ value, set, label }) => (
          <label key={label}>
            <input type="checkbox" checked={value} onChange={(e) => set(e.target.checked)} />
            {t(label)}
          </label>
        ))}
      </div>
      <Link href="/settings" className="text-link">
        {t("Settings")} →
      </Link>
    </details>
  );
}
