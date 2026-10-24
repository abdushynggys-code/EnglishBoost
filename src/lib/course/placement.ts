import { placementQuestions } from '../../data/course/placement';
import { shuffled } from '../../data/course/questionBank';
import { courseLevels } from './levels';
import { courseSkills } from './progress';
import type { PlacementAnswer } from './types';
export function placementLength(answers: PlacementAnswer[]) {
 if(answers.length<12)return 30;
 const rate=answers.slice(0,12).filter(a=>a.correct&&!a.assisted&&!a.skipped).length/12;
 return rate>=0.85?15:rate>=0.5?20:30;
}
export function nextPlacementQuestion(answers: PlacementAnswer[],seed='placement') {
 if(answers.length>=placementLength(answers))return null;
 const skill=courseSkills[answers.length%courseSkills.length];
 const evidence=answers.filter(a=>!a.assisted&&!a.skipped);
 const last=evidence[evidence.length-1];
 const index=last?Math.max(0,Math.min(5,courseLevels.indexOf(last.level)+(last.correct?1:-1))):2;
 const available=placementQuestions.filter(q=>q.skill===skill&&q.level===courseLevels[index]&&!answers.some(a=>a.question_id===q.id));
 return shuffled(available,`${seed}-${answers.length}`)[0];
}
