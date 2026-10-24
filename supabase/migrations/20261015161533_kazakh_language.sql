alter table public.profiles drop constraint profiles_language_check;
alter table public.profiles add constraint profiles_language_check
  check (language in ('en', 'de', 'ru', 'kk'));
alter table public.lessons add column activities_kk text not null default '';
alter table public.quiz_questions add column explanation_kk text not null default '';
alter table public.reading_questions add column explanation_kk text not null default '';
alter table public.vocabulary add column translation_kk text not null default '',
  add column definition_kk text not null default '';
-- Existing table grants and RLS policies continue to protect these columns.
