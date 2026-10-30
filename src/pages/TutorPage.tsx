import { TutorWorkspaceSection } from "../components/TutorWorkspaceSection";
import { useI18n } from "../lib/i18n";
import { Link, useSearch } from "wouter";
import { Card } from "../components/Card";
import { PageHeading } from "../components/PageHeading";
import { Icon } from "../components/Icon";
import { useLearning } from "../lib/learningContext";

const tabs = [
  { id: "overview", title: "Plan & teach" },
  { id: "classes", title: "Classes & assignments" },
  { id: "library", title: "Material library" },
  { id: "ai-course", title: "AI book course" },
  { id: "students", title: "Students & reports" },
  { id: "reviews", title: "Review work" },
  { id: "content", title: "My editable material" },
];
const contentTabs = [
  { id: "lessons", title: "Lessons" },
  { id: "questions", title: "Quizzes" },
  { id: "vocabulary", title: "Vocabulary" },
  { id: "passages", title: "Reading" },
  { id: "writing", title: "Writing" },
  { id: "assign", title: "Assign & schedule" },
];

export function TutorPage() {
  const { t } = useI18n();
  const { session, profile } = useLearning();
  const search = useSearch();
  const requested = new URLSearchParams(search).get("view") ?? "overview";
  const view = requested === "content" ? "lessons" : requested;
  const editing = contentTabs.some((tab) => tab.id === view);
  if (!session || profile?.role !== "tutor")
    return (
      <Card className="empty-state">
        <Icon name="tutor" size={40} />
        <h1>{t("A space for the person in your corner.")}</h1>
        <p>{t("The tutor workspace is available to approved tutor accounts. Students can explore their lessons from the learning dashboard.")}</p>
        <Link className="button primary" href={session ? "/" : "/sign-in"}>
          {session ? t("Back to your dashboard") : t("Sign in as a tutor")}
          <Icon name="arrow" size={16} />
        </Link>
      </Card>
    );
  return (
    <>
      <PageHeading
        eyebrow={t("THE TUTOR WORKSPACE")}
        title={t("Your teaching desk")}
        description={t("Create a class. Pick a module. Give clear feedback.")}
        action={
          <span className="status-badge green">
            <Icon name="shield" size={13} />
            {t("Tutor access")}
          </span>
        }
      />
      <nav className="tutor-tabs" aria-label={t("Tutor workspace")}>
        {tabs.map((tab) => (
          <Link key={tab.id} href={`/tutor?view=${tab.id}`} className={view === tab.id || (tab.id === "content" && editing) ? "active" : ""}>
            {t(tab.title)}
          </Link>
        ))}
      </nav>
      {editing && (
        <nav className="tutor-tabs tutor-content-tabs" aria-label={t("Content type")}>
          {contentTabs.map((tab) => (
            <Link key={tab.id} href={`/tutor?view=${tab.id}`} className={view === tab.id ? "active" : ""}>
              {t(tab.title)}
            </Link>
          ))}
        </nav>
      )}
      <Link href="/classroom" className="text-link spaced">
        {t("Live Classroom")} <Icon name="arrow" size={15} />
      </Link>
      <TutorWorkspaceSection view={view} />
    </>
  );
}
