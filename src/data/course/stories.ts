import type { CourseLevel } from '../../lib/course/types';
export const unitTitles = ['Home and belonging','People and routines','Plans and journeys','Ideas and stories'];
export const stories: Record<CourseLevel, string[]> = {
  A1: [
    'Dorothy lives in Kansas with her aunt and uncle. Their house is small. Her dog Toto makes her happy. Dorothy loves her family.',
    'Maya gets up at seven. She eats breakfast and walks to school. Her friend Sam takes the bus. He calls her and they agree to meet in the classroom.',
    'Leo wants to visit his cousin. He buys a train ticket. He checks the time and packs his bag. His train leaves at nine.',
    'Sara reads a story about a lost dog. A child finds the dog near a park. The child sees a phone number on its collar and calls its owner. The dog goes home safely.',
  ],
  A2: [
    'Dorothy lived in a small house in Kansas with her aunt and uncle. The house had one room and a wooden floor. Life was simple, but Toto made her laugh. When Dorothy thought about travelling, she wanted to see new places and still come home to her family.',
    'Maya usually walked to school with Sam, but yesterday he missed the bus. While she was waiting by the gate, she called him. They agreed to meet in the classroom. Sam arrived before the first lesson, so they had time to compare their homework.',
    'Leo was planning a visit to his cousin. He bought a train ticket for nine o’clock and packed the night before. At the station, he noticed a delay on the board. He sent his cousin a message and waited instead of getting on the wrong train.',
    'Sara read a story about a dog that had lost its way. At first, she thought the child would keep it. However, the child called the number on its collar. The ending surprised Sara, and she wrote a short review explaining why the choice was kind.',
  ],
  B1: [
    'Dorothy’s small house in Kansas offered little comfort, yet her sense of belonging came from the people and the dog who shared it. Although she was curious about unfamiliar places, she did not confuse adventure with forgetting home. This tension between discovery and belonging gives her journey its emotional purpose.',
    'Maya had been waiting outside school when Sam called to explain that he had missed his bus. Instead of worrying about the delay, they agreed on a new meeting point. By the time he arrived, Maya had collected the materials for their project, showing how a small change of plan can become an opportunity to help.',
    'Having booked an early train, Leo expected to reach his cousin before lunch. When a delay was announced, he compared the alternatives rather than boarding the first train he saw. A later direct service would take less time overall than an immediate journey with two changes. He chose convenience over an apparently earlier departure.',
    'The story’s ending challenged Sara’s first assumption: the child returned the dog rather than keeping it. In her review, she distinguished what the narrator stated from what she had inferred. She argued that an unexpected ending can remain convincing when earlier details, such as the phone number on a collar, support it.',
  ],
};
export const words = [
  [['belong','to feel at home in a place'],['wooden','made of wood'],['journey','travel from one place to another']],
  [['routine','things you regularly do'],['compare','to look for similarities and differences'],['opportunity','a useful chance to do something']],
  [['depart','to leave a place'],['delay','a period of waiting longer than expected'],['alternative','another possible choice']],
  [['owner','a person something belongs to'],['review','an opinion about a book or film'],['infer','to understand something from clues']],
];
export const storyQuestions = [
  ['Where is Dorothy’s home?','Kansas','London','Paris','What matters to Dorothy besides adventure?','Her family','A large house','Being famous'],
  ['Where do Maya and Sam meet?','At school','At the cinema','At the airport','What helps them deal with the change?','Communicating','Ignoring the problem','Leaving school'],
  ['How is Leo travelling?','By train','By bicycle','By boat','Why does Leo check the information?','To choose the right service','To buy food','To avoid visiting his cousin'],
  ['How does the child help the dog?','Contacts its owner','Sells it','Leaves it alone','What supports the child’s decision?','The contact information on the collar','The dog’s colour','Sara’s school timetable'],
];
