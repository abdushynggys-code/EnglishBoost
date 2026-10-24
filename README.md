# EnglishBoost

An English learning app for independent learners and tutor-led classes, from first words to advanced communication.
Built with **Vite, React 18, TypeScript, wouter, and Supabase**, with Vercel routing already configured.

## Run locally

```powershell
npm install
npm run dev
```

Open the local URL printed by Vite, usually `http://localhost:5173`.
Use Node.js 22.12 or newer. Run `npm run build` before deploying.

## Learning and account access

The public introduction offers three small practice samples. Students can sign in with Google or email and learn independently. Joining a tutor class is optional: enter its code in Settings to add classroom and homework navigation.

Actual tutor and developer privileges use separate server-side allowlists. The sign-in role choice never grants permissions. Authorised developers can open a private, isolated sandbox from Settings; there is no public demo.

## What works

- A six-level personal course with 24 modules, 168 lessons, adaptive assessment, 2,400 contextual question variants, SRS and advanced daily challenges.
- Tutor class codes, ready-to-teach modules, class-wide assignments and private notifications.
- Persistent player XP, coins, fame and an eleven-tier streak-symbol shop.
- Supplemental eight-week school resources with lesson content, objectives and homework ideas.
- First-visit language choice: English, Deutsch, Русский, or Қазақша. Interface labels follow that choice; English practice stays in English. Change the language and learning focus in Settings.
- Access 2 Unit 1 practice based on the supplied pages: eight mapped lessons and base homework tasks, 30 questions, 50 vocabulary entries, and three adapted readings. Kazakh explanations accompany the new lessons and questions. See [content notes](docs/access2-homework.md).
- “Get to the Point!”: main ideas, flexible sentence guides, relevant details, shortening, conversation, and response styles. Original/improved responses, self-checks, objective results, and tutor reviews are saved.
- Adaptive communication suggestions use recent saved attempts. Written answers receive transparent self-check points and simple reminders; meaning is reviewed by the tutor. Multiple valid answers are welcome, and detailed answers are appropriate when the question needs them.
- Live Classroom: tutors start a room for an assigned student, advance slides, launch grammar questions or summary practice, and read answers. Supabase Realtime sends updates, with polling while reconnecting. A private developer preview is available for testing.
- Grammar practice: choices, blanks, sentence correction, true/false, explanations, scores, retries, and saved attempts.
- English/German/Russian/Kazakh vocabulary support, flashcards, matching and spelling games, theme filters, pronunciation, and review dates.
- Reading passages with scored comprehension questions and written answers for tutor review.
- Writing prompts, word counts, a review checklist, drafts, up to 20 saved revisions, and tutor feedback.
- Homework assignments, due dates, material links, submissions, revisions, and tutor scores.
- Progress charts, topic accuracy, practice recommendations, activity history, and a weekly activity view.
- A calm home screen, compact navigation, phone bottom bar, profile settings, calendar downloads, and optional soft click sounds (off by default).

## Tutor setup

The migrations provision **abdushynggys@gmail.com** as the tutor account.
Sign in with that exact account, then open **Tutor Workspace** or `/tutor`.
The role is set in the database; a student cannot promote themselves through the app.

In the tutor workspace:

1. Approve the student’s sign-in email under **Students & reports**.
2. Share your website link with the student. Approval does not send an invitation email.
3. The student signs in with that address. Previously approved addresses are approved at registration.
4. Edit lessons and manage quizzes, vocabulary, reading, and writing prompts.
5. Assign homework and schedule tutoring sessions under **Assign & schedule**.
6. Review submitted writing/homework and communication practice under **Review work**. Communication practice can also be linked to homework or lessons.
7. Open a student’s report to see results, recurring mistakes, and a generated factual progress summary.

## Supabase configuration

Your local `.env` needs:

```dotenv
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_PUBLISHABLE_KEY
```

Keep `.env` out of Git. Never use a service-role key in the frontend.
This project uses the existing Supabase client in `src/lib/supabase.ts`.

Schema and access policies are in `supabase/migrations/`.
The EnglishBoost migrations have been applied to the linked project.
For a fresh checkout, run these commands yourself if login/link is needed:

```powershell
npm run db:login
npx.cmd supabase link --project-ref iypqfesjyodudiubdvqh
npm run db:push -- --dry-run
npm run db:push -- --yes
```

Enter the database password in your terminal if prompted. Hidden typing is normal.
Apply future schema changes through new migrations rather than the SQL Editor.
All student tables use Row Level Security. Tutors can read only students linked to them.
Public starter content is seeded through migrations; the private developer sandbox uses bundled sample copies.
Language, learning focus, level, and sound preferences are cached locally and saved to the signed-in profile. Learning responses remain in Supabase; sandbox responses remain in memory only.
The new communication and classroom tables use RLS; students cannot set their tutor score or control classroom activities.

For Google sign-in, enable Google in Supabase Authentication and configure its OAuth credentials.
Allow `http://localhost:5173/sign-in` and your deployed `/sign-in` URL under Authentication → URL Configuration.
Google’s authorized callback is your Supabase project’s `/auth/v1/callback` URL.

## Adaptive course

Open `/course` or `/placement` for the adaptive 15/20/30-question level check and connected six-level learning path, with XP, coins, checkpoints and spaced reviews. Read [the course rules](docs/adaptive-course.md). Run `npm run test:course` to check the learning logic.

## Scope and integrations

- Writing guidance is rule based. Detailed correction and grading come from the tutor; no AI correction is claimed.
- Tutor-authored free text is displayed as written. Lesson, grammar, reading, and vocabulary editors provide optional German/Russian explanation fields; the app does not claim to automatically translate arbitrary material.
- Live Classroom is shared teaching content and answers, without embedded video calling. Use a scheduled meeting link alongside it if needed.
- Written reading answers are excluded from automatic scores and are visible to the tutor in recent practice answers.
- Speaking is practised with browser pronunciation and tutor conversation; there is no automatic speech assessment.
- Pronunciation depends on your browser’s installed speech voices.
- Calendar buttons download an `.ics` file; they do not connect to a Google Calendar account.
- Learning materials are links. There is no file-upload interface in this version.
- The progress ring measures completed learning activities, not a language proficiency certification.

## Project structure

`src/pages/` contains routes; `src/components/` contains reusable screens and cards.
`src/lib/` owns Supabase requests, types, and learning logic.
`src/data/` contains course content, question-bank generators and private sandbox samples. `src/styles/` is split by component and screen size.
The Inter font is served locally; its license is in `public/fonts/OFL.txt`.

## Deploy

Use the existing GitHub → Vercel setup. Set the same `VITE_SUPABASE_*` values in Vercel.
Build with `npm run build`, commit your changes, and push when ready.
`vercel.json` supports direct page loads and refreshes on every application route.

Keep `.github/workflows/keep-awake.yml` enabled. To configure its GitHub secrets,
run `npm run keep-awake:setup` yourself and look for `Keep-alive verified: <link>`.
