alter table public.profiles
  add column language text check(language in ('en','de','ru')),
  add column learning_track text not null default 'access2' check(learning_track in ('access2','language_arts')),
  add column learning_level text not null default 'A2' check(learning_level in ('A2','B1')),
  add column sound_effects boolean not null default false;
grant update(language, learning_track, learning_level, sound_effects) on public.profiles to authenticated;
alter table public.lessons add column practice_path text not null default '',
  add column book_unit text not null default '', add column book_page text not null default '',
  add column activities_de text not null default '', add column activities_ru text not null default '';
alter table public.quiz_questions add column explanation_de text not null default '', add column explanation_ru text not null default '';
alter table public.reading_questions add column explanation_de text not null default '', add column explanation_ru text not null default '';
alter table public.vocabulary add column translation_ru text not null default '',
  add column definition_de text not null default '', add column definition_ru text not null default '';
