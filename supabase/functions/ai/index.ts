// AI-функция на бесплатном ключе Google Gemini.
// Вызов с фронта: supabase.functions.invoke('ai', { body: { prompt, system } })
//
// Запуск (один раз):
//   1) Добавь GEMINI_API_KEY в локальный .env
//   2) Загрузи секрет:  npm run ai:secret
//   3) Задеплой:        npm run ai:deploy

import { buildCoursePrompt } from './coursePrompt.ts';
import type { AssessmentKind, CourseImage, GeneratedCourse } from './coursePrompt.ts';
import { buildPersonalizationPrompt } from './personalizedPrompt.ts';
import type { GeneratedPersonalization, StudentContext } from './personalizedPrompt.ts';

const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
const MODEL = 'gemini-3.5-flash-lite';

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

type GeminiResponse = {
  candidates?: Array<{
    content?: {
      parts?: Array<{ text?: unknown }>;
    };
  }>;
};

type CourseRequest = {
  mode: 'course_from_images';
  bookName?: unknown;
  bookIdentity?: unknown;
  assessmentKind?: unknown;
  questionCount?: unknown;
  images?: unknown;
};

type PersonalizationRequest = {
  mode: 'personalize_student_course';
  student?: unknown;
  images?: unknown;
};

function json(body: object, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...cors, 'Content-Type': 'application/json' },
  });
}

function jwtSubject(authorization: string) {
  try {
    const token = authorization.replace(/^Bearer\s+/i, '');
    const encoded = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const payload = encoded.padEnd(Math.ceil(encoded.length / 4) * 4, '=');
    return (JSON.parse(atob(payload)) as { sub?: unknown }).sub;
  } catch {
    return undefined;
  }
}

async function hasTutorAccess(req: Request) {
  const authorization = req.headers.get('authorization') ?? '';
  const subject = jwtSubject(authorization);
  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const anonKey = Deno.env.get('SUPABASE_ANON_KEY');
  if (typeof subject !== 'string' || !supabaseUrl || !anonKey) return false;
  const response = await fetch(
    `${supabaseUrl}/rest/v1/profiles?id=eq.${encodeURIComponent(subject)}&select=role,approved`,
    { headers: { authorization, apikey: anonKey } },
  );
  if (!response.ok) return false;
  const profiles = (await response.json()) as Array<{ role?: unknown; approved?: unknown }>;
  return profiles[0]?.role === 'tutor' && profiles[0]?.approved === true;
}

function validImage(value: unknown): value is CourseImage {
  if (!value || typeof value !== 'object') return false;
  const image = value as Partial<CourseImage>;
  return ['front_cover', 'back_cover', 'material'].includes(image.role ?? '')
    && ['image/jpeg', 'image/png', 'image/webp'].includes(image.mimeType ?? '')
    && typeof image.data === 'string' && /^[a-zA-Z0-9+/]+={0,2}$/.test(image.data);
}

function parseCourse(text: string, questionCount: number): GeneratedCourse | null {
  try {
    const value = JSON.parse(text.replace(/^```json\s*|\s*```$/g, '')) as GeneratedCourse;
    if (typeof value.accepted !== 'boolean' || typeof value.reason !== 'string') return null;
    if (!value.accepted) return value;
    const lesson = value.lesson;
    if (!lesson || !Array.isArray(lesson.questions) || lesson.questions.length !== questionCount) return null;
    if (typeof value.book_identity !== 'string' || value.book_identity.length < 10) return null;
    if (!['Beginner', 'Intermediate'].includes(lesson.difficulty)) return null;
    if (!['Grammar', 'Vocabulary', 'Reading', 'Writing', 'Speaking'].includes(lesson.skill)) return null;
    if (!Array.isArray(lesson.objectives) || !lesson.objectives.length) return null;
    if (typeof value.extracted_text !== 'string' || value.extracted_text.length < 10) return null;
    const validQuestions = lesson.questions.every((question) =>
      question && typeof question.prompt === 'string' && typeof question.answer === 'string'
      && typeof question.explanation === 'string' && Array.isArray(question.options)
      && ['choice', 'blank', 'correction', 'boolean'].includes(question.type)
      && (!['choice', 'boolean'].includes(question.type) || (question.options.length >= 2 && question.options.includes(question.answer)))
    );
    return validQuestions ? value : null;
  } catch {
    return null;
  }
}

async function generateCourse(body: CourseRequest) {
  const bookName = typeof body.bookName === 'string' ? body.bookName.trim() : '';
  const bookIdentity = typeof body.bookIdentity === 'string' ? body.bookIdentity.trim() : '';
  const assessmentKind = body.assessmentKind as AssessmentKind;
  const questionCount = Number(body.questionCount);
  const images = Array.isArray(body.images) && body.images.every(validImage) ? body.images : [];
  const isNewBook = !bookIdentity;
  const roles = images.map((image) => image.role);
  const totalBytes = images.reduce((sum, image) => sum + image.data.length, 0);
  if (!bookName || bookName.length > 160) return json({ error: 'Add a valid book name.' }, 400);
  if (!['quiz', 'easy_test', 'hard_test'].includes(assessmentKind)) return json({ error: 'Choose an assessment type.' }, 400);
  if (![5, 10, 15, 20].includes(questionCount)) return json({ error: 'Invalid question count.' }, 400);
  if (!images.length || !roles.includes('material')) return json({ error: 'Add at least one material image.' }, 400);
  if (isNewBook && (!roles.includes('front_cover') || !roles.includes('back_cover'))) {
    return json({ error: 'A new book needs clear front and back cover images.' }, 400);
  }
  if (images.length > 8 || totalBytes > 15_000_000) return json({ error: 'Use at most 8 compressed images under 15 MB total.' }, 400);

  const prompt = buildCoursePrompt({ bookName, bookIdentity, assessmentKind, questionCount, isNewBook });
  const parts: Array<{ text: string } | { inlineData: { mimeType: string; data: string } }> = [{ text: prompt }];
  for (const image of images) {
    parts.push({ text: `IMAGE ROLE: ${image.role.toUpperCase()}` });
    parts.push({ inlineData: { mimeType: image.mimeType, data: image.data } });
  }
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts }],
        generationConfig: { temperature: 0.15, maxOutputTokens: 16_000, responseMimeType: 'application/json' },
      }),
    },
  );
  const data = (await response.json()) as GeminiResponse;
  if (!response.ok) {
    console.error('Gemini course request failed', response.status, data);
    return json({ error: 'AI could not read these images. Try clearer, smaller photos.' }, 502);
  }
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  const course = typeof text === 'string' ? parseCourse(text, questionCount) : null;
  if (!course) return json({ error: 'AI returned an incomplete course. Try clearer images.' }, 502);
  return course.accepted ? json({ course }) : json({ rejected: true, reason: course.reason });
}

function validStudent(value: unknown): value is StudentContext {
  if (!value || typeof value !== 'object') return false;
  const student = value as Partial<StudentContext>;
  return typeof student.name === 'string' && student.name.length <= 100
    && (student.currentLevel === null || ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].includes(student.currentLevel ?? ''))
    && (student.currentSkills === null || (typeof student.currentSkills === 'object' && student.currentSkills !== null))
    && (student.currentInterest === null || typeof student.currentInterest === 'string')
    && (student.personalizationSummary === null || typeof student.personalizationSummary === 'string')
    && Number.isInteger(student.xp) && (student.xp ?? -1) >= 0
    && Number.isInteger(student.completedAssignments) && Number.isInteger(student.pendingAssignments);
}

function parsePersonalization(text: string, currentLevel: string | null): GeneratedPersonalization | null {
  try {
    const value = JSON.parse(text.replace(/^```json\s*|\s*```$/g, '')) as GeneratedPersonalization;
    if (typeof value.accepted !== 'boolean' || typeof value.reason !== 'string') return null;
    if (!value.accepted) return value;
    const plan = value.plan;
    const lesson = value.lesson;
    const levels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
    const skills = ['grammar', 'vocabulary', 'reading', 'listening'] as const;
    if (!plan || !lesson || !levels.includes(plan.level) || !['everyday', 'travel', 'stories', 'school'].includes(plan.interest)) return null;
    if (currentLevel && Math.abs(levels.indexOf(plan.level) - levels.indexOf(currentLevel)) > 1) return null;
    if (!plan.skill_levels || !skills.every((skill) => Object.hasOwn(plan.skill_levels, skill)
      && (plan.skill_levels[skill] === null || levels.includes(plan.skill_levels[skill]!)))) return null;
    if (typeof plan.summary !== 'string' || plan.summary.length < 20 || !Array.isArray(plan.focus_modules)
      || plan.focus_modules.length < 2 || plan.focus_modules.length > 4) return null;
    if (!Array.isArray(value.vocabulary) || value.vocabulary.length < 6 || value.vocabulary.length > 12
      || !value.vocabulary.every((item) => item && typeof item.word === 'string' && item.word.length <= 80
        && typeof item.translation_de === 'string' && typeof item.translation_ru === 'string' && typeof item.translation_kk === 'string'
        && typeof item.definition === 'string' && typeof item.example === 'string' && ['extracted', 'support'].includes(item.source))) return null;
    if (!Array.isArray(lesson.objectives) || !lesson.objectives.length || !Array.isArray(lesson.questions) || lesson.questions.length !== 10) return null;
    if (typeof lesson.title !== 'string' || typeof lesson.description !== 'string' || typeof lesson.activities !== 'string'
      || typeof lesson.homework !== 'string' || typeof lesson.book_unit !== 'string' || typeof lesson.book_page !== 'string'
      || typeof lesson.duration !== 'number' || lesson.duration < 5 || lesson.duration > 180) return null;
    if (!['Grammar', 'Vocabulary', 'Reading', 'Writing', 'Speaking'].includes(lesson.skill)
      || !['Beginner', 'Intermediate'].includes(lesson.difficulty)) return null;
    const validQuestions = lesson.questions.every((question) => question && typeof question.prompt === 'string'
      && typeof question.answer === 'string' && typeof question.explanation === 'string' && Array.isArray(question.options)
      && ['choice', 'blank', 'correction', 'boolean'].includes(question.type)
      && (!['choice', 'boolean'].includes(question.type) || (question.options.length >= 2 && question.options.includes(question.answer))));
    return validQuestions ? value : null;
  } catch {
    return null;
  }
}

async function generatePersonalization(body: PersonalizationRequest) {
  const student = validStudent(body.student) ? body.student : null;
  const images = Array.isArray(body.images) && body.images.every(validImage) ? body.images : [];
  const totalBytes = images.reduce((sum, image) => sum + image.data.length, 0);
  if (!student) return json({ error: 'Choose a valid learner.' }, 400);
  if (!images.length || images.some((image) => image.role !== 'material')) return json({ error: 'Add at least one assignment photo.' }, 400);
  if (images.length > 6 || totalBytes > 15_000_000) return json({ error: 'Use at most 6 compressed images under 15 MB total.' }, 400);
  const parts: Array<{ text: string } | { inlineData: { mimeType: string; data: string } }> = [{ text: buildPersonalizationPrompt(student) }];
  for (const image of images) parts.push({ text: 'IMAGE ROLE: MATERIAL' }, { inlineData: { mimeType: image.mimeType, data: image.data } });
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${GEMINI_API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contents: [{ parts }], generationConfig: { temperature: 0.1, maxOutputTokens: 16_000, responseMimeType: 'application/json' } }),
  });
  const data = (await response.json()) as GeminiResponse;
  if (!response.ok) return json({ error: 'AI could not read these photos. Try clearer, smaller images.' }, 502);
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  const personalization = typeof text === 'string' ? parsePersonalization(text, student.currentLevel) : null;
  if (!personalization) return json({ error: 'AI returned an incomplete learning plan. Try clearer photos.' }, 502);
  return personalization.accepted ? json({ personalization }) : json({ rejected: true, reason: personalization.reason });
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  if (req.method !== 'POST') return json({ error: 'Используй POST-запрос' }, 405);

  try {
    if (!GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY is not configured');
      return json({ error: 'AI пока не настроен. Попроси наставника проверить секрет.' }, 503);
    }

    const body = (await req.json()) as { prompt?: unknown; system?: unknown; mode?: unknown } | CourseRequest | PersonalizationRequest;
    if ('mode' in body && body.mode === 'course_from_images') {
      if (!await hasTutorAccess(req)) return json({ error: 'Approved tutor access is required.' }, 403);
      return await generateCourse(body);
    }
    if ('mode' in body && body.mode === 'personalize_student_course') {
      if (!await hasTutorAccess(req)) return json({ error: 'Approved tutor access is required.' }, 403);
      return await generatePersonalization(body);
    }
    const textBody = body as { prompt?: unknown; system?: unknown };
    const prompt = typeof textBody.prompt === 'string' ? textBody.prompt.trim() : '';
    const system = typeof textBody.system === 'string' ? textBody.system.trim() : '';

    if (!prompt) return json({ error: 'Напиши запрос для AI.' }, 400);
    if (prompt.length > 10_000 || system.length > 5_000) {
      return json({ error: 'Запрос слишком длинный. Сделай его короче.' }, 400);
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: system ? { parts: [{ text: system }] } : undefined,
          contents: [{ parts: [{ text: prompt }] }],
        }),
      },
    );

    const data = (await response.json()) as GeminiResponse;
    if (!response.ok) {
      console.error('Gemini request failed', response.status, data);
      return json({ error: 'AI сейчас не ответил. Попробуй ещё раз чуть позже.' }, 502);
    }

    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (typeof text !== 'string' || !text.trim()) {
      console.error('Gemini returned an empty response', data);
      return json({ error: 'AI вернул пустой ответ. Попробуй переформулировать запрос.' }, 502);
    }

    return json({ text });
  } catch (error) {
    console.error('AI function failed', error);
    return json({ error: 'Не получилось обратиться к AI. Попробуй ещё раз.' }, 500);
  }
});
