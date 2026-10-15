create table public.homework_assignments (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references public.profiles on delete cascade,
  tutor_id uuid not null default auth.uid() references public.profiles on delete cascade,
  lesson_id text not null references public.lessons on delete cascade,
  title text not null, instructions text not null, due_at date not null,
  material_url text not null default '', practice_path text not null default '', created_at timestamptz not null default now()
);
create table public.homework_submissions (
  id uuid primary key default gen_random_uuid(), user_id uuid not null default auth.uid() references public.profiles on delete cascade,
  homework_id uuid not null references public.homework_assignments on delete cascade,
  body text not null, submitted_at timestamptz not null default now(), unique(user_id, homework_id)
);
create table public.tutor_feedback (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references public.profiles on delete cascade,
  tutor_id uuid not null default auth.uid() references public.profiles on delete cascade,
  submission_id uuid not null, kind text not null check(kind in ('writing','homework')),
  comment text not null, score integer not null check(score between 0 and 100),
  created_at timestamptz not null default now(), unique(submission_id, kind)
);
create table public.tutoring_sessions (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references public.profiles on delete cascade,
  tutor_id uuid not null default auth.uid() references public.profiles on delete cascade,
  starts_at timestamptz not null, duration integer not null default 60 check(duration > 0),
  meeting_url text not null default ''
);
do $$ declare t text; begin
  foreach t in array array['homework_assignments','tutor_feedback','tutoring_sessions'] loop
    execute format('alter table public.%I enable row level security', t);
    execute format('grant select, insert, update, delete on public.%I to authenticated', t);
    execute format('create policy "read assigned tutoring" on public.%I for select to authenticated using (private.can_access(user_id))', t);
    execute format('create policy "tutor assign" on public.%I for insert to authenticated with check (tutor_id = auth.uid() and private.is_tutor() and exists(select 1 from public.tutor_students where tutor_id = auth.uid() and user_id = %I.user_id))', t, t);
    execute format('create policy "tutor manage" on public.%I for update to authenticated using (tutor_id = auth.uid() and private.is_tutor()) with check (tutor_id = auth.uid() and private.is_tutor() and private.can_access(user_id))', t);
    execute format('create policy "tutor remove" on public.%I for delete to authenticated using (tutor_id = auth.uid() and private.is_tutor())', t);
    execute format('create index on public.%I(user_id)', t);
  end loop;
end $$;
