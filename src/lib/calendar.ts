import type { TutoringSession } from './types';

export function downloadSession(session: TutoringSession) {
  const format = (date: Date) =>
    date
      .toISOString()
      .replace(/[-:]/g, '')
      .replace(/\.\d{3}/, '');
  const start = new Date(session.starts_at);
  const end = new Date(start.getTime() + session.duration * 60000);
  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//EnglishBoost//Tutoring//EN',
    'BEGIN:VEVENT',
    `UID:${session.id}@englishboost`,
    `DTSTAMP:${format(new Date())}`,
    `DTSTART:${format(start)}`,
    `DTEND:${format(end)}`,
    'SUMMARY:EnglishBoost tutoring session',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
  const url = URL.createObjectURL(new Blob([ics], { type: 'text/calendar' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = 'englishboost-session.ics';
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function safeUrl(value: string) {
  try {
    const url = new URL(value);
    return ['http:', 'https:'].includes(url.protocol) ? url.href : null;
  } catch {
    return null;
  }
}
