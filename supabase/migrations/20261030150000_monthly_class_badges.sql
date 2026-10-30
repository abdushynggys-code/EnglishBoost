create table public.class_monthly_badges (
  id uuid primary key default gen_random_uuid(),
  class_id uuid not null references public.learning_classes on delete cascade,
  tutor_id uuid not null references public.profiles on delete cascade,
  student_id uuid not null references public.profiles on delete cascade,
  month date not null check (month = date_trunc('month', month)::date),
  tier text not null check (tier in ('bronze', 'silver', 'gold')),
  correct_answers integer not null check (correct_answers >= 0),
  answered_questions integer not null check (answered_questions > 0 and correct_answers <= answered_questions),
  accuracy integer not null check (accuracy between 0 and 100),
  created_at timestamptz not null default now(),
  unique (class_id, student_id, month)
);

alter table public.class_monthly_badges enable row level security;
grant select on public.class_monthly_badges to authenticated;
create policy "class badge readers" on public.class_monthly_badges for select to authenticated
  using (student_id = auth.uid() or tutor_id = auth.uid());

create function public.monthly_badge_candidates(class_uuid uuid, badge_month date default current_date)
returns table (
  user_id uuid, name text, correct_answers bigint, answered_questions bigint,
  accuracy integer, recommended_tier text, awarded_tier text
) language plpgsql stable security definer set search_path = '' as $$
declare room public.learning_classes; month_start date := date_trunc('month', badge_month)::date;
begin
  select * into room from public.learning_classes where id = class_uuid and user_id = auth.uid();
  if room.id is null or not private.is_tutor() then raise exception 'Tutor access required'; end if;
  return query
  with scored as (
    select q.user_id, q.score, q.total from public.quiz_attempts q
      where q.created_at >= month_start and q.created_at < month_start + interval '1 month' and q.total > 0
    union all
    select r.user_id, r.score, r.total from public.reading_attempts r
      where r.created_at >= month_start and r.created_at < month_start + interval '1 month' and r.total > 0
    union all
    select c.user_id, c.score, c.total from public.course_completions c
      where c.completed_at >= month_start and c.completed_at < month_start + interval '1 month' and c.total > 0
  ), totals as (
    select s.user_id, sum(s.score)::bigint correct, sum(s.total)::bigint answered
    from scored s group by s.user_id
  )
  select p.id, coalesce(nullif(trim(p.full_name), ''), 'Learner'),
    coalesce(t.correct, 0), coalesce(t.answered, 0),
    case when coalesce(t.answered, 0) = 0 then 0 else round(t.correct * 100.0 / t.answered)::integer end,
    case
      when coalesce(t.answered, 0) = 0 then ''
      when round(t.correct * 100.0 / t.answered) >= 90 and t.answered >= 10 then 'gold'
      when round(t.correct * 100.0 / t.answered) >= 75 then 'silver'
      else 'bronze'
    end,
    coalesce(b.tier, '')
  from public.class_members m
  join public.profiles p on p.id = m.user_id
  left join totals t on t.user_id = p.id
  left join public.class_monthly_badges b on b.class_id = room.id and b.student_id = p.id and b.month = month_start
  where m.class_id = room.id
  order by case when coalesce(t.answered, 0) = 0 then 0 else t.correct * 1.0 / t.answered end desc, p.full_name;
end $$;

create function public.award_monthly_class_badge(class_uuid uuid, student_uuid uuid, badge_month date default current_date)
returns text language plpgsql security definer set search_path = '' as $$
declare room public.learning_classes; month_start date := date_trunc('month', badge_month)::date;
  correct_count integer; answer_count integer; percent integer; badge_tier text;
begin
  select * into room from public.learning_classes where id = class_uuid and user_id = auth.uid() for update;
  if room.id is null or not private.is_tutor() then raise exception 'Tutor access required'; end if;
  if not exists(select 1 from public.class_members where class_id = room.id and user_id = student_uuid)
    then raise exception 'Learner is not in this class'; end if;
  if exists(select 1 from public.class_monthly_badges where class_id = room.id and student_id = student_uuid and month = month_start)
    then raise exception 'This monthly badge was already awarded'; end if;
  select coalesce(sum(score), 0)::integer, coalesce(sum(total), 0)::integer into correct_count, answer_count from (
    select score, total from public.quiz_attempts where user_id = student_uuid and created_at >= month_start and created_at < month_start + interval '1 month' and total > 0
    union all
    select score, total from public.reading_attempts where user_id = student_uuid and created_at >= month_start and created_at < month_start + interval '1 month' and total > 0
    union all
    select score, total from public.course_completions where user_id = student_uuid and completed_at >= month_start and completed_at < month_start + interval '1 month' and total > 0
  ) completed_scores;
  if answer_count = 0 then raise exception 'No completed scored work for this month'; end if;
  percent := round(correct_count * 100.0 / answer_count)::integer;
  badge_tier := case when percent >= 90 and answer_count >= 10 then 'gold' when percent >= 75 then 'silver' else 'bronze' end;
  insert into public.class_monthly_badges(class_id, tutor_id, student_id, month, tier, correct_answers, answered_questions, accuracy)
    values(room.id, auth.uid(), student_uuid, month_start, badge_tier, correct_count, answer_count, percent);
  insert into public.notifications(user_id, title, body, href)
    values(student_uuid, 'Monthly class badge', initcap(badge_tier) || ' · ' || percent || '% from completed scored work', '/classes/' || room.id);
  return badge_tier;
end $$;

revoke all on function public.monthly_badge_candidates(uuid, date), public.award_monthly_class_badge(uuid, uuid, date) from public, anon;
grant execute on function public.monthly_badge_candidates(uuid, date), public.award_monthly_class_badge(uuid, uuid, date) to authenticated;
create index class_monthly_badges_student_month on public.class_monthly_badges(student_id, month desc);
