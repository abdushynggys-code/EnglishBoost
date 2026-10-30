import { supabase } from './supabase';

type AiResponse = {
  text?: unknown;
  error?: unknown;
};

export async function askAi(prompt: string, system: string) {
  const { data, error } = await supabase.functions.invoke<AiResponse>('ai', {
    body: { prompt, system },
  });

  if (error) throw new Error(error.message);
  if (typeof data?.error === 'string') throw new Error(data.error);
  if (typeof data?.text !== 'string' || !data.text.trim()) {
    throw new Error('AI returned an empty response.');
  }

  return data.text.trim();
}
