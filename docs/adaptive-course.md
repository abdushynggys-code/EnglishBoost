# Adaptive English course

The course starts at `/placement`, with 12 adaptive questions across grammar, vocabulary, reading, and listening. It starts each skill at A2, adjusts the next question, and records assisted or skipped answers separately. A level needs two correct independent answers at that level or above. This gives a conservative starting estimate, not a CEFR certificate.

Writing and speaking prompts are practice samples. The app does not invent a pronunciation or writing score. Listening uses the browser's English speech voice, requires completed playback for an independent answer, and offers a transcript when audio is unavailable.

`/course` contains four units and 28 short lessons at the estimated starting level. Daily goals are 5, 10, or 15 minutes. The selected interest changes application prompts. Lessons include reading, grammar, fill-in answers, sentence building, listening, writing, and review. Public-domain book inspiration is attributed; the practice stories are explicitly labelled as simplified original texts. Commercial readers are linked to their publishers, not copied.

- New completed lessons earn 10 XP once; passing checkpoints earn 30 XP once.
- Checkpoints require 80% to unlock the next unit. Failed checkpoints preserve completed lessons and schedule review cards.
- Due review sessions earn 5 XP at most once per learner-local day. Remaining due items can still be reviewed that day.
- Review intervals are 1, 3, 7, 14, and 28 days after successful independent reviews. Errors return an item to the 1-day interval. Immediate retries do not advance the schedule.
- Reviews prioritize previous mistakes, then overdue items, with at most eight questions per session.
- Two first-attempt perfect checkpoints plus strong due-review results remove answer choices from a grammar task. A weaker later checkpoint removes that extra challenge.
- Streaks use learner-local dates and preserve yesterday's active streak until today ends. Badges mark practice milestones, not proficiency.
- Retaking placement requires confirmation because saving a new result resets course progress and XP.

Signed-in data uses `course_profiles`, `course_completions`, and `course_reviews`. RLS restricts reads to the owner; atomic authenticated functions save placement and lessons, enforce lesson gates, calculate XP, and prevent duplicate rewards. Course content is bundled and public; demo responses stay in memory for the visit.

Run `npm run test:course` for the placement, repetition, data, unlock, XP, streak, and challenge checks. Run `npm run build` before publishing.

These intervals and thresholds are product defaults. Spaced practice supports retention but does not guarantee it. See [the original spacing study](https://pubmed.ncbi.nlm.nih.gov/19076480/) and [the Council of Europe descriptors](https://www.coe.int/en/web/common-european-framework-reference-languages/cefr-descriptors).
