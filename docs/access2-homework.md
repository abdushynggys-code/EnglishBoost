# Access 2 Unit 1 homework

Source: the learner supplied 25 photographs of Cornelsen English G Access 2 (G9).
This pack contains adapted practice and short retellings, not a full textbook import.
The textbook remains useful alongside the app.

| Photos (filename number) | Book pages | Practice |
| --- | --- | --- |
| 1–4 | 10–13 | Holidays, was/were, weather, paragraph layout |
| 5–7 | 14–16 | A new neighbour, regular/irregular past verbs, -ed pronunciation |
| 8 | 17 | Context clues and the pony story |
| 9–12 | 18–21 | Past questions, phone calls, communication |
| 13–16 | 22–25 | Abby's news, feelings, negatives |
| 17–18 | 26–27 | Crib sheets and everyday English |
| 19–20 | 28–29 | My USA logbook |
| 21–22 | 30–31 | Holiday brochure and self-reflection |
| 23–24 | 206–207 | Vocabulary and irregular past forms |
| 25 | Cover | Book and edition identification |

Audio/video recordings and pages referenced but not supplied (for example 142 and 277)
are not included. Listening and speaking are not automatically scored.

## Use

- Select Қазақша on first visit or under Settings → Language & learning.
- My Book shows the mapped Unit 1 lessons.
- Homework shows eight self-paced base tasks plus the tutor's assigned work.
- Open a base task to write, save a draft, revise, and submit for tutor review.
- Grammar/reading practice is linked from the corresponding lesson.
- Tutors can select a homework template, edit it, choose a student, and set a deadline.
- More material can be added through the existing tutor content editor, including
  unit/page references and optional Kazakh explanations. Photo/PDF import is not implemented.

## Storage

The two migrations add Kazakh fields/preferences and shared Unit 1 learning content:

- `20261015161533_kazakh_language.sql`
- `20261015161535_access2_unit1_homework.sql`

Existing RLS rules remain in place. Learning content uses the established shared-content
policies; each student's drafts, quiz results, and submissions use the existing user-owned
tables and policies. No student is automatically assigned a due date.
Demo data in `src/data/access2/` mirrors the seeded content. Demo progress resets on refresh.

The Kazakh catalog is under `src/locales/kk/`. For tutor-authored content without a Kazakh
explanation, the app uses the original text; it never substitutes Russian for Kazakh.
