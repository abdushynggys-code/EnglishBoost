import { lazy, Suspense } from 'react';
import { PageLoading } from './components/PageLoading';
import { Route, Switch } from 'wouter';
import { LearningProvider } from './components/LearningProvider';
import { AppShell } from './components/AppShell';
import { LanguageProvider } from './components/LanguageProvider';
import { CourseProvider } from './components/CourseProvider';
const CoursePage = lazy(() => import('./pages/CoursePage').then((module) => ({ default: module.CoursePage })));
const PlacementPage = lazy(() => import('./pages/PlacementPage').then((module) => ({ default: module.PlacementPage })));
const CourseLessonPage = lazy(() => import('./pages/CourseLessonPage').then((module) => ({ default: module.CourseLessonPage })));
const HomePage = lazy(() => import('./pages/HomePage').then((module) => ({ default: module.HomePage })));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage').then((module) => ({ default: module.NotFoundPage })));
const SignInPage = lazy(() => import('./pages/SignInPage').then((module) => ({ default: module.SignInPage })));
const ProfilePage = lazy(() => import('./pages/ProfilePage').then((module) => ({ default: module.ProfilePage })));
const LessonsPage = lazy(() => import('./pages/LessonsPage').then((module) => ({ default: module.LessonsPage })));
const LessonPage = lazy(() => import('./pages/LessonPage').then((module) => ({ default: module.LessonPage })));
const PracticePage = lazy(() => import('./pages/PracticePage').then((module) => ({ default: module.PracticePage })));
const VocabularyPage = lazy(() =>
  import('./pages/VocabularyPage').then((module) => ({ default: module.VocabularyPage })),
);
const ReadingPage = lazy(() => import('./pages/ReadingPage').then((module) => ({ default: module.ReadingPage })));
const ReadingActivityPage = lazy(() =>
  import('./pages/ReadingActivityPage').then((module) => ({ default: module.ReadingActivityPage })),
);
const WritingPage = lazy(() => import('./pages/WritingPage').then((module) => ({ default: module.WritingPage })));
const HomeworkPage = lazy(() => import('./pages/HomeworkPage').then((module) => ({ default: module.HomeworkPage })));
const ProgressPage = lazy(() => import('./pages/ProgressPage').then((module) => ({ default: module.ProgressPage })));
const ResourcesPage = lazy(() => import('./pages/ResourcesPage').then((module) => ({ default: module.ResourcesPage })));
const SettingsPage = lazy(() => import('./pages/SettingsPage').then((module) => ({ default: module.SettingsPage })));
const TutorPage = lazy(() => import('./pages/TutorPage').then((module) => ({ default: module.TutorPage })));
const BookPage = lazy(() => import('./pages/BookPage').then((module) => ({ default: module.BookPage })));
const PracticeHubPage = lazy(() =>
  import('./pages/PracticeHubPage').then((module) => ({ default: module.PracticeHubPage })),
);
const SummarizePage = lazy(() => import('./pages/SummarizePage').then((module) => ({ default: module.SummarizePage })));
const ClassroomPage = lazy(() => import('./pages/ClassroomPage').then((module) => ({ default: module.ClassroomPage })));
const ClassroomRoomPage = lazy(() =>
  import('./pages/ClassroomRoomPage').then((module) => ({ default: module.ClassroomRoomPage })),
);

// Здесь живут только маршруты. Сами экраны складывай в src/pages/.
export default function App() {
  return (
    <LearningProvider>
      <LanguageProvider>
        <CourseProvider>
        <AppShell>
          <Suspense fallback={<PageLoading />}>
            <Switch>
              <Route path="/" component={HomePage} />
              <Route path="/course" component={CoursePage} />
              <Route path="/placement" component={PlacementPage} />
              <Route path="/course/:id">{(params) => <CourseLessonPage key={params.id} params={params} />}</Route>
              <Route path="/sign-in" component={SignInPage} />
              <Route path="/profile" component={ProfilePage} />
              <Route path="/book" component={BookPage} />
              <Route path="/learn" component={PracticeHubPage} />
              <Route path="/summarize" component={SummarizePage} />
              <Route path="/classroom" component={ClassroomPage} />
              <Route path="/classroom/:id" component={ClassroomRoomPage} />
              <Route path="/lessons" component={LessonsPage} />
              <Route path="/lessons/:id" component={LessonPage} />
              <Route path="/practice" component={PracticePage} />
              <Route path="/vocabulary" component={VocabularyPage} />
              <Route path="/reading" component={ReadingPage} />
              <Route path="/reading/:id" component={ReadingActivityPage} />
              <Route path="/writing" component={WritingPage} />
              <Route path="/homework" component={HomeworkPage} />
              <Route path="/progress" component={ProgressPage} />
              <Route path="/resources" component={ResourcesPage} />
              <Route path="/settings" component={SettingsPage} />
              <Route path="/tutor" component={TutorPage} />
              <Route component={NotFoundPage} />
            </Switch>
          </Suspense>
        </AppShell>
        </CourseProvider>
      </LanguageProvider>
    </LearningProvider>
  );
}
