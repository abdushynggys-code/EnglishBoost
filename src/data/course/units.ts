import { moduleGuides } from './moduleGuides';
import type { CourseInterest, CourseLevel, CourseQuestion, CourseUnit } from '../../lib/course/types';
import { buildQuestionBank, shuffled } from './questionBank';
import { courseLevels, levelNumber, moduleTopics, questionCount } from '../../lib/course/levels';
const kinds = ['story','grammar','practice','listening','writing','review','checkpoint'] as const;
const titles = ['Read and discover','Notice the pattern','Build a sentence','Listen and understand','Use your own words','Remember and review','Module checkpoint'];
const applications:Record<CourseInterest,string>={everyday:'Use a situation from everyday life.',travel:'Use a travel situation as your example.',school:'Use a situation from school or study.',stories:'Use characters and events from a story you know.'};
const unitCache=new Map<string,CourseUnit[]>();
export function buildCourseUnits(level: CourseLevel, interest: CourseInterest, seed='course'): CourseUnit[] {
 const key=`${level}-${interest}-${seed}`;const cached=unitCache.get(key);if(cached)return cached;
 const bank=buildQuestionBank(level);const number=levelNumber(level);const count=questionCount(level);
 const units:CourseUnit[]=moduleTopics[number-1].map((title,index)=>{
  const prefix=`${level}-${interest}-unit${index+1}`;
  const guide=moduleGuides[level][index];
  const pool=bank.filter(q=>Math.floor(Number(q.id.match(/\d+$/)?.[0])/25)===index).map(q=>({...q,id:`${prefix}-${q.id.split('-bank-')[1]}`}));
  return {id:prefix,title,description:'Real situations. Useful language. Practice that connects.',level,lessons:kinds.map((kind,day)=>{
   const ordered=shuffled(pool,`${seed}-${prefix}-${day}`);
   const focus=day===0?'reading':day===1||day===2?'grammar':day===3?'listening':null;
   const selected=focus?[...ordered.filter(q=>q.skill===focus).slice(0,Math.ceil(count/3)),...ordered.filter(q=>q.skill!==focus)]:ordered;
   const questions:CourseQuestion[]=day===4?[]:selected.slice(0,count).map((q,i)=>{
    if(day!==2||q.skill!=='grammar'||i>=3)return q;
    if(i!==1)return {...q,type:'blank',options:[]};
    const sentence=(q.prompt.split('reads: "')[1]?.slice(0,-1)??q.prompt).replace('___',q.answer);
    return {...q,type:'order',prompt:'Build a correct sentence.',answer:sentence,options:shuffled(sentence.split(' '),seed+q.id)};
   });

   return {id:`${prefix}-day${day+1}`,title:titles[day],kind,description:day===6?'Reach 80% to unlock the next module.':`${count} questions. Take breaks whenever you need.`,questions,
    ...(day===0||day===1?{text:`${title}\n\n${day===0?guide[0]:guide[1]}\n\nOriginal practice material. Read once for meaning, then look for the details.`,source_url:'https://learnenglish.britishcouncil.org/free-resources/grammar'}:{}),
    ...(day===4?{writing_prompt:`${guide[2]} ${applications[interest]} ${number<=2?'Write 2–3 short sentences.':number<=4?'Write 4–6 connected sentences, with a reason, example and contrasting point.':'Write 8–10 sentences. Qualify a claim, anticipate an objection and adapt your tone to the reader.'}`,speaking_prompt:'Read your answer aloud. Then explain the same idea without looking.'}:{}),
   };
  })};
 });
 unitCache.set(key,units);return units;
}
export function buildLearningPath(level: CourseLevel,interest: CourseInterest,seed='course') {
 return courseLevels.slice(courseLevels.indexOf(level)).flatMap(next=>buildCourseUnits(next,interest,seed));
}
export function courseQuestionBank(units: CourseUnit[]) {
 return [...new Map(units.flatMap(unit=>unit.lessons.flatMap(lesson=>lesson.questions)).map(question=>[question.id,question])).values()];
}
