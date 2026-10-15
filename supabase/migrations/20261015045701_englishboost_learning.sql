create table public.lesson_progress (
  user_id uuid not null default auth.uid() references public.profiles on delete cascade,
  lesson_id text references public.lessons on delete cascade,
  status text not null check(status in ('in_progress','completed')),
  updated_at timestamptz not null default now(), primary key(user_id, lesson_id)
);
create table public.quiz_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references public.profiles on delete cascade,
  title text not null, score integer not null check(score >= 0),
  total integer not null check(total > 0), check(score <= total),
  answers jsonb not null default '[]', created_at timestamptz not null default now()
);
create table public.reading_attempts (
  like public.quiz_attempts including defaults including constraints including indexes,
  foreign key(user_id) references public.profiles on delete cascade
);
create table public.student_vocabulary (
  user_id uuid not null default auth.uid() references public.profiles on delete cascade,
  vocabulary_id text references public.vocabulary on delete cascade,
  known boolean not null, review_at timestamptz not null,
  updated_at timestamptz not null default now(), primary key(user_id, vocabulary_id)
);
create table public.writing_submissions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references public.profiles on delete cascade,
  assignment_id text not null references public.writing_assignments on delete cascade,
  body text not null default '', submitted boolean not null default false,
  versions jsonb not null default '[]', updated_at timestamptz not null default now(),
  unique(user_id, assignment_id)
);
do $$ declare t text; begin
  foreach t in array array['lesson_progress','quiz_attempts','reading_attempts','student_vocabulary','writing_submissions'] loop
    execute format('alter table public.%I enable row level security', t);
    execute format('grant select, insert, update on public.%I to authenticated', t);
    execute format('create policy "read personal learning" on public.%I for select to authenticated using (private.can_access(user_id))', t);
    execute format('create policy "save own learning" on public.%I for insert to authenticated with check (auth.uid() = user_id and private.is_approved())', t);
    if t not in ('quiz_attempts','reading_attempts') then
      execute format('create policy "update own learning" on public.%I for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id and private.is_approved())', t);
    end if;
    execute format('create index on public.%I(user_id)', t);
  end loop;
end $$;
