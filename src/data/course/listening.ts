import type { CourseLevel } from '../../lib/course/types';
export const checkpointListening: Record<CourseLevel, readonly (readonly [string,string,string,string,string])[]> = {
  A1:[
    ['The library opens at ten. We can meet there at eleven.','What is the meeting time?','Eleven','Ten','Twelve'],
    ['I go swimming on Mondays. On Tuesdays, I cook with my sister.','What does the speaker do on Tuesdays?','Cooks','Swims','Plays football'],
    ['The train to London is on platform four. The train on platform two goes to York.','Which platform is for London?','Four','Two','Six'],
    ['I like the new story. The dog finds its family at the end.','How does the story end?','The dog finds its family','The dog goes to school','The dog gets lost'],
  ],
  A2:[
    ['I planned to meet you at ten, but my bus is late. Let’s meet at the library at eleven instead.','What is the new meeting time?','Eleven','Ten','Twelve'],
    ['I used to swim on Tuesdays, but the pool is closed this month. Now I go to a cooking class with my sister on Tuesdays.','What does the speaker do on Tuesdays now?','A cooking class','Swimming','Football practice'],
    ['Passengers for London, please go to platform four. This is a change from platform two, which is now closed.','Where should passengers for London go?','Platform four','Platform two','The bus stop'],
    ['At first I thought the dog would get lost again. Luckily, the final chapter showed it finding its family.','What surprised the speaker about the ending?','The dog found its family','The dog went to school','The family left forever'],
  ],
  B1:[
    ['Although I had hoped to arrive at ten, the delayed bus means I will not be there until eleven. Would you mind waiting at the library?','When does the speaker expect to arrive?','Eleven','Ten','Twelve'],
    ['Since the pool closed for repairs, I have replaced my Tuesday swimming session with a cooking class. I might continue even after the pool reopens.','Which activity has replaced swimming?','A cooking class','A repair workshop','A running group'],
    ['The London service has been moved from platform two to platform four. Passengers who are already waiting should use the footbridge; there is no need to buy a new ticket.','What should waiting passengers do?','Move to platform four','Buy a new ticket','Stay on platform two'],
    ['The ending seemed predictable at first, yet the author made it convincing by linking the dog’s return to a detail introduced much earlier.','What did the speaker appreciate?','The ending connected to an earlier detail','The book had no ending','The author changed the dog’s name'],
  ],
};
