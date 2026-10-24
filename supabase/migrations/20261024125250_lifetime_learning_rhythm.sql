create function public.learning_rhythm(learner_zone text default 'UTC') returns integer
language sql stable set search_path='' as $$
 with zone as(select coalesce((select name from pg_catalog.pg_timezone_names where name=learner_zone limit 1),'UTC') as name),
 days as(select distinct (r.created_at at time zone z.name)::date as day from public.reward_ledger r cross join zone z where r.user_id=auth.uid()),
 anchor as(select case when exists(select 1 from days where day=(now() at time zone z.name)::date) then (now() at time zone z.name)::date else (now() at time zone z.name)::date-1 end as day from zone z),
 ranked as(select d.day,row_number() over(order by d.day desc)::integer as position from days d cross join anchor a where d.day<=a.day)
 select count(*)::integer from ranked r cross join anchor a where r.day=a.day-(r.position-1);
$$;
revoke all on function public.learning_rhythm(text) from public;
grant execute on function public.learning_rhythm(text) to authenticated;
