create table public.concise_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references public.profiles on delete cascade,
  mode text not null check(mode in ('main_idea','sentences','relevance','shorten','conversation','styles')),
  scenario_id text not null, prompt text not null default '', level integer not null check(level between 1 and 3),
  original text not null default '', improved text not null default '',
  selected_details text[] not null default '{}', style_answers jsonb not null default '{}',
  reflection jsonb not null default '{}', objective_correct integer not null default 0,
  objective_total integer not null default 0, points integer not null default 0,
  check(objective_correct >= 0 and objective_correct <= objective_total), check(points between 0 and 20),
  source text not null default 'practice' check(source in ('practice','classroom','homework')),
  homework_id uuid references public.homework_assignments on delete set null,
  tutor_comment text, tutor_score integer check(tutor_score between 0 and 100),
  created_at timestamptz not null default now()
);
alter table public.concise_attempts enable row level security;
create index on public.concise_attempts(user_id, created_at desc);
grant select on public.concise_attempts to authenticated;
revoke insert, update, delete on public.concise_attempts from authenticated, anon;
grant insert(id,user_id,mode,scenario_id,prompt,level,original,improved,selected_details,style_answers,reflection,
  objective_correct,objective_total,points,source,homework_id,created_at) on public.concise_attempts to authenticated;
grant update(tutor_comment,tutor_score) on public.concise_attempts to authenticated;
create policy "read own concise practice or assigned student" on public.concise_attempts for select to authenticated
  using(private.can_access(user_id));
create policy "submit own concise practice" on public.concise_attempts for insert to authenticated
  with check(user_id = auth.uid() and private.is_approved() and (
    homework_id is null or exists(select 1 from public.homework_assignments where id = homework_id and user_id = auth.uid())
  ));
create policy "tutor review concise practice" on public.concise_attempts for update to authenticated
  using(private.is_tutor() and private.can_access(user_id)) with check(private.is_tutor() and private.can_access(user_id));
