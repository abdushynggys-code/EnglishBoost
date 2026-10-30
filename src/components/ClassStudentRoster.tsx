import type { ClassMember } from "../lib/classes";
import { gameLevel } from "../lib/gamification";
import { useI18n } from "../lib/i18n";
import { Icon } from "./Icon";

export function ClassStudentRoster({ members, selectedIds, onChange }: {
  members: ClassMember[];
  selectedIds: string[];
  onChange: (ids: string[]) => void;
}) {
  const { t } = useI18n();
  function toggle(id: string) {
    onChange(selectedIds.includes(id) ? selectedIds.filter((item) => item !== id) : [...selectedIds, id]);
  }
  return (
    <section className="card class-student-roster">
      <div className="card-heading"><div><h2>{t("Students")}</h2><p>{t("Select everyone or a small group for the next action.")}</p></div>
        <span className="status-badge blue">{selectedIds.length}/{members.length}</span></div>
      {!!members.length && <div className="button-row class-selection-actions">
        <button className="secondary" onClick={() => onChange(members.map((member) => member.user_id))}>{t("Select all")}</button>
        <button className="text-button" onClick={() => onChange([])}>{t("Clear")}</button>
      </div>}
      <div className="class-student-list">
        {members.map((member) => <label key={member.user_id} className={selectedIds.includes(member.user_id) ? "selected" : ""}>
          <input type="checkbox" checked={selectedIds.includes(member.user_id)} onChange={() => toggle(member.user_id)} />
          <span className="student-select-avatar">{member.name.split(" ").map((part) => part[0]).slice(0, 2).join("").toUpperCase()}</span>
          <span><strong>{member.name}</strong><small>{member.course_level || t("No course yet")} · {t("Player level")} {gameLevel(member.xp)}</small></span>
          <span className="student-work-count"><strong>{member.completed}</strong><small>{t("done")}</small></span>
          {selectedIds.includes(member.user_id) && <Icon name="check" size={17} />}
        </label>)}
      </div>
      {!members.length && <p>{t("Share the class code to add the first learner.")}</p>}
    </section>
  );
}
