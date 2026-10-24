import type { Language } from './preferences';

// Some browsers lack Kazakh month names and display "M10" instead of October.
const kazakhMonths = ['қаң.', 'ақп.', 'нау.', 'сәу.', 'мам.', 'мау.', 'шіл.', 'там.', 'қыр.', 'қаз.', 'қар.', 'жел.'];
const kazakhDays = ['Жс', 'Дс', 'Сс', 'Ср', 'Бс', 'Жм', 'Сб'];

export function shortDate(date: Date, language: Language) {
  if (language === 'kk') return `${date.getDate()} ${kazakhMonths[date.getMonth()]}`;
  return date.toLocaleDateString(language === 'en' ? 'en-GB' : language, { day: 'numeric', month: 'short' });
}

export function shortWeekday(date: Date, language: Language) {
  if (language === 'kk') return kazakhDays[date.getDay()];
  return date.toLocaleDateString(language, { weekday: 'short' });
}
