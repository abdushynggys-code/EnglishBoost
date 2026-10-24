import type { CourseLevel, CourseQuestion } from "../../lib/course/types";
import { bankGrammar } from "./bankGrammar";
import { bankVocabulary } from "./bankVocabulary";
import { vocabularyExamples } from "./vocabularyExamples";
import { levelNumber } from "../../lib/course/levels";
const scenes = [
  ["Maya", "library", "notebook", "a reading club"],
  ["Leo", "station", "ticket", "a late bus service"],
  ["Amina", "museum", "guidebook", "a local exhibition"],
  ["Noah", "cafe", "sandwich", "a community kitchen"],
  ["Sara", "school", "folder", "a student exchange"],
  ["Omar", "office", "calendar", "a flexible working scheme"],
  ["Eva", "market", "basket", "a recycling project"],
  ["Kai", "theatre", "programme", "a public performance"],
  ["Zara", "clinic", "form", "a health information campaign"],
  ["Ben", "hotel", "map", "a walking tour"],
];
export function shuffled<T>(items: readonly T[], seed: string): T[] {
  let state = [...seed].reduce((n, c) => (Math.imul(n, 31) + c.charCodeAt(0)) >>> 0, 2166136261);
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    const j = state % (i + 1);
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}
const cache = new Map<CourseLevel, CourseQuestion[]>();
export function buildQuestionBank(level: CourseLevel): CourseQuestion[] {
  const existing = cache.get(level);
  if (existing) return existing;
  const result: CourseQuestion[] = [];
  const advanced = levelNumber(level) >= 4;
  scenes.forEach(([name, place, item, project], scene) => {
    const fill = (s: string) => s.split("{name}").join(name).split("{place}").join(place).split("{item}").join(item);
    bankGrammar[level].forEach(([prompt, answer, a, b, explanation], index) => {
      const id = `${level}-bank-g${scene * 10 + index}`;
      result.push({
        id,
        level,
        skill: "grammar",
        prompt: fill(prompt),
        answer,
        options: shuffled([answer, a, b], id),
        explanation,
      });
    });
    bankVocabulary[level].forEach(([word, answer, a, b], index) => {
      const id = `${level}-bank-v${scene * 10 + index}`;
      result.push({
        id,
        level,
        skill: "vocabulary",
        prompt: `What does "${word}" mean?`,
        target_word: word,
        passage: fill(vocabularyExamples[level][index]),
        answer,
        options: shuffled([answer, a, b], id),
        explanation: `${word}: ${answer}. Example: ${fill(vocabularyExamples[level][index])}`,
      });
    });
    for (let variant = 0; variant < 10; variant++) {
      const time = `${9 + variant}:30`;
      const cost = 12 + scene * 3 + variant;
      const basic = `${name} works at the ${place}. There is a meeting about ${project} at ${time} on Thursday. A ticket costs ${cost} pounds. Students pay half price. Please bring a ${item}. The meeting was moved from Tuesday because the organiser was ill.`;
      const intermediate = `${name} has rescheduled the discussion of ${project} from Tuesday to Thursday at ${time}, following the organiser's illness. Although entry normally costs ${cost} pounds, students receive a fifty-percent discount. Visitors should bring a ${item}. Anyone unable to attend can request a written summary; no recording will be made.`;
      const complex = `In a memo about ${project}, ${name} provisionally endorsed a Thursday meeting at ${time}. The suggested fee of ${cost} pounds, with a fifty-percent student concession, remains subject to consultation. While the pilot's early results appear encouraging, the memo cautions that volunteers may not represent the wider community. Approval to discuss the proposal should not be construed as approval to implement it. A written summary, rather than a recording, is intended to accommodate those unable to attend. The earlier Tuesday date was abandoned owing to the organiser's illness.`;
      const passage = level === "A1" || level === "A2" ? basic : advanced ? complex : intermediate;
      const checks: [string, string, string, string][] = advanced
        ? [
            [
              "What is the status of the proposed fee?",
              "It is still open to consultation.",
              "It has been finally approved.",
              "It has been waived for everyone.",
            ],
            [
              "Why might the pilot results be misleading?",
              "The volunteers may not represent everyone.",
              "No participants attended.",
              "All the data were invented.",
            ],
            [
              "What distinction does the memo emphasise?",
              "Discussing a proposal is not approving its implementation.",
              "Every discussion must produce a decision.",
              "The project has already been completed.",
            ],
            ["What does provisionally imply?", "The endorsement may change.", "The meeting is prohibited.", "The organiser opposes all discussion."],
            ["How much would a student pay if the suggested fee is adopted?", `${cost / 2} pounds`, `${cost} pounds`, `${cost * 2} pounds`],
            ["What accommodation is proposed for absentees?", "A written summary", "A live recording", "A second compulsory meeting"],
            [
              "Which claim goes beyond the evidence?",
              "The pilot proves the project will work for everyone.",
              "Early results look encouraging.",
              "The sample may be unrepresentative.",
            ],
            [
              "What is the main purpose of the memo?",
              "Support further discussion while qualifying the evidence.",
              "Announce an unconditional launch.",
              "Reject the idea without discussion.",
            ],
            ["Why was the earlier date abandoned?", "The organiser was ill.", "The venue was sold.", "The pilot failed."],
            ["Which reading of the tone is most defensible?", "Cautiously supportive", "Unreservedly celebratory", "Openly hostile"],
          ]
        : [
            ["When does the meeting start?", time, `${9 + variant}:00`, `${10 + variant}:45`],
            ["On which day is the meeting?", "Thursday", "Tuesday", "Sunday"],
            ["What is the normal ticket price?", `${cost} pounds`, `${cost + 5} pounds`, `${cost * 2} pounds`],
            ["What should visitors bring?", `a ${item}`, "a bicycle", "a suitcase"],
            ["What discount do students receive?", "Half price", "No discount", "Free entry for everyone"],
            ["Who is mentioned in the notice?", name, scenes[(scene + 1) % 10][0], scenes[(scene + 2) % 10][0]],
            ["Why did the date change?", "The organiser was ill.", "It was snowing.", "The tickets sold out."],
            ["What is the meeting about?", project, "a sports final", "a national election"],
            ["Was Tuesday the original meeting day?", "Yes", "No", "The text does not say"],
            ["How much does a student ticket cost?", `${cost / 2} pounds`, `${cost} pounds`, `${cost * 2} pounds`],
          ];
      for (const skill of ["reading", "listening"] as const) {
        const [prompt, answer, a, b] = checks[variant];
        const id = `${level}-bank-${skill[0]}${scene * 10 + variant}`;
        result.push({
          id,
          level,
          skill,
          ...(skill === "reading" ? { passage } : { audio: passage }),
          prompt: `${name}: ${prompt}`,
          answer,
          options: shuffled([answer, a, b], id),
          explanation: `In this notice about ${project}, the supported answer is: ${answer} Read or listen again and identify the evidence.`,
        });
      }
    }
  });
  cache.set(level, result);
  return result;
}
