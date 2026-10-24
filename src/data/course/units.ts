import type { CourseInterest, CourseLevel, CourseQuestion, CourseUnit } from '../../lib/course/types';
import { grammarExamples } from './grammar';
import { checkpointListening } from './listening';
import { stories, storyQuestions, unitTitles, words } from './stories';

const kinds = ['story','grammar','practice','listening','writing','review','checkpoint'] as const;
const titles = ['Read and discover','Notice the pattern','Build a sentence','Listen and understand','Use your own words','Remember and review','Weekly checkpoint'];
const applications: Record<CourseInterest,string[]> = {
  everyday:['Describe your home and what makes it special.','Explain your usual day and one recent change.','Describe a plan for next weekend.','Recommend a story and explain why you like it.'],
  travel:['Describe a place you would like to stay.','Describe a day exploring a new city.','Explain how you would travel to a new place.','Tell a friend about an interesting journey.'],
  school:['Describe a room at your school.','Describe your school routine and a recent change.','Plan a class trip and give a reason for your choice.','Recommend a book to a classmate.'],
  stories:['Describe the home of a character you like.','Describe a character’s routine before an adventure.','Write a plan for a character’s journey.','Give a story a different ending and explain your choice.'],
};
function options(id: string, values: string[]) {
  const offset = [...id].reduce((sum,char) => sum+char.charCodeAt(0),0) % values.length;
  return [...values.slice(offset),...values.slice(0,offset)];
}
export function buildCourseUnits(level: CourseLevel, interest: CourseInterest): CourseUnit[] {
  return unitTitles.map((title, index) => {
    const prefix = `${level}-${interest}-unit${index+1}`;
    const story = stories[level][index];
    const info = storyQuestions[index];
    const grammar: CourseQuestion[] = grammarExamples[level][index].map(([prompt,answer,a,b,explanation],i) => ({id:`${prefix}-g${i}`,skill:'grammar',level,prompt,answer,options:options(`${prefix}-g${i}`,[answer,a,b]),explanation}));
    const vocab: CourseQuestion[] = words[index].map(([word,meaning],i) => ({id:`${prefix}-v${i}`,skill:'vocabulary',level,prompt:`What does “${word}” mean?`,answer:meaning,options:options(`${prefix}-v${i}`,[meaning,'to forget something completely','a very loud sound']),explanation:`${word}: ${meaning}.`}));
    const read: CourseQuestion = {id:`${prefix}-r0`,skill:'reading',level,passage:story,prompt:info[0],answer:info[1],options:options(prefix,[info[1],info[2],info[3]]),explanation:`The text tells us: ${info[1]}.`};
    const inference: CourseQuestion = {id:`${prefix}-r1`,skill:'reading',level,passage:story,prompt:info[4],answer:info[5],options:options(prefix+'r',[info[5],info[6],info[7]]),explanation:`Use the details in the story: ${info[5]}.`};
    const listen: CourseQuestion = {id:`${prefix}-l0`,skill:'listening',level,audio:story,prompt:info[0],answer:info[1],options:options(prefix+'l',[info[1],info[2],info[3]]),explanation:`The speaker mentions ${info[1]}.`};
    const [audio,prompt,answer,wrongA,wrongB] = checkpointListening[level][index];
    const checkpointAudio: CourseQuestion = {id:prefix+'-l1',skill:'listening',level,audio,prompt,answer,options:options(prefix+'c',[answer,wrongA,wrongB]),explanation:'The speaker gives this information: '+answer+'.'};
    const blank: CourseQuestion = {...grammar[0],id:`${prefix}-blank`,type:'blank',options:[]};
    const sentence = grammar[1].prompt.replace('___',grammar[1].answer);
    const order: CourseQuestion = {...grammar[1],id:`${prefix}-order`,type:'order',prompt:'Build a correct sentence.',answer:sentence,options:sentence.split(' ').reverse()};
    const dailyQuestions = [[vocab[0],vocab[1],read],grammar.slice(0,2),[blank,order],[listen],[],[...vocab.slice(0,2),grammar[0]],[grammar[2],grammar[3],vocab[2],inference,checkpointAudio]];
    return { id:`${prefix}`,title,description:'Seven small lessons. One useful skill at a time.',level,
      lessons:kinds.map((kind,day) => ({id:`${prefix}-day${day+1}`,title:titles[day],kind,description:day===6?'Reach 80% to unlock the next unit.':'About five minutes of focused practice.',questions:dailyQuestions[day],
        ...(day===0?{text:`Original simplified ${index===0?'retelling inspired by The Wonderful Wizard of Oz':'practice story'}.\n\n${story}\n\nNew words: ${words[index].map(([word,meaning])=>`${word} — ${meaning}`).join('; ')}.`,...(index===0?{source_url:'https://www.gutenberg.org/files/55/55-h/55-h.htm'}:{})}:{}),
        ...(day===4?{writing_prompt:`${applications[interest][index]} ${level==='A1'?'Write two short sentences.':level==='A2'?'Write three sentences and use because or but.':'Write four connected sentences, including a reason and a contrasting idea.'}`,speaking_prompt:'Read your answer aloud. Then say the same idea without looking.'}:{}),
      })),
    };
  });
}
export function courseQuestionBank(units: CourseUnit[]) {
  return [...new Map(units.flatMap((unit)=>unit.lessons.flatMap((lesson)=>lesson.questions)).map((question)=>[question.id,question])).values()];
}
