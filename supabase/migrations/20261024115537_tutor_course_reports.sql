create function public.tutor_course_reports() returns table(user_id uuid,full_name text,email text,course_level text,lessons bigint,xp bigint,pending bigint)
language plpgsql stable security definer set search_path='' as $$
begin
 if not private.is_tutor() then raise exception 'Tutor access required';end if;
 return query select p.id,p.full_name,p.email,cp.placement->>'level',
  (select count(*) from public.course_completions c where c.user_id=p.id and c.passed and c.lesson_id not like 'review:%' and c.lesson_id not like 'challenge:%'),
  coalesce(w.xp,0),
  (select count(*) from public.homework_assignments h where h.user_id=p.id and h.tutor_id=auth.uid() and not exists(select 1 from public.homework_submissions s where s.homework_id=h.id and s.user_id=p.id))
 from public.tutor_students t join public.profiles p on p.id=t.user_id left join public.course_profiles cp on cp.user_id=p.id left join public.learning_wallets w on w.user_id=p.id
 where t.tutor_id=auth.uid() order by p.full_name,p.email;
end $$;
revoke all on function public.tutor_course_reports() from public;
grant execute on function public.tutor_course_reports() to authenticated;
