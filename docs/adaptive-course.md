# Connected learning and progression

EnglishBoost supports independent study immediately after sign-up. Joining a class is optional. Student navigation hides classrooms and homework until a class is joined. Settings contains the class-code form and language preferences. Only the public introduction has a language popover; the app header contains streaks, notifications and the profile menu.

## Course and assessment

- Levels 1–6 map to A1, A2, B1, B2, C1 and C2. CEFR references remain visible as secondary text.
- Each level has four modules and seven lessons per module: 24 modules / 168 lessons for a learner starting at Level 1.
- Placement starts around the middle, moves up and down, and rotates grammar, vocabulary, reading and listening. The first 12 answers set the session length: 15 for strong independent performance, 20 for mixed performance, 30 for learners needing more evidence. Assisted and skipped answers do not establish a listening level.
- There are 400 contextual question variants per level (2,400 total): 100 each for grammar, vocabulary, reading and listening. They are generated from original language patterns, definitions and contextual notices. This is a varied practice bank, not 2,400 independently authored concepts or a certified proficiency exam.
- Each module includes an original real-world text, a pattern explanation and an application task. Topics progress from introductions and shopping to argument, uncertainty, register, subtext and mediation.
- Ordinary lessons have 30 questions at Levels 1–2, 20 at Levels 3–4 and 15 at Levels 5–6. Writing lessons are open responses. Sentence building includes both typed gaps and word ordering.
- A stable placement ID seeds each learner's selection and question order. Different learners receive different combinations. Review prioritises errors and due items at 1, 3, 7, 14 and 28 days.
- Module checkpoints need 80%. Completing a level opens the next level without another placement or a progress reset.
- Transcript-assisted lesson answers count as reading practice and are clearly labelled. They do not create an independent listening assessment. Writing and speaking samples remain ungraded practice.
- After the last module, a fresh daily advanced challenge uses 15 Level 6 items, with typed grammar answers. One daily challenge reward is available. Errors feed back into review.
- The materials library lets students practise any of the 24 modules without changing their personal path. Tutors can assign these module URLs or copy the teaching material into their editable lessons.

The sequence uses the [Council of Europe framework](https://www.coe.int/en/web/common-european-framework-reference-languages/introduction-and-context) and [descriptors](https://www.coe.int/en/web/common-european-framework-reference-languages/cefr-descriptors), with grammar reference links to the [British Council](https://learnenglish.britishcouncil.org/free-resources/grammar). Practice texts are original; linked publishers and books are not reproduced.

## Tutor workflow

1. Open the teaching desk and create a class.
2. Share the generated ten-character code. Students enter it in Settings.
3. Pick a level and module, add instructions and a due date, and assign it to the class.
4. Students receive private notifications and submit their response through Homework.
5. Review submissions and use the student course report to see level, completed lessons, lifetime XP and outstanding assignments.

Existing editable content tools, individual assignments and live lesson controls remain available. Actual tutor privileges are assigned through the existing account allowlist, independently of the sign-in role preference. A student's own course does not depend on tutor approval or participation in a class.

Notifications cover class joining, new assignments, tutor feedback and scheduled sessions. Realtime updates have a polling fallback. Notification reads are owner-only; tutors receive only reports for students linked to them.

## XP, coins and streakers

- Player level is separate from the six course levels. The cumulative threshold for player level L is `(L - 1) * (L + 99)` XP. Player level 200 requires 59,501 XP; 60,000 XP reaches level 201.
- Base XP: ordinary lesson 100, module checkpoint 250, due review 50, advanced daily challenge 150.
- A perfect scored session adds 20 XP. Consecutive learner-local study days add up to 20 XP. A server-timed run completed between 45 seconds and 3 minutes adds 10 XP; no bonus is awarded for rushing faster.
- Coins per rewarded session are `max(1, floor(awarded XP / 10)) + min(5, floor(streak / 3))`.
- Lifetime XP, coins, streaks and owned items survive a placement retake. Replays and repeated saves cannot grant the same lesson reward twice.
- Fame begins at 70,000 XP and rises by one per further 10,000 XP.
- Eleven tiers are visible from the start. Seed is free, Fire is Tier 2, and Black hole is Tier 10, unlocked at player level 150 / 37,101 XP. Later tiers have richer motion. Reduced-motion preferences disable decorative animation.
- Tier 11 is Unknown: at least 70,000 XP, a free claim, exactly one worldwide owner. An atomic database update reserves the single slot. Account deletion does not reopen a claimed slot.
- Purchases lock the learner's wallet, check XP and coin requirements, deduct once and record ownership. Equipping an owned item does not charge again.

Supabase enforces ownership, lesson gates, reward amounts, duplicate protection and purchases. Answer correctness is graded in the browser; this educational build is not an invigilated or cheat-proof exam. All new tables use RLS, and sensitive writes go through authenticated functions.

## Private development sandbox

There is no public demo route or demo sign-in link. Developer access is an additional per-account allowlist in `developer_accounts`, separate from student/tutor roles. No account is automatically added. When the owner identifies an account, grant access through a new migration and `npm run db:push`; never use an email match or browser setting as authorisation.

Authorised accounts get a Developer tools entry in Settings that opens a separate tab. The developer workspace can choose:

- Student or tutor preview.
- Starting course level and fresh / partly completed / completed path.
- Entry screen: course, shop, classroom, teaching desk or Settings.
- Temporary XP and coin balances for testing player levels and shop thresholds.

The sandbox uses in-memory course progress, fictional people and classes, and a sample workspace. A shared fetch guard blocks database, storage and function mutations. Profile language changes do not change the real preference cache. Real purchases and assignments are disabled. Exit sandbox restores the signed-in account. Unreleased UI can be placed behind this developer gate; deploying arbitrary new code still requires the normal reviewed build and publish process.

## Verification

- `npm run test:course`: all six banks, unique IDs, correct choices, lesson sizes, personalisation, 15/20/30 assessment lengths, cross-level gates, progression thresholds, SRS and transcript grading.
- `npm run build`: TypeScript and production bundling.
- `supabase/tests/connected_learning.sql`: database-owner test transaction, always rolled back. Covers independent access, role safety, classes, private assignments, notifications, server XP, timed bonuses, duplicate and retake protection, continuing a daily review, own-row RLS, tutor reports, purchases and the unique worldwide item.
- Browser checks exercise public samples and language switching, independent navigation, full lesson saves, placement, class joining, tutor assignments, all shop tiers, mobile widths, private developer entry and the absence of sandbox writes.

Schema changes live in timestamped migrations. Use `npm run db:push -- --dry-run` and `npm run db:push -- --yes`; no manual SQL Editor setup is needed.
