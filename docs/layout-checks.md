# Layout checks — 24 October 2026

The browser audit completed 486 viewport checks with populated, simulated student, tutor and developer accounts. Supabase HTTP calls used test fixtures; database permissions and saves were checked separately with rollback-only SQL tests.

| Area | Coverage |
| --- | --- |
| Public | Introduction, sign-in, tutor sign-in |
| Learning | Dashboard, course path, placement, lesson, sentence practice, writing, checkpoint, review |
| Library | All-level materials, module practice, book, lesson list/detail, practice hub, quizzes, vocabulary, reading list/detail |
| Personal | Profile, progress, resources, settings, homework, summarizing |
| Classes | Class list, leaderboard/homework page, live lesson room |
| Tutor | Overview, classes, library, students, reviews, assignments, and all five content editors |
| Developer | Workspace layout; isolated demo behaviour checked in separate browser tests |
| Other | Unknown-route page |

Student and tutor routes were checked in English, German, Russian and Kazakh. English widths included 320, 390, 768, 1024 and 1440 px; translated routes included 320 and 1440 px. Public and developer pages were checked at 320, 390, 768 and 1440 px.

Checks covered page overflow, content extending beyond the viewport, clipped headings/buttons, and browser errors. Scrollable tables and intentionally hidden navigation were excluded from overflow warnings. Screenshots were inspected for the narrow tutor layout and themed Spark collections.

The first pass found a tutor student card where the report button overflowed at 320 px in German. The row now wraps, its text can shrink/wrap, and the action uses the available width. The completed rerun found no overflow or clipped-heading/button failures and no browser errors.

Separate interaction checks covered all 201 Spark drawings, Fame immediately below/at 40,000 XP, thirty-question practice with round breaks, typed checkpoint answers, lesson saves, class joins/deletion, notifications and sandbox write protection. These checks cover the tested content and states; future content changes should be checked again.

The logo and 40,000-XP update also passed 16 owner-banner layouts (four languages, 320/390/768/1440 px), reduced-motion checks, favicon loading, unlock boundaries, developer preview/exit isolation and the corrected journey question in review. Database tests reject an Unknown claim at 39,999 XP, allow it at 40,000 XP and reject a second worldwide owner; fixtures are rolled back.

The later progression rebalance supersedes those thresholds: Unknown now requires 70,000 XP and Fame begins at 60,000 XP. Its focused rerun passed the same 16 banner layouts and boundary checks around early tiers, Tier 10, Fame and Unknown. Rollback database tests reject Unknown at 69,999 XP, accept it at 70,000 XP and preserve the single worldwide claim. The pacing and price model is documented in adaptive-course.md.
