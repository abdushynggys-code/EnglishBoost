import { Link } from "wouter";
import { ClassConnections } from "./ClassConnections";
import { TutorClassAssignment } from "./TutorClassAssignment";
import { TutorMaterialLibrary } from "./TutorMaterialLibrary";
import { TutorCourseReports } from "./TutorCourseReports";
import { TutorStudents } from "./TutorStudents";
import { TutorContent } from "./TutorContent";
import { TutorAssignment } from "./TutorAssignment";
import { TutorReviews } from "./TutorReviews";
import { Card } from "./Card";
import { Icon } from "./Icon";
import { useI18n } from "../lib/i18n";
import type { ContentKind } from "../lib/contentForms";
const actions = [
  ["classes", "Create a class", "Share a code and assign your next lesson."],
  ["library", "Choose material", "24 modules from first words to advanced English."],
  ["reviews", "Give feedback", "Read submissions and help students move forward."],
];
export function TutorWorkspaceSection({ view }: { view: string }) {
  const { t } = useI18n();
  if (view === "overview")
    return (
      <>
        <div className="tutor-start-grid">
          {actions.map(([id, title, description]) => (
            <Link className="card" key={id} href={`/tutor?view=${id}`}>
              <Icon name={id === "classes" ? "tutor" : id === "library" ? "book" : "pen"} />
              <h2>{t(title)}</h2>
              <p>{t(description)}</p>
              <span className="text-link">{t("Open")} →</span>
            </Link>
          ))}
        </div>
        <TutorCourseReports />
        <TutorMaterialLibrary />
      </>
    );
  if (view === "classes")
    return (
      <>
        <ClassConnections />
        <TutorClassAssignment />
      </>
    );
  if (view === "library") return <TutorMaterialLibrary />;
  if (view === "students")
    return (
      <>
        <TutorCourseReports />
        <TutorStudents />
      </>
    );
  if (view === "assign") return <TutorAssignment />;
  if (view === "reviews") return <TutorReviews />;
  if (["lessons", "questions", "vocabulary", "passages", "writing"].includes(view)) return <TutorContent key={view} kind={view as ContentKind} />;
  return (
    <Card title={t("Choose a workspace section")}>
      <p>{t("Use the tabs above to manage your tutoring.")}</p>
    </Card>
  );
}
