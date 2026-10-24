import type { Word } from './types';
import type { Language } from './preferences';
import { translate } from './i18n';

const russianWords: Record<string, string> = {
  achieve: 'достигать',
  assignment: 'задание',
  curious: 'любопытный',
  improve: 'улучшать',
  'look after': 'заботиться',
  journey: 'поездка',
  confident: 'уверенный',
  evidence: 'подтверждение',
  'give up': 'сдаваться',
  explore: 'исследовать',
  challenge: 'сложная задача',
  however: 'однако',
  timetable: 'расписание',
  break: 'перемена',
  subject: 'школьный предмет',
  borrow: 'брать на время',
  helpful: 'готовый помочь',
  practise: 'практиковаться',
};
export function wordMeaning(word: Word, language: Language) {
  if (language === 'kk') return word.translation_kk || word.definition_kk || translate(language, word.definition);
  if (language === 'de') return word.translation || word.definition_de || word.definition;
  if (language === 'ru') return word.translation_ru || russianWords[word.word] || word.definition_ru || word.definition;
  return word.definition;
}
export function wordDefinition(word: Word, language: Language) {
  return (
    (language === 'de' ? word.definition_de : language === 'ru' ? word.definition_ru : language === 'kk' ? word.definition_kk : '') ||
    translate(language, word.definition)
  );
}
