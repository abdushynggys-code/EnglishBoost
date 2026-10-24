import { courseLevels } from '../../lib/course/levels';
import { buildQuestionBank } from './questionBank';
export const placementQuestions = courseLevels.flatMap(buildQuestionBank);
