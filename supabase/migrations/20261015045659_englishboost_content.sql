create table public.lessons (
  id text primary key, user_id uuid references public.profiles on delete cascade,
  week integer not null check (week between 1 and 8), title text not null,
  description text not null, objectives text[] not null, activities text not null,
  homework text not null, duration integer not null check(duration > 0), skill text not null
);
create table public.quiz_questions (
  id text primary key, user_id uuid references public.profiles on delete cascade,
  lesson_id text not null references public.lessons on delete cascade, topic text not null,
  difficulty text not null, type text not null check(type in ('choice','blank','correction','boolean')),
  prompt text not null, options text[] not null default '{}', answer text not null, explanation text not null
);
create table public.vocabulary (
  id text primary key, user_id uuid references public.profiles on delete cascade,
  word text not null, translation text not null, definition text not null, example text not null,
  theme text not null, difficulty text not null
);
create table public.reading_passages (
  id text primary key, user_id uuid references public.profiles on delete cascade,
  title text not null, level text not null, body text not null
);
create table public.reading_questions (
  id text primary key, user_id uuid references public.profiles on delete cascade,
  passage_id text not null references public.reading_passages on delete cascade,
  prompt text not null, options text[] not null default '{}', answer text not null, explanation text not null
);
create table public.writing_assignments (
  id text primary key, user_id uuid references public.profiles on delete cascade,
  title text not null, instructions text not null, min_words integer not null, format text not null
);

do $$ declare t text; begin
  foreach t in array array['lessons','quiz_questions','vocabulary','reading_passages','reading_questions','writing_assignments'] loop
    execute format('alter table public.%I enable row level security', t);
    execute format('grant select, insert, update, delete on public.%I to authenticated', t);
    execute format('create policy "read learning content" on public.%I for select to authenticated using (private.is_approved() and (user_id is null or user_id = auth.uid() or exists(select 1 from public.tutor_students where tutor_id = %I.user_id and user_id = auth.uid())))', t, t);
    execute format('create policy "tutor create content" on public.%I for insert to authenticated with check (private.is_tutor() and user_id = auth.uid())', t);
    execute format('create policy "tutor edit content" on public.%I for update to authenticated using (private.is_tutor() and (user_id is null or user_id = auth.uid())) with check (private.is_tutor() and (user_id is null or user_id = auth.uid()))', t);
    execute format('create policy "tutor delete content" on public.%I for delete to authenticated using (private.is_tutor() and (user_id is null or user_id = auth.uid()))', t);
  end loop;
end $$;
