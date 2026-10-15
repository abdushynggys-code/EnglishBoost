create table public.classroom_rooms (
  id uuid primary key default gen_random_uuid(), tutor_id uuid not null default auth.uid() references public.profiles on delete cascade,
  user_id uuid not null references public.profiles on delete cascade,
  lesson_id text not null references public.lessons on delete cascade,
  status text not null default 'live' check(status in ('live','ended')),
  active_slide integer not null default 0 check(active_slide >= 0),
  activity text not null default 'slide' check(activity in ('slide','quiz','summary')),
  question_id text references public.quiz_questions on delete set null,
  scenario_id text not null default 'morning', version integer not null default 1 check(version >= 1),
  created_at timestamptz not null default now()
);
create table public.classroom_responses (
  id uuid primary key default gen_random_uuid(), room_id uuid not null references public.classroom_rooms on delete cascade,
  user_id uuid not null default auth.uid() references public.profiles on delete cascade,
  activity_version integer not null, response text not null check(length(response) between 1 and 12000),
  submitted_at timestamptz not null default now(), unique(room_id, user_id, activity_version)
);
alter table public.classroom_rooms enable row level security;
alter table public.classroom_responses enable row level security;
create index on public.classroom_rooms(user_id);
create index on public.classroom_rooms(tutor_id);
create index on public.classroom_responses(room_id);
grant select, insert, update on public.classroom_rooms, public.classroom_responses to authenticated;
create policy "classroom participants" on public.classroom_rooms for select to authenticated
  using(user_id = auth.uid() or (tutor_id = auth.uid() and private.is_tutor()));
create policy "tutor create assigned classroom" on public.classroom_rooms for insert to authenticated
  with check(tutor_id = auth.uid() and private.is_tutor() and exists(
    select 1 from public.tutor_students where tutor_id = auth.uid() and user_id = classroom_rooms.user_id
  ));
create policy "tutor control classroom" on public.classroom_rooms for update to authenticated
  using(tutor_id = auth.uid() and private.is_tutor()) with check(tutor_id = auth.uid() and private.is_tutor() and exists(
    select 1 from public.tutor_students where tutor_id = auth.uid() and user_id = classroom_rooms.user_id
  ));
create policy "classroom response readers" on public.classroom_responses for select to authenticated
  using(user_id = auth.uid() or exists(select 1 from public.classroom_rooms where id = room_id and tutor_id = auth.uid()));
create policy "student answer live activity" on public.classroom_responses for insert to authenticated
  with check(user_id = auth.uid() and private.is_approved() and exists(
    select 1 from public.classroom_rooms where id = room_id and user_id = auth.uid() and status = 'live' and version = activity_version
  ));
create policy "student revise current answer" on public.classroom_responses for update to authenticated
  using(user_id = auth.uid()) with check(user_id = auth.uid() and private.is_approved() and exists(
    select 1 from public.classroom_rooms where id = room_id and user_id = auth.uid() and status = 'live' and version = activity_version
  ));
do $$ declare t text; begin
  foreach t in array array['classroom_rooms','classroom_responses'] loop
    if exists(select 1 from pg_publication where pubname = 'supabase_realtime') and not exists(
      select 1 from pg_publication_tables where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = t
    ) then execute format('alter publication supabase_realtime add table public.%I', t); end if;
  end loop;
end $$;
