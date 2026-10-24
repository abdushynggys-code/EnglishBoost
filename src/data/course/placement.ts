import { grammarPlacement, vocabularyPlacement } from './placementLanguage';
import { inputPlacement } from './placementInput';
export const placementQuestions = [...grammarPlacement, ...vocabularyPlacement, ...inputPlacement];
