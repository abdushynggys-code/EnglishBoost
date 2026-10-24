// Exercise the learning rules with real course content, without a database or browser.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
require.extensions['.ts'] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename,'utf8'), {
  compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020,esModuleInterop:true},
}).outputText,filename);
const { estimatePlacement, nextReview, courseStats, isLessonUnlocked, shouldStretch } = require('../src/lib/course/progress.ts');
const { nextPlacementQuestion } = require('../src/lib/course/placement.ts');
const { buildCourseUnits, courseQuestionBank } = require('../src/data/course/units.ts');
const { placementQuestions } = require('../src/data/course/placement.ts');
function diagnose(correct, assisted=false) {
  const answers=[];
  while(answers.length<12) {
    const question=nextPlacementQuestion(answers);
    assert.ok(question,'Every assessment step needs a fresh question');
    assert.ok(!answers.some(answer=>answer.question_id===question.id));
    answers.push({question_id:question.id,skill:question.skill,level:question.level,correct,assisted,skipped:false});
  }
  assert.equal(nextPlacementQuestion(answers),null);
  return estimatePlacement(answers);
}
assert.equal(placementQuestions.length,24);
assert.equal(diagnose(true).level,'B1');
assert.equal(diagnose(false).level,'A1');
assert.deepEqual(diagnose(true,true).skill_levels,{grammar:null,vocabulary:null,reading:null,listening:null});
assert.equal(estimatePlacement([]).level,'A1');
let card;
let today = new Date(2026,9,24,12);
for(const interval of [1,3,7,14,28,28]) {
  card=nextReview(card,'word',true,today);
  const expected=new Date(today);expected.setDate(expected.getDate()+interval);
  assert.equal(card.due_at,expected.toISOString());
  today=expected;
}
card=nextReview(card,'word',false,today);
assert.equal(card.stage,0);assert.equal(card.lapses,1);
const completion=(id,passed=true)=>({lesson_id:id,passed,completed_at:new Date(2026,9,24,12).toISOString(),score:passed?5:3,total:5,xp:passed?10:0,attempts:1});
for(const level of ['A1','A2','B1']) for(const interest of ['everyday','travel','stories','school']) {
  const units=buildCourseUnits(level,interest);
  const lessons=units.flatMap(unit=>unit.lessons);
  assert.equal(lessons.length,28);
  assert.equal(new Set(lessons.map(lesson=>lesson.id)).size,28);
  assert.ok(isLessonUnlocked(units,[],lessons[0].id));
  assert.ok(!isLessonUnlocked(units,[],lessons[1].id));
  const firstSix=lessons.slice(0,6).map(lesson=>completion(lesson.id));
  assert.ok(isLessonUnlocked(units,firstSix,lessons[6].id));
  assert.ok(!isLessonUnlocked(units,[...firstSix,completion(lessons[6].id,false)],lessons[7].id));
  assert.ok(isLessonUnlocked(units,[...firstSix,completion(lessons[6].id)],lessons[7].id));
  for(const question of courseQuestionBank(units)) {
    if(question.type==='order') assert.equal(question.options.slice().reverse().join(' '),question.answer);
    else if(question.type!=='blank') assert.ok(question.options.includes(question.answer),question.id);
    assert.ok(question.answer&&question.explanation);
    assert.ok(!placementQuestions.some(item=>item.id===question.id));
  }
  assert.equal(new Set(units.map(unit=>unit.lessons[6].questions.find(q=>q.audio).audio)).size,4);
}
const wins=[completion('A2-everyday-unit1-day7'),completion('A2-everyday-unit2-day7'),completion('review:2026-10-24')];
assert.ok(shouldStretch(wins));
assert.ok(!shouldStretch(wins.map((win,index)=>index===0?{...win,attempts:2}:win)));
assert.ok(!shouldStretch([...wins,completion('A2-everyday-unit3-day7',false)]));
const stats=courseStats([completion('one'),{...completion('two'),completed_at:new Date(2026,9,23,12).toISOString()},completion('failed',false)],new Date(2026,9,24,17));
assert.equal(stats.streak,2);assert.equal(stats.xp,20);assert.equal(stats.completed,2);
console.log('Course checks passed: placement, assisted answers, SRS, 12 course variants, lesson gates, checkpoints, difficulty, XP, streaks.');
