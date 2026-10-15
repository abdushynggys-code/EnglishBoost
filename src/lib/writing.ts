export function countWords(text: string) {
  return text.trim() ? text.trim().split(/\s+/).length : 0;
}

export function writingAdvice(
  text: string,
  minimum: number,
  t: (text: string, values?: Record<string, string | number>) => string = (text) => text,
) {
  const advice: string[] = [];
  const count = countWords(text);
  if (!count) return ['Start with one sentence that introduces your main idea.'];
  if (count < minimum)
    advice.push(t('Add a little more detail: aim for at least {minimum} words. You have {count}.', { minimum, count }));
  if (!/^[A-Z“"'‘]/.test(text.trim())) advice.push('Check whether your first sentence starts with a capital letter.');
  if (!/[.!?][”"']?$/.test(text.trim())) advice.push('Check the punctuation at the end of your last sentence.');
  if (!/\b(however|because|therefore|also|although|first|finally|in addition)\b/i.test(text))
    advice.push('Try a linking word such as “because”, “however”, or “therefore”.');
  if (!/\b(for example|for instance|such as)\b/i.test(text))
    advice.push('Could a specific example make your main idea stronger?');
  return advice.length
    ? advice
    : ['You have a good starting structure. Read your work aloud and use the checklist to review it.'];
}
