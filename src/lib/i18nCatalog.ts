import { accountPhrases } from "../locales/account";
import { commonPhrases } from "../locales/common";
import { connectedExperiencePhrases } from "../locales/connectedExperience";
import { contentPhrases } from "../locales/content";
import { coursePhrases } from "../locales/course";
import { courseExpansionPhrases } from "../locales/courseExpansion";
import { experiencePhrases } from "../locales/experience";
import { feedbackPhrases } from "../locales/feedback";
import { flowPhrases } from "../locales/flow";
import { interfacePhrases } from "../locales/interface";
import { kazakhPhrases } from "../locales/kk";
import { learningPhrases } from "../locales/learning";
import { legendPhrases } from "../locales/legend";
import { lessonPolishPhrases } from "../locales/lessonPolish";
import { platformPhrases } from "../locales/platform";
import { polishedPhrases } from "../locales/polish";
import { readingPhrases } from "../locales/reading";
import { sparkCollectionPhrases } from "../locales/sparkCollections";
import { summaryPhrases } from "../locales/summary";
import { tutorPhrases } from "../locales/tutor";
import { writingPhrases } from "../locales/writing";
import type { PhraseMap, TranslationCatalog } from "./i18n";

const phrases: PhraseMap = {
  ...commonPhrases,
  ...learningPhrases,
  ...accountPhrases,
  ...summaryPhrases,
  ...tutorPhrases,
  ...contentPhrases,
  ...interfacePhrases,
  ...feedbackPhrases,
  ...writingPhrases,
  ...readingPhrases,
};

export const translationCatalog: TranslationCatalog = {
  phrases: Object.fromEntries(Object.entries(phrases).map(([key, value]) => [key.toLowerCase(), value])),
  polished: Object.fromEntries(
    Object.entries({
      ...polishedPhrases,
      ...coursePhrases,
      ...flowPhrases,
      ...platformPhrases,
      ...courseExpansionPhrases,
      ...experiencePhrases,
      ...connectedExperiencePhrases,
      ...sparkCollectionPhrases,
      ...lessonPolishPhrases,
      ...legendPhrases,
    }).map(([key, value]) => [key.toLowerCase(), value]),
  ),
  kazakh: kazakhPhrases,
};
