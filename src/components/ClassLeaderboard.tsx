import type { ClassMember } from "../lib/classes";
import { gameLevel } from "../lib/gamification";
import { useI18n } from "../lib/i18n";
import { courseLevels, levelNumber } from "../lib/course/levels";
export function ClassLeaderboard({ members, userId }: { members: ClassMember[]; userId?: string }) {
  const { t } = useI18n();
  return (
    <section className="card">
      <p className="eyebrow">{t("GROW TOGETHER")}</p>
      <h2>{t("Class leaderboard")}</h2>
      <p>{t("Ranked by lifetime learning XP. Every lesson counts.")}</p>
      {!members.length ? (
        <p className="spaced">{t("Share your code to welcome the first learner.")}</p>
      ) : (
        <div className="table-scroll spaced">
          <table className="class-table">
            <thead>
              <tr>
                {["Rank", "Learner", "Player level", "XP", "Homework done", "To do"].map((label) => (
                  <th key={label}>{t(label)}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {members.map((member, index) => (
                <tr key={member.user_id} className={member.user_id === userId ? "is-you" : ""}>
                  <td>
                    <strong>{index + 1}</strong>
                  </td>
                  <td>
                    {member.name}
                    {member.user_id === userId && <span className="you-label">{t("You")}</span>}
                    {member.course_level && (
                      <span className="cefr-caption">
                        {t("Level")} {levelNumber(courseLevels.find((level) => level === member.course_level) ?? "A1")} · {member.course_level}
                      </span>
                    )}
                  </td>
                  <td>{gameLevel(member.xp)}</td>
                  <td>{Number(member.xp).toLocaleString()}</td>
                  <td>
                    <span className="status-badge green">{member.completed}</span>
                  </td>
                  <td>{member.pending}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
