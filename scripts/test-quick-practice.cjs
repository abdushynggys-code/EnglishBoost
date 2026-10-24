const assert=require('node:assert/strict'),fs=require('node:fs'),ts=require('typescript');
require.extensions['.ts']=(m,f)=>m._compile(ts.transpileModule(fs.readFileSync(f,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText,f);
const {buildCourseUnits}=require('../src/data/course/units.ts');
const {buildQuestionBank}=require('../src/data/course/questionBank.ts');
const {quickPractice}=require('../src/data/course/quickPractice.ts');
for(const level of ['A1','A2','B1','B2','C1','C2']){
 for(const question of buildQuestionBank(level)){
  const quick=quickPractice(question);assert.deepEqual(quickPractice(quick),quick,'Repeated review must preserve the prompt and evidence');
  if(question.skill==='vocabulary'){
   assert.ok(question.target_word&&question.passage.toLowerCase().includes(question.target_word.toLowerCase()),'Vocabulary needs its example sentence: '+question.id);
   assert.equal(question.prompt,`What does "${question.target_word}" mean?`);assert.match(question.passage,/[.!?]$/);
   assert.equal(quick.passage,question.passage,'Quick practice must retain vocabulary context');
  }
  if(question.skill==='grammar'){assert.ok(question.prompt.includes('___'));assert.ok(!question.prompt.includes('reads:'));}
 }
 const units=buildCourseUnits(level,'everyday','quick-test');
 for(const unit of units){
  const daily=unit.lessons[0],assessment=unit.lessons[6];assert.equal(daily.questions.length,30);
  for(const q of daily.questions){assert.equal(q.options.length,2);assert.ok(q.options.includes(q.answer));if(q.passage||q.audio)assert.ok((q.passage??q.audio).split(/\s+/).length<=70,'Daily extract too long: '+q.id);}
  for(const skill of ['grammar','vocabulary','reading','listening'])assert.ok(assessment.questions.filter(q=>q.skill===skill).length>=3,'Missing assessed skill');
  assert.ok(assessment.questions.filter(q=>q.skill==='grammar').every(q=>q.type==='blank'&&q.options.length===0));
  assert.ok(assessment.questions.filter(q=>q.skill==='reading').every(q=>q.passage.split(/\s+/).length>daily.questions.find(item=>item.skill==='reading').passage.split(/\s+/).length));
 }
 assert.equal(units.filter(unit=>unit.lessons[2].difficulty==='stretch').length,2);
 assert.ok(units[1].lessons[2].questions.filter(q=>q.type==='blank'||q.type==='order').length>=6);
 const order=units[0].lessons[2].questions.find(q=>q.type==='order');assert.deepEqual(quickPractice(order).options,order.options,'Review must preserve word tiles');
}
const b1=quickPractice(buildQuestionBank('B1').find(q=>q.id==='B1-bank-r8'));assert.ok(b1.passage.includes('from Tuesday'),'Previous meeting day must be stated');
const c2=quickPractice(buildQuestionBank('C2').find(q=>q.id==='C2-bank-r0'));assert.ok(c2.passage.includes('subject to consultation'),'Fee-status evidence missing');
console.log('Quick practice checks passed: thirty short questions, two choices, evidence retained, balanced harder assessments and six production tasks in stretch lessons.');
