export function normalizeAnswer(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[’‘]/g, "'")
    .replace(/[.!?]+$/, '')
    .replace(/\s+/g, ' ');
}

export function isAnswerCorrect(response: string, expected: string) {
  return normalizeAnswer(response) === normalizeAnswer(expected);
}
