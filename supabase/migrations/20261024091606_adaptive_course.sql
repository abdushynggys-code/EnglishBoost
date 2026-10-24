create table public.course_profiles (
  user_id uuid primary key default auth.uid() references public.profiles on delete cascade,
  placement jsonb not null check (jsonb_typeof(placement) = 'object'),
  updated_at timestamptz not null default now()
);
create table public.course_completions (
  user_id uuid not null default auth.uid() references public.profiles on delete cascade,
  lesson_id text not null,
  completed_at timestamptz not null default now(),
  score integer not null check (score >= 0), total integer not null check (total between 0 and 20 and score <= total),
  xp integer not null check (xp in (0, 5, 10, 30)), passed boolean not null,
  response text not null default '' check (length(response) <= 5000),
  primary key(user_id, lesson_id)
);
create table public.course_reviews (
  user_id uuid not null default auth.uid() references public.profiles on delete cascade,
  item_id text not null, stage integer not null check (stage between 0 and 4),
  due_at timestamptz not null, last_reviewed_at timestamptz not null,
  lapses integer not null default 0 check (lapses >= 0), primary key(user_id, item_id)
);
alter table public.course_profiles enable row level security;
alter table public.course_completions enable row level security;
alter table public.course_reviews enable row level security;
create policy "read own course" on public.course_profiles for select to authenticated using(auth.uid() = user_id);
create policy "read own course completions" on public.course_completions for select to authenticated using(auth.uid() = user_id);
create policy "read own course reviews" on public.course_reviews for select to authenticated using(auth.uid() = user_id);
grant select on public.course_profiles, public.course_completions, public.course_reviews to authenticated;
revoke insert, update, delete on public.course_profiles, public.course_completions, public.course_reviews from anon, authenticated;
create index on public.course_reviews(user_id, due_at);

create function public.save_course_placement(result jsonb) returns void
language plpgsql security definer set search_path = '' as $$
declare learner uuid := auth.uid();
begin
  if learner is null or not private.is_approved() then raise exception 'Sign in with an approved account'; end if;
  if result is null or jsonb_typeof(result) is distinct from 'object' or result->>'level' is null or result#>>'{settings,interest}' is null or result#>>'{settings,daily_minutes}' is null or result->>'level' not in ('A1','A2','B1') or result#>>'{settings,interest}' not in ('everyday','travel','stories','school')
    or (result#>>'{settings,daily_minutes}')::integer not in (5,10,15)
    or jsonb_typeof(result->'answers') is distinct from 'array' or jsonb_array_length(result->'answers') <> 12
    or length(result::text) > 30000 then raise exception 'Invalid placement'; end if;
  perform pg_advisory_xact_lock(hashtext(learner::text));
  insert into public.course_profiles(user_id,placement) values(learner,result)
    on conflict(user_id) do update set placement=excluded.placement, updated_at=now();
  delete from public.course_completions where user_id=learner;
  delete from public.course_reviews where user_id=learner;
end $$;
revoke all on function public.save_course_placement(jsonb) from public, anon;
grant execute on function public.save_course_placement(jsonb) to authenticated;

create function public.save_course_lesson(completion jsonb, review_cards jsonb) returns void
language plpgsql security definer set search_path = '' as $$
declare
  learner uuid := auth.uid(); lesson text := completion->>'lesson_id'; placement jsonb;
  earned integer; did_pass boolean; result_score integer := (completion->>'score')::integer;
  result_total integer := (completion->>'total')::integer; unit_number integer; day_number integer;
  previous_lesson text; prefix text; card jsonb; due timestamptz; new_stage integer; old_card public.course_reviews;
begin
  if learner is null or not private.is_approved() then raise exception 'Sign in with an approved account'; end if;
  perform pg_advisory_xact_lock(hashtext(learner::text));
  select p.placement into placement from public.course_profiles p where user_id=learner;
  if placement is null then raise exception 'Complete your level check first'; end if;
  if result_total is null or result_score is null or result_total not between 0 and 20
    or result_score not between 0 and result_total or jsonb_typeof(review_cards) is distinct from 'array'
    or jsonb_array_length(review_cards)>20 then raise exception 'Invalid lesson result'; end if;
  if lesson ~ '^review:[0-9]{4}-[0-9]{2}-[0-9]{2}$' then
    if not exists(select 1 from pg_catalog.pg_timezone_names where name=completion->>'timezone')
      or right(lesson,10)<>to_char(now() at time zone (completion->>'timezone'),'YYYY-MM-DD') then raise exception 'Invalid review date'; end if;
    if not exists(select 1 from public.course_reviews where user_id=learner and due_at<=now())
      or result_total=0 then raise exception 'No reviews are due'; end if;
    earned := 5; did_pass := true;
  else
    if lesson !~ '^(A1|A2|B1)-(everyday|travel|stories|school)-unit[1-4]-day[1-7]$' then raise exception 'Invalid lesson'; end if;
    prefix := (placement->>'level') || '-' || (placement#>>'{settings,interest}') || '-';
    if left(lesson,length(prefix)) <> prefix then raise exception 'Lesson does not belong to this course'; end if;
    unit_number := substring(lesson from 'unit([1-4])')::integer;
    day_number := right(lesson,1)::integer;
    if unit_number>1 or day_number>1 then
      previous_lesson := prefix || 'unit' || (case when day_number=1 then unit_number-1 else unit_number end)
        || '-day' || (case when day_number=1 then 7 else day_number-1 end);
      if not exists(select 1 from public.course_completions where user_id=learner and lesson_id=previous_lesson and passed)
        then raise exception 'Complete the previous lesson'; end if;
    end if;
    did_pass := day_number<>7 or (result_total>=5 and result_score::numeric/result_total>=0.8);
    earned := case when not did_pass then 0 when day_number=7 then 30 else 10 end;
  end if;
  if exists(select 1 from public.course_completions where user_id=learner and lesson_id=lesson and passed) and lesson not like 'review:%' then return; end if;
  insert into public.course_completions(user_id,lesson_id,score,total,xp,passed,response)
    values(learner,lesson,result_score,result_total,earned,did_pass,coalesce(completion->>'response',''))
    on conflict(user_id,lesson_id) do update set score=excluded.score,total=excluded.total,xp=excluded.xp,
      passed=excluded.passed,response=excluded.response,completed_at=now() where not public.course_completions.passed;
  prefix := (placement->>'level') || '-' || (placement#>>'{settings,interest}') || '-';
  for card in select * from jsonb_array_elements(review_cards) loop
    if card->>'item_id' is null or left(card->>'item_id',length(prefix))<>prefix or length(card->>'item_id')>120
      then raise exception 'Invalid review item'; end if;
    select * into old_card from public.course_reviews where user_id=learner and item_id=card->>'item_id';
    if old_card.item_id is not null and old_card.due_at>now() then continue; end if;
    new_stage := least(4,greatest(0,(card->>'stage')::integer));
    due := now() + make_interval(days => (array[1,3,7,14,28])[new_stage+1]);
    insert into public.course_reviews(user_id,item_id,stage,due_at,last_reviewed_at,lapses)
      values(learner,card->>'item_id',new_stage,due,now(),greatest(0,(card->>'lapses')::integer))
      on conflict(user_id,item_id) do update set stage=excluded.stage,due_at=excluded.due_at,
        last_reviewed_at=excluded.last_reviewed_at,lapses=excluded.lapses;
  end loop;
end $$;
revoke all on function public.save_course_lesson(jsonb,jsonb) from public, anon;
grant execute on function public.save_course_lesson(jsonb,jsonb) to authenticated;
