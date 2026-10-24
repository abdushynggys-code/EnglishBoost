import type { CourseQuestion } from '../../lib/course/types';

export const grammarPlacement: CourseQuestion[] = [
  { id:'pg1',skill:'grammar',level:'A1',prompt:'She ___ a student.',options:['is','are','be'],answer:'is',explanation:'Use is with she, he, and it.' },
  { id:'pg2',skill:'grammar',level:'A1',prompt:'We ___ football on Saturdays.',options:['plays','play','playing'],answer:'play',explanation:'Use the base verb with we in the present simple.' },
  { id:'pg3',skill:'grammar',level:'A2',prompt:'I ___ my grandparents last weekend.',options:['visit','visited','have visit'],answer:'visited',explanation:'Last weekend is a finished past time: visited.' },
  { id:'pg4',skill:'grammar',level:'A2',prompt:'There is not ___ milk in the fridge.',options:['some','many','any'],answer:'any',explanation:'Use any in a negative sentence with an uncountable noun.' },
  { id:'pg5',skill:'grammar',level:'B1',prompt:'If it rains tomorrow, we ___ at home.',options:['would stay','will stay','stayed'],answer:'will stay',explanation:'First conditional: if + present simple, will + base verb.' },
  { id:'pg6',skill:'grammar',level:'B1',prompt:'I ___ here since 2022.',options:['live','am living','have lived'],answer:'have lived',explanation:'Present perfect describes a state that began in the past and continues now.' },
];
export const vocabularyPlacement: CourseQuestion[] = [
  { id:'pv1',skill:'vocabulary',level:'A1',prompt:'Which word means the opposite of cold?',options:['hot','small','old'],answer:'hot',explanation:'Hot and cold describe opposite temperatures.' },
  { id:'pv2',skill:'vocabulary',level:'A1',prompt:'You buy bread at a ___.',options:['library','bakery','station'],answer:'bakery',explanation:'A bakery sells bread and other baked food.' },
  { id:'pv3',skill:'vocabulary',level:'A2',prompt:'The train leaves at 8:00. We must ___ before then.',options:['arrive','borrow','invite'],answer:'arrive',explanation:'Arrive means reach a place.' },
  { id:'pv4',skill:'vocabulary',level:'A2',prompt:'Could I ___ your pen? I will give it back.',options:['lend','borrow','keep'],answer:'borrow',explanation:'Borrow means receive something temporarily; lend means give it temporarily.' },
  { id:'pv5',skill:'vocabulary',level:'B1',prompt:'The first plan failed, so we need an ___.',options:['advantage','alternative','appointment'],answer:'alternative',explanation:'An alternative is another possible choice.' },
  { id:'pv6',skill:'vocabulary',level:'B1',prompt:'She kept practising ___ the task was difficult.',options:['although','because of','unless'],answer:'although',explanation:'Although introduces a contrast: the difficulty did not stop her.' },
];
