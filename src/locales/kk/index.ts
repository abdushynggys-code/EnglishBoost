import { coreKk } from './core';
import { accountKk } from './account';
import { learningKk } from './learning';
import { interfaceKk } from './interface';
import { bookKk } from './book';
import { tutorKk } from './tutor';
import { summaryKk } from './summary';
import { extraKk } from './extra';
import { contentKk } from './content';

export const kazakhPhrases: Record<string, string> = Object.fromEntries(
  Object.entries({
    ...coreKk, ...accountKk, ...learningKk, ...interfaceKk, ...bookKk,
    ...tutorKk, ...summaryKk, ...extraKk, ...contentKk,
  })
    .map(([key, value]) => [key.toLowerCase(), value]),
);
